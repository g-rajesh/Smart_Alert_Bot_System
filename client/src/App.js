import { Routes, Route } from "react-router-dom"

import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp"
import Feedback from "./components/Feedback";
import Chat from "./components/Chat";
import Home from "./components/Home";
import "./index.css";

const App = () => {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={ <Home/> } />
                <Route path="chat" element={ <Chat/> } />
                <Route path="signup" element={ <SignUp/> } />
                <Route path="signin" element={ <SignIn/> } />
                <Route path="feedback" element={ <Feedback/> } />
            </Routes>
        </div>
    );
}

export default App;
