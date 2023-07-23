const express = require('express');
// merge params is requiered if the main file router import line looks like this:
// app.use('/campgrounds/:id/reviews', reviews)
// in (/blalba/:id/blabla) the ":id" part is what couses 
// the error so you include "mergeParams: true"
const router = express.Router({ mergeParams: true });

const ExpressError = require('../utilities/expressError');

const catchAsync = require('../utilities/catchAsync');


const Campground = require('../models/campground');
const Review = require('../models/review.js');

const { validateReview, isLoggedIn, isReviewOwner } = require('../middleware')

// controllers
const reviews = require('../controllers/reviews');



router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewOwner, catchAsync(reviews.deleteReview));


module.exports = router;