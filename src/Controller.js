/*global $:true, document:true, T4:true, _:true */
(function() {
  "use strict";

  T4.Controller = function() {
    var setup = {
      dimensions: [6, 6],
      winLength: 4
    };
    this.model = new T4.Model(setup);
    this.view = new T4.View(this.model, $('#canvas'));

    $('#restart').click(_.bind(this.restart, this)).click();
  };

  T4.Controller.prototype.restart = function() {
    this.model.restart();
    this.view.update();
  };

  $(document).ready(function() {
    (new T4.Controller()).restart();
  });

}());