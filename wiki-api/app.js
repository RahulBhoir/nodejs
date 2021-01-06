const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');


const app = express();
app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});
const articleSchema = mongoose.Schema({
    title:String,
    content: String
});

const Article = mongoose.model('article', articleSchema);

app.listen(3000,function(){
    console.log('server is running at port 3000');
});

///////////////////////////////////////////////THIS IS FOR ALL ARTICLE////////////////////////////////////////
app.route('/articles')

.get(function(req,res){
    Article.find({},function(err,foundArticles){
        if(!err){
            res.send(foundArticles);
        }
        else{
            res.send(err);
        }
    });
})

.post(function(req,res){
    const articleTitle = req.body.title;
    const articleContent = req.body.content;

    const newArticle = new Article({
        title: articleTitle,
        content: articleContent
    });
    newArticle.save(function(err){
        if(!err){
            res.send('successfully added article to the DB');
        }
        else{
            res.send(err);
        }
    });
})

.delete(function(req,res){
    Article.deleteMany({}, function(err){
        if(!err){
            res.send('successfully deleted the data');
        }
        else{
            res.send(err);
        }
    });
});

///////////////////////////////////////////////THIS IS FOR ONE ARTICLE////////////////////////////////////////

app.route('/articles/:articleTitle')

.get(function(req,res){
    let title = req.params.articleTitle;
    Article.findOne({title: title}, function(err,foundArticle){
        if(!err){
            if(foundArticle){
                res.send(foundArticle);
            }else{
                res.send('No article found');
            }
        }else{
            res.send(err);
        }
    })
})
// put is use when we have to replace complete specific document
.put(function(req,res){
    Article.update(
        {title: req.params.articleTitle},
        {title:req.body.title, content:req.body.content},
        {overwrite:true},
        function(err){
            if(!err){
                res.send('successfully updated the data');
            }else{
                res.send(err);
            }
        })
})

// patch is use when we have to replace a part of a specific document
.patch(function(req,res){
    Article.update(
        {title:req.params.articleTitle},
        {$set: {title: req.body.title}},
        function(err){
            if(!err){
                res.send('successfully updated the data');
            }
            else{
                res.send(err);
            }
        });
})

.delete(function(req,res){
    Article.deleteOne({title:req.params.articleTitle}, function(err){
        if(!err){
            res.send('successfully updated the data');
        }
        else{
            res.send(err);
        }
    });
});