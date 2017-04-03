window.addEventListener('load',function () {

  function Calculator() {
    this.queue    = [];
    this.operandA = null;
    this.operandB = null;
    this.operator = null;
    this.output = 0;
    this.previousInput = null;
  }
  
  Calculator.prototype.input = function(input) {
    if (input === undefined) return 0;
    if (input === 'C') { 
      this.clear();
      return 0;
    }
    
    var currentOperator = this.operator;
    var number = Number(input);
    var isNumber = isNaN(number) ? false : true; 
    var result; 
    
    // Helpers
    var isOperator = this.isOperator;
    
    
    if (isNumber) { 
      if (!currentOperator) {
        this.enqueue(number);
        this.operandA = this.getQueuedNumber();
      } else {
        // clear queue if there's an operator previously
        if (isOperator(this.previousInput)) {
           this.clearQueue();
        }
        this.enqueue(number);
        this.operandB = this.getQueuedNumber();
      }
    } else {
      if (!currentOperator) {
        this.setOperator(input);
      } else if (currentOperator && this.previousInput === '=' && input !== '='){
        this.operandA = this.getQueuedNumber();
        this.operandB = null;
      } else if (input === '=' && this.operandB === null) {
        this.operandB = this.getQueuedNumber();
        this.clearQueue();
        result = this.calculate(this.operator, this.operandA, this.operandB);
        this.enqueue(result);
        this.operandA = result;
        this.setOperator(input);        
      } else if (!isOperator(this.previousInput)){
        this.clearQueue();
        result = this.calculate(this.operator, this.operandA, this.operandB);
        this.enqueue(result);
        this.operandA = result;
        this.setOperator(input);
      } else if (input === '=') {
        this.operandB = this.getQueuedNumber();
        result = this.calculate(this.operator, this.operandA, this.operandB);
        this.clearQueue();
        this.enqueue(result)
      }
      this.setOperator(input);
    }
    
    // save the previous input
    this.previousInput = input;
    
    // debug state
    console.log('POST STATE',this.state());
    
    // return current queue of numbers
    return this.getQueuedNumber();
  };
  
  Calculator.prototype.isOperator = function(input) {
    return /(\+|\-)/.test(input);
  };

  Calculator.prototype.state = function () {
    return {
      queue: this.queue,
      operandA: this.operandA,
      operandB: this.operandB,
      operator: this.operator
    };
  };
  
  Calculator.prototype.calculate = function (operator, a, b) {
    switch(operator) {
      case '+': return a + b;
      case '-': return a - b;
//      case '%': return a / b;
    }
  };
  
  Calculator.prototype.setOperator = function (operator) {
    if (/(\+|\-)/.test(operator)) {
      this.operator = operator;
    }
  };
  
  Calculator.prototype.clearQueue = function () {
    this.queue = [];
  };
  
  Calculator.prototype.isQueueEmpty = function () {
    return this.queue.length === 0;
  };
  
  Calculator.prototype.getQueuedNumber = function () {
    if (this.isQueueEmpty()) return 0;
    return Number(this.queue.join(''));
  };
  
  Calculator.prototype.enqueue = function (element) {
    this.queue.push(element);
  };
  
  Calculator.prototype.clear = function () {
    Calculator.call(this);
  };
  
  
  
  var keypad = document.querySelector('.keypad');
  var operatorPad = document.querySelector('.operator-pad');
  var display = document.querySelector('.display');
  var calc = new Calculator();
  
  keypad.addEventListener('click', onclick);
  operatorPad.addEventListener('click', onclick);
  
  render(calc.input());
  
  function onclick(event) {
    var target = event.target;
    var dataset = target.dataset;
    var input = dataset.key; 
    render(calc.input(input));
  }
  
  function render(value) {
    display.innerHTML = value;
  }
  
  
  (function () {
    // default passed
    var passed = true;
    var calc = new Calculator();
    var units = [];
    units = units.concat([
      // test 1
      assert(calc.input(1), 1), 
      assert(calc.input(2), 12),
      assert(calc.input('+'), 12),
      assert(calc.input(2), 2),
      assert(calc.input('-'), 14),
      assert(calc.input(2), 2),
      assert(calc.input('='), 12),
      assert(calc.input('='), 10),
      assert(calc.input('-'), 10),
      assert(calc.input('='), 0),
      assert(calc.input('='), -10),

      // test 2
      assert(calc.input('C'), 0),
      assert(calc.input(1), 1),
      assert(calc.input('+'), 1),
      assert(calc.input(2), 2),
      assert(calc.input('-'), 3),
      assert(calc.input(2), 2),
      assert(calc.input(4), 24),
      assert(calc.input('+'), -21),
      assert(calc.input('+'), -21),
      assert(calc.input('-'), -21),
      assert(calc.input(6), 6),
      assert(calc.input('='), -27),
      
      
      // test 3
      assert(calc.input('C'), 0),
      assert(calc.input(1), 1),
      assert(calc.input('+'), 1),
      assert(calc.input(2), 2),
      assert(calc.input('-'), 3),
      assert(calc.input(2), 2),
      assert(calc.input(4), 24),
      assert(calc.input('+'), -21),
      assert(calc.input('+'), -21),
      assert(calc.input('-'), -21),
      assert(calc.input(6), 6),
      assert(calc.input('='), -27),
      
      // test 4
      assert(calc.input('C'), 0),
      assert(calc.input(2), 2),
      assert(calc.input(3), 23),
      assert(calc.input('-'), 23),
      assert(calc.input(2), 2),
      assert(calc.input(6), 26),
      assert(calc.input('+'), -3),
      assert(calc.input('='), -6)
      ]
    );

    var i = 0;
    var length = units.length;
    while(i < length){
      passed = passed && units[i];
      i++;
    }
    console.log('TEST CASES : ' + (passed ? 'PASSED' : 'FAILED'));
  }());
  
  function assert(a,b) {
    return a === b;
  }
  
});
