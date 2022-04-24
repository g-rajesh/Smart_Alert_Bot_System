import { configureStore } from '@reduxjs/toolkit'
import signinReducer from './reducers/signinSlice'
import signupReducer from './reducers/signupSlice'
import userReducer from './reducers/userSlice'

export const store = configureStore({
    reducer: {
        signup: signupReducer,
        signin: signinReducer,
        user: userReducer
    },
})