const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SubcategorySchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
});

const Subcategory = mongoose.model('Subcategory', SubcategorySchema);
module.exports = Subcategory;
