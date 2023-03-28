const jwt = require("jsonwebtoken");

function checkToken(token) {
    let t = ""
    for(let coockie of token.split(" ")){
      if(coockie.slice(0,5) == "token"){
        t = coockie.slice(6)
      }
    }
  const email = jwt.verify(t, "secretkey")
  /*if (!checkUserDb(email)) {
    throw new Error("Incorrect email");
  } else {
    console.log("Ok");
  }*/
  return email;
}

module.exports = {checkToken}