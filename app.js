var DEFAULT_SIZE = 3;

var Board = Backbone.Model.extend({
  initialize: function() {
    this.set('cells', new Array(this.get('size') * this.get('size'))); 
  },

  // Did a player win? Otherwise return undefined.
  isWon: function() {
    // Check rows & columns
    for (var i = 0; i < this.get('size'); i++) {
      var rowWinner = this.checkRow(i);
      if (rowWinner) {
        return rowWinner;
      }

      var colWinner = this.checkCol(i);
      if (colWinner) {
        return colWinner;
      }
    }
    
    return undefined;
  },

  checkRow: function(rowNumber) {
    var rowOwner = this.getCell(0, rowNumber);
    for (var i = 0; i < this.get('size'); i++) {
      var currCol = this.getCell(i, rowNumber);
      if (currCol != undefined && currCol != rowOwner) {
        return currCol
      }
    }
    return rowOwner;
  },

  checkCol: function(colNumber) {
    var colOwner = this.getCell(colNumber, 0);
    for (var i = 0; i < this.get('size'); i++) {
      var currRow = this.getCell(colNumber, i);
      if (currRow != undefined && currRow != colOwner) {
        return currRow;
      }
    }
    return colOwner;
  },

  getCell: function(x, y) {
    return this.get('cells')[this.translate(x, y)];
  },

  setCell: function(x, y, player) {
    this.get('cells')[this.translate(x, y)] = player;
  },

  // This does a translation of 2D coordinates to a 1D space using Row
  // major order.
  translate: function(x, y) {
    var size = this.get('size');

    if (x >= size || y >= size) {
      throw "Coordinates don't make sense for board size=" + size + ".";
    }

    return size * y + x;
  }

});


// Manages view and game loop (see cellClicked).
var BoardViewController = Backbone.View.extend({
  el: "#board-view",

  className: "board-view",

  events: {
    "click .cell-view": "cellClicked"
  },

  initialize: function() {
    this.currentPlayer = 'A';
  },

  render: function() {
    this.$el.html(_.template($("#board-view-tmpl").html(), this.model.toJSON()));
  },

  cellClicked: function(ev) {
    var x, y, winner;

    x = $(ev.currentTarget).data('x');
    y = $(ev.currentTarget).data('y');

    // Update model
    this.model.setCell(x, y, this.currentPlayer);

    // Update view
    $(ev.currentTarget).text(this.currentPlayer);
    
    if (winner = this.model.isWon()) {
      alert("Player " + winner);
    }

    this.togglePlayer();
  },

  togglePlayer: function() {
    if (this.currentPlayer == 'A') {
      this.currentPlayer = 'B';
    } else {
      this.currentPlayer = 'A';
    }
  }
});

$(function() {
  window.MainBoard = new Board({ size: DEFAULT_SIZE });
  window.MainBoardView = new BoardViewController({ model: window.MainBoard });
  MainBoardView.render();
});
