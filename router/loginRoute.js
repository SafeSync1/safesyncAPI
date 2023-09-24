const Express = require("express")
const R = Express.Router();
const Bcrypt = require('bcrypt');
// const App = Express();

const db = require('../model/ngoSchema.js');

const nLog = async(req, res, next) =>{
      try {
            const { email, password } = req.body;

            if (!email || !password) {

                  return res.status(406).json({ status: 406 });  //fill data properly

            }

            const Exist = await db.findOne({ nEmail: email },{nPassword: 1, nOtp: 1});

            if (!Exist) {

                  return res.status(417).json({ status: 417 });   //Incorrect Email or Password

            }

            const ismatch = await Bcrypt.compare(password, Exist.nPassword);

            if (!ismatch) {

                  return res.status(417).json({ status: 417 });    //Incorrect Email or Password

            }
            else {
                  if (Exist.nOtp == 0) {
                        next();
                  }
                  else {
                        return res.status(401).json({ status: 401 });       //not acceptable
                  }

            }

      } catch (err) {
            console.log(err);
            return res.status(500).json({status: 500})
      }
}

R.get('/nLogin', nLog, (req,res) => {
      return res.status(202).json({status: 202});      //login successfull
})

module.exports = R;