import React from "react"
import {Modal, Form, Input} from "antd"
import css from "../index.module.css"


const PayModal = (props) => {

    const {showModal, formLoading, formData, closeModal, handelChange, handelSubmit, setFormLoading, payMoney, leftMoney} = props
    const [error, setError] = React.useState(false)
    const [invalidAmount, setInvalidAmount] = React.useState(false);
    const [moneyLeft, setMoneyLeft] = React.useState(false)

    const handelForm = () => {
        setMoneyLeft(false)
        setInvalidAmount(false)
        setFormLoading(true)
        setError(false)
        if(formData.amount !== ''){
            if(+formData.amount > 0){
                if(+formData.amount <= +leftMoney){
                    handelSubmit()
                }else{
                    setError(false)
                    setFormLoading(false)
                    setInvalidAmount(false)
                    setMoneyLeft(true)
                }
            }else{
                setError(false)
                setFormLoading(false)
                setMoneyLeft(false)
                setInvalidAmount(true)
            }
        }else{
            setFormLoading(false)
            setError(true)
        }
    }
    return(
        <>
        <Modal title = "Donate/Support" onCancel={closeModal} confirmLoading = {formLoading} onOk={handelForm}
        okText = "Send" cancelText = "Cancel" visible = {showModal}>
            <Form layout="vertical">
                <Form.Item name={['from']} label = {'From Address'} initialValue={formData.from}>
                    <Input disabled = {true} />
                </Form.Item>
                <Form.Item name={['to']} label = {'To Address'}>
                    <Input defaultValue={formData.to} disabled = {true} />
                </Form.Item>
                <Form.Item name={['amount']} label = {'Amount (ETH)'} rules={[
                    {
                        required: true,
                        message: 'Please enter amount in eth !'
                    },
                ]}>
                    <Input value={formData.amount} name="amount" placeholder="enter amount in eth" onChange={handelChange} />
                    {payMoney && payMoney.length !== 0 && <p>{payMoney === '$ 0.0000, ₹ 0.0000' ? '' : payMoney}</p>}
                </Form.Item>
            </Form>
            {error &&  <div className={css.error}>All * marks filed are required !</div>}
            {invalidAmount &&  <div className={css.error}>*Amount should be greater than zero !</div>}
            {moneyLeft &&  <div className={css.error}>*Pay amount should be less than & equal to (total money - collectedMoney)!</div>}
        </Modal>
        </>
    )
}

export default PayModal