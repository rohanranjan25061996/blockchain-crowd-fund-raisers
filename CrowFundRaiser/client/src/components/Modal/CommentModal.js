import React from "react"
import {Modal, Form, Input} from "antd"
import css from "../index.module.css"

const CommentModal = (props) => {

    const {showModal, formLoading, formData, closeModal, handelChange, handelSubmit, setFormLoading} = props
    const [error, setError] = React.useState(false)
    const [nullAddressError, setNullAddressError] = React.useState(false)
    const handelForm = () => {
        setNullAddressError(false)
        setFormLoading(true)
        setError(false)
        if(formData.comment !== '' && formData.to !== ''){
            if(formData.to !== '0x0000000000000000000000000000000000000000'){
                handelSubmit()
            }else{
                setFormLoading(false)
                setError(false)
                setNullAddressError(true)
            }
        }else{
            setNullAddressError(false)
            setFormLoading(false)
            setError(true)
        }
    }
    return(
        <>
         <Modal title = "Add Comment" onCancel={closeModal} confirmLoading = {formLoading} onOk={handelForm}
        okText = "Add" cancelText = "Cancel" visible = {showModal}>
            <Form layout="vertical">
                <Form.Item name={['from']} label = {'Form Address'} initialValue={formData.from}>
                    <Input disabled = {true} />
                </Form.Item>
                <Form.Item name={['to']} label = {'To Address'} rules={[
                     {
                        required: true,
                        message: 'Please enter to address here.. !'
                    },
                ]}>
                    <Input name="to" value={formData.to} onChange={handelChange} placeholder="enter to address here.." />
                </Form.Item>
                <Form.Item name={['comment']} label = {'Message'} rules={[
                    {
                        required: true,
                        message: 'Please enter comment !'
                    },
                ]}>
                    <Input.TextArea value={formData.comment} name="comment"  
                    rows={5} placeholder="max length 50 character" maxLength={50} onChange={handelChange} />
                </Form.Item>
            </Form>
            {error &&  <div className={css.error}>All * marks filed are required !</div>}
            {nullAddressError &&  <div className={css.error}>Invalid to address !</div>}
        </Modal>
        </>
    )
}

export default CommentModal