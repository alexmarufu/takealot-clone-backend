const mysql = require("mysql")

const db = mysql.createConnection({
    user: "",
    host: "localhost",
    password: "",
    database: "",
  })
  
  db.connect((error) => {
    if(error) {
      console.log(error);
    } else {
      console.log('Database Connected Successfully!!!');
     }
    
  })

  module.exports = db;
