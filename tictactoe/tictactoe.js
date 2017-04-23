(function() {

  var container = document.querySelector('.tictactoe');
  var startButton = document.getElementById('startButton');
  var gameState = document.getElementById('gameState');
  var game;

  startButton.addEventListener('click', start);
  container.addEventListener('click', onCellClick);

  function onCellClick(event) {
    var target = event.target;
    var dataset = target.dataset;
    // console.log(dataset);
    // console.log('target', target);
    if ( dataset && dataset.row ) {
      //console.log('pos', dataset.row, dataset.column);
      var results = game.input(dataset.row, dataset.column);

      if (results) {
        if (results.game === 'won') {
          gameState.innerHTML = 'Player ' + results.player + ' wins!';
        }

        if (results.game === 'tie') {
          gameState.innerHTML = 'Tie game';
        }
      }
      render(game.output());
    }
  }

  function TicTacToe() {
    this.results = null;
    this.state = 'playing'; // => over
    this.player = 'X';
    this.round = 0;
    this.matrix = [
      [ null, null, null],
      [ null, null, null],
      [ null, null, null],
    ];
  }

  TicTacToe.prototype.input = function (row, column) {

    if (this.getState() === 'over') {
      return this.getResults();
    }

    if (this.setValue(row, column)) {
      if (this.checkGame(row, column)) {
        this.setState('over');
        this.setResults({
          player: this.player,
          game: 'won'
        });
        return this.getResults();
      } else {
        this.togglePlayer();      
      }

      this.round++;
      if (this.round === 9) {
        this.setState('over');
        this.setResults({
          game: 'tie'
        });
        return this.getResults();
      }
    }
    return this.getResults();
  };

  TicTacToe.prototype.setState = function (state) {
    this.state = state;  
  };

  TicTacToe.prototype.getState = function (state) {
    return this.state;
  };

  TicTacToe.prototype.setResults = function (results) {
    this.results = results;
  };

  TicTacToe.prototype.getResults = function () { 
    return this.results;
  };

  TicTacToe.prototype.checkGame = function (row, column) {
    var matrix = this.matrix;
    var symbol = this.player;
    var checks = [
      checkRow(matrix, row, symbol),
      checkColumn(matrix, column, symbol),
      checkDiagonal(matrix, symbol),
      checkAntiDiagonal(matrix, symbol)
    ];

    return checks.reduce(function (acc, check) { 
      return acc + check;
    }, false);



    function checkRow(matrix, row, symbol) {
      var row = matrix[row];
      var length = row.length;
      for (var i = 0; i < length; i++) {
        var cell = row[i];
        if (cell !== symbol) {
          return false;
        }
      }
      return true;
    }

    function checkColumn(matrix, column, symbol) {
      var length = matrix.length;
      for (var i = 0; i < length; i++) {
        var cell = matrix[i][column];
        if (cell !== symbol) {
          return false;
        }
      }
      return true;
    }

    function checkDiagonal(matrix, symbol) {
      // 0,0 , 1,1 , 2,2 
      var length = matrix.length;
      for (var i = 0; i < length; i++) {
        var cell = matrix[i][i];
        if (cell !== symbol) {
          return false;
        }
      }
      return true;
    }

    function checkAntiDiagonal(matrix, symbol) {
      // 0,2 , 1,1 , 2,0
      var length = matrix.length;
      for (var i = 0, j = length -1; i < length; i++) {
        var cell = matrix[i][j];
        if (cell !== symbol) {
          return false;
        }
        j--;
      }
      return true;
    }
  };

  TicTacToe.prototype.setValue = function (row, column) {
    var matrix = this.matrix;
    if (matrix[row][column] === null) {
      matrix[row][column] = this.player;    
      return true;
    }
    return false;
  };

  TicTacToe.prototype.togglePlayer = function () {
    this.player = this.player === 'X' ? 'O' : 'X';
  };

  TicTacToe.prototype.output = function () {
    return this.matrix;
  };

  function start() {
    // console.log('start');
    game = new TicTacToe();
    render(game.output());
    gameState.innerHTML = 'Playing';
  }

  function render(matrix) {
    var values = matrix.reduce(function(array, row, rowIndex) {
      return array.concat(row.map(function (cell, cellIndex) {
        return {
          value: cell,
          id: 'cell-' + rowIndex + '-' + cellIndex
        };
      }));
    }, []);

    values.forEach(function(cell){
      var cellElement = document.getElementById(cell.id);
      cellElement.innerHTML = cell.value !== null ? cell.value : '';
    });
  }

  // on load
  start();
}());
