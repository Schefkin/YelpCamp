const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new.ejs')
}

// this
module.exports.createCampground = async (req, res, next) => {

    const campground = new Campground(req.body);

    campground.image = req.files.map(f => ({ url: f.path, filename: f.filename }));

    campground.owner = req.user._id;

    await campground.save();

    console.log(campground.image);

    req.flash('success', 'Successfully made a new campground!');


    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        // nested populate to get the owner of each review
        // populates the owner of a review
        path: 'reviews',
        populate: {
            path: 'owner'
        }
        // populates owner of the entire campground poster
    }).populate('owner');
    // handles error when campground is not found after it was deleted 
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show.ejs', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id)

    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }


    res.render('campgrounds/edit.ejs', { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body)
    // I have to do it the long way because in ES6 objects are not spreadable
    const campground = await Campground.findByIdAndUpdate(id, { title: req.body.title, location: req.body.location, image: req.body.image, price: req.body.price, description: req.body.description });

    // makes imgs variable that's an array
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));

    // adds image
    campground.image.push(...imgs);
    await campground.save();

    // to delete a certain image (pull from the images array of a current campground)
    // where filename is in the query form submitted
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
       await campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } });
    }
    

    // flashes the message under name "success"
    req.flash('success', 'Successfully updated campground!');

    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);

    // flashes a message
    req.flash('success', 'Successfully deleted campground :(')

    res.redirect('/campgrounds');
}