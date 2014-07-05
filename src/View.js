/*global $:true, _:true, T3:true */
(function() {
  "use strict";

  T3.View = function(model) {
    this.model = model;
    this.canvas = $('#canvas');

    var width = this.canvas.width();
    var height = this.canvas.height();

    this.ctx = this.canvas[0].getContext('2d');

    this.ctx.scale(width, height);

    this.pixel = 1 / width;

    this.symbolRadius = 1 / (_.min(this.model.getDimensions()) * 10);

    this.canvas.click(_.bind(this._mouseClick, this));
    this.canvas.mousemove(_.bind(this._mouseMove, this));
    this.canvas.mouseleave(_.bind(this._mouseLeave, this));
  };

  T3.View.prototype._mouseClick = function(event) {
    this._onFreeSquare(event, function(square) {
      this.model.take(square);
      this.model.setMousedSquare(null);
      this.update();
    });
  };

  T3.View.prototype._mouseMove = function(event) {
    this._onFreeSquare(event, function(square) {
      this.model.setMousedSquare(square);
      this.update();
    });
  };

  T3.View.prototype._mouseLeave = function(event) {
    this._onFreeSquare(event, function() {
      this.model.setMousedSquare(null);
      this.update();
    });
  };

  //call handler on free square corresponding to mouse position of event
  //if that square is free
  T3.View.prototype._onFreeSquare = function(event, handler) {
    if (this.model.getWinner() !== null) {
      return;
    }

    var pixelX = event.pageX - this.canvas.offset().left;
    var pixelY = event.pageY - this.canvas.offset().top;

    var percentX = pixelX / this.canvas.width();
    var percentY = pixelY / this.canvas.height();

    var cellX = Math.floor(percentX * this.model.getDimensions()[0]);
    var cellY = Math.floor(percentY * this.model.getDimensions()[1]);

    var square = this.model.getSquare([cellX, cellY]);
    if (square && square.getOwner() === null) {
      handler.call(this, square);
    }
  };


  T3.View.prototype.update = function() {
    $('#status').text(this.model.getStatus());
    this._draw();
  };

  T3.View.prototype._draw = function() {
    this.ctx.save();
    this.ctx.clearRect(0, 0, 1, 1);

    this._drawBoard();

    this.ctx.restore();
  };

  T3.View.prototype._drawBoard = function() {
    this.ctx.beginPath();
    this._drawColumnLines();
    this._drawRowLines();
    this._stroke(1 / 9, 'black');

    this._drawSquares();

    if (this.model.getMousedSquare() !== null) {
      this._drawSquare(this.model.getMousedSquare(), this.model.getCurrentPlayer(), 'black');
    }
  };

  T3.View.prototype._drawColumnLines = function() {
    var size = this.model.getDimensions()[0];
    var nudge = this.pixel / 2;
    for (var column = 1; column < size; column++) {
      var pixelX = column / size;
      this.ctx.moveTo(pixelX + nudge, 0);
      this.ctx.lineTo(pixelX + nudge, 1);
    }
  };

  T3.View.prototype._drawRowLines = function() {
    var size = this.model.getDimensions()[1];
    var nudge = this.pixel / 2;
    for (var row = 1; row < size; row++) {
      var pixelY = row / size;
      this.ctx.moveTo(0, pixelY + nudge);
      this.ctx.lineTo(1, pixelY + nudge);
    }
  };

  T3.View.prototype._drawSquares = function() {
    _.each(this.model.getSquares(), function(square) {
      var color = square.isHighlighted() ? 'red' : 'black';
      this._drawSquare(square, square.getOwner(), color);
    }, this);
  };

  T3.View.prototype._drawSquare = function(square, player, color) {
    this.ctx.beginPath();

    var cx = square.getCoords()[0] + 0.5;
    var cy = square.getCoords()[1] + 0.5;
    this._drawSquare2(cx / this.model.getDimensions()[0], cy / this.model.getDimensions()[1], player);

    this._stroke(1 / 3, color);
  };

  T3.View.prototype._drawSquare2 = function(x, y, player) {
    if (player !== null) {
      if (player.getName() === 'X') {
        this._drawX(x, y);
      } else if (player.getName() === 'O') {
        this._drawO(x, y);
      } else {
        throw "unexpected player name: " + player.getName();
      }
    }
  };

  T3.View.prototype._drawX = function(x, y) {
    var r = this.symbolRadius;
    var nudge = this.pixel / 2;
    this.ctx.moveTo(x + nudge - r, y + nudge - r);
    this.ctx.lineTo(x + nudge + r, y + nudge + r);
    this.ctx.moveTo(x + nudge + r, y + nudge - r);
    this.ctx.lineTo(x + nudge - r, y + nudge + r);
  };

  T3.View.prototype._drawO = function(x, y) {
    var r = this.symbolRadius;
    this.ctx.moveTo(x + r, y);
    this.ctx.arc(x, y, r, 0, Math.PI * 2, false);
  };

  T3.View.prototype._stroke = function(pixelWeight, color) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = this.pixel * pixelWeight;
    this.ctx.stroke();
  };

}());