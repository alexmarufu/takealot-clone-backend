const mysql = require("mysql")

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "samsungrules",
    database: "takealotclone",
  })
  
  db.connect((error) => {
    if(error) {
      console.log(error);
    } else {
      console.log('Database Connected Successfully!!!');
     }
    
  })

  module.exports = db;