/* jshint esnext: true */
var calculator = document.getElementById('calculator');
var output = document.getElementById('calculator-output');

calculator.addEventListener('click', calculatorClick);

function calculatorClick(event) {
  var target = event.target;
  var dataset = target.dataset;
  var value = dataset.value;
  var type = dataset.type;
  if (type) {
    calc.input(type, value);
    result = calc.output() ;
    output.innerHTML = result;
  }
}

//  States
const STATE_LEFT_OPERAND = 'left_operand';
const STATE_RIGHT_OPERAND = 'right_operand';
const STATE_OPERATOR = 'operator';
const STATE_RESULT = 'result';

// Inputs
const TYPE_NUMBER = 'number';
const TYPE_ACTION = 'action';
const TYPE_OPERATOR = 'operator';

// Operators
const OPERATOR_DIVISION = '/';
const OPERATOR_MULTIPLICATION = '*';
const OPERATOR_ADDITION = '+';
const OPERATOR_SUBTRACTION = '-';

// Actions
const ACTION_CLEAR = 'C';
const ACTION_RESULT = '=';



class BaseStrategy {
  constructor(delegate) {
    this.delegate = delegate;
  }
  onNumber(number) {
     this.delegate.acc.push(number);
  }
  onOperator(operator){}
  onResult(){}
  onClear() {
    this.delegate.reset();
  }
}

class LeftOperandStrategy extends BaseStrategy {
  onOperator(operator){
    let dg = this.delegate;
    dg.setOperator(operator);
    dg.setLeftOperand(dg.getAccumulator());
    dg.transition(STATE_OPERATOR);
  }
}
class OperatorStrategy  extends BaseStrategy {
  onNumber(number) {
    let dg = this.delegate;
    dg.clearAccumulator();
    dg.acc.push(number);
    dg.transition(STATE_RIGHT_OPERAND);
  }
  onOperator(operator) {
    this.delegate.setOperator(operator);
  }
  onResult() {
    let dg = this.delegate;
    dg.setRightOperand(dg.getAccumulator());
    dg.setAccumulator(dg.operation());
  }
}

class RightOperandStrategy  extends BaseStrategy {
  onOperator(operator) {
    let dg = this.delegate;
    let result = 0;
    dg.setRightOperand(dg.getAccumulator());
    result = dg.operation();
    dg.setAccumulator(result);
    dg.setLeftOperand(result);
    dg.setOperator(operator);
    dg.transition(STATE_OPERATOR);
  }
  onResult() {
    let dg = this.delegate;
    let result = 0;
    let rightOperand = 0;
    dg.setRightOperand(dg.getAccumulator());
    result = dg.operation();
    dg.setAccumulator(result);
    rightOperand = dg.getRightOperand();
    if (dg.getOperator() === OPERATOR_SUBTRACTION) {
      rightOperand = rightOperand * -1;
      dg.setOperator(OPERATOR_ADDITION);
    }
    if (dg.getOperator() === OPERATOR_DIVISION) {
      rightOperand = 1 / rightOperand;
      dg.setOperator(OPERATOR_MULTIPLICATION);
    }
    dg.setLeftOperand(rightOperand);
    dg.transition(STATE_RESULT);
  }
}

class ResultOperandStrategy  extends BaseStrategy {
  onOperator(operator) {
    let dg = this.delegate;
    dg.setOperator(operator);
    dg.setLeftOperand(dg.getAccumulator());
    dg.transition(STATE_OPERATOR);
  }
  onResult() {
    let dg = this.delegate;
    dg.setRightOperand(dg.getAccumulator());
    dg.setAccumulator(dg.operation());
  }
}

// ES6
class Calculator {
  constructor() {
    this.init();
  }

  /**
  * Initializes the calculator values, and selects the first state
  */
  init() {
    this.acc = [];
    this.operator = null;
    this.leftOperand = 0;
    this.rightOperand = 0;
    this.state = null;
    this.strategy = null;
    this.transition(STATE_LEFT_OPERAND);
  }

