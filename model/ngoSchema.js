const Mongoose = require('mongoose');
const Bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken')

const ngoSchema = new Mongoose.Schema({

      nOtp: {
            type: Number,
            default: 0
      },

      nAuthorized: {
            type: Boolean,
            default: 0
      },

      nName: {
            type: String,
            required: true
      },

      nEmail: {
            type: String,
            required: true,
            unique: true
      },

      nContact: {
            type: Number
      },

      nPassword: {
            type: String,
            required: true
      },

      nDocument: {
            data: Buffer,
            contentType: String
      },
      nTokens: [{
            nToken: {
                  type: String,
            }
      }],
});

ngoSchema.methods.GenerateAuthToken = async function () {

      try {

            let token = Jwt.sign({ _id: this._id }, process.env.SECRET_KEY)
            console.log(token)
            this.nTokens = this.nTokens.concat({ nToken: token });
            await this.save();
            return token;

      } catch (err) {

            console.log(err);

      }
}

ngoSchema.pre('save', async function (next) {

      if (this.isModified('nPassword')) {

            this.nPassword = await Bcrypt.hash(this.nPassword, 12);

      }
      next();
});

const Collection = Mongoose.model('NGOs', ngoSchema);

module.exports = Collection;