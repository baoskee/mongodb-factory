# mongodb-factory

Test factory for mongoDB injections.


## Getting Started
```javascript
var MONGO_URI = 'mongodb://localhost/test'
var factory = require('mongodb-factory')(MONGO_URI)
```

### Creating stubs
The argument is a function for possible creation of dynamically 
generated stubs.
```javascript
var Stub = require('mongodb-factory').Stub;
var faker = require('faker')
var userStub = new Stub(function () {
    username: faker.internet.username(),
    password: faker.internet.password()
}); 
```

### Executing plans
```javascript
var MONGO_URI = 'mongodb://localhost/test'
var Factory = require('mongodb-factory');
var factory = new Factory(MONGO_URI);

factory.add(300, userStub)
    .add(200, animalStub)
    .exec(function (err) {
        if (err) { /* handle error */ }
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

### Internals
#### Inside Orders
Orders are internal representations for factory plans to have chained 
methods like add(). The Order class should not be too heavy, only
serves as plural form for the generation of previously defined stubs.
