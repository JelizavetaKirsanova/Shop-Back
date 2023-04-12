const dbserices = require("../db.js");
const db = dbserices.createDbConnection();

async function checkUserDb(email) {
  return new Promise((resolve, reject) => {
    let users = [];
  
    db.each(
      `SELECT * FROM users WHERE email == (?)`,
      [email],
      function (error, row) {
        if (error) {
          console.error(error.message);
          reject(error);
        }
        users.push(row);
      },
      function (error, count){
        if (error) {
          console.error(error.message);
          reject(error);
        }
        resolve(count > 0);
      }
    );
  });
}

exports.checkUserDb = checkUserDb;