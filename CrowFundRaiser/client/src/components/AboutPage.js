import React from "react";
import {Button, Tabs} from "antd"
import css from "./index.module.css"
import { AuthContext } from "../context/AuthContext";
import CommentModal from "./Modal/CommentModal";
import {useMoralis} from "react-moralis";
import { abi } from "../ABI";
import CSoon from "../assets/img1.jpeg"
import notification_api, {
    getSignedContract,
    getWalletInstance,
    parseErrorMessage
} from './utils';
import { ethers } from "ethers";

const {TabPane} = Tabs

const temp = {
    to: '',
    from: '',
    comment: ''
}

const AboutPage = (props) => {


    const {data, image, fullData, getData} = props
    const [commentModal, setCommentModal] = React.useState(false);
    const [commentForm, setCommentForm] = React.useState(temp);
    const [commentLoading, setCommentLoading] = React.useState(false);
    const {userAddress} = React.useContext(AuthContext);
    const {Moralis} = useMoralis();

    const handelFormChange = (e) => {
        const {name, value} = e.target
        setCommentForm({...commentForm, [name]: value})
    }
    const closeModal = () => {
        getData()
        setCommentLoading(false)
        setCommentModal(false)
        setCommentForm(temp)
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

    const handelFormSubmit = async () => {
        if(data.comments){
            try{
                data.comments.push(commentForm)
                const aboutFile = new Moralis.File("file.json", {base64 : btoa(unescape(encodeURIComponent(JSON.stringify(data))))})
                await aboutFile.saveIPFS();
                const fileHash = aboutFile.hash();
                let payLoadAbout = {
                    _hash: fileHash,
                    _id: commentForm.id
                }
                const signedContract = await getSignedContract();
                const estimatedGas = await signedContract.estimateGas.updateAbout(payLoadAbout._id, payLoadAbout._hash)
                const balance = await getBalanceOfCurrentUser();
                const finalPay = await calculateMaxTransactionFees(estimatedGas)
                if(balance > finalPay){
                    const option = {
                        contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS,
                        abi: abi,
                        functionName: "updateAbout",
                        params: {...payLoadAbout}
                    }
                    const updateAbout = await Moralis.executeFunction(option);
                    await updateAbout.wait();
                    closeModal()
                }else{
                    setCommentLoading(false)
                    notification_api.error({
                        message: "Failed, Insufficient fund !",
                        description: parseErrorMessage("Insufficient fund !")
                    })
                }
            }catch(error){
                setCommentLoading(false)
                notification_api.error({
                    message: "Failed",
                    description: parseErrorMessage(error.message)
                })
            }
        }
    }

    const onComment = () => {
        let payload = {
            id: fullData.id,
            from: userAddress,
            to: '',
            comment: ''
        }
        setCommentForm({...payload})
        setCommentModal(true)
    }
    const url = process.env.REACT_APP_MORALIS_IPFS_URL
    return(
        <>
        <div className={css.aboutpage_main}>
           {commentModal &&  <CommentModal showModal = {commentModal} formLoading = {commentLoading} 
           formData = {commentForm} closeModal = {closeModal} handelChange = {handelFormChange}
           setFormLoading = {setCommentLoading} handelSubmit = {handelFormSubmit} />}
            <div className={css.aboutpage_container}>
                <Tabs defaultActiveKey={"1"}>
                    <TabPane tab="About" key="1">
                        <div className={css.about_page_title}>
                            {data.title}
                        </div>
                        <p style={{fontSize: '18px', paddingTop:'10px'}}>{data.description}</p>
                        <div className={css.about_image}>
                            <div className={css.about_img_img}> {image &&  <img src={`${url}${image[0]}`} />} </div>
                        </div>
                        <p style={{fontSize: '18px', paddingTop:'10px'}}>{data.description}</p>
                        <div className={css.about_image}>
                            <div className={css.about_img_img}> {image &&  <img src={`${url}${image[1]}`} />} </div>
                        </div>
                        <p style={{fontSize: '18px', paddingTop:'10px'}}>{data.description}</p>
                        <div className={css.about_image}>
                            <div className={css.about_img_img}> {image &&  <img src={`${url}${image[2]}`} />} </div>
                        </div>
                        <p style={{fontSize: '18px', paddingTop:'10px'}}>{data.description}</p>
                        <div className={css.about_image}>
                            <div className={css.about_img_img}> {image &&  <img src={`${url}${image[3]}`} />} </div>
                        </div>
                    </TabPane>
                    <TabPane tab="Comment" key="2">
                        <div className={css.about_comment}>
                            <Button type="primary" onClick={onComment}>Write Comment's</Button>
                        </div>
                        <div className={css.comments}>
                            {data && data.comments && data.comments.length !== 0 && data.comments.map((item) => <>
                            <div style={{paddingBottom: '10px'}}>
                                    <div>From: {item.from}</div>
                                    <div>To: {item.to}</div>
                                    <div>Message: {item.comment}</div>
                            </div>
                            </>) }
                        </div>
                    </TabPane>
                    <TabPane tab="Details" key="3">
                        <div className={css.comming_soon}>
                           <div style={{width: '50%'}}>
                                <img src={CSoon} alt="Csoon" />
                           </div>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        </div>
        </>
    )
}

export default AboutPage