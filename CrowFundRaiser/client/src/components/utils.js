import {abi} from "../ABI"
import {ethers} from "ethers"
export { notification as default } from 'antd';



export function parseErrorMessage(e) {
  try {
    const error_strings = [];
    if (e.details && e.details.length > 0) {
      e.details.forEach((e) => {
        error_strings.push(e.message);
      });
    } else error_strings.push(e.message);
    return error_strings.join('. ');
  } catch (e) {
    return 'Uncaught exception found.';
  }
}

export const getWalletInstance = () => {
    const provider = new ethers.providers.JsonRpcBatchProvider(process.env.REACT_APP_RINKEBY_NEWTORK_URL);
    const wallet = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, abi, provider);
    return [provider, wallet]
}

export const getSignedContract = async () => {
    const provider = new ethers.providers.JsonRpcBatchProvider(process.env.REACT_APP_RINKEBY_NEWTORK_URL);
    const signer = provider.getSigner(process.env.REACT_APP_MY_ADDRESS)
    const wallet = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, abi, signer);
    console.log("step9", provider, signer, wallet)
    return wallet
}

export const getTimeMillisecond = (date, time) => {
    let splitDate = date.split('-');
    let newDate = `${splitDate[1]}/${splitDate[2]}/${splitDate[0]}`
    let newTime = `${time}:00`
    let mix = `${newDate} ${newTime}`
    let newdate = new Date(mix)
    let res = newdate.getTime()
    return res.toString();
}

export const convertTimeToDHM = (time, TM, CM) => {
  let flag = +TM === +CM ? true : false
    if(time && !flag){
        const now_time = new Date().getTime();
        const calc = +time - now_time;
        if(calc > 0){
            let days = Math.floor(calc / (1000 * 60 * 60 * 24));
            let hours = Math.floor((calc / (1000 * 60 * 60)) % 24);
            let minutes = Math.floor((calc / 1000 / 60) % 60);
            let d = days < 10 ? `0${days}` : days
            let hr = hours < 10 ? `0${hours}` : hours
            let min = minutes < 10 ? `0${minutes}` : minutes
            return `${d}::${hr}::${min}`
        }else{
            return null
        }
    }else{
        return null
    }
}

export const ethereumToDollarToRupees = (money) => {
    let dollar = +money * 2637.50
    let rupees = dollar.toFixed(4) * 76.43
    return rupees.toFixed(3)
}

export const convertMoney = (money) => {
  let dollar = +money * 2637.50
  let rupees = dollar.toFixed(4) * 76.43
  let final = `$ ${dollar.toFixed(4)}, ₹ ${rupees.toFixed(4)}`
  return final
}