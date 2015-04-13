'use strict';

var Model = function(options) {
  options || (options = {});
  this.options = _.extend(options, this.options);
  this.initialize.apply(this, arguments);
};

Model.prototype.options = {
  'url': base_url + 'api/'
};

Model.prototype.initialize = function() {};

Model.factory = function(model, id, callback) {
  var self = new Model();
  self._populate(model, id, callback);
  self._reset();
  return self;
};