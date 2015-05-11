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