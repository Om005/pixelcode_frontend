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

import { useMonaco } from "@monaco-editor/react";
export default function Guest() {
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
  const [selectedLanguage, setSelectedLanguage] = useState(
    sessionStorage.getItem("lang") === null
      ? "javascript"
      : sessionStorage.getItem("lang")
  );
  const [ip, setip] = useState(
    sessionStorage.getItem("ip") ? "" : sessionStorage.getItem("ip")
  );
  const [output, setoutput] = useState("");
  const [code, setcode] = useState(
    sessionStorage.getItem("code") === null
      ? languages["javascript"].boilerplate
      : sessionStorage.getItem("code")
  );
  const [type, settype] = useState(
    sessionStorage.getItem("code") == null
      ? "text/javascript"
      : sessionStorage.getItem("ex")
  );
  const [extension, setextension] = useState(
    sessionStorage.getItem("ex") === null ? ".js" : sessionStorage.getItem("ex")
  );

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

  const handleChange = (e) => {
    setSelectedLanguage(e.target.value);
    sessionStorage.setItem("lang", e.target.value);
    setcode(languages[e.target.value].boilerplate);
    sessionStorage.setItem("code", languages[e.target.value].boilerplate);
    settype(languages[e.target.value].type);
    setextension(languages[e.target.value].extension);
    sessionStorage.setItem("ex", languages[e.target.value].extension);
  };

  const handlefile = (e) => {
    const f = e.target.files[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setip(e.target.result);
        sessionStorage.setItem("ip", e.target.value);
      };
      reader.readAsText(f);
    }
  };

  const handledownload = () => {
    const blob = new Blob([code], { type: type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `code${extension}`;
    link.click();
  };

  const handlerun = async () => {
    if(selectedLanguage==="none" || selectedLanguage==="Text"){
       toast.error("This file cannot be executed");
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
        language: selectedLanguage,
        stdin: ip,
        files: [
          {
            name: `index${extension}`,
            content: code,
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
          setcode(code);
          sessionStorage.setItem("code", code);
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
        sessionStorage.setItem("ip", event.target.result); // Save to sessionStorage
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
        setcode(event.target.result); // Set file content to the editor
        sessionStorage.setItem("code", event.target.result); // Save to sessionStorage
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

const handleshare = async() => {
    // setshowshare(true);
    document.querySelector(".sharef").innerHTML = "Generating Link...";
    const shareid = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/file/generate-link",
        {
            code: code,
            lang: selectedLanguage,
        }
    )
    document.querySelector(".sharef").innerHTML = "Copy Link";
    if(shareid.data.success){
        sessionStorage.setItem('slink', slink+shareid.data.id);
        setslink(slink+shareid.data.id);
    }
    document.querySelector(".sharef").innerHTML = "Update";
    sethaveid(true);
    sessionStorage.setItem('haveid', 'true');
}

const handlecopy = () => {
    navigator.clipboard.writeText(slink);
    toast.success("Link Copied to Clipboard");
    document.querySelector(".sharef").innerHTML = "Copied!";
    setTimeout(() => {
        document.querySelector(".sharef").innerHTML = "Copy Link";
    }, 2000);
}

const handleupdate = async() => {
    document.querySelector(".updatef").innerHTML = "Updating...";
    const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/file/update-link",
        {
            code: code,
            lang: selectedLanguage,
            id: slink.split("/").pop(),
        }
    )
    document.querySelector(".updatef").innerHTML = "Update";
    if(response.data.success){
        toast.success("Updated Successfully");  
        // setslink(slink+response.data.id);
    }
    else{
        toast.error(response.data.message);
    }
    document.querySelector(".updatef").innerHTML = "Update";

}


const [showshare, setshowshare] = useState(false);
const [slink, setslink] = useState(sessionStorage.getItem('slink') || 'https://pixelcode-nine.vercel.app/guest/')
const [haveid, sethaveid] = useState(sessionStorage.getItem('haveid') === 'true' || false)
const { isLoggedin } = useContext(AppContent);
useEffect(() => {
    if (location.state?.haveid) {
      sethaveid(true);
      setslink(location.state.slink);
    }
  }, [location.state]);
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
                        value={selectedLanguage}
                        onChange={handleChange}
                        className="w-[50%] px-3 py-2 bg-[#171717] text-white border rounded-lg focus:outline-none focus:border-blue-500"
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
                    <button
                        className="flex gap-2 py-1 px-3 rounded-lg bg-[#0E8AC2]"
                        onClick={() => setshowshare(true)}
                    >
                        <img src="./svgs/share.svg" alt="" />
                        <span className="text-white text-lg">Share</span>
                    </button>
                    {showshare && !haveid && (
                        <div className="fixed inset-0 z-30 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-neutral-800 rounded-lg shadow-lg p-6 max-w-sm w-full">
                                <div className="flex items-center justify-between mb-4">

                                <h2 className=" ml-1 text-lg font-semibold text-gray-100 mb-2">Share</h2>
                            <button onClick={()=> {setshowshare(false);}}> 

                                <img className="cursor-pointer hover:bg-[#ac2e2e] rounded-lg p-2" src="./svgs/cross.svg" alt="" />
                                </button>
                                </div>
                                <p className="text-white border border-slate-500 bg-[#181818] overflow-hidden text-ellipsis whitespace-nowrap px-2 py-1 rounded-lg mb-4">
  {slink}
</p>

                                <button
                                    onClick={() => handleshare()}
                                    className="bg-blue-500 flex gap-2 sharef text-center text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                >
                                    <img src="./svgs/link.svg" className="invert rotate-45" alt="" />
                                    Generate Link
                                </button>
                            </div>
                        </div>
                    )}
                    {showshare && haveid && (
                        <div className="fixed inset-0 z-30 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-neutral-800 rounded-lg shadow-lg p-6 max-w-sm w-full">
                                <div className="flex items-center justify-between mb-4">

                                <h2 className=" ml-1 text-lg font-semibold text-gray-100 mb-2">Share</h2>
                                <button onClick={()=> {setshowshare(false);}}> 

                                <img className="cursor-pointer hover:bg-[#ac2e2e] rounded-lg p-2" src="./svgs/cross.svg" alt="" />
                                </button>
                                </div>
                                <p className="text-white bg-[#181818] overflow-hidden text-ellipsis whitespace-nowrap border border-slate-600 px-2 py-1 rounded-lg mb-4">
  {slink}
</p>

<div className="flex gap-2">

                                <button
                                    onClick={() => handlecopy()}
                                    className="bg-blue-500 sharef text-center text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                    >
                                    Copy Link
                                </button>
                                <button
                                    onClick={() => handleupdate()}
                                    className="bg-blue-500 updatef sharef text-center text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                    >
                                    Update
                                </button>
                                    </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="h-12 w-full rounded-lg  bg-gray100 dak:bg-neutral-800 flex justify-between mr-9 gap-1 items-center">
                    <select
                        onChange={handletheme}
                        className="w-[50%] px-3 py-2 bg-[#171717] text-white border rounded-lg focus:outline-none focus:border-blue-500"
                    >
                        {themes.map((lang, index) => (
                            <option key={index} value={lang}>
                                {lang}
                            </option>
                        ))}
                    </select>
                    <Link
                        to={"/signin"}
                        className="px-4 m hover:translate-x-1 duration-200 py-2 text-lg bg-[#0BA6ECCC] text-white flex gap-2 items-center rounded-lg hover:bg-sky-600 focus:outline-none w-full md:w-auto"
                    >
                        <img src="./imgs/login.png" className="w-5 invert" alt="" /> Sign
                        in
                    </Link>
                </div>
            </div>

            <div className="h-screen w-full bg-background text-foreground overflow-hidden">
                <PanelGroup direction="horizontal">
                    <Panel defaultSize={50} minSize={30}>
                        <div className="bg-[#2c2c2c] rounded-lg h-full flex flex-col overflow-hidden">
                            <div className="flex items-center justify-between">
                                <p className="flex text-white nunito gap-2 justify-start items-center text-lg p-1 px-3">
                                    <img src="./svgs/code.svg" className="w-5" alt="" />
                                    Code
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
                                                <div className="flex resetcbtn justify-end mt-6 space-x-3">
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
                                                            setcode(
                                                                languages[selectedLanguage].boilerplate
                                                            );
                                                            sessionStorage.setItem(
                                                                "code",
                                                                languages[selectedLanguage].boilerplate
                                                            );
                                                            setshowPopup(false);
                                                        }}
                                                        className="bg-green-500 resetbtn text-white px-4 py-2 rounded-lg hover:bg-green-600"
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
            value={code}
            onChange={(e) => {
                setcode(e);
                sessionStorage.setItem("code", e);
            }}
            className="z-10"
            height="100%"
            language={selectedLanguage}
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
                    <label className="px-4 py-2 bg-[#3B82F6B8] duration-200 text-white rounded-lg hover:bg-blue-600 focus:outline-none cursor-pointer">
                        Choose File
                        <input
                            type="file"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                        setip(event.target.result); // Set file content
                                        sessionStorage.setItem("ip", event.target.result); // Save to sessionStorage
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
                        sessionStorage.setItem("ip", e.target.value);
                    }}
                    placeholder="Type or drag and drop your input here..."
                    className="w-full h-full resize-none overflow-scroll custom-scrollbar bg-[#1E1E1E] text-white outline-none rounded-lg p-2"
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
