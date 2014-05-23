var easymongo = require('easymongo');
var bcrypt = require('bcrypt-nodejs');

var mongo = new easymongo({dbname: 'testDB'}); //intraDB
var accounts = mongo.collection('accounts');

var salt = '$2a$10$pjhXPB4PWJok4u8BYw8jLu'; //bcrypt.genSaltSync(10);
// console.log(salt);

function encode (data) {
  return (bcrypt.hashSync(data, salt));
};

hash = encode('yoann');

console.log(hash);

console.log(bcrypt.compareSync('yoann', hash));

//Insert admin account
//accounts.save({login: 'admin', password: 'admin', dateOfCreation: Date.now(), accessRights: 5});
/*
accounts.save(data, function (err, res) {
  console.log(res);
});*/

/*accounts.find({login: 'Admin'}, function (err, res) {
  console.log(res);
});*/
/*accounts.find({name: 'Alexey'}, {limit: 2}, function(error, results) {
  // Always return array of documents.
  console.log(results);
});

accounts.findById('4e4e1638c85e808431000003', function(error, results) {
  // Returns a document (object). If error occur then returns false.
  console.log(results);
});

accounts.count({name: 'Alexey'}, function(error, results) {
  // Amount (int). If error occur then returns zero.
  console.log(results);
});

accounts.remove({name: 'Alexey'}, function(error, results) {
  // Returns a result of operation (boolean). If error occur then returns false.
  console.log(results);
});

accounts.removeById('4e4e1638c85e808431000003', function(error, results) {
  // Returns a result of operation (boolean). If error occur then returns false.
  console.log(results);
});*/
