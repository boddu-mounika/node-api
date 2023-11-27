const PDFParser = require("pdf-parse");

exports.handler = async (event) => {
  const { pdfData } = event.body;
  const pdfBuffer = Buffer.from(pdfData, "base64");
  //console.log()
  try {
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
        "Access-Control-Allow-Headers": "*"
        
      },
      body: "Error parsing the PDF file.",
    };
  }
};

// const pdfParse = require("pdf-parse");

// exports.handler = async (event) => {
//     // let base64string = event.body ;
//     // let bufferObj = Buffer.from(base64string, "base64");
//     // let decodedString = bufferObj.toString("utf8");
//     // return{
//     //     headers: {
//     //         "Access-Control-Allow-Origin": "*",
//     //         "Access-Control-Allow-Headers": "*",
//     //         "Content-Type":"multipart/form-data"
//     //     },
//     //     statusCode: 205,
//     //     body:JSON.stringify(event)
//     // };

//     if (!event.files) {
//         return {
//             statusCode: 400,
//         //  Uncomment below to enable CORS requests
//          headers: {
//              "Access-Control-Allow-Origin": "*",
//              "Access-Control-Allow-Headers": "*"
//          },
//             body: JSON.stringify("No file inpput"+result.text),

//         };
//       }
//     pdfParse(event.files.pdfFile).then((result) => {
//         return {
//             statusCode: 200,
//         //  Uncomment below to enable CORS requests
//          headers: {
//              "Access-Control-Allow-Origin": "*",
//              "Access-Control-Allow-Headers": "*"

//          },
//             body: JSON.stringify(result.text),

//         };
//     }).catch((error)=>{
//         return {
//             statusCode: 400,
//         //  Uncomment below to enable CORS requests
//          headers: {
//              "Access-Control-Allow-Origin": "*",
//              "Access-Control-Allow-Headers": "*"
//          },
//             body: error,
//         };
//     });
// };
