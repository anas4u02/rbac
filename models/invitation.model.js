const mongoose = require('mongoose')


const invitationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    role: {
        type: String,
        enum: [roles.admin, roles.developer, roles.inbox],
        default: roles.client
    }
});

const Invitation =  mongoose.model('invitation', invitationSchema);
module.exports = Invitation;