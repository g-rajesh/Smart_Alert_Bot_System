import { createSlice, current } from '@reduxjs/toolkit'

let user = null
let token = null

if(localStorage.getItem('user')){
    user = JSON.parse(localStorage.getItem('user'))
}
if(localStorage.getItem('token')){
    token = JSON.parse(localStorage.getItem('token'))
}

const initialState = {
    user,
    token,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, {payload}) => {
            payload.data.viewCall = false;
            payload.data.attend = false;
            state.user = payload.data
            state.token = payload.token
            localStorage.setItem('user', JSON.stringify(payload.data));
            localStorage.setItem('token', JSON.stringify(payload.token));
        },

        updateViewCall: (state, {payload}) => {
            state.user.viewCall = payload;
            localStorage.setItem('user', JSON.stringify(user))
        },

        updateAttend: (state, {payload}) => {
            state.user.attend = payload;
            localStorage.setItem('user', JSON.stringify(user))
        },

        updateUserIsVerified: (state, {payload}) => {
            state.user = {...state.user, isVerified: payload};
            localStorage.setItem('user', JSON.stringify(state.user));
        },

        logoutHandler: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    },
})

export const { updateUser, updateUserIsVerified, logoutHandler, updateViewCall, updateAttend, updateUserSocket, updateUserRTC } = userSlice.actions

export default userSlice.reducer