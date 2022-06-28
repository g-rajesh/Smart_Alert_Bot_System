import { createSlice, current } from '@reduxjs/toolkit'

let formDetails = {
    "email": "",
    "password": ""
};

let data = formDetails;
if(localStorage.getItem("signinState")){
    data = JSON.parse(localStorage.getItem("signinState"));
}

const initialState = {
    formDetails: data,
    error: formDetails
};

export const signinSlice = createSlice({
    name: 'signin',
    initialState,
    reducers: {
        changeHandler: (state, {payload}) => {
            state.formDetails = {
                ...state.formDetails, [payload.name]: payload.value
            }

            localStorage.setItem("signinState", JSON.stringify(state.formDetails));
        },

        submitHandler: (state) => {
            localStorage.removeItem("signinState");
            state.formDetails = formDetails;
        },

        changeError: (state, {payload}) => {
            state.error = {...state.error, ...payload}
        },

        deleteError: (state)=> {
            state.error = formDetails
        },
    },
})

export const { changeHandler, submitHandler, changeError, deleteError } = signinSlice.actions

export default signinSlice.reducer