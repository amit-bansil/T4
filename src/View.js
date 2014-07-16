/*global $:true, _:true, T4:true */
(function() {
  "use strict";

  var SYMBOL_HIGHLIGHT_COLOR = 'red';
  var SYBMOL_MOUSED_COLOR = 'purple';
  var SYMBOL_DEFAULT_COLOR = 'black';
  var GRID_LINE_WEIGHT = 1 / 9;
  var GRID_LINE_COLOR = 'black';
  var SYMBOL_RADIUS = 1 / 10;
  var SYMBOL_WEIGHT = 1 / 3;

  T4.View = function(model, canvas) {
    this.model = model;
    this.pen = new T4.Pen(canvas);
    this.canvas = canvas;

    this.symbolRadius = (1 / _.min(this.model.getDimensions())) *
      SYMBOL_RADIUS;

    this.pen.on('click', this._mouseClick, this);
    this.pen.on('mousemove', this._mouseMove, this);
    canvas.mouseleave(_.bind(this._mouseLeave, this));
  };

  T4.View.prototype._mouseClick = function(coords) {
    this._onFreeSquare(coords, function(square) {
      this.model.take(square);
      this.model.setMousedSquare(null);
      this.update();
    });
  };

  T4.View.prototype._mouseMove = function(coords) {
    this._onFreeSquare(coords, function(square) {
      this.model.setMousedSquare(square);
      this.update();
    });
  };

  T4.View.prototype._mouseLeave = function(event) {
    this.model.setMousedSquare(null);
    this.update();
  };

  //call handler on free square corresponding to mouse position of event
  //if that square is free
  T4.View.prototype._onFreeSquare = function(coords, handler) {
    if (this.model.getWinner() !== null) {
      return;
    }

    var square = this.model.getSquare(coords);
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
      this._drawSquare(this.model.getMousedSquare(),
        this.model.getCurrentPlayer(), SYBMOL_MOUSED_COLOR);
    }
  };

  T4.View.prototype._drawGridLines = function(axis) {
    var size = this.model.getDimensions()[axis];
    var pen = this.pen.weightChild(GRID_LINE_WEIGHT).colorChild(GRID_LINE_COLOR);
    for (var cell = 1; cell < size; cell++) {
      pen.positionChild(axis, cell / size).
      drawLine(this.pen.perpendicular(axis));
    }
  };

  T4.View.prototype._drawSquares = function() {
    _.each(this.model.getSquares(), function(square) {
      var color = square.isHighlighted() ? SYMBOL_HIGHLIGHT_COLOR : SYMBOL_DEFAULT_COLOR;
      var pen = this._drawSquare(square, square.getOwner(), color);
      pen.hitMask(square.getCoords());
    }, this);
  };

  T4.View.prototype._drawSquare = function(square, player, color) {
    var that = this;
    //TODO pull out
    function transformForAxis(pen, axis) {
      var cellPosition = square.getCoords()[axis];
      var cellCount = that.model.getDimensions()[axis];
      pen = pen.positionChild(axis, cellPosition / cellCount);
      pen = pen.sizeChild(axis, 1 / cellCount);
      return pen;
    }
    var pen = transformForAxis(this.pen, this.pen.X_AXIS);
    pen = transformForAxis(pen, pen.Y_AXIS);
    pen = pen.weightChild(SYMBOL_WEIGHT).colorChild(color);

    if (player !== null) {
      if (player.getName() === 'X') {
        pen.drawX(this.symbolRadius);
      } else if (player.getName() === 'O') {
        pen.drawO(this.symbolRadius);
      } else {
        throw "unexpected player name: " + player.getName();
      }
    }
    return pen;
  };

}());