const Campground = require('../models/campground');
const Review = require('../models/review.js');


module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const foundCampground = await Campground.findById(id);
    
    // destructures the variables that I got from the form submitted by their names given in html file
    const { body, rating } = req.body;
    const newReview = new Review({ body: body, rating: rating });

    newReview.owner = req.user._id;

    // Assosiates the newly created review with the camp that is currently being viewd
    foundCampground.reviews.push(newReview);

    // Saves the data to database because I designed them to be seperate tables
    await newReview.save();
    await foundCampground.save();

    // flashes a message
    req.flash('success', 'Successfully created new review!')

    res.redirect(`/campgrounds/${foundCampground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    // flashes a message
    req.flash('success', 'Successfully deleted review :(')

    res.redirect(`/campgrounds/${id}`);
}