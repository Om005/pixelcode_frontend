import { TypewriterEffectSmooth } from "./ui/typewriter-effect";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AppContent } from "../context/AppContex";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { getFiles } from "../features/fileSlicer";
import { useNavigate } from "react-router-dom";


export function TypewriterEffectSmoothDemo() {
  const dispatch = useDispatch();
  const files = useSelector(state => state.fileSlicer.files);
  const navigate = useNavigate()
  const {backendurl, setisLoggedin, getUserData} = useContext(AppContent)
  const {isLoggedin, userData} = useContext(AppContent)
const words = [
    {
        text: "Begin Your Coding Adventure With",
    },
    {
        text: "\u00A0PIXELCODE.",
        className: "text-blue-500 dark:text-blue-500",
    },
];

  const handlebtn = async (e)=>{
    try{
      const data = await dispatch(getFiles(userData.email));
      window.scrollTo(0, 0);
      navigate('/ide')
    }catch(error){
      toast.error(error.message)
    }
  }
  const handleguest = async (e)=>{
    window.scrollTo(0, 0);
      navigate('/guest');
  }
  return (
    <div className="flex flex-col items-center justify-center h-[40rem]  ">
      <TypewriterEffectSmooth words={words} />
      <p className="text-white text-center mb-10">Welcome to PIXELCODE, a flexible code editor for any programming language. Write, save, and manage your code with ease using its intuitive interface and powerful features.</p>
      <div
        className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <button onClick={handleguest}
          className="w-40 flex justify-center items-center h-12 rounded-xl z-10 bg-black border dark:border-white border-transparent text-white text-lg">
          Explore now
        </button>
        {!isLoggedin && <Link to={'signup'}
          className="w-40 flex justify-center items-center h-12 z-10 rounded-xl bg-white text-black border border-black roboto text-lg">
          Signup
        </Link>}
        {isLoggedin && userData.isAccountVerified && <button onClick={handlebtn}
          className="w-48 flex justify-center items-center h-12 z-10 rounded-xl bg-white text-black border border-black roboto text-lg">
          Code Play Ground
        </button>}
        {isLoggedin && !userData.isAccountVerified && <button onClick={()=> toast.error("Please verify your email first.")}
          className="w-48 flex justify-center items-center h-12 z-10 rounded-xl bg-white text-black border border-black roboto text-lg">
          Code Play Ground
        </button>}
      </div>
    </div>
  );
}
