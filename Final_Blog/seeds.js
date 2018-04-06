var mongoose = require("mongoose");
var Blog = require("./models/blog");
var Comment = require("./models/comment");

var data = [
    {
        title: "Blog 1",
        image: "https://images.unsplash.com/photo-1522092787785-60123fde65c4?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=94d6ebf03fdc6a3c8159ac9aeceb0483&auto=format&fit=crop&w=500&q=60",
        body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        date:  Date()
    },
    {
        title: "Blog 2",
        image: "https://images.unsplash.com/photo-1517462889167-adbd2e3dd095?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=03094b083fdf716ef93d491579bc7d74&auto=format&fit=crop&w=500&q=60",
        body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        date:  Date()
    },
    {
        title: "Blog 3",
        image: "https://images.unsplash.com/photo-1517537599369-d8e0ad02789f?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b93f553f7d033fd81cb76510a30060e1&auto=format&fit=crop&w=500&q=60",
        body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        date:  Date()
    },
    {
        title: "Blog 4",
        image: "https://images.unsplash.com/photo-1514908723567-37415a284929?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=3855548616ada871417bd6ad7f6c66c0&auto=format&fit=crop&w=500&q=60",
        body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        date:  Date()
    }
]

function seedDB() {
    //Remove all blogs
    Blog.remove({}, function (err) {
        if(err){
            console.log(err);
        }
        console.log("remove blogs");
        //add a few blogs
        data.forEach(function (seed) {
            Blog.create(seed, function (err, blog) {
                if(err){
                    console.log(err)
                } else {
                    console.log("added a blog");
                    //create a comment
                    Comment.create(
                        {
                            text: "Awesome ambience. Loved it!!",
                            author: "Taler",
                            timestamp: Date()
                        }, function (err, comment) {
                            if(err) {
                                console.log(err);
                            } else {
                                blog.comments.push(comment);
                                blog.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    });
}

module.exports = seedDB;