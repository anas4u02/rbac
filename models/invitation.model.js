const mongoose = require('mongoose')
const { roles, invitationStatus } = require('../utils/constants')


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
    },
    invitationStatus : {
        type: String,
        enum: [invitationStatus.accepted, invitationStatus.rejected, invitationStatus.pending],
        default: invitationStatus.pending
    }
});

const Invitation = mongoose.model('invitation', invitationSchema);
module.exports = Invitation;