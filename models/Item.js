const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    itemName:{
        type: String,
        required: true
    },
    userId:{
        type: String,
        required: true
    },
    itemStyle:{
        type: String,
        required: true
    }
});

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;