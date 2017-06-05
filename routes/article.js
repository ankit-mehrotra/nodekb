const express = require("express");
const router = express.Router();

let Articles = require("../models/article");
//Add Route
router.get("/add",function(req,res){
  res.render("add_article",{
    title:"New Article"
  });
});
router.get("/:id",function(req,res){
  Articles.findById(req.params.id,function(error,article){
    res.render("articles",{
      title:"Get Article",
      article:article
    });
});
});
router.post("/add",function(req,res){
req.checkBody('title','Title is required').notEmpty();
req.checkBody('author','Author is required').notEmpty();
req.checkBody('body','Body is required').notEmpty();

let errors = req.validationErrors();
if(errors){
  res.render("add_Article",{
    title:'Add Article',
    errors:errors
  });
}else{

    let article = new Articles();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err){
      if(err){
          console.log(err);
          return;
      }else{
        req.flash("success",'Article Added');
        res.redirect('/');
      }

    })
}

});
//load Edit form
router.get("/edit/:id",function(req,res){
  Articles.findById(req.params.id,function(error,article){
    res.render("edit_article",{
      article:article
    });
});
});
//App Delete

router.delete("/:id",function(req,res){
  let query = {_id:req.params.id}

  Articles.remove(query,function(err){
    if(err){
      console.log(err);
    }
    req.flash("danger","Deleted Successfully");
    res.send("Success");
  });
});
//Post Edit Submit

router.post("/edit/:id",function(req,res){
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;
  let query = {_id:req.params.id}
  Articles.update(query,article,function(err){
    if(err){
        console.log(err);
        return;
    }else{
      req.flash("danger","Article updated");
      res.redirect('/');
    }

  })
});
module.exports = router;
