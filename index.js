const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dbserices = require("./db.js");

const db = dbserices.createDbConnection();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send({ message: "hi" });
});

function selectRows() {
    db.each(`SELECT * FROM users`, (error, row) => {
        if (error) {
            throw new Error(error.message);
        }
        console.log(row);
    });
}

app.post("/reg", (req, res) => {
    db.run(
        `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
        [req.body.name, req.body.email, req.body.password],
        function (error) {
            if (error) {
                console.error(error.message);
            }
            console.log(`Inserted a row with the ID: ${this.lastID}`);
            selectRows();
        }
    );

    res.send({ status: "ok" });
});

app.post("/log", (req, res) => {
    db.each(
        `SELECT * FROM users WHERE email == (?) AND password == (?)`,
        [req.body.email, req.body.password],
        function (error, row) {
            if (error) {
                console.error(error.message);
            }
            console.log(row);
            users.push(row)
        },
        function (error, count){
            if (count > 0) {
                res.send({ status: "ok", user: users.at(0) });
            } else {
                res.status(404).send(error.message);
            }
        
        }
    )
  
        
});

app.listen(3000, () => {
    console.log("server started");
});
