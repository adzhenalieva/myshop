const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nanoid = require("nanoid");
const SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function (value) {
                if (!this.isModified('email')) return;

                const user = await User.findOne({email: value});

                if (user) throw new Error();
            },
            message: 'This user is already registered'
        }
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'user',
        enum: ['user', 'admin']
    },
    token: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

UserSchema.methods.generateToken = function () {
    this.token = nanoid();
};

UserSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        delete ret.password;
        return ret;
    }
});
const User = mongoose.model('User', UserSchema);

module.exports = User;
