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
  var request = $.post(this.options.url, this.options.data, 'json');
  
  if (callback) {
    request
		.success(function(response) {
		  if (response && response.success) {
			return callback(true);
		  }
		  callback(false, 'cant send');
		})
		.error(function(response) {
		  callback(false, response.statusText);
		});
  }
};