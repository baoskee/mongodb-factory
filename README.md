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

#### Adding optional arguments to add() function
If you add optional arguments to the add function, the plan extends
your stub to take in those arguments for all the stubs in that 
add clause.

### Cleaning up
Will delete all documents from your database.

```javascript
factory.cleanUp(function (err) {
  if (err) {
    /* handle error */ 
  }
});
```


### Advanced 

#### Dynamic stubs
Arguments defined in stub can be passed into the add() method of factory.
```javascript
var animalStub = new Stub(function (type, name) {
   return {
     type: type || 'mammal',
     name: name || 'Oski'
   }
}, 'animals');

factory.add(100, animalStub, 'reptile').exec(...);
```
