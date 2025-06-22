/* DOM references */
const display = document.getElementById("display");
const keys    = document.querySelector(".keys");

/* Calculator state */
let firstValue = "";
let operator   = "";
let awaitingSecondValue = false;

/* Core calculation */
function calculate(a, op, b) {
  const x = parseFloat(a);
  const y = parseFloat(b);

  switch (op) {
    case "add":       return x + y;
    case "subtract":  return x - y;
    case "multiply":  return x * y;
    case "divide":    return y === 0 ? "∞" : x / y;
    default:          return y;
  }
}

/* Event delegation for all buttons */
keys.addEventListener("click", (e) => {
  if (!e.target.matches("button")) return;

  const key        = e.target;
  const number     = key.dataset.number;
  const action     = key.dataset.action;
  const currentVal = display.textContent;

  /* ----- Number / decimal press ----- */
  if (number !== undefined) {
    if (currentVal === "0" || awaitingSecondValue) {
      display.textContent = number;
      awaitingSecondValue = false;
    } else {
      if (number === "." && currentVal.includes(".")) return; // prevent double dots
      display.textContent = currentVal + number;
    }
    return;
  }

  /* ----- Operator / utility press ----- */
  switch (action) {
    case "clear":
      firstValue = operator = "";
      awaitingSecondValue = false;
      display.textContent = "0";
      break;

    case "delete":
      display.textContent = currentVal.length > 1
        ? currentVal.slice(0, -1)
        : "0";
      break;

    case "calculate":
      if (!operator) return;
      const result = calculate(firstValue, operator, currentVal);
      display.textContent = result;
      firstValue          = String(result);
      operator            = "";
      awaitingSecondValue = false;
      break;

    /* Operators */
    case "add":
    case "subtract":
    case "multiply":
    case "divide":
      if (operator && awaitingSecondValue) {   // change operator mid-way
        operator = action;
        return;
      }

      if (!firstValue) {
        firstValue = currentVal;
      } else if (operator) {
        firstValue = String(calculate(firstValue, operator, currentVal));
        display.textContent = firstValue;
      }

      operator = action;
      awaitingSecondValue = true;
      break;
  }
});
