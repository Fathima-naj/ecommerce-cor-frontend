import { configureStore,  } from "@reduxjs/toolkit";
import productReducer from './productSlice'
import userReducer from './userSlice'
import cartReducer from './cartSlice'

const store=configureStore({
 reducer:{
   product:productReducer,
   user:userReducer,
   cart:cartReducer
 }
})

export default store