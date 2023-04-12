const jwt = require("jsonwebtoken");

function createToken(email) {
    const token = jwt.sign({ data: email }, "secretkey", { expiresIn: "1d" });
    return token;
  }
module.exports = {createToken}
