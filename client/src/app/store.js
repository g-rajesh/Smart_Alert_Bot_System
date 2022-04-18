import { configureStore } from '@reduxjs/toolkit'
import signinReducer from './signin/signinSlice'
import signupReducer from './signup/signupSlice'
import userReducer from './user/userSlice'

export const store = configureStore({
    reducer: {
        signup: signupReducer,
        signin: signinReducer,
        user: userReducer
    },
})