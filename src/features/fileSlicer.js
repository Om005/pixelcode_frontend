import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getFiles = createAsyncThunk(
    "fileSlicer/getFiles",
    async (email, { rejectWithValue }) =>{
        try {
      const resp = await axios.post(
        import.meta.env.VITE_BACKEND_URL+"/api/file/idefile",
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      // assume your API returns { success: true, files: [...] }
      return resp.data.files;
    } catch (err) {
      // axios nests errors differently
      const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to fetch files";

      return rejectWithValue(message);
    }
  }
)

export const addFile = createAsyncThunk(
  "fileSlicer/addFile",
  async ({ email, parentId, name, language, content }, { rejectWithValue }) => {
    try {
      const resp = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/file/makefile",
        { email, parentId, name, language, content },
        { headers: { "Content-Type": "application/json" } }
      );
      return resp.data; // <-- this will be action.payload
    } catch (err) {
      const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to add file";
      return rejectWithValue(message);
    }
  }
);

export const addFolder = createAsyncThunk(
  "fileSlicer/addFolder",
  async ({ email, parentId, name }, { rejectWithValue }) => {
    try {
      const resp = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/file/makefolder",
        { email, parentId, name },
        { headers: { "Content-Type": "application/json" } }
      );
      if(resp.data.success){
        return resp.data; // <-- this will be action.payload
      }
      else{
        const rt = {success: false, message: resp.data.message};
        return rt;
      }
    } catch (err) {
      const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to add file";
      return rejectWithValue(message);
    }
  }
);

export const deleteNode = createAsyncThunk(
  "fileSlicer/deleteNode",
  async ({ email, nodeId }, {rejectWithValue}) =>{
    try {
      const resp = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/file/delete",
        { email, nodeId },
        { headers: { "Content-Type": "application/json" } }
      );
      return resp.data;
    } catch (err) {
      const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to delete file";
      return rejectWithValue(message);
    }
    }
);
export const renameNode = createAsyncThunk(
  "fileSlicer/renameNode",
  async ({ email, nodeId, newName }, {rejectWithValue}) =>{
    try {
      const resp = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/file/rename",
        { email, nodeId, newName },
        { headers: { "Content-Type": "application/json" } }
      );
      return resp.data;
    } catch (err) {
      const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to rename file";
      return rejectWithValue(message);
    }
    }
);
export const WriteFile = createAsyncThunk(
  "fileSlicer/renameNode",
  async ({ nodeId, content }, {rejectWithValue}) =>{
    try {
      const resp = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/file/writefile",
        { nodeId, content },
        { headers: { "Content-Type": "application/json" } }
      );
      return resp.data;
    } catch (err) {
      const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to write file";
      return rejectWithValue(message);
    }
    }
);
export const GetNode = createAsyncThunk(
  "fileSlicer/renameNode",
  async ({ nodeId }, {rejectWithValue}) =>{
    try {
      const resp = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/file/getnode",
        { nodeId },
        { headers: { "Content-Type": "application/json" } }
      );
      return resp.data;
      
    } catch (err) {
      const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to retrieve file";
      return rejectWithValue(message);
    }
    }
);



const initialState = {
    files: [],
    username: "",
    email: "",
    filecode: "",
    filelanguage: "",
    currfile: [],
}
export const fileSlicer = createSlice({
    name: "fileSlicer",
    initialState,
    reducers: {
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setFileCode: (state, action) => {
            state.filecode = action.payload;
        },
        setFileLanguage: (state, action) => {
            state.filelanguage = action.payload;
        },
        setCurrFile: (state, action) => {
            state.currfile = action.payload;
        },
        setUsername: (state, action) => {
            state.username = action.payload;
        },  
    },
    extraReducers: (builder) => {
    builder
      .addCase(getFiles.fulfilled, (state, action) => {
        state.files = action.payload; // Update files array with response
      })
      .addCase(getFiles.rejected, (state, action) => {
        console.error("Failed to fetch files:", action.error.message);
      })
      .addCase(addFile.fulfilled, (state, action) => {
      state.files.push(action.payload); // Append new fileNode
      })
      // .addCase(deleteNode.fulfilled, (state, action) => {
      // const deletedId = action.meta.arg.nodeId;  // from thunk arg
      // state.files = state.files.filter(file => file.id !== deletedId);
      // })
      .addCase(addFolder.fulfilled, (state, action) => {
      state.files.push(action.payload); // Append new fileNode
      });
  },
});


export const { setEmail, setUsername, setCurrFile } = fileSlicer.actions;
export default fileSlicer.reducer;
