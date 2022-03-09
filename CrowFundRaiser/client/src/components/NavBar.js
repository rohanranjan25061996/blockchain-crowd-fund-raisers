import React from "react";
import {Layout, Menu} from "antd"
import {getWalletInstance} from "./utils"
import css from "./index.module.css"
import {Link} from "react-router-dom"
import { AuthContext } from "../context/AuthContext";
import {useMoralis} from "react-moralis";
import {useNavigate} from "react-router";

const { Header } = Layout;

const NavBar = (props) => {

    const {isAuth, setUserAddress, handelAuth} = React.useContext(AuthContext)
    const {isAuthenticated, isWeb3Enabled, authenticate, enableWeb3, logout} = useMoralis()

    const [name, setName] = React.useState('')
    const navigate = useNavigate();
    React.useEffect(() => {
        getName()
    }, [])

    React.useEffect(() => {
        if (!isWeb3Enabled && isAuthenticated) {
          enableWeb3({ provider: "walletconnect", chainId: 56 });
          console.log("web3 activated");
        }
      }, [isWeb3Enabled, isAuthenticated, enableWeb3]);

    const getName = async () => {
        let wallet = getWalletInstance();
        const _name = await wallet[1].CrowdFundRaiserName();
        setName(_name)
    }

    const loginUser = async () => {
        authenticate({signingMessage: 'Welcome to Blockchain Crowd Fund App !'}).then((user) => {
           let addr = user.get("ethAddress")
           setUserAddress(addr);
           handelAuth();
           navigate("/home");
      })
   }

   const logoOutuser = () => {
       logout();
       setUserAddress("")
       handelAuth()
   }

    return(
        <>
        <div className={css.navbar}>
            <div className={css.logo}>{name}</div>
            <div className={css.navbar_link}>
                <Link key={"/"} to={"/"} className={css.link} onClick={!isAuth ? loginUser : logoOutuser}>{isAuth ? "Sign Off" : "Sign In With Wallet"}</Link>
                <Link key={"/home"} to={"/home"} className={css.link}>Home</Link>
            </div>
        </div>
        </>
    )
}

export default NavBar