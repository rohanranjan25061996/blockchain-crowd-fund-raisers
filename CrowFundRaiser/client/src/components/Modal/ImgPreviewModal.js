import React from "react";
import {Upload} from "antd"
import {PlusOutlined} from "@ant-design/icons"
let i = 0

const UploadImage = (props) => {

    const {fileList, setFileList } = props

    const onChange = ({fileList}) => {
        setFileList(fileList)
    }


    const uploadButton = (
        <>
        <div>
            <PlusOutlined />
        </div>
        </>
    )

    return(
        <>
        <Upload listType={'picture-card'}
        fileList={fileList}
         onChange={onChange}>
            {fileList.length < 4 ? uploadButton : null}
        </Upload>
        </>
    )

}

export default UploadImage