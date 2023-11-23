const Express = require("express");
const Router = Express.Router();
const db = require('../model/ngoSchema')
const branch = require("../model/branchSchema")

Router.put("/UpdateNgo",async(req, res) => {
      try {
            const {email, name, contact, expertise} = req.body;

            await db.findOneAndUpdate({nEmail: email}, {nName: name, nContact: contact, nExpertise: expertise})
            return res.status(200).json({status: 200})
      } catch (error) {
            console.log(error)
            res.status(500).json({status: 500})
      }
})

Router.put("/UpdateBranch", async(req,res) => {
      try {
            const {address, coordinates, name, bEmail, nEmail, contact, services, expertise, equipements} = req.body;
            await branch.findOneAndUpdate({nEmail:nEmail, bEmail: bEmail}, {bAddress: address, bCoordinates: coordinates, bName: name, bContact: contact, bServices: services, bExpertise: expertise, bEquipements: equipements})
            return res.status(200).json({status: 200})
      } catch (error) {
            console.log(error)
            res.status(500).json({status: 500})
      }
})

Router.post("/GetNgoList", async(req, res) => {
      try{
            return res.status(200).json({status: 200, data: await db.find({nOtp: 0, nAuthorized: true}, {nEmail:1, nName: 1})});
      }
      catch(e){
            console.log(e)
            res.status(500).json({status: 500})
      }
})

module.exports = Router;