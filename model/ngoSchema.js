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

      nBranches: [{
            bAuthorized: {
                  type: Number,
                  default: 0
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
            bServices: [{
                  sName: {
                        type: String
                  },
                  sDescription: {
                        type: String
                  }
            }],
            bLastInteraction: {
                  type: Date      //This will include date and time both
            },
            bExpertise: [{
                  eName: {
                        type: String
                  }
            }],
            bEquipements: [{
                  eqName: {
                        type: String
                  },
                  eqQuantity: {
                        type: Number,
                        default: 0
                  }
            }],
            bcollab: [{
                  cEmail: {
                        type: String,
                        required: true
                  },
                  cStatus: {
                        type: Boolean,
                        default: 0
                  }
            }],
            bTokens: [{
                  bToken: {
                        type: String,
                  }
            }],
      }],
      nTokens: [{
            nToken: {
                  type: String,
            }
      }],
});

ngoSchema.methods.GenerateAuthToken = async function (which) {

      try {

            let token = Jwt.sign({_id:this._id}, process.env.SECRET_KEY)
            if(which === "n"){
                  console.log(token)
                  this.nTokens = this.nTokens.concat({nToken: token});
            }
            else{
                  this.bTokens = this.bTokens.concat({bToken: token});
            }
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