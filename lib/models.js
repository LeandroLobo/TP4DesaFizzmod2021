import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const productoSchema = new Schema({
    name: String,
    price: Number,
    desc: String,
    url: String
});
const product = mongoose.model('products', productoSchema);

export default {product};