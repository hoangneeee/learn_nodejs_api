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
    const title = req.body.title;
    const content = req.body.content;
    // Create post in Db
    res.status(201).json({
        message: 'Successfully!',
        post: {id: new Date().toISOString(), title: title, content: content}
    });
};