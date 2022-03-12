const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');


const app = express();


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    fileName: (req, file, cb) => {
        cb(null, uuidv4());
    }
});


const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(bodyParser.json());
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('imageUrl'));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use((error, req, res, next) => {
   console.log(error);
   const status = error.statusCode || 500;
   const message = error.message;
   res.status(status).json({ message: message })
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);


mongoose.connect(
    'mongodb://localhost:27017/blog_dev'
    )
    .then(result => {
        app.listen(8080);
        console.log('Connect success')
    })
    .catch(err => console.log(err));
