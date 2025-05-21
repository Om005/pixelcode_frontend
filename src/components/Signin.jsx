
import React, { useContext, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "../lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
} from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";
import { AppContent } from "../context/AppContex";
import { useDispatch, useSelector } from "react-redux";
import { getFiles } from "../features/fileSlicer";
import { useEffect } from "react";

export default function Signin() {

  const navigate = useNavigate()
  const dispatch = useDispatch();
  const files = useSelector(state => state.fileSlicer.files);

  
  const handleSubmit = async(e) => {
    try{
      
      e.preventDefault();

      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendurl+'/api/auth/login', {email, password})
      
      if(data.success){
        setisLoggedin(true);
          getUserData()
          toast.success("Login Successful");
          dispatch(getFiles(email));
          
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
        else{
          toast.error(`${data.message}`)
        }
      }
      catch(error){
        toast.error(error.message)
      }
      
    };
    
    const [signup, setsignup] = useState(false)
    const [name, setname] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const {backendurl, setisLoggedin, getUserData} = useContext(AppContent)
    
    return (
      (
      <div className="flex flex-col items-center justify-center h-screen">
        <Link to={'/'}>
        <img src="./imgs/logo.png" className="invert w-72 mb-10" alt="" />
        </Link>
    <div
      className="max-w-md w-full mx-auto rounded-none md:rounded-2xl border border-slate-700 p-4 md:p-8 shadow-input bg-[#000000]">
      <h2 className="font-bold text-xl text-center text-neutral-200">
        {signup?"Sign up":"Sign in"}
      </h2>
      <form className="my-8" onSubmit={handleSubmit}>
        <div
          className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          {signup && <LabelInputContainer>
            <Label htmlFor="Fullname">First name</Label>
            <Input id="Fullname" value={name} onChange={(e)=>setname(e.target.value)} placeholder="Full name" type="text" />
          </LabelInputContainer>}
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" value={email} onChange={(e)=>setemail(e.target.value)} placeholder="Email" type="email" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" value={password} onChange={(e)=>setpassword(e.target.value)} placeholder="Password" type="password" />
        </LabelInputContainer>
        <p className="text-blue-700 mb-2 cursor-pointer">
          <Link to={'/reset-password'}>
          Forgot Password?
          </Link>
        </p>
        <button
          className="bg-gradient-to-br relative group/btn from-zinc-900 to-zinc-900 block bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit">
          {signup?"Sign up":"Sign in"} &rarr;
          <BottomGradient />
        </button>

        <div
          className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent mt-8 h-[1px] w-full" />
        <p className="text-white text-center my-2 mb-3"> 
    <>
    Don't have an account?{" "}
      <Link to={'/signup'} className="text-blue-700 cursor-pointer">Create account</Link>
    </>
          
          </p>
        <div className="flex flex-col space-y-4">
          {/* <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-zinc-900 shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit">
            <IconBrandGithub className="h-4 w-4 text-neutral-300" />
            <span className="text-neutral-300 text-sm">
              GitHub
            </span>
            <BottomGradient />
          </button>
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-zinc-900 shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit">
            <IconBrandGoogle className="h-4 w-4 text-neutral-300" />
            <span className="text-neutral-300 text-sm">
              Google
            </span>
            <BottomGradient />
          </button> */}
        </div>
      </form>
              </div>
    </div>)
  );
}

const BottomGradient = () => {
  return (<>
    <span
      className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    <span
      className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
  </>);
};

const LabelInputContainer = ({
  children,
  className
}) => {
  return (
    (<div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>)
  );
};
