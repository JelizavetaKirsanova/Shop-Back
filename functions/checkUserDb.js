function checkUserDb(email) {
    let users = [];
  
    db.each(
      `SELECT * FROM users WHERE email == (?)`,
      [email],
      function (error, row) {
        if (error) {
          console.error(error.message);
        }
        users.push(row);
      }
    );
    console.log(users)
    if(users.length == 0) return false
    return true;
}

exports.checkUserDb = checkUserDb