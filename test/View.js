/*global $:true, _:true, T4:true */
(function() {
  var setup = {
    dimensions: [6, 6],
    winLength: 4
  };
  this.model = new T4.Model(setup);
  this.view = new T4.View(this.model, $('#canvas'));
}());