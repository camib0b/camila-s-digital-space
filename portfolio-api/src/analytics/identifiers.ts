/**
 * Convert a 9-character CUSIP into an ISIN check digit.
 * Verified against United Airlines CUSIP 910047109 → US9100471096.
 */
export function cusipToIsin(countryCode: string, cusip: string): string | null {
  if (!/^[A-Z]{2}$/.test(countryCode) || !/^[0-9A-Z*@#]{9}$/.test(cusip)) {
    return null;
  }
  const body = `${countryCode}${cusip}`;
  let digits = "";
  for (const character of body) {
    if (character >= "0" && character <= "9") {
      digits += character;
    } else {
      digits += String(character.charCodeAt(0) - 55);
    }
  }

  let total = 0;
  const reversed = digits.split("").reverse();
  for (let index = 0; index < reversed.length; index += 1) {
    const character = reversed[index];
    if (character === undefined) {
      return null;
    }
    let value = Number(character);
    if (index % 2 === 0) {
      value *= 2;
      if (value > 9) {
        value -= 9;
      }
    }
    total += value;
  }
  const checkDigit = (10 - (total % 10)) % 10;
  return `${body}${checkDigit}`;
}
