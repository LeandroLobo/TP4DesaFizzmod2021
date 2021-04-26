import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: String,
    price: Number,
    desc: String,
    url: String
});
const product = mongoose.model('productos', productSchema);

export default {product};