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