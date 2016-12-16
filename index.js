var mongoFactory = require('./lib/factory');

/**
 * Expose components of factory as reusable parts.
 * @type {Stub}
 * @type {Order}
 */
mongoFactory.Stub = require('./lib/stub');
mongoFactory.Order = require('./lib/order');

module.exports = mongoFactory;
