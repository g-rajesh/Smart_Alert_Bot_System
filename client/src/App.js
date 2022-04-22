import { Routes, Route } from "react-router-dom"

import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp"
import Feedback from "./components/Feedback";
import Dashboard from "./components/Dashboard";
import Chat from "./components/Chat";
import Home from "./components/Home";
import "./index.css";

// TODO
// 1. HOME PAGE LOREM
// 2. LOADING ANIMATION

const App = () => {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={ <Home/> } />
                <Route path="chat" element={ <Chat/> } />
                <Route path="dashboard" element={ <Dashboard/> } />
                <Route path="signup" element={ <SignUp/> } />
                <Route path="signin" element={ <SignIn/> } />
                <Route path="feedback" element={ <Feedback/> } />
            </Routes>
        </div>
    );
}

export default App;
