import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../utils/axiosClient";


export const registerUserAPI = createAsyncThunk(
   'auth/register',
   async (userData, thunkAPI) =>{
       console.log(userData)
     try {
        const response = await axiosClient.post('/user/register', userData)
        return response.data.user;  
     } catch (error) {
        return  thunkAPI.rejectWithValue(error.message);
     }

   }
);

export const loginUserAPI = createAsyncThunk(
   'auth/login',
   async(credential , thunkAPI)=>{
      try {
         const response = await axiosClient.post('/user/login' , credential);
         console.log(response.data.user)
         return response.data.user;
         
      } catch (error) {
         return thunkAPI.rejectWithValue(error.message);
      }
   }
);

export const logoutUserAPI = createAsyncThunk(
   'auth/logout', 

   async(_, thunkAPI)=>{
          
      try {
          await axiosClient.post('/user/logout',{},{
            withCredentials:true
         });
         delete axiosClient.defaults.headers.common["Authorization"];
         localStorage.clear();
         sessionStorage.clear();
          return null;
      } catch (error) {
         return thunkAPI.rejectWithValue(error.message)
      }
   }
)

export const checkAuthAPI = createAsyncThunk(
   'auth/check',
   async(_, thunkAPI)=>{

      try {
         const  response  = await axiosClient.get('/user/check')
         console.log(response.data.user)
         return response.data.user
      } catch (error) {
         return thunkAPI.rejectWithValue(error.message)
      }
   }
)

export const forgotPasswordAPI = createAsyncThunk(
   '/auth/forget',
   async( data , thunkAPI)=>{

      try {
         const response = await axiosClient.post('/user/forgetPassword', data , {
            withCredentials:true
         } );
         return response.data;

      } catch (error) {
         return thunkAPI.rejectWithValue(error.message)
      }
   }
)

const authSlice = createSlice({
   name : "auth", 
   initialState :{
      user : null, 
      isAuthenticated : false, 
      loading : false, 
      error : null,
     
     forgotLoading: false,
     forgotSuccess: false,
     forgotError: null,
     forgotMessage: null,

   }, 
   reducers:{

   }, 
   extraReducers: (builder)=>{
      builder

      // RegisterUserAPI Cases
      .addCase(registerUserAPI.pending , (state)=>{
         state.loading = true, 
         state.error = null
      })
      .addCase(registerUserAPI.fulfilled, (state,action)=>{
         state.user = action.payload, 
         state.isAuthenticated = !!action.payload, 
         state.loading = false
      })
      .addCase(registerUserAPI.rejected, (state,action)=>{
         state.user = null, 
         state.loading = false, 
         state.isAuthenticated = false, 
         state.error = action.payload || "Something Went Wrong"
      })
     

      // LoginUserAPI Cases
      .addCase(loginUserAPI.pending , (state)=>{
         state.loading = true, 
         state.error = null
      })
      .addCase(loginUserAPI.fulfilled, (state,action)=>{
         state.user = action.payload, 
         state.isAuthenticated = !!action.payload, 
         state.loading = false
      })
      .addCase(loginUserAPI.rejected, (state,action)=>{
         state.user = null, 
         state.loading = false, 
         state.isAuthenticated = false, 
         state.error = action.payload || "Something Went Wrong"
      })

      //Check User Api Cases 
      .addCase(logoutUserAPI.pending , (state)=>{
         state.loading = true, 
         state.error = null
         
      })
      .addCase(logoutUserAPI.fulfilled, (state)=>{
         state.user = null, 
         state.isAuthenticated = false, 
         state.loading = false,
         state.error = null
      })
      .addCase(logoutUserAPI.rejected, (state,action)=>{
         state.user = null, 
         state.loading = false, 
         state.isAuthenticated = false, 
         state.error = action.payload || "Something Went Wrong"
      })

      .addCase(checkAuthAPI.pending , (state)=>{
         state.loading = true,
         state.error = null
      })
      .addCase(checkAuthAPI.fulfilled, (state,action)=>{
         state.user = action.payload, 
         state.isAuthenticated = true, 
         state.loading = false
      })
      .addCase(checkAuthAPI.rejected, (state,action)=>{
         state.user = null, 
         state.loading = false, 
         state.isAuthenticated = false, 
         state.error = action.payload || "Something Went Wrong"
      })

      //forget 
      .addCase(forgotPasswordAPI.pending, (state) => {
      state.forgotLoading = true;
      state.forgotError = null;
      state.forgotSuccess = false;
      })
      .addCase(forgotPasswordAPI.fulfilled, (state, action) => {
     state.forgotLoading = false;
    state.forgotSuccess = true;
    state.forgotMessage = action.payload.message;
      })
      .addCase(forgotPasswordAPI.rejected, (state, action) => {
    state.forgotLoading = false;
    state.forgotError = action.payload || "Something went wrong";
    })

   }
})


export default authSlice.reducer;