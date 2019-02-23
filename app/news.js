const express = require("express");
const multer = require("multer");
const path = require("path");
const nanoid = require("nanoid");

const config = require("../config");
const News = require("../models/News");

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
    News.find({}, {content: 0})
        .then( results => res.send(results))
        .catch(e => res.send(e).status(500))
});

router.get("/:id", (req, res) => {
    News.find({"_id": req.params.id})
        .then( results => res.send(results))
        .catch(e => res.send(e).status(500))
});

router.post("/", auth, upload.single("photo"), async  (req, res) => {

    const data = req.body;

    if (req.file) data.image = req.file.filename;

    if (!data.title || !data.content){
        res.status(400).send("no data");
        return;
    }

    const news = new News(data);
    news.save()
        .then((result) => res.send(result))
        .catch(error => res.status(400).send(error));

});

router.delete("/:id", [auth, permit('admin')], (req, res) => {

    News.deleteOne({_id: req.params.id})
        .then(result => res.send(result))
        .catch((e) => res.send(e).status(500));
});

module.exports = router;