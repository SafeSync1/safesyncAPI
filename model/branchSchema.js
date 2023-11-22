const Mongoose = require('mongoose');
const Bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken')

const branchSchema = new Mongoose.Schema({

      nEmail:{
            type: String,
            required: true
      },
      bOtp: {
            type: Number,
            default: 0
      },
      bAuthorized: {
            type: Boolean,
            default: 0
      },
      bDocument: {
            data: Buffer,
            contentType: String
      },
      bCoordinates: {
            type: String,
            default: "0"
      },
      bAddress: {
            type: String,
            default: ""
      },
      bName: {
            type: String,
            required: true
      },
      bEmail: {
            type: String,
            required: true,
      },
      bPassword: {
            type: String,
            required: true
      },
      bPhone: {
            type: Number
      },
      bServices: {
            // sName: {
            //       type: String
            // },
            // sDescription: {
            //       type: String
            // }
            type: String
      },
      bLastInteraction: {
            type: Date      //This will include date and time both
      },
      bExpertise: {
            // eName: {
            //       type: String
            // }
            type: String
      },
      bEquipements: [{
            eqName: {
                  type: String
            },
            eqQuantity: {
                  type: Number,
                  default: 0
            }
      }],
      // bcollab: [{
      //       cEmail: {
      //             type: String,
      //             required: true
      //       },
      //       cStatus: {
      //             type: Boolean,
      //             default: 0
      //       }
      // }],
      bTokens: [{
            bToken: {
                  type: String,
            }
      }],


});

branchSchema.methods.GenerateAuthToken = async function () {

      try {

            let token = Jwt.sign({ _id: this._id }, process.env.SECRET_KEY)

            this.bTokens = this.bTokens.concat({ bToken: token });

            await this.save();
            return token;

      } catch (err) {

            console.log(err);

      }
}

branchSchema.pre('save', async function (next) {

      if (this.isModified('bPassword')) {

            this.bPassword = await Bcrypt.hash(this.bPassword, 12);

      }
      next();
});

const Collection = Mongoose.model('branches', branchSchema);

module.exports = Collection;