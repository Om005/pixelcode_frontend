import React, { useState, useContext, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";

import { useDispatch, useSelector } from "react-redux";

import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import Auth from "./Auth";
import { AppContent } from "../context/AppContex";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { addFile, addFolder, deleteNode, getFiles, renameNode } from "../features/fileSlicer";
import { setCurrFile } from "../features/fileSlicer";
import languages from "../constants/info";
import { Link } from "react-router-dom";
import { Folder } from "lucide-react"

const expandedState = new Map();

export default function IDE() {
  
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const files = useSelector(state => state.fileSlicer.files);
  const currfile = useSelector(state => state.fileSlicer.currfile);
  
  const treeData = buildFileTree(files);
  
  const { isLoggedin, userData, isLoading } = useContext(AppContent);
  useEffect(() => {
    if(!isLoggedin && !isLoading){
        navigate("/notfound");
        toast.error("User is not authorized");
    }
  }, [isLoading, isLoggedin])
  

function buildFileTree(files) {
  const idToNodeMap = {};
  const root = [];

  // Create map of id → node
  files.forEach(file => {
    idToNodeMap[file._id] = { ...file, children: [] };
  });

  // Assign children to parents
  files.forEach(file => {
    if (file.parent === null) {
      root.push(idToNodeMap[file._id]);
    } else if (idToNodeMap[file.parent]) {
      idToNodeMap[file.parent].children.push(idToNodeMap[file._id]);
    }
  });

  return root;
}


 // key: node.id, value: boolean

const FileNode = ({ node, depth = 0 }) => {
  


  
  // const [expanded, setexpanded] = useState(true);
  const [expanded, setexpanded] = useState(() => {
    return expandedState.get(node._id)??false; // default to collapsed
  });
  const [ishoverd, setishoverd] = useState(false);
  const [isadd, setisadd] = useState(false);
  const [ShowEditPopup, setShowEditPopup] = useState({open: false,id: "",});
  const [ShowDeletePopup, setShowDeletePopup] = useState({open: false,id: "",});
  const [shownewfolder, setshownewfolder] = useState({open: false, id: ""});
  const [newFilename, setnewFilename] = useState(""); 
  const [shownewfile, setshownewfile] = useState({open: false, id: ""});
  const [filename, setfilename] = useState("");
  const isFolder = node.kind === "folder";
  useEffect(() => {
    expandedState.set(node._id, expanded);
  }, [expanded, node._id]);

    useEffect(() => {

        const handleKeyDown = (e) => {
          if ((e.key === "Enter" && ShowDeletePopup.open==true)) {
            document.querySelector(".dltbtn").click();
          }
          if ((e.key === "Escape" && ShowDeletePopup.open==true)) {
            document.querySelector(".dltcbtn").click();
          }
          if ((e.key === "Enter" && ShowEditPopup.open==true)) {
            document.querySelector(".editbtn").click();
          }
          if ((e.key === "Escape" && ShowEditPopup.open==true)) {
            document.querySelector(".editcbtn").click();
          }
          if ((e.key === "Enter" && shownewfolder.open==true)) {
            document.querySelector(".newfolderbtn").click();
          }
          if ((e.key === "Escape" && shownewfolder.open==true)) {
            document.querySelector(".newfoldercbtn").click();
          }
          if ((e.key === "Enter" && shownewfile.open==true)) {
            document.querySelector(".newfilebtn").click();
          }
          if ((e.key === "Escape" && shownewfile.open==true)) {
            document.querySelector(".newfilecbtn").click();
          }

        };
        window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [ShowDeletePopup, ShowEditPopup, shownewfolder, shownewfile]);

  
  return (
    <div className="ml-1 montserrat">
      <div className={`flex justify-between hover:bg-gray-700 rounded px-2 ${ishoverd?"pr-4":""}`}>

      <div
        onClick={() => {
          if(isFolder == true){

            setexpanded(!expanded)
          }
          else{
            dispatch(setCurrFile(node));
            localStorage.setItem("lst", node._id);
            dispatch(getFiles(userData.email));
          }
        }}
        className="flex items-center gap-2 py-1 cursor-pointer"
        style={{ marginLeft: `${depth * 5}px` }}
        >
        {isFolder && !expanded && <img
          src="./svgs/up.svg"
          className="w-2 h-2 -ml-4 rotate-90"
          alt=""
          />}
        {isFolder && expanded && <img
          src="./svgs/up.svg"
          className="w-2 h-2 -ml-4 rotate-180"
          alt=""
          />}
        <img
          src={isFolder ? "./svgs/folder.svg" : `./svgs/${node.language}.svg`}
          className={`w-4 h-4 ${node.language=="sh"?"invert":""}`}
          alt=""
          />
        <p className="text-sm w-24 overflow-hidden">{node.name}</p>
      </div>
      <div className="flex gap-2 items-center">
        <div className={`${isadd ? "w-10": "w-5"} flex items-center gap-2 transition-all duration-300`}
        onMouseEnter={() => setisadd(true)}
        onMouseLeave={() => setisadd(false)}>

        {!isadd && isFolder && <img src="./svgs/add.svg" className="invert cursor-pointer w-5" alt="" />}
        {isFolder && isadd&& <img src="./imgs/newfolder.png"
        onClick={()=>{setshownewfolder({open: true, id: ""})}}
        className="invert cursor-pointer h-5" alt="" />}
        {shownewfolder.open && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
    onClick={() => {
      setshownewfolder({ open: false, id: "" });
      setnewFilename("");
    }}
  >
    <div
      className="w-full max-w-md transform rounded-lg bg-white dark:bg-neutral-800 shadow-xl transition-all animate-in zoom-in-95 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <svg
            className="h-5 w-5 text-blue-500 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l3-3h4l3 3h8v13H3V7z" />
          </svg>
          New Folder
        </h2>

        <input
          type="text"
          autoFocus
          value={newFilename}
          onChange={(e) => setnewFilename(e.target.value)}
          className="w-full px-3 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
          id="edit-node-name"
          placeholder="Enter folder name"
          autoComplete="off"
        />

        <div className="flex justify-end gap-3 mt-5">
          <button
            className="px-4 py-2 newfoldercbtn rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 transition-colors duration-200"
            onClick={() => {
              setshownewfolder({ open: false, id: "" });
              setnewFilename("");
            }}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 newfolderbtn rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            onClick={async () => {
              const rsp = await handlenewfolder(newFilename, node._id);
              setshownewfolder({ open: false, id: "" });
              setnewFilename("");
            }}
            disabled={!newFilename.trim()}
          >
            Create Folder
          </button>
        </div>
      </div>
    </div>
  </div>
)}

        {isFolder && isadd&& <img src="./imgs/newfile.png"
        onClick={()=>{setshownewfile({open:true, id: ""})}}

         className="invert cursor-pointer h-4" alt="" />}
        {shownewfile.open && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
    onClick={() => {
      setshownewfile({ open: false, id: "" });
      setfilename("");
    }}
  >
    <div
      className="w-full max-w-md transform rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all animate-in zoom-in-95 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-500 dark:text-blue-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6.414a2 2 0 00-.586-1.414l-3.414-3.414A2 2 0 0012.586 1H4zm8 1.5L16.5 8H12a1 1 0 01-1-1V3.5z" />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">New File</h2>
        </div>

        <div className="mb-5">
          <input
            type="text"
            value={filename}
            onChange={(e) => setfilename(e.target.value)}
            autoFocus
            placeholder="Enter file name"
            className="w-full px-3 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
            autoComplete="off"
            id="edit-node-name"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 newfilecbtn py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 transition-colors duration-200"
            onClick={() => {
              setshownewfile({ open: false, id: "" });
              setfilename("");
            }}
          >
            Cancel
          </button>
          <button
            className="px-4 newfilebtn py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            onClick={async () => {
              const rsp = await handlenewfile(filename, node._id);
              setshownewfile({ open: false, id: "" });
              setfilename("");
            }}
            disabled={!filename.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
)}

        </div>
        <div className={`${ishoverd ? "w-10": "w-5"} transition-all duration-300`}
        onMouseEnter={() => setishoverd(true)}
        onMouseLeave={() => setishoverd(false)}>
        {!ishoverd && <img src="./svgs/dots.svg" className="invert cursor-pointer w-6" alt="" />}
        {ishoverd && <div className="flex gap-2">

        <img src="./svgs/edit.svg" data-id={node._id} 
        onClick={async(e)=>{
          const id = e.target.getAttribute("data-id");
          setShowEditPopup({ open: true, id: id});
          setnewFilename(node.name);
        }}
        /* Show popup if ShowEditPopup.open is true */
        
        className="invert cursor-pointer w-6" alt="" />
        
        {ShowEditPopup.open && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
    onClick={() => setShowEditPopup({ open: false, nodeId: "" })}
  >
    <div
      className="w-full max-w-md transform rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all animate-in zoom-in-95 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Edit File/Folder Name
          </h2>
        </div>

        <div className="mb-5">
          <input
            type="text"
            autoFocus
            value={newFilename}
            onChange={(e) => setnewFilename(e.target.value)}
            placeholder="Enter new name"
            className="w-full px-3 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
            id="edit-node-name"
            autoComplete="off"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-md text-sm font-medium editcbtn text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 transition-colors duration-200"
            onClick={() => setShowEditPopup({ open: false, nodeId: "" })}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-md text-sm font-medium editbtn text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            onClick={async () => {
              const rsp = await handlerename(newFilename, node._id);
              setShowEditPopup({ open: false, nodeId: "" });
            }}
            disabled={!newFilename.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
)}

        <img src="./svgs/delete.svg" data-id={node._id} onClick={async(e)=>{
          const id = e.target.getAttribute("data-id");
          setShowDeletePopup({ open: true, id: id});
            }} className="invert cursor-pointer w-5" alt="" />
            {ShowDeletePopup.open && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
    onClick={() => setShowDeletePopup({ open: false, id: "" })}
  >
    <div
      className="w-full max-w-md transform rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all animate-in zoom-in-95 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Delete File/Folder
          </h2>
        </div>
        <p className="mb-5 text-gray-800 dark:text-gray-300">
          {node.kind === "file"
            ? "Are you sure you want to delete this file?"
            : "Are you sure you want to delete this folder?"}
        </p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-md text-sm font-medium dltcbtn text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 transition-colors duration-200"
            onClick={() => setShowDeletePopup({ open: false, id: "" })}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-md text-sm font-medium dltbtn text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
            onClick={async () => {
              if (
                currfile._id === node._id ||
                currfile?.path?.startsWith(node.path + "/")
              ) {
                dispatch(
                  setCurrFile({ _id: "", name: "", language: "", content: "" })
                );
              }

              const id = ShowDeletePopup.id;
              const result = await dispatch(
                deleteNode({
                  email: userData.email,
                  nodeId: node._id,
                })
              );

              const last = localStorage.getItem("lst");
              if (
                last === node._id ||
                currfile?.path?.startsWith(node.path + "/")
              ) {
                localStorage.removeItem("lst");
              }

              dispatch(getFiles(userData.email));

              if (result.payload.success) {
                toast.success("Item deleted successfully");
              } else {
                toast.error(result.payload.message);
              }

              setShowDeletePopup({ open: false, id: "" });
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
)}

            </div>}
        </div>

      </div>
          </div>
      {isFolder && expanded && node.children?.map(child => (
        <FileNode key={child._id} node={child} depth={depth + 1} />
      ))}
    </div>
  );
};

const handlerename = async(name, id) => {
  if(name == "" || name.startsWith(".")){
    toast.error("Please enter a name for the file");
    return;
  }
  // name will be something.something2 extract something2
  let fileExtension = name.split(".")[1];
  if(fileExtension === undefined || fileExtension === ""){
    fileExtension = "txt";
  }
  if (
  fileExtension !== "js" &&
  fileExtension !== "py" &&
  fileExtension !== "java" &&
  fileExtension !== "cs" &&
  fileExtension !== "cpp" &&
  fileExtension !== "go" &&
  fileExtension !== "rs" &&
  fileExtension !== "kt" &&
  fileExtension !== "pl" &&
  fileExtension !== "php" &&
  fileExtension !== "rb" &&
  fileExtension !== "swift" &&
  fileExtension !== "c" &&
  fileExtension !== "sh" && 
  fileExtension !== "txt" 
) {
  // Do something for supported programming files
  toast.error("File type not supported");
  return;
}


  if (name) {
    const result = await dispatch(
      renameNode({
        email: userData.email,
        nodeId: id,
        newName: name,
      })
    );
    if(result.payload.success == true){
      let ext = name.split(".")[1];
      if(ext === undefined || ext === ""){
        ext = "txt";
      }
      dispatch(setCurrFile(...[{ name:name, language: ext }]));


      toast.success("File renamed successfully");
      const rsp = await dispatch(getFiles(userData.email));

    }else{
      toast.error(result.payload.message);
    }
  }
}

const handlenewfile = async(name, id) => {
  if(name == "" || name.startsWith(".")){
    toast.error("Please enter a name for the file");
    return;
  }
  // name will be something.something2 extract something2
  let fileExtension = name.split(".")[1];
  if(fileExtension === undefined || fileExtension === ""){
    fileExtension = "txt";
  }
  if (
  fileExtension !== "js" &&
  fileExtension !== "py" &&
  fileExtension !== "java" &&
  fileExtension !== "cs" &&
  fileExtension !== "cpp" &&
  fileExtension !== "go" &&
  fileExtension !== "rs" &&
  fileExtension !== "kt" &&
  fileExtension !== "pl" &&
  fileExtension !== "php" &&
  fileExtension !== "rb" &&
  fileExtension !== "swift" &&
  fileExtension !== "c" &&
  fileExtension !== "sh" && 
  fileExtension !== "txt" 
) {
  // Do something for supported programming files
  toast.error("File type not supported");
  return;
}

  if (name) {
    const result = await dispatch(
      addFile({
        email: userData.email,
        parentId: id,
        name: name,
        language: fileExtension,
        content: languages[extoname[fileExtension]].boilerplate
      })
    );
    if(result.payload.success == true){
      // dispatch(setCurrFile(...[{ name:name, language: fileExtension }]));
      dispatch(setCurrFile(result.payload.fileNode ));
      localStorage.setItem("lst", result.payload.fileNode._id);
      toast.success("File created successfully");
      const rsp = await dispatch(getFiles(userData.email));

    }else{
      toast.error(result.payload.message);
    }
  }
}

const handlenewfolder = async(name, id) => {
  if(name == ""){
    toast.error("Please enter a name for the folder");
    return;
  }
  if (name) {
    const result = await dispatch(
      addFolder({
        email: userData.email,
        parentId: id,
        name: name,
      })
    );
    if(result.payload.success == true){
      toast.success("Folder created successfully");
      const rsp = await dispatch(getFiles(userData.email));

    }else{
      toast.error(result.payload.message);
    }
  }
}

const [shownewfolder, setshownewfolder] = useState({open: false, id: ""});
const [shownewfile, setshownewfile] = useState({open: false, id: ""});
const [foldername, setfoldername] = useState("");
const [filename, setfilename] = useState("");
const extoname = {txt: "text", "":"none", js: "javascript",py: "python",java: "java",cs: "csharp",cpp: "cpp",go: "go",rs: "rust",kt: "kotlin",pl: "perl",php: "php",rb: "ruby",swift: "swift",c: "c",sh: "bash"};


useEffect(() => {

        const handleKeyDown = (e) => {
          if ((e.key === "Enter" && shownewfolder.open==true)) {
            document.querySelector(".newfolderbtn2").click();
          }
          if ((e.key === "Escape" && shownewfolder.open==true)) {
            document.querySelector(".newfoldercbtn2").click();
          }
          if ((e.key === "Enter" && shownewfile.open==true)) {
            document.querySelector(".newfilebtn2").click();
          }
          if ((e.key === "Escape" && shownewfile.open==true)) {
            document.querySelector(".newfilecbtn2").click();
          }

        };
        window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [shownewfolder, shownewfile]);


return (
    <div
        className={cn(
            "mx-auto flex w-full max--7xl flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
            "h-[100vh]"
        )}>
        <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className="justify-between gap-10">
                <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                    {open ? <Logo /> : <LogoIcon />}
                    {open && <div className="mt-2 h-5 flex bg-[#333333] p-3 rounded-lg py-5 justify-between items-center">
                        {/* {links.map((link, idx) => (
                            <SidebarLink key={idx} link={link} />
                        ))} */}
                        {open? <p className="text-white transition">Root</p>:<></>}
                        <div className="flex items-center gap-3">
                            <img src="./imgs/newfile.png" onClick={()=> setshownewfile({open:true, id: ""})}  className="cursor-pointer invert h-5" alt="" />
                            <img onClick={()=> setshownewfolder({open: true, id:""})} src="./imgs/newfolder.png" className="cursor-pointer invert h-6" alt="" />
                        </div>
                        {shownewfile.open && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
    onClick={() => {
      setshownewfile({ open: false, id: "" });
      setfilename("");
    }}
  >
    <div
      className="w-full max-w-md transform rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all animate-in zoom-in-95 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-500 dark:text-blue-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6.414a2 2 0 00-.586-1.414l-3.414-3.414A2 2 0 0012.586 1H4zm8 1.5L16.5 8H12a1 1 0 01-1-1V3.5z" />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">New File</h2>
        </div>

        <div className="mb-5">
          <input
            type="text"
            value={filename}
            onChange={(e) => setfilename(e.target.value)}
            autoFocus
            placeholder="Enter file name"
            className="w-full px-3 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
            autoComplete="off"
            id="edit-node-name"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 newfilecbtn2 2py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 transition-colors duration-200"
            onClick={() => {
              setshownewfile({ open: false, id: "" });
              setfilename("");
            }}
          >
            Cancel
          </button>
          <button
            className="px-4 newfilebtn2 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            onClick={async () => {
              const rsp = await handlenewfile(filename, "-1");
              setshownewfile({ open: false, id: "" });
              setfilename("");
            }}
            disabled={!filename.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
)}

                        {shownewfolder.open && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
    onClick={() => setshownewfolder({ open: false, id: "" })}
  >
    <div
      className="w-full max-w-md transform rounded-lg bg-white dark:bg-neutral-800 shadow-xl transition-all animate-in zoom-in-95 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-500 dark:text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
            />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            New Folder
          </h2>
        </div>

        <div className="mb-5">
          <input
            type="text"
            autoFocus
            value={foldername}
            onChange={(e) => setfoldername(e.target.value)}
            className="w-full px-3 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
            id="edit-node-name"
            placeholder="Enter folder name"
            autoComplete="off"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 newfoldercbtn2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 transition-colors duration-200"
            onClick={() => {setshownewfolder({ open: false, id: "" }); setfoldername("");}}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 newfolderbtn2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            onClick={async () => {
              const rsp = await handlenewfolder(foldername, "-1");
              setshownewfolder({ open: false, id: "" });
              setfoldername("");
            }}
            disabled={!foldername.trim()}
          >
            Create Folder
          </button>
        </div>
      </div>
    </div>
  </div>
)}


                    </div>}
                    <div className="mt-4 px-2 text-white">
  {treeData.map((node) => (
    <FileNode key={node.id} node={node} />
  ))}
</div>

                </div>
                <div>
                    <SidebarLink
                        link={{
                            label: userData.name,
                            href: "#",
                            icon: (
                                <img
                                    src="./svgs/user.svg"
                                    className="h-7 w-7 shrink-0 rounded-full cursor-pointer"
                                    width={50}
                                    height={50}
                                    alt="Avatar"
                                />
                            ),
                        }}
                    />
                </div>
            </SidebarBody>
        </Sidebar>
        <Auth />
    </div>
);
}
export const Logo = () => {
  return (
    <Link
      to="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
      <div
        className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white">
        PIXELCODE
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
      <div
        className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};

// Dummy dashboard component with content
const Dashboard = () => {
  return (
    <div className="flex flex-1">
      <div
        className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex gap-2">
          {[...new Array(4)].map((i, idx) => (
            <div
              key={"first-array-demo-1" + idx}
              className="h-20 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"></div>
          ))}
        </div>
        <div className="flex flex-1 gap-2">
          {[...new Array(2)].map((i, idx) => (
            <div
              key={"second-array-demo-1" + idx}
              className="h-full w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"></div>
          ))}
        </div>
      </div>
    </div>
  );
};
