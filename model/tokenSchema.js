const mongoose = require('mongoose');
const schema = mongoose.Schema;

const tokenSchema = new schema({

    user_id:{
        type:schema.Types.ObjectId,
        require: true
    },
    email:{
      type: String,
      required: true,
    },
    token: {
        type: Number,
        required: true,
      },
    createdAt: {
      type: Date,
      default: Date.now,
      expires : 3600,// this is the expiry time in seconds
    }
    

})

module.exports = mongoose.model('token',tokenSchema);