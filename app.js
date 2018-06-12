const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');

const app = express();
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://39.105.81.51:27017/vue-blog');
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once("open", function(callback){
    console.log("Connection Succeeded");
});

app.post('/blogs', (req, res) => {
    let db = req.db;
    let title = req.body.title;
    let content = req.body.content;
    let description = req.body.description;
    let new_blog = new Blog({
        title:title,
        content:content,
        description:description
    })

    new_blog.save(function(error){
        if(error){
            console.log(error);
        }
        res.send({
            success: true,
            message: 'Post saved successfully!'
        });
    })
})

app.get('/blogs', (req,res) => {
    Blog.find({}, 'title content description', function(error, blogs){
        if(error){console.error(error)}
        res.send({
            blogs:blogs
        });
    }).sort({_id:-1})
})

app.get('/blog/:id', (req,res) => {
    let db = req.db;
    Blog.findById(req.params.id, 'title content description', function(error, blog){
        if(error){ console.error(error)}
        res.send(blog)
    })
})

app.put('/blogs/:id', (req,res) => {
    let db = req.db;
    Blog.findById(req.params.id, 'title content description', function(error, blogs){
        if(error){ console.error(error);}
        blogs.title = req.body.title;
        blogs.content = req.body.title;
        blogs.description = req.body.description;

        blogs.save(function(error){
            if(error){
                console.log(error)
            }
            res.send({
                success: true
            })
        })
    })
})

app.delete('/blogs/:id', (req, res) => {
    let db = req.db;
    Blog.remove({
        _id: req.params.id
    }, function(err, blog){
        if(err){
            res.send(err);
        }
        res.send({
            success: true
        })
    })
})

app.listen(8081);