const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    upcCode: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Groceries', 'Dairy', 'Bakery', 'Produce', 'Medicine', 'Cosmetics', 'Pantry'],
      default: 'Groceries',
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for dashboard: user's products sorted by expiry date
productSchema.index({ userId: 1, expiryDate: 1 });

// Text index for searching by title and UPC code
productSchema.index({ title: 'text', upcCode: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
