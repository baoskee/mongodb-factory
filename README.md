# mongodb-factory

Test factory for mongoDB injections.


## Getting Started
Getting the Factory constructor object. 

```javascript
var Factory = require('mongodb-factory');
```

### Creating stubs
The argument is a function for possible creation of dynamically 
generated stubs.

```javascript
var Stub = Factory.Stub;
/**
 * faker is a library for generating fake data 
 * https://www.npmjs.com/package/faker 
 */
var faker = require('faker'); 
var userStub = new Stub(function () {
    username: faker.internet.username(),
    password: faker.internet.password()
}, 'users'); 
```

### Executing plans
```javascript
var MONGO_URI = 'mongodb://localhost/test';
var factory = new Factory(MONGO_URI);

factory.add(300, userStub)
    .add(200, animalStub)
    .exec(function (err, docs) { // docs an array of all inserted documents
        if (err) { 
          // handle error  
        }
    });
```

### Getting the database object
For application actions that require insertions to MongoDB, having 
a database getter can be handy for quick lookups to check they
were actually inserted.

```javascript
factory.getDB(function (err, db) {
    if (err) throw err;
    // do something with the db object
});
```

### Cleaning up
Will delete all documents from your database.

```javascript
factory.cleanUp(function (err) {
  if (err)
    /* handle error */ 
  else 
    /* do some maintenance */
});
```

## Advanced 

### Dynamic stubs
Arguments defined in stub will be passed into the add() method of factory.

```javascript
var animalStub = new Stub(function (type, name) {
   return {
     type: type || 'mammal',
     name: name || 'Oski'
   }
}, 'animals');

factory.add(1, animalStub, 'reptile', 'Bob')
    .add(1, animalStub, 'bear')
    .exec(...);
```

### Adding collections to remove all documents from
```javascript
factory.collections.push('otherCollection');
// now it will delete all documents from 'otherCollection' also
factory.cleanup(function (err) {...}); 
```