  /**
  * Selects the strategy acording to the state value
  * @param {String} state
  */
  transition(state) {
    this.state = state;
    switch(state) {
      case STATE_LEFT_OPERAND:
        this.strategy = new LeftOperandStrategy(this);
        break;
      case STATE_RIGHT_OPERAND:
        this.strategy = new RightOperandStrategy(this);
        break;
      case STATE_OPERATOR:
        this.strategy = new OperatorStrategy(this);
        break;
      case STATE_RESULT:
        this.strategy = new ResultOperandStrategy(this);
        break;
    }
  }

  /**
  * Sets the accumulator value received in Number type then comberted into an array
  * @param {String} type of input
  * @param {String} type Number, Operator
  */
  input(type, value) {
    switch(type) {
      case TYPE_NUMBER:
        this.strategy.onNumber(value);
        break;
      case TYPE_OPERATOR:
        this.strategy.onOperator(value);
        break;
      case TYPE_ACTION:
          if (value === ACTION_CLEAR){
            this.strategy.onClear();
          }
          if (value === ACTION_RESULT){
            this.strategy.onResult();
          }
        break;
    }
    this.logger();
  }

  /**
  * Performs the operation taking left operand , operator and right operand
  * @return {Number} operation result
  */
  operation () {
    let operator = this.operator;
    let result = 0;

    switch(operator) {
      case OPERATOR_DIVISION:
        result = this.leftOperand / this.rightOperand;
      break;
      case OPERATOR_MULTIPLICATION:
        result = this.leftOperand * this.rightOperand;
      break;
      case OPERATOR_ADDITION:
        result = this.leftOperand + this.rightOperand;
      break;
      case OPERATOR_SUBTRACTION:
        result = this.leftOperand - this.rightOperand;
      break;
    }
    return result;
  }

  /**
  * Sets the new left operand
  * @param {Number} new ledt operand
  */
  setLeftOperand(value) {
    this.leftOperand = value;
  }

  /**
  * Returns the current Numeric value of Left Operand
  * @return {Number} new left operand
  */
  getLeftOperand() {
    return this.leftOperand;
  }

  /**
  * Sets the new Right Operand value
  * @param {Number} new right operand value
  */
  setRightOperand(value) {
    this.rightOperand = value;
  }

  /**
  * Returns the current numeric value of the Right Operand
  * @return {Number} Accumulator Number value
  */
  getRightOperand() {
    return this.rightOperand;
  }

  /**
  * Sets the new operator value
  * @param {Number} operator value
  */
  setOperator(value) {
    this.operator = value;
  }

  /**
  * Returns the current Operator
  * @return {String} operator
  */
  getOperator() {
    return this.operator;
  }

  /**
  * Sets the accumulator value received in Number type then comberted into an array
  * @param {Number} new Accumulator value
  */
  setAccumulator(value) {
    this.acc = Array.from(String(value));
  }

  /**
  * Returns the current Numeric value of the accumulator
  * @return {Number} Accumulator Number value
  */
  getAccumulator() {
    return parseFloat(this.acc.join(''));
  }

  /**
  * Resets the value of the accumulator
  */
  clearAccumulator() {
    this.acc = [];
  }

  /**
  * Resets the state of the calculator
  */
  reset() {
    this.init();
  }

  /**
  * Logs the state of the calculator
  */
  logger() {
    console.log({
      acc: this.acc,
      operator: this.operator,
      leftOperand: this.leftOperand,
      rightOperand: this.rightOperand,
      state: this.state
    })
  }

  /**
  * Returns the accumulator current value
  * @return {String} Accumulator current value
  */
  output() {
    let result = 0;
    if (this.acc.length > 0) {
      result = this.acc.join('');
    }
    return result;
  }
}

var calc = new Calculator();
