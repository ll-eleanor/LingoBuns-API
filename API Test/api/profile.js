const mongoose = require('mongoose');

const profileSchema = mongoose.Schema(
    {
        clientName: {
            type: String,
            required: [true, "Please enter a name"],
            default: "kid"
        },
        clientAge: {
            type: Number,
            required: true,
            default: 12
        }
    }
);

module.exports = mongoose.model('Profile', profileSchema);