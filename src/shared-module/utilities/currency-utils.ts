import { isValidValue } from './helper-utils';

export function formatNumberToFloat(number): any {
    return parseFloat(number).toFixed(3);
}

export function defaultZero (amount: any, is_float: Boolean=true) {
  let num = amount;
  if (is_float) {
    num = parseFloat(formatNumberToFloat(amount));
  }
  if (isValidValue(num) && !isNaN(num)) {
    return num;
  } else {
    return 0;
  }
}

export function roundOffToCeilFloor(amount: any) {
  amount = Number(amount);
  let roundedoffAmount;
  const decimalPart = Math.abs(amount % 1);
  if (decimalPart === 0.5) {
    const rounded = Math.round(amount);
    if (rounded % 2 === 0) {
      roundedoffAmount = rounded;
    } else {
      roundedoffAmount = amount > 0 ? rounded - 1 : rounded + 1;
    }
  } else {
    roundedoffAmount = Math.round(amount);
  }
  return {
    roundOffAmount: (roundedoffAmount - amount).toFixed(3),
    roundedOffAmount: roundedoffAmount.toFixed(3)
  };
}

export function unRoundOffCeilFloor(roundedAmount: any, roundoffAmount: any) {
  roundedAmount = Number(roundedAmount);
  roundoffAmount = Number(roundoffAmount);
  if (roundoffAmount < .5) {
    return (roundedAmount + roundoffAmount).toFixed(3);
  } else {
    return (roundedAmount - roundoffAmount).toFixed(3);
  }
}