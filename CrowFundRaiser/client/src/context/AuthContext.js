import React from "react"

export const AuthContext = React.createContext()

export const AuthContextProvider = ({ children }) => {

    const [isAuth, setAuth] = React.useState(false)
    const [userAddress, setUserAddress] = React.useState("")

    const handelAuth = () =>{

        setAuth((prev) => !prev)
    }

    const value = {isAuth, handelAuth, userAddress, setUserAddress }

    return(
        <AuthContext.Provider value = {value}> {children} </AuthContext.Provider>
    )
}