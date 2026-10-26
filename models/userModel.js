const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new  mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true , 'Name Required']
    },
    slug:{
        type:String,
        lowercase:true,
    },
    email:{
        type:String,
        required:[true , 'Email Required' ],
        unique: true,
        lowercase:true,
    },
    phone:{
        type:String,
    },
    profileimage:{
        type:String
    },
    password:{
        type:String,
        required:[true , 'Password Required'],
        minlength:[6 , 'Too Short Password'],
    },
    passwordChangedAt:Date,
    role:{
        type:String,
        enum:['user' , 'admin' , 'manager'],
        default:'user'
    },
    active:{
        type:Boolean,
        default:true
    },
    passwordResetCode:String,
    passwordResetExpires:Date,
    passwordResetVerified:Boolean
},{timestamps: true})



// يعمله بيكريبت ب برييي قبل ما يتحفظ عندي في الداتا 
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    // hashing user password
    this.password = await bcrypt.hash(this.password, 12);
});

 
const User = mongoose.model('User' , userSchema);

module.exports = User;