function decodeformdata (input) {
  const boundaryRegex = /^--([^\r\n]+)/;
  const boundaryMatch = input.match(boundaryRegex);
  const boundary = boundaryMatch ? boundaryMatch[1] : null;

  if (boundary) {
    // Split the string into separate key-value pairs
    const keyValuePairs = input
      .split(`${boundary}--`)[0]
      .split(`${boundary}\r\n`)
      .slice(1);

    // Extract the data for each key-value pair
    const formData = {};
    keyValuePairs.forEach((pair) => {
      const match = pair.match(/name="([^"]+)"\r\n\r\n(.+)\r\n/);
      if (match) {
        const name = match[1];
        const value = match[2];
        formData[name] = value;
      }
    });

    console.log(formData);
    return formData;
  } else {
    console.log("Boundary not found in the encoded form data.");
    return null;
  }
};

module.exports.decodeformdata = decodeformdata;
