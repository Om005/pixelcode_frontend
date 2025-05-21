import React, { useEffect, useRef, useState, useContext } from "react";
import { cn } from "../lib/utils";
import { Editor } from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

import themes from "../constants/Themes";
import languages from "../constants/info";
import { toast } from "react-hot-toast";
import { useLocation } from 'react-router-dom';
import { AppContent } from "../context/AppContex";
import { useSelector } from "react-redux";
import { setCurrFile } from "../features/fileSlicer";
import { useDispatch } from "react-redux";
import { WriteFile } from "../features/fileSlicer";
import { GetNode } from "../features/fileSlicer";
import { SparklesIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";


import { useMonaco } from "@monaco-editor/react";
export default function Auth() {

  
  
  return (
    <div
    className={cn(
        "rounded-md flex flex-col md:flex-row bg-neutral-800 w-full flex-1 mx-auto border border-neutral-700 overflow-hidden",
        "h-[100vh]"
      )}
      >
      <Dashboard />
    </div>
  );
}
const Dashboard = () => {
  const monaco = useMonaco();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [selectedLanguage, setSelectedLanguage] = useState(
  //   localStorage.getItem("lang") === null
  //   ? "javascript"
  //   : localStorage.getItem("lang")
  // );
  const [ip, setip] = useState(
    localStorage.getItem("ip") ? "" : localStorage.getItem("ip")
  );
  const [output, setoutput] = useState("");
  // const [code, setcode] = useState(
  //   localStorage.getItem("code") === null
  //   ? languages["javascript"].boilerplate
  //   : localStorage.getItem("code")
  // );
  // const [type, settype] = useState(
  //   localStorage.getItem("code") == null
  //   ? "text/javascript"
  //   : localStorage.getItem("ex")
  // );
  // const [extension, setextension] = useState(
  //   localStorage.getItem("ex") === null ? ".js" : localStorage.getItem("ex")
  // );
  
  const [hovered, setHovered] = useState(false);
  const [hoveredi, setHoveredi] = useState(false);
  const [hoveredo, setHoveredo] = useState(false);
  const [hoveredw, setHoveredw] = useState(false);
  const [hoveredio, setHoveredio] = useState(false);
  const [hoveredreset, setHoveredreset] = useState(false);
  const [showPopup, setshowPopup] = useState(false);
  const [wrap, setwrap] = useState(false);
  const [see, setsee] = useState(true);
  
  const handleMouseEnter = () => {
    setHovered(true);
  };
  
  const handleMouseLeave = () => {
    setHovered(false);
  };
  const handleMouseEnteri = () => {
    setHoveredi(true);
  };
  
  const handleMouseLeavei = () => {
    setHoveredi(false);
  };
  
  const handlefile = (e) => {
    const f = e.target.files[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setip(e.target.result);
        localStorage.setItem("ip", e.target.value);
      };
      reader.readAsText(f);
    }
  };
  
  const handledownload = () => {
    const blob = new Blob([currfile.content], { type: languages[extoname[`${currfile.language}`]].type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `code.${currfile.language}`;
    link.click();
  };
  
  const handlerun = async () => {
    
    if(currfile.language == "txt"){
      toast.error("A text file cannot be executed");
      return;
    }
    setsee(true);
    document.querySelector(".run").style.backgroundColor = "#4461BD";
    document.querySelector(".run").children[1].innerHTML = "Running...";
    document.querySelector(".run").children[0].src = "./svgs/running.gif";
    document.querySelector(".run").children[0].classList.remove("invert");
    
    document.querySelector(".op").classList.add("animate-pulse");
    document.querySelector(".op").classList.remove("text-red-400");
    document.querySelector(".op").classList.add("text-green-300");
    setoutput("Loading...");
    const options = {
      method: "POST",
      url: "https://onecompiler-apis.p.rapidapi.com/api/v1/run",
      headers: {
        "x-rapidapi-key": import.meta.env.VITE_RAPID_KEY,
        "x-rapidapi-host": import.meta.env.VITE_RAPID_HOST,
        "Content-Type": "application/json",
      },
      data: {
        language: extoname[`${currfile.language}`],
        stdin: ip,
        files: [
          {
            name: `index.${currfile.language}`,
            content: currfile.content,
          },
        ],
      },
    };
    const response = await axios.request(options);
    if (response.data.stderr != null) {
      document.querySelector(".op").classList.remove("text-green-300");
      document.querySelector(".op").classList.add("text-red-400");
      setoutput(response.data.stderr);
    } else {
      document.querySelector(".op").classList.remove("text-red-400");
      document.querySelector(".op").classList.add("text-green-300");
      setoutput(response.data.stdout);
    }
    document.querySelector(".op").classList.remove("animate-pulse");
    document.querySelector(".run").style.backgroundColor = "#22C55E";
    document.querySelector(".run").children[1].innerHTML = "Run";
    document.querySelector(".run").children[0].src = "./svgs/play.svg";
    document.querySelector(".run").children[0].classList.add("invert");
  };
  
  const handleimport = () => {
    const inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.style.display = "none"; // Hide the input element
    document.body.appendChild(inputFile);
    
    inputFile.click();
    
    inputFile.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const code = e.target.result; // The file content
          dispatch(setCurrFile({ ...currfile, content: code }));
          dispatch(WriteFile({ nodeId: currfile._id, content: code }));
        };
        reader.readAsText(file); // Read the file content as text
      }
    });
  };
  
  const handletheme = async (e) => {
    if (e.target.value == "Vs-Dark") {
      monaco.editor.setTheme("vs-dark");
    } else if (e.target.value == "Vs-Light") {
      monaco.editor.setTheme("vs-light");
    } else {
      fetch(`/themes/${e.target.value}.json`)
      .then((data) => data.json())
      .then((data) => {
          monaco.editor.defineTheme("customeTheme", data);
          monaco.editor.setTheme("customeTheme");
        });
      }
    };
    
    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === "z" && e.altKey) {
          document.querySelector(".wwrap").click()
        }
        if (e.key === "`" && e.ctrlKey) {
          document.querySelector(".ioio").click()
        }
        if (e.key === "'" && e.ctrlKey) {
          document.querySelector(".run").click()
        }
        if (e.key === "F2") {
          document.querySelector(".run").click()
        }
        if ((e.key === "S" || e.key==="s") && e.ctrlKey && e.shiftKey) {
          document.querySelector(".dwnld").click()
        }
      };
      window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  
