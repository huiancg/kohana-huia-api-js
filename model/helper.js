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