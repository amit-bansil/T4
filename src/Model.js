/*global _:true, T3:true */
(function() {
  "use strict";

  T3.Model = function(setup) {
    // DIMENSIONS
    this.getDimensions = _.constant(setup.dimensions);

    // BOARD
    var board = {};

    // return all corrdinates for axes startAxis through endAxis
    this.getSubCoords = function(startAxis, endAxis) {
      var selectedDimensions = this.getDimensions().slice(startAxis, endAxis + 1);
      return _.product(_.map(selectedDimensions, function(dimension) {
        return _.range(dimension);
      }));
    };

    this.getCoords = function() {
      return this.getSubCoords(0, this.getDimensions().length - 1);
    };

    _.each(this.getCoords(), function(coord) {
      board[coord] = new T3.Square(coord);
    });

    this.getSquare = function(coord) {
      return board[coord];
    };

    this.getSquares = function() {
      return _.values(board);
    };

    // PLAYERS
    var currentPlayer = null;

    var players = [new T3.Player('X'), new T3.Player('O')];

    this.getPlayers = _.constant(players);

    this.getCurrentPlayer = function() {
      return currentPlayer;
    };

    this._setCurrentPlayer = function(newCurrentPlayer) {
      currentPlayer = newCurrentPlayer;
    };

    // MOUSED SQUARE
    var mousedSquare = null;

    this.getMousedSquare = function() {
      return mousedSquare;
    };

    this.setMousedSquare = function(newMousedSquare) {
      if (newMousedSquare !== null) {
        _.checkContains(board, newMousedSquare);
      }
      mousedSquare = newMousedSquare;
    };

    // MISC
    this.getWinLength = _.constant(setup.winLength);
  };

  //clear board and select a random current player
  T3.Model.prototype.restart = function() {
    var playerIndex = _.random(0, this.getPlayers().length - 1);
    this._setCurrentPlayer(this.getPlayers()[playerIndex]);

    _.each(this.getSquares(), function(square) {
      square.reset();
    });
  };


  //marks square (x,y) as owned by current player
  //and changes current player to other player
  T3.Model.prototype.take = function(square) {
    _.checkContains(this.getSquares(), square);

    square._setOwner(this.getCurrentPlayer());
    var nextPlayer = _.nextElement(this.getPlayers(),
      this.getCurrentPlayer());
    this._setCurrentPlayer(nextPlayer);
  };

  T3.Model.prototype._hasOpening = function() {
    return _.any(this.getSquares(), function(square) {
      return square.getOwner() === null;
    });
  };

  //returns current winner or null if none
  //OPTIMIZE recalc only on move
  T3.Model.prototype.getWinner = function() {
    var winners = _.filter(this.getPlayers(), this._isWinner, this);
    if (winners.length === 0) {
      return null;
    }
    if (winners.length === 1) {
      return winners[0];
    }
    throw "Multiple Winners";
  };

  T3.Model.prototype._isWinner = function(player) {
    //OPTMIIZE compute valid lines once
    return _.any(_.map(this._computeLines(), function(line) {
      return this._isWinningLine(player, line);
    }, this));
  };

  T3.Model.prototype._isWinningLine = function(player, line) {
    var playerOwnsLine = _.all(line, function(coords) {
      return this.getSquare(coords).getOwner() === player;
    }, this);

    //highlight line
    if (playerOwnsLine) {
      _.each(line, function(coords) {
        this.getSquare(coords)._highlight();
      }, this);
    }

    return playerOwnsLine;
  };

  T3.Model.prototype._computeLines = _.once(function() {
    var deltas = _.product(_.repeat(_.range(-1, 2), this.getDimensions().length));

    //ignore lines that are either backward (all deltas negative/0)
    //or points (all deltas zero) by only including those
    //deltas that are positive in atleast 1 direction
    var increasingDeltas = _.filter(deltas, function(delta) {
      var isPositive = function(value) {
        return value > 0;
      };
      return _.any(delta, isPositive);
    });
    var squareDeltas = _.product([this.getSquares(), increasingDeltas]);
    var lines = _.map(squareDeltas, function(squareDelta) {
      var square = squareDelta[0];
      var delta = squareDelta[1];
      return this._computeLine(square, delta);
    }, this);
    return _.filter(lines, function(line) {
      return _.all(line, this.isInBounds, this);
    }, this);
  });

  T3.Model.prototype._computeLine = function(square, deltas) {
    var walk = function(step) {
      return _.map(_.range(this.getDimensions().length), function(axis) {
        return square.getCoords()[axis] + step * deltas[axis];
      });
    };
    return _.map(_.range(this.getWinLength()), walk, this);
  };

  T3.Model.prototype.isInBounds = function(coord) {
    return _.all(_.range(this.getDimensions().length), function(axis) {
      return 0 <= coord[axis] && coord[axis] < this.getDimensions()[axis];
    }, this);
  };

  T3.Model.prototype.getStatus = function() {
    if (this.getWinner() !== null) {
      return this.getWinner().getName() + " is the winner!";
    }
    if (!this._hasOpening()) {
      return "Stalemate!";
    }
    return this.getCurrentPlayer().getName() + "'s move.";
  };

  T3.Square = function(coords) {
    var owner = null;
    var highlight = false;
    this.reset = function() {
      owner = null;
      highlight = false;
    };

    this.getOwner = function() {
      return owner;
    };

    this._setOwner = function(newOwner) {
      owner = newOwner;
    };

    this.isHighlighted = function() {
      return highlight;
    };

    this._highlight = function() {
      highlight = true;
    };

    this.getCoords = _.constant(coords);
  };

  T3.Player = function(name) {
    this.getName = _.constant(name);
  };

}());