import Cookies from "universal-cookie";
export let developement = true;
export var isLoggedIn = false;
export var otp = {
    state: false,
};
export var loginUser;

export const setIsLoggedIn = (TorF) => {
    isLoggedIn = TorF;
};

export const setOtp = (value) => {
    otp = value;
};
export const getOtp = () => {
    return otp;
};

export const setData = (value) => {
    loginUser = value;
};
export const LoginOrNot = async () => {
    const cookie = new Cookies();

    const optionsForFetching = {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
        },

        body: JSON.stringify({
            token: cookie.get("Token") ? cookie.get("Token") : "",
            userType: cookie.get("userType") ? cookie.get("userType") : "",
            need: 3,
        }),
    };

    try {
        const res = await fetch(
            developement ? "http://localhost:5000/isLoggedIn" : "/isLoggedIn",
            optionsForFetching
        );

        const data = await res.json();

        if (data.status != 200) {
            throw new Error(res.error);
        }
        loginUser = data.data[0];
        return true;
    } catch (error) {
        return false;
    }
};
