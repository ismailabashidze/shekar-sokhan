export function isValidJSON(jsonString: string) {
  try {
    const jsonObject = JSON.parse(jsonString);
    return {
      valid: true,
      parsedObject: jsonObject,
    };
  }
  catch (e) {
    return {
      valid: false,
      error: e.message,
    };
  }
}
export function checkJSONStructure(parsedObject: object, requiredKeys: string[]) {
  const keys = Object.keys(parsedObject);
  const missingKeys = requiredKeys.filter(key => !keys.includes(key));
  return {
    keys: keys,
    missingKeys: missingKeys,
  };
}
