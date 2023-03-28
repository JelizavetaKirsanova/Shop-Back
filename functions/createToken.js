const jwt = require("jsonwebtoken");

function createToken(email) {
    const token = jwt.sign({ data: email }, "secretkey", { expiresIn: "10m" });
    return token;
  }
module.exports = {createToken}
