import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { AppContent } from '../context/AppContex';
import { useNavigate } from 'react-router-dom';
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "../lib/utils";

const BottomGradient = () => {
  return (<>
    <span
      className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    <span
      className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
  </>);
};


const ResetPassword = () => {
  const [email, setemail] = useState("")
  const [isemailsent, setisemailsent] = useState(false)
  const [isverified, setisverified] = useState(false)
  const [newpassword, setnewpassword] = useState("")

  const iprefs = useRef([])
  const navigate = useNavigate()
  const {backendurl, isLoggedin,getUserData,userData, setuserData} = useContext(AppContent)
  axios.defaults.withCredentials = true
  const handleinput = (e, index)=>{
    if(e.target.value.length > 0 && index<iprefs.current.length-1){
      iprefs.current[index+1].focus()
    }
  }
  const handlekeydown = (e, index)=>{
    if(e.key === 'Backspace' && e.target.value==='' && index>0){
      iprefs.current[index-1].focus()
    }
  }

  const handlepaste = (e)=>{
    const paste = e.clipboardData.getData('text')
    const pastearr = paste.split('')
    pastearr.forEach((e, index)=>{
      if(iprefs.current[index]){
        iprefs.current[index].value = e;
      }
    })
  }

  const handlesubmitotp = async(e)=>{
    try{
      e.preventDefault();
      const otparr = iprefs.current.map(e=>e.value)
      const otp = otparr.join('')
      
      const {data} = await axios.post(backendurl+'/api/auth/verify-reset-otp', {email, otp})
      
      if(data.success){
        toast.success(data.message)
        setisverified(true)
      }
      else{
        toast.error(data.message)
      }
    }catch(error){
      console.log(error)
    }
  }
  const handleemailsub = async(e)=>{
    try{
      e.preventDefault()
      const {data} = await axios.post(backendurl+'/api/auth/send-reset-otp', {email})
      if(data.success){
        toast.success(data.message)
        setisemailsent(true)
      }
      else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.message)
    }
  }
  
  const handlenewpasssub = async(e)=>{{
    try{

      e.preventDefault()
      const {data} = await axios.post(backendurl+'/api/auth/reset-password', {email, newPassword:newpassword})
      if(data.success){
        toast.success(data.message)
        navigate('/signin')
      }
      else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.message)
    }
  }}
  return (
    <>
    <div className='flex text-white justify-center items-center min-h-screen bg-gradient-to-b from-blue-950 to-blue-900'>
        {!isemailsent && <form className='rounded-2xl p-8 flex flex-col items-center shadow-xl w-96 text-sm border  border-slate-700 bg-[#151c22]' onSubmit={handleemailsub}>
          <h2 className='text-2xl font-semibold text-center mb-4'>Reset Password</h2>
          <p className='text-center mb-6 text-blue-0 text-lg'>Enter your registered email id</p>
          <div className='flex justify-between gap-2 mb-8'>
            {/* {Array(6).fill(0).map((_, index)=>(
              <input type="text" key={index} maxLength={'1'} required
              className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
              ref={e=>iprefs.current[index] = e}
              onInput={(e)=>handleinput(e, index)}
              onKeyDown={(e)=>handlekeydown(e, index)}
              />
              ))} */}
            <LabelInputContainer className="w-full">
                      <Input id="email" value={email} onChange={(e)=>setemail(e.target.value)} className={'w-72'} placeholder="Email" type="email" />
                  </LabelInputContainer>
          </div>
          <button
          className="bg-gradient-to-br relative group/btn border border-slate-700 from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-[90%] text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit">
            Submit
          <BottomGradient />
        </button>
        </form>}
        {isemailsent && !isverified && <form className='rounded-2xl p-8 flex flex-col items-center shadow-xl w-96 text-sm border  border-slate-700 bg-[#151c22]' onSubmit={handlesubmitotp}>
          <h2 className='text-2xl font-semibold text-center mb-4'>Email Verify OTP</h2>
          <p className='text-center mb-6 text-blue-0 text-lg'>Enter 6-digit code sent to your email id.</p>
          <div className='flex justify-between gap-2 mb-8' onPaste={handlepaste}>
            {Array(6).fill(0).map((_, index)=>(
              <input type="text" key={index} maxLength={'1'} required
              autoFocus={index === 0}
              className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
              ref={e=>iprefs.current[index] = e}
              onInput={(e)=>handleinput(e, index)}
              onKeyDown={(e)=>handlekeydown(e, index)}
              />
            ))}
          </div>
          <button
          className="bg-gradient-to-br  relative group/btn border border-slate-700 from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-[50%] text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit">
            Verify OTP
          <BottomGradient />
        </button>
        </form>}
    {isemailsent && isverified && <form className='rounded-2xl p-8 flex flex-col items-center shadow-xl w-96 text-sm border  border-slate-700 bg-[#151c22]' onSubmit={handlenewpasssub}>
      <h2 className='text-2xl font-semibold text-center mb-4'>Reset Password</h2>
      <p className='text-center mb-6 text-blue-0 text-lg'>Enter new password</p>
      <div className='flex justify-between gap-2 mb-8'>
        {/* {Array(6).fill(0).map((_, index)=>(
          <input type="text" key={index} maxLength={'1'} required
          className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
          ref={e=>iprefs.current[index] = e}
          onInput={(e)=>handleinput(e, index)}
          onKeyDown={(e)=>handlekeydown(e, index)}
          />
          ))} */}
        <LabelInputContainer className="w-full">
                  <Input id="email" value={newpassword} onChange={(e)=>setnewpassword(e.target.value)} className={'w-72'} placeholder="New password" type="password" />
              </LabelInputContainer>
      </div>
      <button
      className="bg-gradient-to-br relative group/btn border border-slate-700 from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-[90%] text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
      type="submit">
        Submit
      <BottomGradient />
    </button>
    </form>}
    </div>
  </>
  )
}


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


export default ResetPassword
