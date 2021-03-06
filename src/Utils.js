/*global _:true */
(function() {
  "use strict";

  var utils = {};

  //see wikipedia:cartesian product
  utils.product = function(sets) {
    var product2 = function(memos, set) {
      var ret = _.map(memos, function(memo) {
        return _.map(set, function(element) {
          return memo.concat([element]);
        });
      });
      return _.flatten(ret, true);
    };
    return _.reduce(sets, product2, [
      []
    ]);
  };

  utils.repeat = function(element, n) {
    return _.map(_.range(n), function() {
      return element;
    });
  };

  utils.checkContains = function(array, element) {
    if (!_.contains(array, element)) {
      throw "" + element + " not found in " + array;
    }
  };

  utils.nextElement = function(array, element) {
    return array[(array.indexOf(element) + 1) % array.length];
  };

  //more defensive and less efficient version of constant
  utils.constant = function(value) {
    value = _.clone(value);
    return function() {
      return _.clone(value);
    };
  };

  _.mixin(utils);

}()); /*global _:true */
(function() {
  "use strict";

  var utils = {};

  //see wikipedia:cartesian product
  utils.product = function(sets) {
    var product2 = function(memos, set) {
      var ret = _.map(memos, function(memo) {
        return _.map(set, function(element) {
          return memo.concat([element]);
        });
      });
      return _.flatten(ret, true);
    };
    return _.reduce(sets, product2, [
      []
    ]);
  };

  utils.repeat = function(element, n) {
    return _.map(_.range(n), function() {
      return element;
    });
  };

  utils.checkContains = function(array, element) {
    if (!_.contains(array, element)) {
      throw "" + element + " not found in " + array;
    }
  };

  utils.nextElement = function(array, element) {
    return array[(array.indexOf(element) + 1) % array.length];
  };

  //more defensive and less efficient version of constant
  utils.constant = function(value) {
    value = _.clone(value);
    return function() {
      return _.clone(value);
    };
  };

  _.mixin(utils);

}());