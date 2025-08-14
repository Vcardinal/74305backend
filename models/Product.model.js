import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

productSchema.plugin(mongoosePaginate);

export const ProductModel = mongoose.model('Product', productSchema);

