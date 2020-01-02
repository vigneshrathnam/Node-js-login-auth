var Datastore = require('nedb')
  , db = new Datastore({ filename: './db/users.db', autoload: true });

module.exports=db;
