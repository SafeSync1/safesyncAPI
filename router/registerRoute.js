const sgMail = require('@sendgrid/mail');
const db = require('../model/ngoSchema.js');    //importing our collection schema for our users collection
const branch = require("../model/branchSchema.js");
const Express = require("express");
const Router = Express.Router();
const fs = require('fs')
const multer = require('multer');
const Bcrypt = require('bcrypt')

const upload = multer({ dest: process.env.Destination });

const sendMail = async (ngo, to, which) => {
      const deleteIt = async () => {
            try {
                  if (which === "ngo") {
                        console.log("Checking for ngo authorization.. " + (to))
                        const res = await db.findOne({ nEmail: to }, { nOtp: 1 })
                        if (res.nOtp !== 0) {
                              console.log("Deleting it..")

                              db.deleteOne({ nEmail: to }).then(function () {
                                    console.log("Data deleted"); // Success
                              }).catch(function (error) {
                                    console.log(error); // Failure
                              });
                        }
                  }
                  else {
                        console.log("Checking for branch authorization..." + (to))
                        const res = await branch.findOne({ nEmail: ngo, bEmail: to });
                        if (res.bOtp !== 0) {
                              console.log("Deleting it..")

                              branch.deleteOne({ nEmail: ngo, bEmail: to }).then(function () {
                                    console.log("Data deleted"); // Success
                              }).catch(function (error) {
                                    console.log(error); // Failure
                              })
                        }
                  }
            } catch (error) {
                  console.log(error)
                  res.status(500).json({ status: 500 })
            }

      }

      setTimeout(deleteIt, 60000);

      const CODE = Math.floor(100000 + Math.random() * 900000)
      const msg = {
            to: to,
            from: 'neelchhatbar@gmail.com', // Use the email address or domain you verified above
            subject: 'Verification',
            text: 'OTP verification..',
            html: `Your SafeSync Login CODE: <strong>${CODE}</strong>`,
      };

      try {
            await sgMail.send(msg);
            if (which === "ngo") {
                  await db.findOneAndUpdate({ nEmail: to }, { nOtp: Number(CODE) }); //Bcrypt.hash(CODE,12)
            }
            else {
                  await branch.findOneAndUpdate({ nEmail: ngo, bEmail: to }, { bOtp: Number(CODE) });
            }
      } catch (error) {
            console.log(error)
      }
}

Router.post("/CheckCode", async (req, res) => {
      try {
            const { userType, nEmail, bEmail, otp } = req.body;
            if (userType === "ngo") {
                  const Gotp = await db.findOne({ nEmail: nEmail }, { nOtp: 1 })
                  if (Number(Gotp.nOtp) === 0) {
                        return res.status(422).json({ status: 422 });    //already Authorized
                  }
                  else if (Number(Gotp.nOtp) !== Number(otp)) {
                        return res.status(406).json({ status: 406 }); //	Not Acceptable
                  }
                  else {
                        await db.findOneAndUpdate({ nEmail: nEmail }, { nOtp: 0 })
                        return res.status(200).json({ status: 200 }); //	ok
                  }
            }
            else if (userType === "branch") {
                  const Gotp = await branch.findOne({ bEmail: bEmail, nEmail: nEmail }, { bOtp: 1 })
                  if (Number(Gotp.bOtp) === 0) {
                        return res.status(422).json({ status: 422 });    //already Authorized
                  }
                  else if (Number(Gotp.bOtp) !== Number(otp)) {
                        return res.status(406).json({ status: 406 }); //	Not Acceptable
                  }
                  else {
                        await branch.findOneAndUpdate({ nEmail: nEmail, bEmail: bEmail }, { bOtp: 0 })
                        return res.status(200).json({ status: 200 }); //	ok
                  }
            }
            else {
                  return res.status(406).json({ status: 406 });   //not acceptable
            }


      } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500 })
      }

})

Router.post("/ngoRegister", upload.single('document'), async (req, res) => {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {

            return res.status(406).json({ status: 406 }); //	Not Acceptable

      }

      try {
            const Exist = await db.findOne({ nEmail: email });
            if (Exist) {
                  return res.status(422).json({ status: 422 }); //already exist
            }
            var doc = fs.readFileSync(req.file.path);
            var encode_doc = doc.toString('base64');
            var final_doc = {
                  data: encode_doc,
                  contentType: 'application/pdf'
            };

            const user = new db({ nEmail: email, nPassword: password, nName: name, nContact: (req.body.contact ? req.body.contact : ""), nDocument: final_doc });

            await user.save();

            res.status(201).send({ status: 201 }); //user created

            sendMail("", email, "ngo");

            fs.unlink(req.file.path, (err) => {
                  if (err) {
                        console.log(err)
                  }
            })

      } catch (err) {

            console.log(err);
            return res.status(500).json({ status: 500 })
      }
});

