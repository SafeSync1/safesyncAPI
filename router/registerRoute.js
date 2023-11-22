const sgMail = require('@sendgrid/mail');
const db = require('../model/ngoSchema.js');    //importing our collection schema for our users collection
const branch = require("../model/branchSchema.js");
const Express = require("express");
const Router = Express.Router();
const fs = require('fs')
const multer = require('multer');

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
                  res.status(500).json({status: 500})
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
                  await branch.findOneAndUpdate({ nEmail: ngo, bEmail: to }, {bOtp: Number(CODE)});
            }
      } catch (error) {
            console.log(error)
      }
}

Router.post("/ngoCheckCode", async (req, res) => {

      const { email, otp } = req.body;

      const Gotp = await db.findOne({ nEmail: email }, { nOtp: 1 })
      if (Number(Gotp.nOtp) === 0) {
            return res.status(422).json({ status: 422 });    //already Authorized
      }
      else if (Number(Gotp.nOtp) !== Number(otp)) {
            return res.status(406).json({ status: 406 }); //	Not Acceptable
      }
      else {
            await db.findOneAndUpdate({ nEmail: email }, { nOtp: 0 })
            return res.status(200).json({ status: 200 }); //	ok
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

            const user = new db({ nEmail: email, nPassword: password, nName: name, nContact: (req.body.contact ? req.body.contact : null), nDocument: final_doc });

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
      const { nEmail, email, password, name } = req.body;
      if (!nEmail || !email || !password || !name) {
            return res.status(406).json({ status: 406 });//not acceptable
      }
      try {
            const Exist = await branch.findOne({ nEmail: nEmail, bEmail: email });
            if (Exist) {
                  return res.status(422).json({ status: 422 });//already exist
            }
            var doc = fs.readFileSync(req.file.path);
            var encode_doc = doc.toString('base64');
            var final_doc = {
                  data: encode_doc,
                  contentType: 'application/pdf'
            };

            const user = new branch({ nEmail:nEmail ,bEmail: email, bPassword: password, bName: name, bDocument: final_doc });
            await user.save();

            res.status(201).send({ status: 201 }); //user created

            sendMail(nEmail, email, "Branch");

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

module.exports = Router;
