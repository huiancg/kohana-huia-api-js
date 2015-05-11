'use strict';

var Card = function(options) {
  this.options = _.extend({}, Card.defaults, options);
  if (this.options.callback) {
	this.send(this.options.callback);
  }
  return this;
};

Card.defaults = {
  'url': base_url + 'huia/card',
  'data': {},
  'callback': null
};

Card.factory = function(options) {
  return new Card(options);
};

Card.prototype.send = function(callback) {
  var request = $.post(this.options.url, this.options.data, 'json');
  
  if (callback) {
    request
		.success(function(response) {
		  if (response) {
			return callback(response);
		  }
		  callback(false);
		})
		.error(function(response) {
		  callback(false, response.statusText);
		});
  }
};
'use strict';

var Email = function(options) {
  this.options = _.extend({}, Email.defaults, options);
  if (this.options.callback) {
	this.send(this.options.callback);
  }
  return this;
};

Email.defaults = {
  'url': base_url + 'huia/email',
  'data': {  
	'view': 'view',
	'subject': 'Título',
  },
  'callback': null
};

Email.factory = function(options) {
  return new Email(options);
};

Email.prototype.send = function(callback) {
  var request = $.post(this.options.url, this.options.data);
  
  if (callback) {
    request
		.success(function(response) {
		  if (response && JSON.parse(response).success) {
			return callback(true);
		  }
		  callback(false, 'cant send');
		})
		.error(function(response) {
		  callback(false, response.statusText);
		});
  }
};

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
'use strict';

// helpers

Model.prototype._reset = function()
{
  this._query = [];
  this._count_all = false;
  this._offset = null;
  this._limit = 0;
  this._first = false;
};

Model.prototype._query_builder = function()
{
  var query = this._query;

  if (this._offset)
  {
    query.push(['offset', this._offset]);
  }

  if (this._limit)
  {
    query.push(['limit', this._limit]);
  }

  return query;
};

Model.prototype._populate = function(model, id, callback)
{
  var self = this;

  var Model = Backbone.Model.extend({});

  var Collection =  Backbone.Collection.extend({
    url: function() {
      return self.options.url + model;
    }
  });

  self._collection = new Collection();

  if (id)
  {
    self.where('id', '=', id).find(callback);
  }
};
'use strict';

Model.prototype.where = function(key, operator, value) {
  this._query.push(['where', key, operator, value]);
  return this;
};

Model.prototype.or = function(key, operator, value) {
  this._query.push(['or', key, operator, value]);
  return this;
};

Model.prototype.where_open = function() {
  this._query.push(['where_open']);
  return this;
};

Model.prototype.where_close = function() {
  this._query.push(['where_close']);
  return this;
};

Model.prototype.limit = function(value) {
  this._limit = value;
  return this;
};

Model.prototype.offset = function(value) {
  this._offset = value;
  return this;
};

Model.prototype.order_by = function(field, direction) {
  direction = (direction) ? direction : 'ASC';
  this._query.push(['order_by', field, direction]);
  return this;
};

Model.prototype.group_by = function(field) {
  this._query.push(['group_by', field]);
  return this;
};

Model.prototype.sum = function(field, name) {
  this._query.push(['sum', field, (name) ? name : null]);
  return this;
};