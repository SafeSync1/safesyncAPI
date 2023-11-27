const Express = require("express");
const Router = Express.Router();
const db = require('../model/ngoSchema');
const branch = require("../model/branchSchema")
Router.post("/ngoApprove", async (req, res) => {
      try {
            const { email, secretKey } = req.body;
            if (secretKey != process.env.SECRET_KEY) {
                  return res.status(401).json({ status: 401 })          //Secret Key is Wrong
            }
            else if(!email){
                  return res.status(406).json({status: 406})     //Email field missing
            }
            else {
                  await db.findOneAndUpdate({ nEmail: email }, { nAuthorized: true });
                  return res.status(200).json({status: 200})       //Authorized a ngo
            }
      }
      catch (err) {
            console.log(err)
            res.status(500).json({ status: 500 })       //Internal server error
      }
});

Router.post("/branchApprove", async(req, res)=>{
      try {
            const {nEmail, bEmail} = req.body;
            if(!nEmail || !bEmail){
                  return res.status(406).json({status: 406})     //field missing
            }
            else{
                  await branch.findOneAndUpdate({nEmail: nEmail, bEmail: bEmail}, {bAuthorized:true})
                  return res.status(200).json({status: 200})
            }
      } catch (error) {
            console.log(error)
            res.status(500).json({status: 500})
      }
})
module.exports = Router;