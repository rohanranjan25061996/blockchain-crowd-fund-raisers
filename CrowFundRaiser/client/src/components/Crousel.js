import React from "react";
import {Carousel} from "antd"
import css from "./index.module.css"

const CrouselData = (props) => {

    const {image, id, goToFullPage} = props
    const url = process.env.REACT_APP_MORALIS_IPFS_URL;
    return(
        <>
        <Carousel autoplay effect="fade">
            {image && image.map((item) => <div className={css.crousel_image}> <img src={`${url}${item}`} alt="image" width={'100%'} height={'100%'}
            onClick={() => goToFullPage(id)} /> </div>)}
        </Carousel>
        </>
    )
}

export default CrouselData