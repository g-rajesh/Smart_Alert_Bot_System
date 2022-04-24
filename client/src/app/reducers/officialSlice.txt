import { createSlice, current } from '@reduxjs/toolkit'

let official = null
let token = null

if(localStorage.getItem('official')){
    official = JSON.parse(localStorage.getItem('official'))
}
if(localStorage.getItem('token')){
    token = JSON.parse(localStorage.getItem('token'))
}

const initialState = {
    official,
    token
};

export const officialSlice = createSlice({
    name: 'official',
    initialState,
    reducers: {
        updateOfficial: (state, {payload}) => {
            state.official = payload.data
            state.token = payload.token
            localStorage.setItem('official', JSON.stringify(payload.data));
            localStorage.setItem('token', JSON.stringify(payload.token));
        },

        logoutHandler: (state) => {
            state.official = null;
            state.token = null;
            localStorage.removeItem('official');
            localStorage.removeItem('token');
        }
    },
})

export const { updateOfficial, logoutHandler } = officialSlice.actions

export default officialSlice.reducer