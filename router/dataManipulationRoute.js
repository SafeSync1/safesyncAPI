const Express = require("express");
const Router = Express.Router();
const db = require('../model/ngoSchema')
const branch = require("../model/branchSchema")
const Jwt = require("jsonwebtoken");

Router.post("/UpdateNgo", async (req, res) => {
      try {
            const { email, name, contact, expertise } = req.body;

            await db.findOneAndUpdate({ nEmail: email }, { nName: name, nContact: contact, nExpertise: expertise })
            return res.status(200).json({ status: 200 })
      } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500 })
      }
})

Router.post("/UpdateBranch", async (req, res) => {
      try {
            const { address, coordinates, name, bEmail, nEmail, contact, services, expertise, equipements } = req.body;
            await branch.findOneAndUpdate({ nEmail: nEmail, bEmail: bEmail }, { bAddress: address, bCoordinates: coordinates, bName: name, bContact: contact, bServices: services, bExpertise: expertise, bEquipements: equipements })
            return res.status(200).json({ status: 200 })
      } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500 })
      }
})

Router.post("/GetNgoList", async (req, res) => {
      try {
            return res.status(200).json({ status: 200, data: await db.find({ nOtp: 0, nAuthorized: true }, { nEmail: 1, nName: 1 }) });
      }
      catch (e) {
            console.log(e)
            res.status(500).json({ status: 500 })
      }
})

const N1 = async () => {
      return await db.find({ nOtp: 0, nAuthorized: true }, { nName: 1, nEmail: 1 });
}
const N2 = async (nEmail) => {
      return await branch.find({nEmail, bOtp: 0, bAuthorized: true},{bName: 1, bCoordinates: 1, bEmail:1});
}

Router.post("/isLoggedIn", async (req, res) => {
      try {
            const { userType, token, need, nEmail,bEmail } = req.body;
      
            if (!token || !userType) {
                  return res.status(406).json({ status: 406 });  //Token not found
            }
            const verifyToken = Jwt.verify(token, process.env.SECRET_KEY);

            if (userType === 'ngo') {
                  const rootUser = await db.findOne({ _id: verifyToken._id, "nTokens.nToken": token });

                  if (!rootUser) {
                        return res.status(408).json({ status: 408 });     //User not found
                  }
                  
            }
            else {
                  const rootUser = await branch.findOne({ _id: verifyToken._id, "bTokens.bToken": token });

                  if (!rootUser) {
                        return res.status(408).json({ status: 408 });     //User not found
                  }
            }
            if (need === 1) {
                  return res.status(200).json({ status: 200, data: await N1() });
            }
            else if (need === 2) {
                  if (!nEmail) {
                        return res.status(406).json({ status: 406 });
                  }
                  else{
                        return res.status(200).json({ status: 200, data: await N2(nEmail) });
                  }
            }
            else if(need === 3){
                  if(userType === "ngo"){
                        return res.status(200).json({status: 200, data: await db.find({_id: verifyToken._id}, {nTokens: 0, nDocument: 0}) })
                  }
                  else{
                        return res.status(200).json({status: 200, data: await branch.find({_id: verifyToken._id}, {bTokens: 0, bDocument: 0}) })
                  }
            }
            else if(need === 4){
                  if(!nEmail || !bEmail){
                        return res.status(406).json({status: 406})
                  }
                  else{
                        return res.status(200).json({status: 200, data: await branch.findOne({bEmail, nEmail}, {bTokens: 0, bDocument: 0})});
                  }
            }
            else if(need === 5){
                  if(!nEmail){
                        return res.status(406).json({status: 406});
                  }
                  else{
                        return res.status(200).json({status: 200, data: await db.findOne({nEmail}, {nTokens: 0, nDocument: 0})});
                  }
            }
      }
      catch (err) {
            console.log(err)
            res.status(500).json({ status: 500 })      //Internal server error
      }
})


module.exports = Router;