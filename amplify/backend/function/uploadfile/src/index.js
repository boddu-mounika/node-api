
const pdfParse = require("pdf-parse");

exports.handler = async (event) => {
    var result = "NotWorked";
    pdfParse(event.files.pdfFile).then((result) => {
        if(result!=null)
            result="worked"
        // return {
        //     statusCode: 200,
        // //  Uncomment below to enable CORS requests
        //  headers: {
        //      "Access-Control-Allow-Origin": "*",
        //      "Access-Control-Allow-Headers": "*"
             
        //  },
        //     body: JSON.stringify(result.text),

        // };      
    })
    return {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
     headers: {
         "Access-Control-Allow-Origin": "*",
         "Access-Control-Allow-Headers": "*"
         
     },
        body: JSON.stringify(result),

    };     
    // console.log(event);
    // console.log(event.body);
    // pdfParse(event.files.pdfFile).then((result) => {
    //     return {
    //         statusCode: 200,
    //     //  Uncomment below to enable CORS requests
    //      headers: {
    //          "Access-Control-Allow-Origin": "*",
    //          "Access-Control-Allow-Headers": "*"
             
    //      },
    //         body: JSON.stringify(result.text),

    //     };      
    // }).catch((error)=>{
    //     return {
    //         statusCode: 400,
    //     //  Uncomment below to enable CORS requests
    //      headers: {
    //          "Access-Control-Allow-Origin": "*",
    //          "Access-Control-Allow-Headers": "*"
    //      },
    //         body: error,
    //     }; 
    // });
};
