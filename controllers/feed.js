const { validationResult } = require('express-validator/check');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{
            _id: '1',
            title: 'First Post', 
            content: 'This is the first post', 
            imagesUrl: 'images/    django.png',
            creator: {
                name: 'Hoang'
            },
            createdAt: new Date()
        }]
    });
};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 442;
        throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    // Create post in Db
    const post = new Post({
        title: title,
        imageUrl: 'images/django.png',
        content: content,
        creator: { name: 'Hoang' }
    });
    post.save().then(result => {
        console.log(result);
        res.status(201).json({
        message: 'Successfully!',
        post: result
    });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        throw err;
    });

};