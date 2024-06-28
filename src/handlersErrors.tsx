import { voidishEl, voidishStr } from "./declarations/types";

export function htmlElementNotFound(
  el: voidishEl,
  context: string,
  acceptedTypes: string[] = ["HTMLElement"]
): Error {
  const message = `HTMLELEMENT ERROR:
  The page experienced an error while validating an HTMLElement for ${context}.
  Obtained element id ${el?.id ?? "null"};
  Obtained element tag ${el?.tagName ?? "undefined"};
  Accepted types: ${JSON.stringify(acceptedTypes)
    .replace("[", "")
    .replace("]", "")}`;
  console.error(message);
  return new Error(message);
}

export function elementNotFound(
  el: voidishEl,
  context: string,
  acceptedTypes: string[]
): Error {
  const message = `ELEMENT ERROR:
  The page experienced an error while validating an Element for ${
    context || "Undetermined context"
  }.
  Obtained element id ${el?.id ?? "null"};
  Obtained element tag ${el?.tagName ?? "undefined"};
  Accepted types: ${JSON.stringify(acceptedTypes)
    .replace("[", "")
    .replace("]", "")}`;
  console.error(message);
  return new Error(message);
}

export function typeError(
  value: any,
  context: string,
  acceptedTypes: string[]
): Error {
  const message = `TYPE ERROR:
  The page experienced an error while validating the type of a variable or constant for ${
    context || "Undetermined context"
  }.
  Obtained value: ${value ?? "nullish"};
  Accepted Types: ${JSON.stringify(acceptedTypes)
    .replace("[", "")
    .replace("]", "")}}`;
  console.error(message);
  return new Error(message);
}

export function numberError(value: any, context: string): Error {
  const message = `NUMBER ERROR:
  The page experienced an error while validating a variable or constant number for ${
    context || "Undetermined context"
  }.
  Obtained value: ${value ?? "nullish"}`;
  console.error(message);
  return new Error(message);
}

export function argsError(acceptedTypes: string[], ...values: any[]): Error {
  let message = `ARGUMENTS ERROR:
  The webpage experienced an error while trying to argument for a function
  Accepted Types: ${JSON.stringify(acceptedTypes)
    .replace("[", "")
    .replace("]", "")}`;
  for (let v = 0; v < values.length; v++)
    message += `\nObtained Value and Instance: ${values[v] ?? "nullish"}, ${
      values[v].constructor.name
    }`;
  console.error(message);
  return Error(message);
}

export function stringError(
  fetchedStr: voidishStr,
  expectedPattern: string
): Error {
  const message = `STRING ERROR: 
  Obtained value ${fetchedStr};
  Expected pattern of value: ${expectedPattern}`;
  console.error(message);
  return new Error(message);
}

export function parseFinite(
  value: string,
  context: string = "float",
  def: number = 0
): number {
  try {
    if (typeof value !== "string")
      throw typeError(value, `reading first argument of parseFinite`, [
        "string",
      ]);
    if (typeof context !== "string")
      throw typeError(context, `reading second argument of parseFinite`, [
        "string",
      ]);
    if (context !== "int" && context !== "float")
      throw stringError(context, '"int" or "float"');
    if (typeof def !== "number")
      throw typeError(def, `reading third argument of parseFinite`, ["number"]);
    // @ts-ignore
    if (Number.isFinite) {
      if (context === "float") {
        if (!Number.isFinite(parseFloat(value))) {
          console.warn(`Error processing parseFloat. Value defaulted`);
          return def;
        } else return parseFloat(value);
      } else {
        if (!Number.isFinite(parseInt(value))) {
          console.warn(`Error processing parseInt. Value defaulted`);
          return def;
        } else return parseInt(value);
      }
    } else {
      console.warn(
        `The current browser does not support ES6. Please update your current active browser. That might result in misleading numbers.`
      );
      if (context === "float") {
        if (isNaN(parseFloat(value)) || parseFloat(value) === Infinity) {
          console.warn(`Error processing parseFloat. Value defaulted`);
          return def;
        } else return parseFloat(value);
      } else {
        if (isNaN(parseInt(value)) || parseInt(value) === Infinity) {
          console.warn(`Error processing parseInt. Value defaulted`);
          return def;
        } else return parseInt(value);
      }
    }
  } catch (err) {
    console.error(`Error executing parseFinite():
    ${(err as Error).message}`);
    return -1;
  }
}
