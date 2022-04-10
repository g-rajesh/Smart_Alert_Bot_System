import { createSlice, current } from '@reduxjs/toolkit'
import { formDetails } from '../../util/data'

let data = formDetails;
if(localStorage.getItem("signupState")){
    data = JSON.parse(localStorage.getItem("signupState"));
}

let page = 1;
if(localStorage.getItem("page")) {
    page = JSON.parse(localStorage.getItem("page"));
}

const initialState = {
    formDetails: data,
    error: {
        "fName": "",
        "lName": "",
        "email": "",
        "password": "",
        "cno": ""
    },
    currPage: page
};

export const signupSlice = createSlice({
    name: 'signup',
    initialState,
    reducers: {
        changeHandler: (state, {payload}) => {
            // console.log(payload);
            state.formDetails = {
                ...state.formDetails, [payload.name]: payload.value
            }

            localStorage.setItem("signupState", JSON.stringify(state.formDetails));
            // console.log(state.formDetails)
        },

        submitHandler: (state) => {
            // console.log(current(state));
            state.currPage = 1;
            localStorage.setItem("page", JSON.stringify(state.currPage));
            localStorage.removeItem("signupState");
            state.formDetails = formDetails;
        },

        changePageHandler: (state, {payload}) => {
            state.currPage = payload;
            // console.log(state.currPage);
            localStorage.setItem("page", JSON.stringify(state.currPage));
        }
    },
})

export const { changeHandler, submitHandler, changePageHandler } = signupSlice.actions

export default signupSlice.reducer