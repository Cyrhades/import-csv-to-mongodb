const mongoose = require('mongoose');

module.exports = mongoose.Schema({
    firstname: { type: String, match: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁ ÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/ },
    lastname: { type: String, match: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁ ÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/ },
    email : {  type: String, unique: true, lowercase: true, match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ },
    password : { type: String },
    address : {
        address1: { type: String },
        address2: { type: String },
        zipcode: { type: String },
        city: { type: String },
    },
    nutriments : {
        type: [{
            name: { type: String },
            value: { type: Number },
        }]
    },
    apiKey: { type: String, unique: true },
    roles: { type: Array, default: ['USER'] },              
    date: { type: Date, default: Date.now }
});