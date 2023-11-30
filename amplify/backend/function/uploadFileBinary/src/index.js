const PDFParser = require("pdf-parse");

exports.handler = async (event) => {
    console.log(event);
    console.log(event.body);
    const pdfData = event.body;
    //const pdfData = jsonObj.pdfData;
    // return {
    //     statusCode: 205,
    //     headers: {
    //       "Access-Control-Allow-Origin": "*",
    //       "Access-Control-Allow-Headers": "*"
    //     },
    //     body: "Missing PDF data in the request body."+jsonObj,
    //   };
  
    if (!pdfData) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*"
        },
        body: "Missing PDF data in the request body."+pdfData,
      };
    }
  
    try {
      const pdfBuffer = Buffer.from(pdfData, "base64");
      const pdf = await PDFParser.pdf2json(pdfBuffer);
      const plainText = pdf.text; // Extract plain text from the PDF file
  
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*"
        },
        body: plainText,
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "AccessControl-Allow-Headers": "*"
        },
        body: "Error parsing the PDF file."+pdfData,
      };
    }
  };