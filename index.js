var mongoFactory = require('./lib/factory');

// Expose the Stub constructor.
mongoFactory.Stub = require('./lib/stub');

module.exports = mongoFactory;
