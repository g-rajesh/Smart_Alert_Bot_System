import { configureStore } from '@reduxjs/toolkit'
import signinReducer from './signin/signinSlice'
import signupReducer from './signup/signupSlice'

export const store = configureStore({
    reducer: {
        signup: signupReducer,
        signin: signinReducer
    },
})