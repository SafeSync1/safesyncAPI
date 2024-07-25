import { Routes, Route } from "react-router-dom";

import "./index.css";

import Login from "./components/Login";
import Otp from "./components/Otp";
import Register from "./components/Register";
import Home from "./components/Home";
import ResetPassword from "./components/ResetPassword";
import ForgotPassword from "./components/ForgotPassword";
import AccountUpdate from "./components/AccountUpdate";
import Ngos from "./components/Ngos";
import NgoDetail from "./components/NgoDetail";

function App() {
    return (
        <>
            <Routes>
                <Route exact path="/Login" element={<Login />} />
                <Route exact path="/Otp" element={<Otp />} />
                <Route exact path="/Register" element={<Register />} />
                <Route exact path="/" element={<Home />} />
                <Route exact path="/RP" element={<ResetPassword />} />
                <Route exact path="/FP" element={<ForgotPassword />} />
                <Route exact path="/AU" element={<AccountUpdate />} />
                <Route exact path="/Ngos" element={<Ngos />} />
                <Route path="Ngos/:nEmail" element={<NgoDetail />} />
            </Routes>
        </>
    );
}

export default App;
