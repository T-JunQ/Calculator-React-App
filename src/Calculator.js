import styles from "./Calculator.css";
import { getByDisplayValue, render } from "@testing-library/react";
import { useEffect, useReducer, useState } from "react";
import { useInRouterContext } from "react-router-dom";
import { e, isOperatorNode, round } from "mathjs";

export default function Calculator() {
  const operators = ["+", "-", "*", "/", "%"];

  const calculatorLayout = [
    ["C", "AC", "%", "/"],
    ["1", "2", "3", "+"],
    ["4", "5", "6", "-"],
    ["7", "8", "9", "*"],
    ["0", ".", "Enter"],
  ];

  const [inputVal, setInputVal] = useState("");
  const [isOutput, setIsOutput] = useState(false);
  const [history, setHistory] = useState([]);

  function handleNumInput(val) {
    let isValidInput = true;

    if (operators.includes(val)) {
      if (isNaN(Number(inputVal[inputVal.length - 1]))) {
        isValidInput = false;
      }
    }

    if (val === ".") {
      if (isNaN(Number(inputVal[inputVal.length - 1]))) {
        isValidInput = false;
      }

      let operatorIndex = -1;
      operators.forEach((operator) => {
        let index = inputVal.lastIndexOf(operator);
        if (index !== -1 && index <= inputVal.length) {
          operatorIndex = index;
        }
      });

      if (operatorIndex !== -1) {
        const num = inputVal.slice(inputVal.indexOf(operatorIndex));
        console.log("num", num);
        if (num.includes(".")) {
          isValidInput = false;
        }
      } else if (inputVal.includes(".")) {
        isValidInput = false;
      }
    }

    if (isValidInput) {
      if (inputVal === "Undefined" || inputVal === "Infinity") {
        setInputVal(val);
      } else {
        setInputVal(inputVal + val);
      }
    }
  }

  function handleEnter() {
    var operatorsInInput = [];
    let allowCalculations = true;

    for (let i = 0; i < inputVal.length; i++) {
      const char = inputVal[i];

      if (operators.includes(char)) {
        operatorsInInput.push(char);

        if (inputVal.endsWith(char)) {
          allowCalculations = false;
        }
      }
    }

    if (operatorsInInput.length !== 0 && allowCalculations) {
      const numbersInInput = splitByList(inputVal, operators);
      var output = numbersInInput[0];
      for (let i = 1; i < numbersInInput.length; i++) {
        console.log(numbersInInput);
        output = calculate(output, numbersInInput[i], operatorsInInput[i - 1]);
        console.log("Output:", output, i);
      }

      let newHistory = history.slice();
      newHistory.push(inputVal);
      setHistory(newHistory);

      setInputVal(
        output != null || output != undefined
          ? round(Number(output), 5).toString()
          : "Undefined"
      );

      setIsOutput(true);
    }
  }

  function splitByList(string, delimiters) {
    var splitString = string + "";
    var output = "";

    for (let i = 0; i < splitString.length; i++) {
      const char = splitString[i];
      if (operators.includes(char)) {
        output += ",";
      } else {
        output += char;
      }
    }

    return output.split(",");
  }

  function calculate(a, b, operator) {
    a = Number(a);
    b = Number(b);
    switch (operator) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "/":
        return a / b;
      case "*":
        return a * b;
      case "%":
        return a % b;
      default:
        return null;
    }
  }

  function handleAC() {
    setInputVal("");
  }

  function handleC() {
    if (inputVal == "Undefined" || inputVal == "Infinity") {
      setInputVal("");
    } else if (inputVal.length > 1) {
      const newInput = inputVal.slice(0, -1);
      setInputVal(newInput);
    } else {
      setInputVal("");
    }
  }

  function handleInputs(input) {
    console.log(input);

    console.log();

    if (
      calculatorLayout.toString().split(",").includes(input) ||
      input === "Backspace"
    ) {
      switch (input) {
        case "Enter":
          handleEnter();
          break;
        case "AC":
          handleAC();
          break;
        case "Backspace":
          handleC();
          break;
        case "C":
          handleC();
          break;
        default:
          if (isOutput) {
            console.log(isOutput);
            setInputVal("");
            setIsOutput(false);
          }
          handleNumInput(input);
      }
    }
  }

  function historyBack(value) {
    setInputVal(value);
  }

  function clearHistory() {
    var arr = [];
    setHistory(arr);
  }

  useEffect(() => {
    function handleKeyDown(event) {
      handleInputs(event.key);
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <>
      <h1>Calculator</h1>
      <div className="calFlex">
        <table className="cal">
          <tbody>
            <tr>
              <td colSpan={4} className="displayInput">
                {inputVal}
              </td>
            </tr>

            {calculatorLayout.map((row, i) => (
              <tr key={i}>
                {row.map((value, j) => (
                  <td
                    key={j}
                    {...(value === "Enter"
                      ? {
                          colSpan: 2,
                        }
                      : {})}
                  >
                    <button
                      onClick={() => {
                        handleInputs(value);
                      }}
                    >
                      {value}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {history.length === 0 ? (
          ""
        ) : (
          <table className="history">
            <tbody>
              <tr>
                <th>History</th>
              </tr>

              <button
                onClick={clearHistory}
                style={{
                  marginBottom: 10,
                  marginTop: 5,
                  padding: 5,
                  backgroundColor: "#003399",
                  color: "white",
                }}
              >
                Clear History
              </button>

              {history.map((v, i) => (
                <tr>
                  <td className="historyButton">
                    <button onClick={() => historyBack(v)}>{v}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
