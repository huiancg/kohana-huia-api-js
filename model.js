'use strict';

var Model = function() {};

Model.options = {
  'url': base_url + 'api/'
};

Model.factory = function(model, id, callback) {
  var self = new Model();
  self.options = _.extend({}, Model.options);
  self._populate(model, id, callback);
  self._reset();
  return self;
};