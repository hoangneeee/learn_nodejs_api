const fs = require('fs');
const path = require('path');
const {validationResult} = require('express-validator/check');

const Post = require('../models/post');


exports.getPosts = (req, res, next) => {
    Post.find()
        .then(posts => {
            res.status(200).json({message: 'Fetched posts successfully', posts: posts});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};


exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 442;
        throw error;
    }
    if (!req.file) {
        const error = new Error('No image provided');
        error.statusCode = 442;
        throw error;
    }
    const imageUrl = req.file.path.replace("\\", "/");
    const title = req.body.title;
    const content = req.body.content;
    // Create post in Db
    const post = new Post({
        title: title,
        imageUrl: imageUrl,
        content: content,
        creator: {name: 'Hoang'}
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
        next(err);
    });
};


exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Could not find post.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({message: 'Post fetched.', post: post});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};


exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 442;
        throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.imageUrl;

    if (req.file) {
        imageUrl = req.file.path.replace("\\", "/");
    }

    if (!imageUrl) {
        const error = new Error('No file picked.');
        error.statusCode = 422;
        throw error;
    }
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Could not find post.');
                error.statusCode = 404;
                throw error;
            }
            if (imageUrl !== post.imageUrl) {
                clearImage(post.imageUrl);
            }
            post.title = title;
            post.content = content;
            post.imageUrl = imageUrl;
            return post.save();
        })
        .then(result => {
            res.status(200).json({ message: 'Post updated!', post: result })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};


const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};


exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Could not find post.');
                error.statusCode = 404;
                throw error;
            }
            // Check logged in user
            clearImage(post.imageUrl);
            return Post.findByIdAndRemove(postId);
        })
        .then(result => {
            console.log(result)
            res.status(200).json({ message: 'Deleted Post'})
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
    });
}