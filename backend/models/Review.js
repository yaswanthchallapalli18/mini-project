const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true, // Only one review per booking
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please select a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment for your service experience'],
      trim: true,
    },
  },
  { timestamps: true }
);

// Static method to calculate and update provider average rating
ReviewSchema.statics.getAverageRating = async function (providerId) {
  const stats = await this.aggregate([
    { $match: { provider: providerId } },
    {
      $group: {
        _id: '$provider',
        nRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    if (stats.length > 0) {
      await mongoose.model('Provider').findByIdAndUpdate(providerId, {
        averageRating: Math.round(stats[0].avgRating * 10) / 10,
      });
    } else {
      await mongoose.model('Provider').findByIdAndUpdate(providerId, {
        averageRating: 0,
      });
    }
  } catch (err) {
    console.error(`Error calculating average rating: ${err}`);
  }
};

// Call getAverageRating after save
ReviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.provider);
});

module.exports = mongoose.model('Review', ReviewSchema, 'hsb_reviews');
