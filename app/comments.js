const express = require("express");
const multer = require("multer");
const path = require("path");
const nanoid = require("nanoid");

const config = require("../config");
const Comments = require("../models/Comment");

const auth = require("../middlewares/auth");
const permit = require("../middlewares/permit");

const storage = multer.diskStorage({
    destination(req, file, cd){
        cd(null, config.uploadPath)
    },
    filename(req, file, cd){
        cd(null, nanoid() + path.extname(file.originalname))
    }
});

const upload = multer({storage});

const router = express.Router();

router.get("/", (req, res) => {
    if(req.query.news_id){
        console.log(req.query.news_id);
        Comments.find({newsId: req.query.news_id})
            .then( results => res.send(results))
            .catch(e => res.send(e).status(500))

    }
    else{
    Comments.find({})
        .then( results => res.send(results))
        .catch(e => res.send(e).status(500))
    }
});


router.post("/", auth, upload.none(), async  (req, res) => {

    const data = req.body;



    if (!data.newsId){
        res.status(400).send("no data");
        return;
    }

    const comments = new Comments(data);
    comments.save()
        .then((result) => res.send(result))
        .catch(error => res.status(400).send(error));

});

router.delete("/:id", [auth, permit('admin')], (req, res) => {
    console.log(req.params.id);
    Comments.deleteOne({_id: req.params.id})
        .then(result => res.send(result))
        .catch((e) => res.send(e).status(500));
});

module.exports = router;