import { Routes, Route } from "react-router-dom"
import SignIn from "./components/Auth/SignIn";

import SignUp from "./components/Auth/SignUp"
import Chat from "./components/Chat";
import Feedback from "./components/Feedback";
import "./index.css";

const App = () => {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={ <Chat/> } />
                <Route path="signup" element={ <SignUp/> } />
                <Route path="signin" element={ <SignIn/> } />
                <Route path="feedback" element={ <Feedback/> } />
            </Routes>
        </div>
    );
}

export default App;
