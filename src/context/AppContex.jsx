import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContent = createContext()
import { useDispatch, useSelector } from "react-redux";
import { getFiles } from "../features/fileSlicer";

export const AppContextProvider = (props)=>{
    axios.defaults.withCredentials = true;
    const backendurl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin, setisLoggedin] = useState(false)
    const [isLoading, setisLoading] = useState(true)
    const [userData, setuserData] = useState(false)
    const dispatch = useDispatch()

    const getAuthState = async()=>{
        try{
            const {data} = await axios.get(backendurl+'/api/auth/is-auth')
            if(data.success){
                setisLoggedin(true);
                getUserData()
            }
            else{
                setisLoggedin(false);
                if(data.message!=="Not Authorized Login Again.")
                    toast.error(data.message)
            }
        }catch(error){
            setisLoggedin(false);
            toast.error(error.message)
        }finally {
        setisLoading(false); // Important!
    }
    }
    const getUserData = async()=>{
        try{
            const {data} = await axios.get(backendurl+'/api/user/data')
            data.success?setuserData(data.userData):toast.error(data.message)
            await dispatch(getFiles(data.userData.email))

        }catch(error){
            toast.error(error.message)
        }
    }
    
    useEffect(()=>{
        getAuthState();
    }, [])
    const value = {
        backendurl, isLoading,
        isLoggedin, setisLoggedin ,
        userData, setuserData,
        getUserData,
    }
    
    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}