import mongoose, { mongo } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    media: [String],
    category: String,
    collections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection" }],
    tags: [String],
    sizes: [String],
    colors: [String],
    price: {
      type: mongoose.Schema.Types.Decimal128,
      get: (v: mongoose.Schema.Types.Decimal128) =>
        v ? parseFloat(v.toString()) : null,
    },
    expense: {
      type: mongoose.Schema.Types.Decimal128,
      get: (v: mongoose.Schema.Types.Decimal128) =>
        v ? parseFloat(v.toString()) : null,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { toJSON: { getters: true } }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
