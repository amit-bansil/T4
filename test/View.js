/*global $:true, _:true, T4:true */
(function() {
  "use strict";

  function testView(options) {
    var setup = {
      dimensions: options.dimensions,
      winLength: options.winLength
    };
    var model = new T4.Model(setup);
    var canvas = $('<canvas id="canvas1" width="300" height="300"></canvas>');
    $('body').append(canvas);
    var view = new T4.View(model, canvas);
    model.restart();
    if (options.moves) {
      _.each(options.moves.split(' '), function(move) {
        var x = parseInt(move[0], 10);
        var y = parseInt(move[1], 10);
        model.take(model.getSquare([x, y]));
      });
    }
    view.update();
  }

  function onReady() {
    testView({
      dimensions: [6, 6],
      winLength: 4,
      moves: '00 11 01 22 10 33 02 44'
    });
    testView({
      dimensions: [3, 3],
      winLength: 3,
      moves: '11 00 22 01 10'
    });
    testView({
      dimensions: [5, 3],
      winLength: 3
    });
  }
  $(document).ready(onReady);
}());