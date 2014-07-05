/*global $:true, document:true, T3:true, _:true */
(function() {
  "use strict";

  T3.Controller = function() {
    var setup = {
      dimensions: [6, 6],
      winLength: 4
    };
    this.model = new T3.Model(setup);
    this.view = new T3.View(this.model);

    $('#restart').click(_.bind(this.restart, this)).click();
  };

  T3.Controller.prototype.restart = function() {
    this.model.restart();
    this.view.update();
  };

  $(document).ready(function() {
    (new T3.Controller()).restart();
  });

}());