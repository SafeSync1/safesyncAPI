export let developement = false;
export var isLoggedIn = false;
export var otp = {
      state:false
};

export const setIsLoggedIn = (TorF) => {
      isLoggedIn = TorF;
}

export const setOtp = (value) => {
      otp = value
}
