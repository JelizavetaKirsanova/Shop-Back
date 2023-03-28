function selectRows() {
    db.each(`SELECT * FROM users`, (error, row) => {
      if (error) {
        throw new Error(error.message);
      }
      console.log(row);
    });
}

exports.selectRows = selectRows