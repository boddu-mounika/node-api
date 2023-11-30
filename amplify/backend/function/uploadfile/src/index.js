const PDFParser = require("pdf-parse");

// exports.handler = async (event) => {
//     const pdfData = event.body;
  
//     //if (!pdfData) {
//       return {
//         statusCode: 400,
//         headers: {
//           "Access-Control-Allow-Origin": "*",
//           "Access-Control-Allow-Headers": "*"
//         },
//         body: JSON.stringify(event.body),
//       };
//     //}
  
//     try {
//       const pdfBuffer = Buffer.from(pdfData, "base64");
//       const pdf = await PDFParser.pdf2json(pdfBuffer);
//       const plainText = pdf.text; // Extract plain text from the PDF file
  
//       return {
//         statusCode: 200,
//         headers: {
//           "Access-Control-Allow-Origin": "*",
//           "Access-Control-Allow-Headers": "*"
//         },
//         body: plainText,
//       };
//     } catch (error) {
//       console.error(error);
//       return {
//         statusCode: 500,
//         headers: {
//           "AccessControl-Allow-Headers": "*"
//         },
//         body: "Error parsing the PDF file.",
//       };
//     }
//   };
// const pdfParse = require("pdf-parse");

exports.handler = async (event) => {
    // let base64string = event.body ;
    // let bufferObj = Buffer.from(base64string, "base64");
    // let decodedString = bufferObj.toString("utf8");
    // return{
    //     headers: {
    //         "Access-Control-Allow-Origin": "*",
    //         "Access-Control-Allow-Headers": "*",
    //         "Content-Type":"multipart/form-data"
    //     },
    //     statusCode: 205,
    //     body:JSON.stringify(event)
    // };

    if (!event.body) {
        return {
            statusCode: 400,
        //  Uncomment below to enable CORS requests
         headers: {
             "Access-Control-Allow-Origin": "*",
             "Access-Control-Allow-Headers": "*"
         },
            body: "No file input",

        };
      }
    pdfParse(event.body).then((result) => {
        return {
            statusCode: 200,
        //  Uncomment below to enable CORS requests
         headers: {
             "Access-Control-Allow-Origin": "*",
             "Access-Control-Allow-Headers": "*"

         },
            body: JSON.stringify(result.text),

        };
    }).catch((error)=>{
        return {
            statusCode: 400,
        //  Uncomment below to enable CORS requests
         headers: {
             "Access-Control-Allow-Origin": "*",
             "Access-Control-Allow-Headers": "*"
         },
            body: JSON.stringify(event.body),
        };
    });
};
