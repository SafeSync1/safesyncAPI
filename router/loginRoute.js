const Bcrypt = require('bcrypt');
const Express = require("Express");
const Router = Express.Router();
const db = require('../model/ngoSchema.js');
const Jwt = require("jsonwebtoken");

Router.get("/ngoLogin", async (req, res) => {
      try {
            const { email, password } = req.body;

            if (!email || !password) {

                  return res.status(406).json({ status: 406 });  //fill data properly

            }

            const Exist = await db.findOne({ nEmail: email }, { nPassword: 1, nOtp: 1, nTokens: 1, nAuthorized: 1 });

            if (!Exist) {

                  return res.status(417).json({ status: 417 });   //Incorrect Email or Password

            }

            const ismatch = await Bcrypt.compare(password, Exist.nPassword);

            if (!ismatch) {

                  return res.status(417).json({ status: 417 });    //Incorrect Email or Password

            }
            else {
                  if (Exist.nOtp == 0) {
                        if (Exist.nAuthorized) {
                              const token = await Exist.GenerateAuthToken();
                              return res.status(202).json({ status: 202, id: Exist._id, token });      //login successfull
                        }
                        else {
                              return res.status(402).json({ status: 402 });       //not Authorized by admin
                        }
                  }
                  else {
                        return res.status(401).json({ status: 401 });       //Otp verification pending
                  }

            }

      } catch (err) {
            console.log(err);
            return res.status(500).json({ status: 500 })      //Internal server error
      }
})

Router.get("/isLoggedIn", async (req, res) => {
      try {
            const { userType, id, token } = req.body;
            if (userType == 'ngo') {

                  if (!token) {

                        return res.status(407).json({status: 407});  //Token not found

                  }

                  const verifyToken = Jwt.verify(token, process.env.SECRET_KEY);

                  const rootUser = await db.findOne({ _id: verifyToken._id, "nTokens.nToken": token });
                  
                  if (!rootUser) { throw new Error }  //User not found
                  return res.status(200).json({status: 200})      //Yes user is logged in
            }
            else if (userType == 'branch') {
                  // const { nEmail } = req.body;
            }
            else {
                  return res.status(407).json({ status: 407 })      //Fill the fields properly
            }
      }
      catch (err) {
            console.log(err)
            res.status(500).json({ status: 500 })      //Internal server error
      }
})

module.exports = Router;