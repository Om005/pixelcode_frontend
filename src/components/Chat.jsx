import { MoonIcon, SunIcon, Trash2Icon, SendIcon, SparklesIcon } from "lucide-react"
import React, { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import Markdown from 'react-markdown'
import rehypePrism from 'rehype-prism-plus';
import 'prismjs/themes/prism-okaidia.css'; // Pick a Prism theme
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast"
import { useContext } from "react"
import { AppContent } from "../context/AppContex"
import { useNavigate } from "react-router-dom"

const Chat = () => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(true)
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState(localStorage.getItem("chatMessages") ? JSON.parse(localStorage.getItem("chatMessages")) : [])
  const [isTyping, setIsTyping] = useState(false)
  const [DeletePopup, setDeletePopup] = useState(false)
  const [isrefer, setisrefer] = useState(location.state?.isrefer || false)
  const [arg, setarg] = useState(location.state?.arg || "")
  const [fname, setfname] = useState(location.state?.fname || "")
  const [type, settype] = useState(location.state?.type || "")
  const navigate = useNavigate()
  
  
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  
  const clearChat = () => {
    setMessages([])
  }
  
  const { isLoggedin, userData, isLoading } = useContext(AppContent);
    useEffect(() => {
      if(!isLoggedin && !isLoading){
          navigate("/notfound");
          toast.error("User is not authorized");
      }
    }, [isLoading, isLoggedin])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  
  
  useEffect(() => {
    scrollToBottom()
    localStorage.setItem("chatMessages", JSON.stringify(messages))
  }, [messages])
  
  useEffect(() => {
    inputRef.current?.focus()
  }, [])
  
useEffect(() => {

        const handleKeyDown = (e) => {
          if ((e.key === "Enter" && DeletePopup==true)) {
            document.querySelector(".dbtn").click();
          }
          if ((e.key === "Escape" && DeletePopup==true)) {
            document.querySelector(".dcbtn").click();
          }

        };
        window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [DeletePopup]);

  const handleSendMessage = async () => {
  if (inputValue.trim() === "") return;

  const userMessage = {
    id: Date.now().toString(),
    content: inputValue,
    sender: "user",
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setInputValue("");
  setIsTyping(true);

  try {
    const aiResponse = await getAIResponse(inputValue); // ✅ await here

    const aiMessage = {
      id: (Date.now() + 1).toString(),
      content: aiResponse,
      sender: "ai",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
  } catch (err) {
    console.error(err);
  }

  setIsTyping(false);
};


  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const getAIResponse = async (message) => {
    try{
      if(isrefer === false || fname===""){
        const rsp = await axios.post(import.meta.env.VITE_BACKEND_URL+"/api/chat/response", { message });
        return rsp.data.data;
      }
      //let msg = "if user dont give any code and tell you this code or this file, something like that then refer to this code file\n"+fname+"\n"+arg+"\n else give normal response like you do everytime\n, user is asking/telling:\n"+message
      let msg = `In case the question refers to "this code" or "this file" without providing specific code, please consider the following as the context:\nFilename: ${fname}\nCode: ${arg}\n\nOtherwise, proceed normally and write full name of language where ever you are using it (like cpp instead of c++).\n\nUser says:\n${message}`;

      const rsp = await axios.post(import.meta.env.VITE_BACKEND_URL+"/api/chat/response", { message: msg });
      return rsp.data.data;
    } catch{
      return "Sorry, I am unable to respond at the moment. Please try again later.";
    }
  };

  const formatTime = (date) => {
    try{
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }catch{
      const dateObj = new Date(date);
      return dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
  }

  return (
    <div
      className={darkMode ? "bg-[#09090B] overflow-hidden montserrat relative" : "bg-gray-100 overflow-hidden montserrat relative"}
      style={{ height: "90vh" }}
    >
      <div className="absolute top-24 flex justify-center z-10 w-[80vw]">

      {(isrefer && fname!=="") && <div className="bg-[#1A1A1F] relative ml-60 text-[#9CA3A6] flex gap-2 rounded-lg p-3">
        <img onClick={()=>{setisrefer(false)}} src="./svgs/cross.svg" className="cursor-pointer absolute w-5 -right-1 bg-[#2d2d34] rounded-full -top-1 p-1" alt="" />
        <img src={`./svgs/${type}.svg`} className="w-5" alt="" />
        {fname}
      </div>}
      </div>
      {/* Navbar */}
      <div className="flex justify-center absolute -mt-4 w-full pb-2 z-10">
        <div className="w-[50%] h-14 rounded-xl mt-10 bg-gradient-to-r from-indigo-900 to-purple-900 text-white flex justify-between items-center px-6 border border-indigo-700/30">
          <div className="flex items-center space-x-2 bg-[#463488] px-3 py-1 -ml-4 border border-slate-600 rounded-lg">
            <SparklesIcon className="h-5 w-5 text-indigo-300" />
            <h1 className="text-xl font-semibold tracking-wide">Nebula</h1>
          </div>

          <div className="flex items-center space-x-3">
          <Link
  to="/ide"
  className="group relative flex items-center transition-all duration-200 space-x-2 px-2 py-1 -ml-2 cursor-pointer rounded-lg"
>
  <span className="text-white">CodePlayGround</span>
  
  {/* Underline Animation */}
  <span
    className="absolute left-0 -bottom-0.5 h-0.5 bg-white w-0 group-hover:w-[90%] transition-all duration-200 ease-out"
  ></span>
</Link>
          <Link
  to="/"
  className="group relative flex items-center transition-all duration-200 space-x-2 px-2 py-1 -ml-2 cursor-pointer rounded-lg"
>
  <span className="text-white">Home</span>
  
  {/* Underline Animation */}
  <span
    className="absolute left-0 -bottom-0.5 h-0.5 bg-white w-0 group-hover:w-[80%] transition-all duration-200 ease-out"
  ></span>
</Link>
{messages.length!==0 && <button
              onClick={()=> setDeletePopup(true)}
              className="rounded-xl transition-all duration-200 hover:shadow-md hover:bg-red-700 px-4 py-2 text-sm font-medium flex items-center space-x-1"
            >
              <Trash2Icon className="h-4 w-4" />
              <span>Clear Chat</span>
            </button>}
            {DeletePopup && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className={`bg-${darkMode ? "[#18181b]" : "white"} rounded-xl shadow-lg p-8 bg-[#272822] w-80 flex flex-col items-center`}>
                  <Trash2Icon className="h-8 w-8 text-red-500 mb-2" />
                  <h2 className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>Clear Chat?</h2>
                  <p className={`text-sm mb-6 text-center ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Are you sure you want to delete all messages? This action cannot be undone.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setDeletePopup(false)}
                      className={`px-4 dcbtn py-2 rounded-lg font-medium transition-all duration-150 ${darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        clearChat()
                        setDeletePopup(false)
                      }}
                      className="bg-red-600 dbtn hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-150"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${darkMode ? "text-white" : "text-gray-800"} h-[90vh] flex flex-col p-6 overflow-y-auto`}>
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-[2vw] mb- text-gray-500">
            How can I help you today?
          </div>
        ) : (
          <div className="space-y-4 w-full pt-24 pb-12 mt-5 max-w-[75%] mx-auto">
            {messages.map((message) => (
              <div key={message.id} className={`flex text-l ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                {message.sender==="ai" && <span className="h-fit px-2 py-2 rounded-full bg-[#312E81] mr-5 -ml-8">
                  <img src="./svgs/bot.svg" className="invert h-8" alt="" />
                  </span>}
                <div
                  className={`max-w-[80%] rounded-2xl ${
                    message.sender === "user"
                      ? `${darkMode ? "bg-indigo-900 px-4 py-3 " : "bg-indigo-600"} text-white`
                      : `${darkMode ? "bg-gray-800" : "bg-white"} ${darkMode ? "text-white" : "text-gray-800"}`
                  }`}
                >
                  {message.sender === "user"&&<div className="text-sm sm:text-base">
                    {message.content}
                    </div>}
                  {message.sender === "ai"&&<div className="relative text-sm px-4 py-3 rounded-xl bg-[#212121] sm:text-base break-words whitespace-pre-wrap">
                        <img onClick={()=>{
                          navigator.clipboard.writeText(message.content);

                          toast.success("Response copied to clipboard");
                        }} src="./svgs/copy.svg" className="invert copy absolute -bottom-12 mt-1 left-1 cursor-pointer hover:bg-[#D8D7DD] p-2 rounded-lg" alt="" />
                    <Markdown rehypePlugins={[rehypePrism]}>

                    {message.content}
                    </Markdown>
                    </div>}

                  {message.sender === "user"&&<div className={`text-xs mt-1 ${message.sender === "user" ? "text-indigo-200" : "text-gray-400"}`}>
                    {formatTime(message.timestamp)}
                  </div>}
                  
                  

                </div>
                {message.sender==="user" && <span className="h-fit px-2 py-2 rounded-full bg-[#312E81] -mr-7 ml-4">
                  <img src="./svgs/user.svg" className="h-8" alt="" />
                  </span>}
                
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start items-center">
                <span className="h-fit px-2 py-2 rounded-full bg-[#312E81] mr-5 -ml-8">
                  <img src="./svgs/bot.svg" className="invert h-8" alt="" />
                  </span>
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${darkMode ? "bg-gray-800" : "bg-white"} ${darkMode ? "text-white" : "text-gray-800"}`}
                >
                  <div className="flex space-x-1">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="fixed bottom-4 transition-all duration-200 w-full flex justify-center items-center">
      
        <div className="relative w-[70%] px-4">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className={`${darkMode ? "bg-[#1a1a1f] border-[#27272e]" : "bg-white border-gray-300"} w-full focus:border-none outline-none duration-200 focus:outline-indigo-600 h-16 rounded-xl border pl-4 pr-12 ${darkMode ? "text-white" : "text-gray-800"}`}
            placeholder="Type your message..."
          />
          <button
            onClick={handleSendMessage}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 p-2.5 rounded-lg hover:shadow-md transition-all duration-200"
          >
            <SendIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .typing-dot {
          width: 8px;
          height: 8px;
          background-color: ${darkMode ? "#ffffff" : "#666666"};
          border-radius: 50%;
          animation: typing 1.5s infinite ease-in-out;
        }

        .typing-dot:nth-child(1) {
          animation-delay: 0s;
        }

        .typing-dot:nth-child(2) {
          animation-delay: 0.3s;
        }

        .typing-dot:nth-child(3) {
          animation-delay: 0.6s;
        }

        @keyframes typing {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
          
        /* Scrollbar Styles */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: ${darkMode ? "#1a1a1f" : "#f1f1f1"};
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: ${darkMode ? "#3d3d4d" : "#c1c1c1"};
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? "#4d4d5d" : "#a1a1a1"};
        }

      `}</style>
    </div>
  )
}

export default Chat
