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
    var col0 = this.getCell(0, rowNumber);
    if (!col0) {
      return col0;
    }

    for (var i = 1; i < this.get('size'); i++) {
      var currCol = this.getCell(i, rowNumber);
      if (currCol == undefined || currCol != col0) {
        return false;
      }
    }

    return col0;
  },

  checkCol: function(colNumber) {
    var row0 = this.getCell(colNumber, 0);
    if (!row0) {
      return row0;
    }

    for (var i = 1; i < this.get('size'); i++) {
      var currRow = this.getCell(colNumber, i);
      if (currRow == undefined || currRow != row0) {
        return currRow;
      }
    }

    return row0;
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
      alert("Player " + winner + " is the Winner!");
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
