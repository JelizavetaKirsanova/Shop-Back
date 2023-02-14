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
            selectRows()
        }
    );
    
    res.send({ status: "ok" });
});

app.post("/log", (req, res) => {
    console.log(req.body);
    res.send({ status: "ok" });
});

app.listen(3000, () => {
    console.log("server started");
});








app.post("/log", (req, res) => {
    user_password = db.each(
        `SELECT password FROM users WHERE email == (?)`,
        [req.body.email],
        function (error) {
            if (error) {
                console.error(error.message);
            }
            console.log(`Inserted a row with the ID: ${this.lastID}`);
            selectRows()
        }
    );
    
    res.send({ status: "ok" });
});