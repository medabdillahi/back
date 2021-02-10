const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    prenom: { type: String },
    nom: { type: String },
    tel: { type: Number },
    email: { type: String, unique : true },
    type: { type: String},
    mot_de_passe: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);