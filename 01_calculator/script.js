class Calculator {
    constructor(inputValue) {
        this.inputValue = inputValue;
        this.currentValue = '';
        this.previousValue = '';
        this.operator = null;
        //console.log('i have been called here')
    }

    appendNumber(number) {
        if(number === '.' && this.currentValue.includes('.')) return;
        this.currentValue += number;
        this.updateInputBox();
    }

    selectOperator(operator){
        console.log(this.currentValue);
        if(this.currentValue === '') {
            console.log(this.currentValue);
            this.compute();
        }else if(this.previousValue === '') {
            return;
        }
        this.operator = operator;
        this.previousValue = this.currentValue;
        this.currentValue = '';
    }

    compute() {
        let computation;
        const previous = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);
        console.log(previous)
        console.log(current)
        
        if(isNaN(previous) || isNaN(current)) return;

        switch (this.operator) {
            case '+':
                computation = previous + current;         
                break;

            case '-':
                computation = previous - current;
                break;

            case '*':
                computation = previous * current;
                break;

            case '%':
                computation = current / 100;
                break;
            
            case '÷':
                computation = previous / current;
                break;

            default:
                break;
        }
        this.currentValue = computation.toString();
        this.operator = null;
        this.previousValue = '';
        this.updateInputBox();
    }

    allClear() {
        this.currentValue = '';
        this.previousValue = '';
        this.operator = null;
        this.updateInputBox();
    }

    deleteLast() {
        this.currentValue = this.currentValue.slice(0, -1);
        this.updateInputBox();
    }

    updateInputBox() {
        this.inputValue = this.currentValue || '0';
    }

    /*del() {
        this.inputValue = ""
    }

    get value() {
        return this.inputValue
    }

    set value(val) {
        this.inputValue = val
    }*/
}

document.addEventListener('DOMContentLoaded', () => {
    let inputBox = document.getElementById('inputBox');
    const calculator = new Calculator(inputBox);
    console.log(calculator);

    //select all the buttons of the .calculator div
    let calculate = document.querySelectorAll('button');
    calculate.forEach((button) => {
        button.addEventListener('click', (e) => {
            //console.log(e);
            const value = e.target.innerText;
            //console.log(value);
            if(value === '.') {
                //To handle numbers and decimal points
                calculator.appendNumber(value);
                console.log('.')

            }else if(value === 'AC') {
                //To clear the inputBox
                calculator.allClear();

            }else if(value === 'DEL') {
                //To delete the last input digit
                calculator.deleteLast();

            }else if(value === '=') {
                //Calculation of result
                calculator.compute();
                inputBox = calculator.inputValue;

            }else {
                //Handle operators
                console.log('here', value);
                calculator.selectOperator(value);
                //console.log(calculator)
                inputBox = calculator.updateInputBox();
            }
            //console.log(calculator)
        });
    });
});