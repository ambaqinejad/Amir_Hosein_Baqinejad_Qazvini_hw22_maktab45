const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bloggerSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        required: [true, 'First name is required']
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, 'Last name is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        maxlength: 12
    },
    username: {
        type: String,
        trim: true,
        required: [true, 'Username is required'],
        unique: true
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        trim: true,
        enum: ['male', 'female'],
        default: 'male'
    },
    avatar: String,
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        minlength: 13,
        maxlength: 13
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true
    },
    role: {
        type: String,
        enum: ['admin', 'blogger'],
        default: 'blogger'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

bloggerSchema.pre('save', function(next) {
    const blogger = this;
    if (blogger.isNew || blogger.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return next(err);
            }
            bcrypt.hash(blogger.password, salt, (err, hash) => {
                if (err) {
                    return next(err);
                }
                blogger.password = hash;
                return next()
            })
        })
    } else {
        return next();
    }
})

bloggerSchema.pre('updateOne', function(next) {
    const info = this;
    if (info._update.password) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return next(err);
            }
            bcrypt.hash(info._update.password, salt, (err, hash) => {
                if (err) {
                    return next(err);
                }
                info._update.password = hash;
                return next();
            })
        })
    } else {
        return next();
    }
})

module.exports = mongoose.model('Blogger', bloggerSchema);