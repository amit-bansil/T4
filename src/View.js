/*global $:true, _:true, T4:true */
(function() {
  "use strict";

  T4.View = function(model, canvas) {
    this.model = model;
    this.pen = new T4.Pen(canvas);
    this.canvas = canvas;

    this.symbolRadius = 1 / (_.min(this.model.getDimensions()) * 10);

    canvas.click(_.bind(this._mouseClick, this));
    canvas.mousemove(_.bind(this._mouseMove, this));
    canvas.mouseleave(_.bind(this._mouseLeave, this));
  };

  T4.View.prototype._mouseClick = function(event) {
    this._onFreeSquare(event, function(square) {
      this.model.take(square);
      this.model.setMousedSquare(null);
      this.update();
    });
  };

  T4.View.prototype._mouseMove = function(event) {
    this._onFreeSquare(event, function(square) {
      this.model.setMousedSquare(square);
      this.update();
    });
  };

  T4.View.prototype._mouseLeave = function(event) {
    this._onFreeSquare(event, function() {
      this.model.setMousedSquare(null);
      this.update();
    });
  };

  //call handler on free square corresponding to mouse position of event
  //if that square is free
  T4.View.prototype._onFreeSquare = function(event, handler) {
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


  T4.View.prototype.update = function() {
    $('#status').text(this.model.getStatus());
    this._draw();
  };

  T4.View.prototype._draw = function() {
    this.pen.clear();
    this._drawBoard();
  };

  T4.View.prototype._drawBoard = function() {
    this._drawGridLines(this.pen.X_AXIS);
    this._drawGridLines(this.pen.Y_AXIS);

    this._drawSquares();

    if (this.model.getMousedSquare() !== null) {
      this._drawSquare(this.model.getMousedSquare(), this.model.getCurrentPlayer(), 'black');
    }
  };

  T4.View.prototype._drawGridLines = function(axis) {
    var size = this.model.getDimensions()[axis];
    var pen = this.pen.weightChild(1 / 9).colorChild('black');
    for (var cell = 1; cell < size; cell++) {
      pen.positionChild(
        this.pen.perpendicular(axis), cell / size).
      drawLine(axis);
    }
  };

  T4.View.prototype._drawSquares = function() {
    _.each(this.model.getSquares(), function(square) {
      var color = square.isHighlighted() ? 'red' : 'black';
      this._drawSquare(square, square.getOwner(), color);
    }, this);
  };

  T4.View.prototype._drawSquare = function(square, player, color) {
    var that = this;

    function transformForAxis(pen, axis) {
      var cellPosition = square.getCoords()[axis];
      var cellCount = that.model.getDimensions()[axis];
      pen = pen.positionChild(axis, cellPosition / cellCount);
      pen = pen.sizeChild(axis, 1 / cellCount);
      return pen;
    }
    var pen = transformForAxis(this.pen, this.pen.X_AXIS);
    pen = transformForAxis(pen, pen.Y_AXIS);
    pen = pen.weightChild(1 / 3).colorChild(color);

    if (player !== null) {
      if (player.getName() === 'X') {
        pen.drawX(this.symbolRadius);
      } else if (player.getName() === 'O') {
        pen.drawO(this.symbolRadius);
      } else {
        throw "unexpected player name: " + player.getName();
      }
    }
  };

}());