Router.post("/bRegister", upload.single('document'), async (req, res) => {
      const { nEmail, bEmail, password, name } = req.body;
      if (!nEmail || !bEmail || !password || !name) {
            return res.status(406).json({ status: 406 });//not acceptable
      }
      try {
            const Exist = await branch.findOne({ nEmail: nEmail, bEmail: bEmail });
            if (Exist) {
                  return res.status(422).json({ status: 422 });//already exist
            }
            var doc = fs.readFileSync(req.file.path);
            var encode_doc = doc.toString('base64');
            var final_doc = {
                  data: encode_doc,
                  contentType: 'application/pdf'
            };

            const user = new branch({ nEmail: nEmail, bEmail: bEmail, bPassword: password, bName: name, bDocument: final_doc, bContact: "" });
            await user.save();

            res.status(201).send({ status: 201 }); //user created

            sendMail(nEmail, bEmail, "Branch");

            fs.unlink(req.file.path, (err) => {
                  if (err) {
                        console.log(err)
                  }
            })

      } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 500 })    //Internal server error
      }
});

Router.post("/SendOtp", async (req, res) => {
      try {
            const { userType, nEmail, bEmail } = req.body;
            const deleteIt = async () => {
                  if (userType === "ngo") {
                        console.log("Checking for ngo authorization.. " + (nEmail))
                        const res = await db.findOne({ nEmail: nEmail }, { nOtp: 1 })
                        if (res.nOtp !== 0) {
                              console.log("Resetting it..")

                              await db.findOneAndUpdate({nEmail: nEmail}, {nOtp: 0})
                        }
                  }
                  else {
                        console.log("Checking for branch authorization..." + (bEmail))
                        const res = await branch.findOne({ nEmail: nEmail, bEmail: bEmail });
                        if (res.bOtp !== 0) {
                              console.log("Resetting it..")

                              await branch.findOneAndUpdate({ nEmail: nEmail, bEmail: bEmail }, {bOtp: 0})
                        }
                  }
            }
            setTimeout(deleteIt, 60000);
            if (!userType) {
                  return res.status(406).json({ status: 406 });//not acceptable
            }
            if (userType === "ngo") {
                  if (!nEmail) {
                        return res.status(406).json({ status: 406 });//not acceptable
                  }
                  const Exist = await db.findOne({ nEmail }, { _id: 1 })
                  if (!Exist) {
                        return res.status(407).json({ status: 407 });//Does not Exist
                  }
            }
            else {
                  if (!nEmail || !bEmail) {
                        return res.status(406).json({ status: 406 });//not acceptable
                  }
                  const Exist = await branch.findOne({ nEmail, bEmail }, { _id: 1 })
                  if (!Exist) {
                        return res.status(407).json({ status: 407 });//Does not Exist
                  }
            }
            const CODE = Math.floor(100000 + Math.random() * 900000)
            const msg = {
                  to: (userType === "ngo" ? nEmail : bEmail),
                  from: 'neelchhatbar@gmail.com', // Use the email address or domain you verified above
                  subject: 'Verification',
                  text: 'OTP verification..',
                  html: `Your SafeSync Forgot password CODE: <strong>${CODE}</strong>`,
            };

            await sgMail.send(msg);
            if (userType === "ngo") {
                  await db.findOneAndUpdate({ nEmail }, { nOtp: Number(CODE) }); //Bcrypt.hash(CODE,12)
            }
            else {
                  await branch.findOneAndUpdate({ nEmail, bEmail }, { bOtp: Number(CODE) });
            }
            res.status(200).json({ status: 200 })
      } catch (error) {
            console.log(error)
            return res.status(500).json({ status: 500 })
      }
})

Router.post("/ChangePassword", async (req, res) => {
      try {
            const { userType, bEmail, nEmail, password } = req.body;
            
            if (!password || !nEmail || !userType) {
                  return res.status(406).json({ status: 406 })
            }
            if (userType === "ngo") {
                  const data = await db.findOne({ nEmail }, { nPassword: 1 })
                  const ismatch = await Bcrypt.compare(password, data.nPassword);
                  if (ismatch) {
                        return res.status(409).json({ status: 409 })
                  }
                  const pass = await Bcrypt.hash(password, 12);
                  await db.findOneAndUpdate({ nEmail }, { nPassword: pass })
            }
            else {
                  if (!bEmail) {
                        return res.status(406).json({ status: 406 })
                  }
                  const data = await branch.findOne({ nEmail, bEmail }, { bPassword: 1 })
                  const ismatch = await Bcrypt.compare(password, data.bPassword)
                  if (ismatch) {
                        return res.status(409).json({ status: 409 })
                  }
                  const pass = await Bcrypt.hash(password, 12)
                  await branch.findOneAndUpdate({ nEmail, bEmail }, { bPassword: pass })
            }
            res.status(200).json({ status: 200 })
      } catch (error) {
            console.log(error)
            res.status(500).json({ status: 500 })
      }
})

module.exports = Router;
