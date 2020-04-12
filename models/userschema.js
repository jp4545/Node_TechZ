var mongoose = require('mongoose');
var schema = mongoose.Schema;

var UserSchema = new schema({
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
    },
    organisation:{
        type: String,
        required: true
    },
    mobile:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    confirmed:{
        type:Boolean,
        default: false
    },
});

module.exports = mongoose.model('UserSchema',UserSchema);