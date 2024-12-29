const inputBox = document.getElementById("inputBox");
const buttons = document.querySelectorAll("button");

//function for updating the input display
function updateDisplay(arr) {
    return arr.toString().replaceAll(",", "");
}

//function for the '.' operator
function handleDotOperator(arr, val) {
    if(arr.length === 0 || isNaN(arr[arr.length - 1])) {
        arr.push('0.')
    }else {
        arr.push(val);
    }
    return arr;
}

//function to check for invalid operator symbol
function checkInvalidOperator(val, arr) {
    const lastElement = arr[arr.length - 1];
    if(lastElement && ['+', '-', '*', '%', '÷'].includes(lastElement.toString().trim())) {
        return;
    }else {
        arr.push(` ${val} `);
    }
    return arr;
}

//function for showing final result
function compute(array) {
    // Parse and clean the input
    const element = array
        .join('')                          // Combine all elements into a single string
        .split(' ')                        // Split the string by spaces into parts
        .filter((el) => el.trim() !== ''); // Remove empty strings caused by extra spaces
    
    // Split numbers and operators into tokens-- like string '2.5' to number 2.5 and leave symbol as-it-is
    const tokens = element.map((token) => (!isNaN(token) ? parseFloat(token) : token));
    
    // Function to handle a single operation
    const applyOperation = (a, b, operator) => {
        switch (operator) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '÷': return b === 0 ? 'Error: Division by zero' : a / b; //cannot do division with 0
            case '%': return b / 100; // Percentage calculation
            default: throw new Error(`Unknown operator: ${operator}`);
        }
    };

    // Process operations by precedence
    const processPrecedence = (tokens, precedenceOperators) => {
        let resultTokens = [];
        let i = 0;

        while (i < tokens.length) {
            const token = tokens[i];
            if (precedenceOperators.includes(token)) {
                // Apply the operation to the last number in resultTokens and the next token
                const a = resultTokens.pop();
                const b = tokens[i + 1];
                const result = applyOperation(a, b, token);
                if (result === 'Error: Division by zero') return result;
                resultTokens.push(result);
                i += 2; // Skip the next number, as it's already used
            } else {
                resultTokens.push(token);
                i++;
            }
        }

        return resultTokens;
    };

    // Process higher precedence operators (÷, %)
    let intermediateTokens = processPrecedence(tokens, ['÷', '%']);
    if (typeof intermediateTokens === 'string') return intermediateTokens; // Error handling

    //Process multiplication operator only after division and percentage
    intermediateTokens = processPrecedence(intermediateTokens, ['*']);

    // Process lower precedence operators (+, -)
    intermediateTokens = processPrecedence(intermediateTokens, ['+']);

    //('-') is lower in precedence to any other operator according to (bodmas) rule of Mathematics
    intermediateTokens = processPrecedence(intermediateTokens, ['-']);

    // The final result should be the only token left
    return intermediateTokens.length === 1 ? intermediateTokens[0] : 'Error: Invalid expression';
}

document.addEventListener('DOMContentLoaded', () => {
    let output = [];

    buttons.forEach((button) => {
        button.addEventListener('click', (e) => {
            const value = e.target.innerText;

            switch(true) {
                case ['+', '-', '*', '%', '÷'].includes(value):
                    checkInvalidOperator(value, output);
                    inputBox.value = updateDisplay(output);
                    break;

                case value === '.':
                    handleDotOperator(output, value); 
                    inputBox.value = updateDisplay(output);
                    break;

                case !isNaN(value):
                    output.push(value == "00" ? "00" : parseInt(value));
                    inputBox.value = updateDisplay(output);
                    break;

                case value === 'DEL':
                    output.pop();
                    inputBox.value = updateDisplay(output);
                    break;

                case value === 'AC':
                    output = [];
                    inputBox.value = updateDisplay(output);
                    break;

                case value === '=':
                    console.log(value);
                    console.log(output);
                    compute(output);
                    console.log(`${compute(output)} & ${typeof compute(output)}`);
                    inputBox.value = compute(output);
                    //inputBox.value = updateDisplay(output);
                    break;

                default:
                    output = ['Invalid input'];
                    inputBox.value = updateDisplay(output);
                    break;
            }

            console.log(output); 
        });
    });
});
