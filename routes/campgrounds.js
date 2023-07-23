const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });



// utils
const catchAsync = require('../utilities/catchAsync');


// models
const Campground = require('../models/campground');


// schemas
const { campgroundSchema } = require('../schemas.js');

// middleware
const { isLoggedIn, validateCampground, isOwner } = require('../middleware')

// controllers
const campgrounds = require('../controllers/campgrounds');
// campgrounds.index is a controller in from controllers file

router.route('/')
    .get(catchAsync(campgrounds.index))
    // upload.array('image') image is what is the name of the html form input value
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));
    // .post(upload.array('image'), (req, res) => {
    //     res.send(req.body);
    // })

router.get('/new', isLoggedIn, campgrounds.renderNewForm);


router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isOwner, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isOwner, catchAsync(campgrounds.deleteCampground))


router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(campgrounds.renderEditForm));


module.exports = router;