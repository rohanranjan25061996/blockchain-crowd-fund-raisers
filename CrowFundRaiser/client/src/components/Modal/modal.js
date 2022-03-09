import {Modal, Form, DatePicker, TimePicker, Input} from "antd"
import Checkbox from "antd/lib/checkbox/Checkbox";
import moment from 'moment';
import React from "react";
import UploadImage from "./ImgPreviewModal";
import css from "../index.module.css"

const AddModal = (props) => {

    const {showModal, closeModal, formLoading, fileList, setFileList,
    formData, handelChange, handelDate, handelTime, setAbout, about, handelFormSubmit, setFormLoading, addMoney} = props

    const [fileError, setFileError] = React.useState(false)
    const [error, setError] = React.useState(false)
    const [nullAddress, setNullAddress] = React.useState(false)
    const [invalidPayeeAddress, setInvalidPayeeAddress] = React.useState(false)
    const [invalidAmount, setInvalidAmount] = React.useState(false)

    const handelFrom = () => {
        setInvalidAmount(false)
        setInvalidPayeeAddress(false)
        setNullAddress(false)
        setError(false)
        setFileError(false)
        setFormLoading(true)
        if(formData.title !== '' && formData.date !== '' && formData.amount !== ''
        && formData.time !== '' && formData.payee !== '' && about !== '' ){
            console.log('filelist', fileList.length)
            if(fileList.length === 4){
                if(formData.payee !== '0x0000000000000000000000000000000000000000'){
                    if(formData.payee.length === 42){
                        if(+formData.amount > 0){
                            handelFormSubmit()
                        }else{
                            setFormLoading(false)
                            setError(false)
                            setFileError(false)
                            setNullAddress(false)
                            setInvalidPayeeAddress(false)
                            setInvalidAmount(true)
                        }
                    }else{
                        setInvalidAmount(false)
                        setFormLoading(false)
                        setError(false)
                        setFileError(false)
                        setNullAddress(false)
                        setInvalidPayeeAddress(true)
                    }
                }else{
                    setInvalidAmount(false)
                    setInvalidPayeeAddress(false)
                    setFormLoading(false)
                    setError(false)
                    setFileError(false)
                    setNullAddress(true)
                }
            }else{
                setInvalidAmount(false)
                setInvalidPayeeAddress(false)
                setNullAddress(false)
                setFormLoading(false)
                setError(false)
                setFileError(true)
            }
        }else{
            setInvalidAmount(false)
            setInvalidPayeeAddress(false)
            setNullAddress(false)
            setFormLoading(false)
            setFileError(false)
            setError(true)
        }
    }

    function disabledDate(current) {
        return current && current.valueOf() < moment().add(-1, 'days');
      }

    return(
        <>
        <Modal title = "Add" okText = "Submit" cancelText = "Cancel" visible = {showModal}
        onCancel={closeModal}
        confirmLoading = {formLoading} onOk={handelFrom}>
            <Form layout="vertical">
            <Form.Item name={['urgent']} label = {'Urgent Reqirements(Y/N)'}>
                    <Checkbox checked = {formData.urgent} onChange={handelChange} name={"urgent"} type="checkbox"/>
            </Form.Item>
            <Form.Item name={["title"]}
                label = {"Title"}
                rules={[
                    {
                        required: true,
                        message: 'Please enter title !'
                    },
                ]}>
                    <Input placeholder="Enter Title" value={formData.title} name={"title"} onChange={handelChange} type="text" />
                </Form.Item>
                <Form.Item name={["payee"]}
                label = {"Payee Address"}
                rules={[
                    {
                        required: true,
                        message: 'Please enter payee address !'
                    },
                ]}>
                    <Input placeholder="Enter payee address" value={formData.payee} name="payee" onChange={handelChange} type="text" />
                </Form.Item>
                <Form.Item name={["time"]}
                label = {"Needed Time"} rules={[
                    {
                        required: true,
                        message: 'Please enter time !'
                    },
                ]}>
                    <DatePicker disabledDate = {disabledDate} defaultValue = {formData.date} onChange = {handelDate} />
                    <TimePicker format="HH:mm" defaultValue={formData.time} onChange={handelTime} />
                </Form.Item>
                <Form.Item name={["amount"]}
                label = {"Total Amount(ETH)"}
                rules={[
                    {
                        required: true,
                        message: 'Please enter amount !'
                    },
                    {
                        pattern: /^\d+$/,
                        message: 'amount should be digit only!'
                    }
                ]}>
                    <Input placeholder="Enter amount" name="amount" value={formData.amount} onChange={handelChange} />
                    {addMoney && addMoney.length !== 0 &&  <p>{addMoney === '$ 0.0000, ₹ 0.0000' ? '' : addMoney}</p>}
                </Form.Item>
                <Form.Item name={"image"} label = "Upload Image">
                    <UploadImage fileList = {fileList} setFileList = {setFileList} />
                </Form.Item>
                <Form.Item name={['about']} label = {"About the Fundraiser"}rules={[
                    {
                        required: true,
                        message: 'Please enter About the Fundraiser !'
                    },
                ]}>
                    <Input.TextArea rows={5} placeholder="max length 800 character" maxLength={800}
                    onChange={(e) => setAbout(e.target.value)} value={about} />
                </Form.Item>
            </Form>
            {error &&  <div className={css.error}>All * marks filed are required !</div>}
            {fileError &&  <div className={css.error}>*There should be 4 image is required !</div>}
            {nullAddress &&  <div className={css.error}>*Invalid payee address !</div>}
            {invalidPayeeAddress &&  <div className={css.error}>*Incorrect payee address, please provide valid payee address !</div>}
            {invalidAmount &&  <div className={css.error}>*Amount should be greater than zero !</div>}
        </Modal>
        </>
    )
}

export default AddModal