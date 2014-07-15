/*global _:true, T4:true */
(function() {
  "use strict";

  T4.Pen = function(canvas) {
    this.canvas = canvas;

    var width = this.canvas.width();
    var height = this.canvas.height();

    this.ctx = this.canvas[0].getContext('2d');

    this.ctx.scale(width, height);

    this.pixel = 1 / width;

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

  T4.Pen.prototype.clear = function() {

  };

  T4.Pen.prototype.on = function() {

  };

  T4.Pen.prototype.drawX = function(r) {
    this.ctx.beginPath();
    var nudge = this.pixel / 2;
    var x = this.position[0] + this.size[0] / 2;
    var y = this.position[1] + this.size[1] / 2;
    this.ctx.moveTo(x + nudge - r, y + nudge - r);
    this.ctx.lineTo(x + nudge + r, y + nudge + r);
    this.ctx.moveTo(x + nudge + r, y + nudge - r);
    this.ctx.lineTo(x + nudge - r, y + nudge + r);
    this._stroke();
  };

  T4.Pen.prototype.drawO = function(r) {
    this.ctx.beginPath();
    var x = this.position[0] + this.size[0] / 2;
    var y = this.position[1] + this.size[1] / 2;
    this.ctx.moveTo(x + r, y);
    this.ctx.arc(x, y, r, 0, Math.PI * 2, false);
    this._stroke();
  };

  T4.Pen.prototype.drawLine = function(axis) {
    this.ctx.beginPath();
    var nudge = this.pixel / 2;
    var position;
    if (axis === this.X_AXIS) {
      position = this.position[this.Y_AXIS];
      this.ctx.moveTo(this.position[axis], position + nudge);
      this.ctx.lineTo(this.position[axis] + this.size[axis],
        position + nudge);
    } else {
      position = this.position[this.X_AXIS];
      this.ctx.moveTo(position + nudge, this.position[axis]);
      this.ctx.lineTo(position + nudge, this.position[axis] +
        this.size[axis]);
    }
    this._stroke();
  };

  T4.Pen.prototype._stroke = function() {
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.pixel * this.weight;
    this.ctx.stroke();
  };

}());