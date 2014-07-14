/*global _:true, T4:true */
(function() {
  "use strict";

  T4.Pen = function() {
    this.size = {};
    this.size[this.X_AXIS] = this.size[this.Y_AXIS] = 1;

    this.position = {};
    this.position[this.X_AXIS] = this.position[this.Y_AXIS] = 0;

    this.weight = 1;
    this.color = 'black';


  };

  T4.Pen.prototype.X_AXIS = 0;

  T4.Pen.prototype.Y_AXIS = 1;

  T4.Pen.prototype._createChild = function(axis, start) {
    return _.clone(this);
  };

  T4.Pen.prototype.positionChild = function(axis, start) {
    var ret = this._createChild();
    ret.position[axis] += start;
    return ret;
  };

  T4.Pen.prototype.sizeChild = function(axis, size) {
    var ret = this._createChild();
    ret.size[axis] *= size;
    return ret;
  };

  T4.Pen.prototype.weightChild = function(weight) {
    var ret = this._createChild();
    ret.weight *= weight;
    return ret;
  };

  T4.Pen.prototype.colorChild = function(color) {
    var ret = this._createChild();
    ret.color = color;
    return ret;
  };

  T4.Pen.prototype.drawX = function(radius) {

  };

  T4.Pen.prototype.drawO = function(radius) {

  };

  T4.Pen.prototype.drawLine = function(axis) {

  };

}());