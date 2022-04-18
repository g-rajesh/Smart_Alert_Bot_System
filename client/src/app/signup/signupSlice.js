import { createSlice, current } from '@reduxjs/toolkit'
import { formDetails } from '../../Util/data'

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
    error: formDetails,
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

        changeError: (state, {payload}) => {
            for (const [key, value] of Object.entries(payload)) {

                if(key === 'fName' || key === 'lName' || key === 'email' || key === 'password'){
                    if(value !== '') {
                        state.currPage = 1;
                        localStorage.setItem("page", JSON.stringify(state.currPage));
                        break;
                    }  
                }
            }
            state.error = payload
        },

        deleteError: (state)=> {
            state.error = formDetails
        },

        changePageHandler: (state, {payload}) => {
            state.currPage = payload;
            // console.log(state.currPage);
            localStorage.setItem("page", JSON.stringify(state.currPage));
        }
    },
})

export const { changeHandler, submitHandler, deleteError, changeError, changePageHandler } = signupSlice.actions

export default signupSlice.reducer