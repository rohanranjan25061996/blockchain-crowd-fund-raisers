import React from "react";
import { convertMoney, convertTimeToDHM, ethereumToDollarToRupees, getSignedContract, getTimeMillisecond, getWalletInstance } from "./utils";
import {useNavigate} from "react-router-dom"
import { AuthContext } from "../context/AuthContext";
import css from "./index.module.css"
import AddModal from "./Modal/modal";
import "antd/dist/antd.css";
import {useMoralis} from "react-moralis"
import { ethers } from "ethers";
import { abi } from "../ABI";
import CrouselData from "./Crousel";
import {HeartTwoTone} from "@ant-design/icons"
import { Divider } from "antd";
import PayModal from "./Modal/PayModal";
import notification_api, {
    parseErrorMessage
} from './utils';

// notification_api.error({
//     message: `${code} ${message}`,
//     description: parseErrorMessage(error)
//   });

// 0x0000000000000000000000000000000000000000

//(Gas units (limit) x Gas price per unit)

const temp = {
    title: '',
    date: '',
    time: '',
    amount: '',
    payee: '',
    urgent: false
}

const Home = () => {

    const {isAuth, userAddress} = React.useContext(AuthContext);
    const [data, setData] = React.useState([]);
    const [showModal, setShowModal] = React.useState(false)
    const [formLoading, setFormLoading] = React.useState(false)
    const [formData, setFormData] = React.useState(temp)
    const [fileList, setFileList] = React.useState([])
    const [about, setAbout] = React.useState("")
    const [count, setCount] = React.useState(0)
    const [payModal, setPayModal] = React.useState(false)
    const [payData, setPayData] = React.useState({})
    const [payLoading, setPayLoading] = React.useState(false)
    const [dataLoading, setDataLoading] = React.useState(false)
    const [payMoney, setPayMoney] = React.useState('')
    const [addMoney, setAddMoney] = React.useState('')
    const [leftMoney, setLeftMoney] = React.useState(0)
    const navigate = useNavigate();
    const {Moralis} = useMoralis();

    React.useEffect(() => {
        if(!isAuth){
            navigate("/", {replace: true})
        }else{
            getData()
        }
    }, [])

    React.useEffect(() => {
        let interval
        if(data.length !== 0){
            interval = setInterval(() => {
                setCount(prev => prev + 1)
            }, 10000)
        }

        return () => {
            clearInterval(interval)
        }
    }, [count, data])

    const openModal = () => {
        setShowModal(true)
    }

    const payOpenModal = () => {
        setPayModal(true)
    }

    const payCloseModal = () => {
        getData()
        setPayMoney('')
        setLeftMoney(0)
        setPayLoading(false)
        setPayModal(false)
        setPayData({})
    }

    const closeModal = () => {
        getData()
        setAddMoney('')
        setFormData(temp)
        setFileList([])
        setAbout('')
        setFormLoading(false)
        setShowModal(false)
    }

    const handelPayFormChange = (e) => {
        const {name, value} = e.target;
        if(name === 'amount'){
            setPayMoney(convertMoney(value))
        }
        setPayData({...payData, [name]: value})
    }

    const handelChange = (e) => {
        const {name, value, checked, type} = e.target;
        const val = type === 'checkbox' ? checked : value
        if(name === 'amount'){
            let ok = convertMoney(value)
            console.log("convertMoney", ok)
            setAddMoney(ok)
        }
        setFormData({...formData, [name]: val})
    }

    const handelDate = (date, d) => {
        setFormData({...formData, "date": d})
    }

    const handelTime = (time, t) => {
        setFormData({...formData, "time": t})
    }

    const getBalanceOfCurrentUser = async () => {
        const instance = getWalletInstance()
        const provider = instance[0];
        let balanceInEth;
        await provider.getBalance(userAddress).then((balance) => {
            balanceInEth = ethers.utils.formatEther(balance)
            // console.log(`balance: ${balanceInEth} ETH`)
        })
        return balanceInEth
    }

    const calculateMaxTransactionFees = async (gasLimit) => {
        const instance = getWalletInstance()
        const provider = instance[0];
        let transFees = (await provider.getFeeData()).maxFeePerGas.mul(gasLimit)
        transFees = +ethers.utils.formatEther(transFees);
        return transFees
    }

     //0.080.000032 0.110.000045
    const handelPayFormSubmit = async () => {
        try{
            const payOption = {
                type: "native",
                amount: Moralis.Units.ETH(payData.amount),
                receiver: payData.to
            }
            const balance = await getBalanceOfCurrentUser();
            const payAmount = +payData.amount
            if(+balance > payAmount){
                const transaction = await Moralis.transfer(payOption);
                const result = await transaction.wait();
                const updateContract = {
                    _money: +Moralis.Units.ETH(payData.amount),
                    _id: +payData.id
                }
                const signedContract = await getSignedContract();
                const estimatedGas = await signedContract.estimateGas.updateMoney(updateContract._money, updateContract._id);
                const finalPay = await calculateMaxTransactionFees(estimatedGas)
                if(+balance > finalPay){
                    const option = {
                        contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS,
                        abi: abi,
                        functionName: "updateMoney",
                        params: {...updateContract}
                    }
                    const updateMoneyData = await Moralis.executeFunction(option);
                    await updateMoneyData.wait();
                    payCloseModal()
                }
                else{
                    setPayLoading(false)
                    notification_api.error({
                        message: "Failed, Insufficient fund !",
                        description: parseErrorMessage("Insufficient fund !")
                    })
                }
            }else{
                setPayLoading(false)
                notification_api.error({
                    message: "Failed, Insufficient fund !",
                    description: parseErrorMessage("Insufficient fund !")
                })
            }
        }catch(err){
            setPayLoading(false)
            notification_api.error({
                message: "Unable to process",
                description: parseErrorMessage(err.message)
            })
        }
    }

    const handelFormSubmit = async () => {
        let arr = []
        for(let i = 0; i < fileList.length; i++){
            const {originFileObj} = fileList[i]
            const data = fileList[i];
            const name = data.name
            const fileData = new Moralis.File(name, originFileObj);
            await fileData.saveIPFS()
            arr.push(fileData.hash())
        }
        let AboutFilePayLoad = {
            title: formData.title,
            description: about,
            comments: []
        }
        console.log("step5", arr)
        const aboutFile = new Moralis.File("file.json", {base64 : btoa(unescape(encodeURIComponent(JSON.stringify(AboutFilePayLoad))))})
        await aboutFile.saveIPFS();
        const fileHash = aboutFile.hash();
        console.log("step6", fileHash)
        const miliSecondTime = getTimeMillisecond(formData.date, formData.time)
        let payload = {
            _time: miliSecondTime,
            _totalMoney:  Number(formData.amount),
            _collectedMoney: 0,
            _image: arr,
            _title: formData.title,
            _urgent: formData.urgent,
            _payee: formData.payee,
            _fileUrl: fileHash
        }
        console.log("step7", payload)
        try{
            const signedContract = await getSignedContract();
            console.log("ste8", signedContract)
            let estimatedGas = await signedContract.estimateGas.addFundraiser(payload._time,
                payload._totalMoney, payload._collectedMoney, payload._image, payload._title, payload._urgent,
                payload._payee, payload._fileUrl)
            console.log("step1", estimatedGas.toNumber())
            const balance = await getBalanceOfCurrentUser();
            console.log("step2", balance)
            const transactionFees = await calculateMaxTransactionFees(estimatedGas);
            console.log("step3", transactionFees)
            if(balance > transactionFees){
                console.log("step4")
                 const option1 = {
                contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS,
                abi: abi,
                functionName: "addFundraiser",
                params: {...payload}
            }
            const addSendOption = await Moralis.executeFunction(option1);
            await addSendOption.wait();
            closeModal()
            setFormLoading(false)
            }else{
                setFormLoading(false)
                notification_api.error({
                    message: "Unbale to process",
                    description: parseErrorMessage("Insuffient fund in wallet")
                })
            }
        }catch(err){
            console.log("step10 error", err)
            setFormLoading(false)
            notification_api.error({
                message: "Failed",
                description: parseErrorMessage(err.message)
            })
        }
    }

    const getData = async () => {
        setDataLoading(true)
        const instance = getWalletInstance();
        const wallet = instance[1]
        
        try{
            const data = await wallet.getAllFundRaiser();
            console.log("data is => ", data)
            let arr = []
            let obj = {}
            data.forEach((item) => {
                obj = {
                    image: item.image,
                    collectedMoney: item.collectedMoney.toNumber(),
                    totalMoney:item.totalMoney.toNumber(),
                    id: item.id.toNumber(),
                    title: item.title,
                    payee: item.payee,
                    time: item.time,
                    urgent: item.urgent,
                    fileUrl: item.fileUrl
                }
                arr.push(obj)
                obj = {}
            })
            setData(arr)
            setDataLoading(false)
        }catch(err){
            setDataLoading(false)
            notification_api.error({
                message: "Failed",
                description: parseErrorMessage(err)
            })
        }
    }

    const goToFullPage = (id) => {
        navigate(`/home/${id}`)
    }

    const onClickDonte = (id) => {
        const newData = data?.filter((item) => item.id == id)
        const {payee, collectedMoney, totalMoney} = newData[0]
        let payload = {
            from: userAddress,
            to: payee,
            amount: '',
            id: id
        }
        let ok = +totalMoney - +collectedMoney
        setLeftMoney(ok)
        setPayData(payload)
        setPayModal(true)
    }

    if(dataLoading){
        return <div style={{width: '100%', display: 'flex', justifyContent: 'center',
    fontSize: '20px', marginTop: '10%'}}>loading......</div>
    }
    return(
        <>
        <div className={css.home_main}>
            {showModal && <AddModal showModal = {showModal} closeModal = {closeModal} 
            formLoading = {formLoading} fileList = {fileList} setFileList = {setFileList}
            formData = {formData} handelChange = {handelChange} handelDate = {handelDate}
            handelTime = {handelTime} setAbout = {setAbout} about = {about}
            handelFormSubmit = {handelFormSubmit} setFormLoading = {setFormLoading} addMoney = {addMoney} />}

            {payModal && <PayModal showModal = {payModal} closeModal = {payCloseModal} formLoading = {payLoading}
            handelChange = {handelPayFormChange} setFormLoading = {setPayLoading} formData = {payData}
            handelSubmit = {handelPayFormSubmit} payMoney = {payMoney} leftMoney = {leftMoney} />}
            <div className={css.home_add_btn}>
                <button className={css.home_btn_btn} onClick={openModal}>ADD</button>
            </div>
            <div className={css.home_conatiner}>
                {data && data.map((item) => <>
                    <div className={css.home_sub_container_1}>
                        <CrouselData image = {item.image} id = {item.id} goToFullPage = {goToFullPage} />
                    </div>
                    <div className={css.home_sub_container_2}>
                       {item.urgent &&  <div className={css.box}>
                            <div className={`${css.ribbon} ${css.ribbon_top_left}`}> <span>urgent</span> </div>
                        </div>}
                        <div className={css.data_title}>For {item.title}</div>
                        {+item.totalMoney === +item.collectedMoney || convertTimeToDHM(item.time) === null ?
                        <div className={css.donate_now_non_active}>
                            <div className={css.donate_now_1_not_active}>
                                <HeartTwoTone />
                                Donate Now
                            </div>
                        </div>
                        :  <div className={css.donate_now}>
                        <div className={css.donate_now_1} onClick={() => onClickDonte(item.id)}>
                            <HeartTwoTone />
                            Donate Now
                        </div>
                    </div>}
                        <div className={css.money}>
                            ₹ {ethereumToDollarToRupees(item.totalMoney)} ({item.totalMoney} ETH) 
                        </div>
                        <div className={css.c_money}>
                            <p>₹ {ethereumToDollarToRupees(item.collectedMoney / 10 ** 18)} ({item.collectedMoney / 10 ** 18} ETH)
                            <sup>till now collected.</sup> 
                            </p>
                        </div>
                        <div className={css.data_time}>{convertTimeToDHM(item.time) === null || +item.totalMoney === +item.collectedMoney 
                        ? 'Completed' : convertTimeToDHM(item.time, +item.totalMoney,+item.collectedMoney ) }</div>
                        <div className={css.data_time}>
                            {convertTimeToDHM(item.time, +item.totalMoney, +item.collectedMoney) === null || +item.totalMoney === +item.collectedMoney ?
                             null : <div className={css.data_time_time}>
                                <div>Days</div>
                                <div>Hours</div>
                                <div>Minutes</div>
                                </div>}
                        </div>
                        <div className={css.more_details}>
                            <p onClick={() => goToFullPage(item.id)}>more details</p>
                        </div>
                    </div>
                    <div className={css.line}></div>
                </>)}
            </div>
        </div>
        </>
    )
}

export default Home