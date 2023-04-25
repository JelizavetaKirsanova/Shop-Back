const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require('fs');
const uid = require('uid')
const path = require('path');
const fsA = require("fs/promises");
const app = express();
const bodyParser = require("body-parser");
const dbserices = require("./db.js");
const db = dbserices.createDbConnection();
const { checkToken } = require("./functions/checkToken");
const { createToken } = require("./functions/createToken");


app.use('/public', express.static(__dirname + '/public/'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send({ message: "hi" });
});


var storage = multer.diskStorage({

    destination: "./public",
    filename: async function (req, file, cb) {
        console.log("00000000000000000000")
        let orFN = file.originalname
        let category = req.body.category
        let id = req.body.id
        console.log(category)
        console.log(id)
        const dir = `./public/${category}/${id}`
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        
        cb(null, `${dir}/${uid(16)}${orFN.slice(orFN.lastIndexOf('.'))}`)

        console.log( `${dir}/${uid(16)}${orFN.slice(orFN.lastIndexOf('.'))}`)
    }
})



var upload = multer({ storage: storage }).array('file');

app.post('/upload',function(req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        return res.status(200).send(req.file)
    })

});

app.post("/checkToken", async (req, res) => {
    try {
        console.log(await checkToken(req.body.token));
        res.send({ status: "ok" });
    } catch (e) {
        console.log(e);
        res.send({ status: "tokenExpired", error: e });
    }
});

app.post("/categories", async (req, res) => {
    try {
        console.log(await checkToken(req.body.token));
        let categories = [];
        db.each(
            `SELECT DISTINCT category FROM goods`,
            [req.body.category],
            function (error, row) {
                if (error) {
                    console.error(error.message);
                }
                categories.push(row);
            },
            function (error, count) {
                res.send({ status: "ok", categories: categories });
            }
        );
    } catch (e) {
        console.log(e);
        res.send({ status: "tokenExpired", error: e });
    }
});

app.post("/goods", async (req, res) => {
    try {
        console.log(await checkToken(req.body.token));
        let goods = [];
        db.each(
            `SELECT * FROM goods WHERE category == (?)`,
            [req.body.category],
            function (error, row) {
                if (error) {
                    console.error(error.message);
                }
                goods.push(row);
            },
            function (error, count) {
                res.send({ status: "ok", goods: goods });
            }
        );
    } catch (e) {
        console.log(e);
        res.send({ status: "tokenExpired", error: e });
    }
});


app.post("/good", async (req, res) => {
    try {
        console.log(await checkToken(req.body.token));
        let good = {};
        db.each(
            `SELECT * FROM goods WHERE id == (?)`,
            [req.body.id],
            function (error, row) {
                if (error) {
                    console.error(error.message);
                }
                good = row;
            },
            function (error, count) {
                if(count > 0){
                    res.send({ status: "ok", good: good });
                }
                    
            }
        );
    } catch (e) {
        console.log(e);
        res.send({ status: "tokenExpired", error: e });
    }
});

app.post("/addGood", async (req, res) => {
    try {
        const email = await checkToken(req.body.token);
        let users = [];
        db.each(
            `SELECT * FROM users WHERE email == (?)`,
            [email],
            function (error, row) {
                if (error) {
                    console.error(error.message);
                }
                users.push(row);
            },
            function (error, count) {
                db.run(
                    `INSERT INTO goods (title, description, price, category, userId) VALUES (?, ?, ?, ?, ?)`,
                    [
                        req.body.title,
                        req.body.description,
                        req.body.price,
                        req.body.category,
                        users[0],
                    ],
                    function (error) {
                        if (error) {
                            console.error(error.message);
                        }
                        console.log(
                            `Inserted a row with the ID: ${this.lastID}`
                        );
                        res.send({
                            status: "ok",
                            id : this.lastID
                        });
                    }
                );
            }
        );
    } catch (e) {
        console.log(e);
        res.send({ status: "tokenExpired", error: e });
    }
});

app.post("/reg", (req, res) => {
    let users = [];
    db.each(
        `SELECT * FROM users WHERE email == (?)`,
        [req.body.email],
        function (error, row) {
            if (error) {
                console.error(error.message);
            }
            users.push(row);
        },
        function (error, count) {
            if (count > 0) {
                res.status(400).send("f");
            } else {
                db.run(
                    `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
                    [req.body.name, req.body.email, req.body.password],
                    function (error) {
                        if (error) {
                            console.error(error.message);
                        }
                        console.log(
                            `Inserted a row with the ID: ${this.lastID}`
                        );
                        res.send({
                            status: "ok",
                            token: createToken(req.body.email),
                        });
                    }
                );
            }
        }
    );
});

app.post("/reg", (req, res) => {
    let users = [];
    db.each(
        `SELECT * FROM users WHERE email == (?)`,
        [req.body.email],
        function (error, row) {
            if (error) {
                console.error(error.message);
            }
            users.push(row);
        },
        function (error, count) {
            if (count > 0) {
                res.status(400).send("f");
            } else {
                db.run(
                    `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
                    [req.body.name, req.body.email, req.body.password],
                    function (error) {
                        if (error) {
                            console.error(error.message);
                        }
                        console.log(
                            `Inserted a row with the ID: ${this.lastID}`
                        );
                        res.send({
                            status: "ok",
                            token: createToken(req.body.email),
                        });
                    }
                );
            }
        }
    );
});

app.post("/log", (req, res) => {
    let users = [];
    db.each(
        `SELECT * FROM users WHERE email == (?) AND password == (?)`,
        [req.body.email, req.body.password],
        function (error, row) {
            if (error) {
                console.error(error.message);
            }
            console.log(row);
            users.push(row);
        },
        function (error, count) {
            if (count > 0) {
                res.send({ status: "ok", token: createToken(req.body.email) });
            } else {
                res.status(404).send(error.message);
            }
        }
    );
});

app.listen(3000, () => {
    console.log("server started");
});
