const express =  require('express');
const app = express();

//configure dotenv
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 5000;
const host = process.env.host;

const bodyParser = require('body-parser');  // To Parse incoming requests
const mongoose = require('mongoose');
const Validation = require('./Routes/Validation');

// Connect to DB
mongoose.connect(`mongodb+srv://rhino11:${process.env.DB_PASSWORD}@cluster0.opwfn.mongodb.net/<dbname>?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, console.log("Connected to DB"));

mongoose.set('useCreateIndex', true)

// Update DB 
const DbUpdater = require('./configuration/DbUpdater');
const { async } = require('validate.js');

// Apply Rate limit
const rateLimit = require('express-rate-limit');

// Set the Rate Limit
const limiter = rateLimit({
    windowMs: 1000 * 60 * 60 * 24, // 24 hours
    max: 500,
    message: "Too many requests from this IP, try after 24 hour"
});
app.use(limiter);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.listen(port, () => console.log("Server up & running on port" + port));

// API Requests
// 1. LongUrl -> ShortUrl.
app.post('/url', async (req, res) => {
    try {
        if(!!Validation.validateUrl(req.body.url)) {

            return res.status(400).send({ msg: 'Wrong URL'});
        }

        const key = Validation.generatekey();

        // Checking and resolving condition of collision
        const result = DbUpdater.find(key);
        while(key == result.shorturlId) {
            key = Validation.generatekey();
            DbUpdater.find(key);
        }

        // Creating and updating Short Url in DB
        const shortUrl = `http://${host}:${port}/${key}`;

        await DbUpdater.save(req.body.url, shortUrl, key);
        return res.status(200).send({ shortUrl });

    } catch(err) {
        return res.status(500).send({ msg: "Something Went Wrong"});
    }
});

// 2. Redirection of LongUrl -> shortUrl.
app.get("/:shorturlId", async(req, res) => {
    try{
        const url = await DbUpdater.find(req.params.shorturlId);
        return !url ? res.status(404).send("Not found!") : res.redirect(301, url.Longurl)
    } catch(error) {
        res.status(500).send("OOPs Something is wrong");
    }
})


