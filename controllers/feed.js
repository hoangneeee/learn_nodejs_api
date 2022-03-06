const { validationResult } = require('express-validator/check');

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
        return res.status(422).json({ message: 'Validation failed', errors: errors.array()})
    }
    const title = req.body.title;
    const content = req.body.content;
    // Create post in Db
    res.status(201).json({
        message: 'Successfully!',
        post: {
            _id: new Date().toISOString(),
            title: title,
            content: content,
            creator: {
                name: 'Vo Hoang'
            },
            createdAt: new Date()
        }
    });
};