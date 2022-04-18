import { createSlice, current } from '@reduxjs/toolkit'

// let data = formDetails;
// if(localStorage.getItem("signupState")){
//     data = JSON.parse(localStorage.getItem("signupState"));
// }

// let page = 1;
// if(localStorage.getItem("page")) {
//     page = JSON.parse(localStorage.getItem("page"));
// }

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
    token
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, {payload}) => {
            console.log(payload);
            state.user = payload.user
            state.token = payload.token
            localStorage.setItem('user', JSON.stringify(payload.user));
            localStorage.setItem('token', JSON.stringify(payload.token));

        }
    },
})

export const { updateUser } = userSlice.actions

export default userSlice.reducer