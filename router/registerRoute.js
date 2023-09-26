const Dotenv = require('dotenv');
const Express = require('express');
const R = Express.Router();
const App = Express();
// const CookieParser = require('cookie-parser');
const sgMail = require('@sendgrid/mail');

Dotenv.config({ path: './config.env' })
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const db = require('../model/ngoSchema.js');    //importing our collection schema for our users collection


const sendMail = async (to) => {
      const deleteIt = async () => {
            console.log("Checking for authorization.. " + (to))
            const res = await db.findOne({ nEmail: to }, { nOtp: 1 })
            if (res.nOtp !== 0) {
                  console.log("Deleting it..")
                  
                  db.deleteOne({ nEmail: to}).then(function () {
                        console.log("Data deleted"); // Success
                  }).catch(function (error) {
                        console.log(error); // Failure
                  });
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
            await db.findOneAndUpdate({ nEmail: to }, { nOtp: Number(CODE) }); //Bcrypt.hash(CODE,12)

      } catch (error) {
            console.log(error)
      }
}

const nCheckCode = async (req, res, next) => {

      const { email, otp } = req.body;

      const Gotp = await db.findOne({ nEmail: email }, { nOtp: 1 })
      if (Number(Gotp.nOtp) !== Number(otp)) {
            return res.status(406).json({ status: 406 }); //	Not Acceptable
      }
      else {
            await db.findOneAndUpdate({ nEmail: email }, { nOtp: 0 })
            next();
      }

}

R.post('/nCheckCode', nCheckCode, (req, res) => {
      return res.status(200).json({ status: 200 }); //	ok
})

const fs = require('fs')
const multer = require('multer')
const upload = multer({ dest: 'router/uploads/' });

R.post('/nRegister', upload.single('document'), async (req, res) => {

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

            sendMail(email);

            fs.unlink(req.file.path, (err) => {
                  if (err) {
                        console.log(err)
                  }
            })

      } catch (err) {

            console.log(err);

      }

});

module.exports = R;
