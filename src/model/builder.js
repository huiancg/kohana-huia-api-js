'use strict';

Model.prototype.save = function(object, callback) {
	this._first = (object.constructor === Object);
	return this.execute(callback, 'POST', object);
};

Model.prototype.find = function(callback) {
	this._first = true;
  return this.limit(1).execute(callback);
};

Model.prototype.find_all = function(callback)
{
  return this.execute(callback);
};

Model.prototype.count_all = function(callback)
{
  this._count_all = true;
  return this.execute(callback);
};

Model.prototype.execute = function(callback, method, object)
{
  var self = this;
  method || (method = 'GET');

  var data = {
    '_method': method,
    '_query': self._query_builder()
  };

  if (object) {
  	// accept Backbone Model
  	if (object.constructor === Function && object.attributes) {
  		object = object.attributes;
  	}
  	data = $.extend(data, object);
  }

  if (self._count_all) {
    data._count_all = true;
  }
  
  self._collection.fetch({data: data, type: 'POST'})
    .success(function(response){
    	if (response && response.errors) {
    		callback(null, response.errors);
    	}
      else if (self._count_all) {
        callback(response);
      } else {
      	var models = self._collection.models;
      	if (self._first) {
      		models = (models[0]) ? models[0] : null;
      	}
        callback(models);
      }
      self._reset();
    })
    .error(function(error, status){
      callback(null, [{'internal': error.statusText}]);
      self._reset();
    });

  return self;
};