useEffect(() => {
  const fetchNode = async () => {
    const nodeId = localStorage.getItem("lst");
    if (nodeId !== null) {
      const rsp = await dispatch(GetNode({ nodeId }));

      if (rsp.payload?.node) {
        dispatch(setCurrFile(rsp.payload.node));
      } else {
        console.warn("No node returned:", rsp);
      }
    }
  };

  fetchNode();
}, []);

  
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false); // Remove the dotted border
    
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setip(event.target.result); // Set file content
        localStorage.setItem("ip", event.target.result); // Save to localStorage
      };
      reader.readAsText(file); // Read file as text
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true); // Set dragging state only once
    }
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false); // Remove dragging visuals
  };

  const [isDragging2, setIsDragging2] = useState(false);

  const handleFileDrop2 = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging2(false); // Remove dragging visuals
    
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        dispatch(setCurrFile({ ...currfile, content: event.target.result }));
        dispatch(WriteFile({ nodeId: currfile._id, content: event.target.result }));
      };
      reader.readAsText(file); // Read file as text
    }
  };
  
  const handleDragOver2 = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging2) {
      setIsDragging2(true); // Show dragging visuals
    }
  };
  
  const handleDragLeave2 = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging2(false); // Hide dragging visuals
  };
  
  const { isLoggedin } = useContext(AppContent);
  const currfile = useSelector(state => state.fileSlicer.currfile);
  const extoname = {txt: "text", "":"none", js: "javascript",py: "python",java: "java",cs: "csharp",cpp: "cpp",go: "go", rs: "rust",kt: "kotlin",pl: "perl",php: "php",rb: "ruby",swift: "swift",c: "c",sh: "bash"};
  return (
    <div className="flex flex-1 overflow-hidden">
        <div className=" p-2 md:p-3 rounded-tl-2xl border border-neutral-700 bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full overflow-hidden">
            <div className="flex gap-2 nunito">
                <div className="h-12 w-full rounded-lg  bg-gray100 dar:bg-neutral-800 flex justify-start items-center">
                    <Link
                        to={"/"}
                        className="text-blue-400 roboto p-2 saira-condensed-semibold text-xl bg-[#1E1E1E] shadow shadow-white rounded-lg m-1"
                        >
                        <img src="./imgs/logo2.png" className="invert w-36 mr-2" alt="" />
                    </Link>

                    <select
                        value={extoname[`${currfile.language}`]}
                        disabled={true}
                        className="w-[50%] montserrat px-3 py-3 bg-[#171717] text-white border rounded-lg focus:outline-none focus:border-blue-500"
                    >
                        {Object.values(languages).map((lang) => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="h-12 w-full rounded-lg  bg-gray100 dak:bg-neutral-800 flex justify-end items-center">
                    <button
                        onClick={handlerun}
                        className="px-4 gap-1 run py-1 bg-[#01FF5E78] text-white flex justify-start items-center rounded-lg hover:bg-[#01ff5ea3] duration-200 focus:outline-none w-full md:w-auto"
                    >
                        <img src="./svgs/play.svg" className="invert w-5" alt="" />
                        <span>Run</span>
                    </button>
                </div>
                <div className="h-12 w-full rounded-lg  bg-gray100 dak:bg-neutral-800 flex justify-end items-center">
                </div>
                <div className="h-12 w-full rounded-lg  bg-gray100 dak:bg-neutral-800 flex justify-end mr-9 gap-1 items-center">
                <div className="text-white">
                  <button onClick={()=>{
                    const ok = {
                      arg: currfile.content,
                      fname: currfile.name,
                      isrefer: true,
                      type: currfile.language
                    }
                    navigate("/chat", {state: ok});
                  }} className="group p-2 bg-[#3C2882] border border-slate-500 rounded-lg hover:w-40 w-10 mr-2 transition-all duration-200 flex items-center overflow-hidden">
  <SparklesIcon className="h-5 w-5 text-indigo-300 flex-shrink-0" />
  <span className="ml-2 text-indigo-200 montserrat text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-100 whitespace-nowrap">
    Refer File & Ask
  </span>
</button>

                </div>
                    <select
                        onChange={handletheme}
                        className="w-[50%] montserrat px-3 py-2 bg-[#171717] text-white border rounded-lg focus:outline-none focus:border-blue-500"
                    >
                        {themes.map((lang, index) => (
                            <option key={index} value={lang}>
                                {lang}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="h-screen w-full bg-background text-foreground overflow-hidden">
                <PanelGroup direction="horizontal">
                    <Panel defaultSize={50} minSize={30}>
                        <div className="bg-[#2c2c2c] rounded-lg h-full flex flex-col overflow-hidden">
                            <div className="flex items-center justify-between">
                                <p className="flex text-white nunito gap-2 justify-start items-center text-lg p-1 px-3">
                                    <img src="./svgs/code.svg" className="w-5" alt="" />
                                    {currfile.name}
                                </p>
                                <div className="flex">
                                    <div
                                        className={`dl ioio cursor-pointer h-8 hover:bg-[#e5e7eb33] rounded-lg flex items-center nunito transition-all duration-300 ${
                                            hoveredio ? "w-28" : "w-12"
                                        }`}
                                        onMouseEnter={() => setHoveredio(true)}
                                        onMouseLeave={() => setHoveredio(false)}
                                        onClick={() => setsee(!see)}
                                    >
                                        <img
                                            src="./imgs/terminal.png"
                                            className="cursor-pointer h-7 over:bg-[#a1a1a1] rounded-lg mr-2 pl-2 invert p-1"
                                            alt="Download"
                                        />
                                        <p
                                            className={`text-white transition-opacity duration-300 ${
                                                hoveredio
                                                    ? "opacity-100 visible"
                                                    : "opacity-0 invisible"
                                            }`}
                                        >
                                            {see ? "Hide IO" : "Show IO"}
                                        </p>
                                    </div>
                                    <div
                                        className={`dl rst cursor-pointer h-8 hover:bg-[#e5e7eb33] rounded-lg flex items-center nunito transition-all duration-300 ${
                                            hoveredreset ? "w-32" : "w-12"
                                        }`}
                                        onMouseEnter={() => setHoveredreset(true)}
                                        onMouseLeave={() => setHoveredreset(false)}
                                        onClick={() => {
                                            setshowPopup(true);
                                        }}
                                    >
                                        <img
                                            src="./svgs/reset.svg"
                                            className="cursor-pointer h-7 over:bg-[#a1a1a1] rounded-lg mr-2 pl-2 invert p-1"
                                            alt="Download"
                                        />
                                        <p
                                            className={`text-white transition-opacity text-sm duration-300 ${
                                                hoveredreset
                                                    ? "opacity-100 visible"
                                                    : "opacity-0 invisible"
                                            }`}
                                        >
                                            {hoveredreset ? "Reset Code" : ""}
                                        </p>
                                    </div>
                                    {showPopup && (
                                        <div className="fixed inset-0 z-20 bg-black bg-opacity-50 flex items-center justify-center">
                                            <div className="bg-[#303030] w-full max-w-md mx-auto rounded-lg shadow-lg p-6">
                                                <h2 className="text-lg font-semibold text-gray-200">
                                                    Are you sure?
                                                </h2>
                                                <p className="mt-2 text-[#88898B]">
                                                    Your current code will be discarded and reset to the
                                                    default code!
                                                </p>

                                                {/* Action Buttons */}
                                                <div className="flex justify-end mt-6 space-x-3">
                                                    <button
                                                        // onClick={}
                                                        onClick={() => {
                                                            setshowPopup(false);
                                                        }}
                                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                          dispatch(setCurrFile({ ...currfile, content: languages[extoname[`${currfile.language}`]].boilerplate }));
                                                            dispatch(WriteFile({ nodeId: currfile._id, content: languages[extoname[`${currfile.language}`]].boilerplate }));
                                                            setshowPopup(false);
                                                        }}
                                                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                                    >
                                                        Confirm
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div
                                        className={`dl wwrap cursor-pointer h-8 hover:bg-[#e5e7eb33] rounded-lg flex items-center nunito transition-all duration-300 ${
                                            hoveredw ? "w-28" : "w-12"
                                        }`}
                                        onMouseEnter={() => setHoveredw(true)}
                                        onMouseLeave={() => setHoveredw(false)}
                                        onClick={() => setwrap(!wrap)}
                                    >
                                        <img
                                            src="./svgs/wrap.svg"
                                            className="cursor-pointer h-7 over:bg-[#a1a1a1] rounded-lg mr-2 pl-2 invert p-1"
                                            alt="Download"
                                        />
                                        <p
                                            className={`text-white transition-opacity duration-300 ${
                                                hoveredw
                                                    ? "opacity-100 visible"
                                                    : "opacity-0 invisible"
                                            }`}
                                        >
                                            {wrap ? "NoWrap" : "Wrap"}
                                        </p>
                                    </div>
                                    <div
                                        className={`dl cursor-pointer h-8 hover:bg-[#e5e7eb33] rounded-lg flex items-center nunito transition-all duration-300 ${
                                            hoveredi ? "w-28" : "w-12"
                                        }`}
                                        onMouseEnter={handleMouseEnteri}
                                        onMouseLeave={handleMouseLeavei}
                                        onClick={handleimport}
                                    >
                                        <img
                                            src="./imgs/import.png"
                                            className="cursor-pointer h-8 over:bg-[#a1a1a1] rounded-lg mr-2 invert p-1"
                                            alt="Download"
                                        />
                                        <p
                                            className={`text-white transition-opacity duration-300 ${
                                                hoveredi
                                                    ? "opacity-100 visible"
                                                    : "opacity-0 invisible"
                                            }`}
                                        >
                                            {hoveredi ? "Import" : ""}
                                        </p>
                                    </div>
                                    <div
                                        className={`dl dwnld cursor-pointer h-8 hover:bg-[#e5e7eb33] nunito rounded-lg flex items-center transition-all duration-300 ${
                                            hovered ? "w-32" : "w-12"
                                        }`}
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                        onClick={handledownload}
                                    >
                                        <img
                                            src="./imgs/download.png"
                                            className="cursor-pointer h-8 over:bg-[#a1a1a1] rounded-lg mr-2 invert p-1"
                                            alt="Download"
                                        />
                                        <p
                                            className={`text-white transition-opacity duration-300 ${
                                                hovered
                                                    ? "opacity-100 visible"
                                                    : "opacity-0 invisible"
                                            }`}
                                        >
                                            {hovered ? "Download" : ""}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div
        className={`relative w-full h-[90vh] rounded-lg flex-1 overflow-hidden ${
            isDragging2 ? "border-dashed border-2 border-blue-500" : "border border-gray-700"
        }`}
        onDragOver={handleDragOver2}
        onDragLeave={handleDragLeave2}
        onDrop={handleFileDrop2}
    >
        {isDragging2 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10 rounded-lg pointer-events-none">
                <span className="text-blue-500 font-bold">Drop Here</span>
            </div>
        )}
        <Editor
            value={currfile.content}
            className="z-10"
            onChange={(e) => {
              dispatch(setCurrFile({ ...currfile, content: e }));
              dispatch(WriteFile({ nodeId: currfile._id, content: e }));
            }}
            height="100%"
            language={extoname[`${currfile.language}`]}
            theme="vs-dark"
            options={{
                wordWrap: wrap ? "on" : "off",
            }}
        />
    </div>
                        </div>
                    </Panel>
                    <PanelResizeHandle className="w-2 bg-muted hover:bg-[#262626] transition-colors" />
                    <Panel minSize={30} className={`${see ? "" : "hidden"}`}>
                        <PanelGroup direction="vertical">
                        <Panel defaultSize={60} minSize={30}>
        <div className="w-full h-full flex-col gap-1 border border-slate-800 py-2 rounded-md flex justify-start items-center bg-[#181818]">
            <div className="flex justify-between w-full nunito text-white h-10 mt-2">
                <span className="ml-8 text-lg">Input</span>
                <div className="mr-8">
                    <label className="montserrat px-4 py-2 bg-[#3B82F6B8] duration-200 text-white rounded-lg hover:bg-blue-600 focus:outline-none cursor-pointer">
                        Choose File
                        <input
                            type="file"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                        setip(event.target.result); // Set file content
                                        localStorage.setItem("ip", event.target.result); // Save to localStorage
                                    };
                                    reader.readAsText(file); // Read file as text
                                }
                            }}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>
            <div
                className={`relative w-[95%] h-[100%] rounded-lg p-2 ${
                    isDragging ? "border-dashed border-2 border-blue-500" : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleFileDrop}
            >
                {isDragging && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10 rounded-lg pointer-events-none">
                        <span className="text-blue-500 font-bold">Drop Here</span>
                    </div>
                )}
                <textarea
                    name="ip"
                    value={ip}
                    onChange={(e) => {
                        setip(e.target.value);
                        localStorage.setItem("ip", e.target.value);
                    }}
                    placeholder="Type or drag and drop your input here..."
                    className="montserrat w-full h-full resize-none overflow-scroll custom-scrollbar bg-[#1E1E1E] text-white outline-none rounded-lg p-2"
                ></textarea>
            </div>
        </div>
    </Panel>  
                            <PanelResizeHandle className="h-2 bg-muted hover:bg-[#262626] transition-colors" />
                            <Panel minSize={30} className={`${see ? "" : "hidden"}`}>
                                <div className="w-full h-[100%] flex-col overflow-hidden gap- border border-slate-800 py-2 rounded-md flex justify-start items-center bg-[#181818]">
                                    <div className="flex justify-between w-full nunito text-white h-10 mt-1">
                                        <span className="ml-8 text-lg">Output</span>

                                        <div
                                            className={`dl cursor-pointer px-2 mr-5 h-8 hover:bg-[#e5e7eb33] nunito rounded-lg flex items-center transition-all duration-300 ${
                                                hoveredo ? "w-36" : "w-12"
                                            }`}
                                            onMouseEnter={() => setHoveredo(true)}
                                            onMouseLeave={() => setHoveredo(false)}
                                            onClick={() => setoutput("")}
                                        >
                                            <img
                                                src="./imgs/clear.png"
                                                className="cursor-pointer h-8 over:bg-[#a1a1a1] rounded-lg mr-2 invert p-1"
                                                alt="Download"
                                            />
                                            <p
                                                className={`text-white text-sm transition-opacity duration-300 ${
                                                    hoveredo
                                                        ? "opacity-100 visible"
                                                        : "opacity-0 invisible"
                                                }`}
                                            >
                                                {hoveredo ? "Erase Output" : ""}
                                            </p>
                                        </div>
                                    </div>
                                    <textarea
                                        name="ip"
                                        id=""
                                        value={output}
                                        readOnly
                                        className="w-[95%] op whitespace-pre resize-none overflow-scroll custom-scrollbar bg-[#1E1E1E] text-green-300 outline-none rounded-lg p-2 px-3 h-[100%]"
                                    ></textarea>
                                </div>
                            </Panel>
                        </PanelGroup>
                    </Panel>
                </PanelGroup>
            </div>
        </div>
        <style jsx>{`
        
          
        /* Scrollbar Styles */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: "#1a1a1f";
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: "#3d3d4d";
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: "#4d4d5d";
        }

      `}</style>
    </div>
);
};
