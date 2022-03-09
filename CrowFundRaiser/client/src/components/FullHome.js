import React from "react";
import {useParams, useNavigate} from "react-router-dom"
import {useMoralis} from "react-moralis"
import { getWalletInstance, convertTimeToDHM, ethereumToDollarToRupees, getSignedContract, convertMoney } from "./utils";
import axios from "axios"
import css from "./index.module.css"
import CrouselData from "./Crousel";
import {HeartTwoTone} from "@ant-design/icons"
import { abi } from "../ABI";
import PayModal from "./Modal/PayModal";
import { AuthContext } from "../context/AuthContext";
import AboutPage from "./AboutPage";
import { ethers } from "ethers";
import notification_api, {
    parseErrorMessage
} from './utils';

const FullHome = () => {

    const {id} = useParams()
    const {Moralis} = useMoralis()
    const [data, setData] = React.useState([])
    const [aboutData, setAboutData] = React.useState({})
    const [payModal, setPayModal] = React.useState(false)
    const [payData, setPayData] = React.useState({})
    const [payLoading, setPayLoading] = React.useState(false)
    const {userAddress, isAuth} = React.useContext(AuthContext);
    const [count, setCount] = React.useState(0);
    const [dataLoading, setDataLoading] = React.useState(false)
    const [payMoney, setPayMoney] = React.useState('')
    const [leftMoney, setLeftMoney] = React.useState(0)
    const naviagte = useNavigate();

    React.useEffect(() => {
        if(!isAuth){
            naviagte("/", {replace: true})
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

    const getData = async () => {
        setDataLoading(true)
        const instance = getWalletInstance()
        const wallet = instance[1]
        try{
            const data = await wallet.getSingleFundRaiser(+id);
            console.log("data is => ", data)
            let arr = []
            let obj = {
                image: data.image,
                collectedMoney: data.collectedMoney.toNumber(),
                totalMoney:data.totalMoney.toNumber(),
                id: data.id.toNumber(),
                title: data.title,
                payee: data.payee,
                time: data.time,
                urgent: data.urgent,
                fileUrl: data.fileUrl
            }
            arr.push(obj)
            const fileData = await axios.get(`${process.env.REACT_APP_MORALIS_IPFS_URL}${arr[0].fileUrl}`)
            console.log("File Data => ", fileData)
            setData(arr)
            setAboutData(fileData.data)
            setDataLoading(false)
        }catch(err){
            setDataLoading(false)
            notification_api.error({
                message: "Failed",
                description: parseErrorMessage(err)
            })
        }
    }

    const payCloseModal = () => {
        getData()
        setPayMoney('')
        setLeftMoney(0)
        setPayLoading(false)
        setPayModal(false)
        setPayData({})
    }

    const handelPayFormChange = (e) => {
        const {name, value} = e.target;
        if(name === 'amount'){
            let ok = convertMoney(value)
            setPayMoney(ok)
        }
        setPayData({...payData, [name]: value})
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

    const handelPayFormSubmit = async () => {
        try{
            const payOption = {
                type: "native",
                amount: Moralis.Units.ETH(payData.amount),
                receiver: payData.to
            }
            const balance = await getBalanceOfCurrentUser();
            const payAmount = +payData.amount
            if(balance > payAmount){
                const transaction = await Moralis.transfer(payOption);
                const result = await transaction.wait();
                const updateContract = {
                    _money: +Moralis.Units.ETH(payData.amount),
                    _id: +payData.id
                }
                const signedWallet = await getSignedContract();
                let estimateGas = await signedWallet.estimateGas.updateMoney(updateContract._money, updateContract._id)
                const finalPay = await calculateMaxTransactionFees(estimateGas)
                if(balance > finalPay ){
                    const option = {
                        contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS,
                        abi: abi,
                        functionName: "updateMoney",
                        params: {...updateContract}
                    }
                    const updateMoneyData = await Moralis.executeFunction(option);
                    await updateMoneyData.wait();
                    payCloseModal()
                }else{
                    setPayLoading(false)
                notification_api.error({
                    message: "Failed",
                    description: parseErrorMessage("Insufficient fund !")
                })
                }
            }else{
                setPayLoading(false)
                notification_api.error({
                    message: "Failed",
                    description: parseErrorMessage("Insufficient fund !")
                })
            }
        }catch(err){
            setPayLoading(false)
            notification_api.error({
                message: "Failed",
                description: parseErrorMessage(err)
            })
        }
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
        let ok = +totalMoney - +collectedMoney;
        setLeftMoney(ok)
        setPayData(payload)
        setPayModal(true)
    }

    const goBack = () => {
        naviagte("/home", {replace: true})
    }

    if(dataLoading){
        return <div style={{width: '100%', display: 'flex', justifyContent: 'center',
    fontSize: '20px', marginTop: '10%'}}>loading......</div>
    }

    return(
        <>
         <div className={css.home_main}>
            {payModal && <PayModal showModal = {payModal} closeModal = {payCloseModal} formLoading = {payLoading}
            handelChange = {handelPayFormChange} setFormLoading = {setPayLoading} formData = {payData}
            handelSubmit = {handelPayFormSubmit} payMoney = {payMoney} leftMoney = {leftMoney} />}
            <div className={css.home_add_btn}>
                <button className={css.home_btn_btn} onClick={goBack}>BACK</button>
            </div>
            <div className={css.home_conatiner}>
                {data && data.map((item) => <>
                    <div className={css.home_sub_container_1}>
                        <CrouselData image = {item.image} id = {item.id} />
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
                         ? 'Completed' : convertTimeToDHM(item.time) }</div>
                        <div className={css.data_time}>
                            {convertTimeToDHM(item.time) === null || +item.totalMoney === +item.collectedMoney ? null : <div className={css.data_time_time}>
                                <div>Days</div>
                                <div>Hours</div>
                                <div>Minutes</div>
                                </div>}
                        </div>
                    </div>
                </>)}
               {aboutData && data.length !== 0 && <AboutPage data = {aboutData} image = {data[0].image} 
               fullData = {data[0]} getData = {getData} />}
            </div>
        </div>
        </>
    )
}

export default FullHome