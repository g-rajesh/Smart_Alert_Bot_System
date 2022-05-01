import { Routes, Route } from "react-router-dom"

import Navbar from "./Navbar";
import Home from "./Home";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import Chat from "./Chat";
import Feedback from "./Feedback"; 
import Dashboard from "./Dashboard"; 
import Status from "./Status"; 

const Root = () => {
    return (
        <>
        <Navbar />
            <Routes>
                <Route path="/" element={ <Home /> } />
                <Route path="signup" element={ <SignUp /> } />
                <Route path="signin" element={ <SignIn /> } />
                <Route path="chat" element={ <Chat/> } />
                <Route path="feedback" element={ <Feedback /> } />
                <Route path="dashboard" element={ <Dashboard /> } />
                <Route path="status" element={ <Status /> } />
            </Routes>
        </>
    )
}

export default Root