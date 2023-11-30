

function AddNewCase() {
    return (
      <h1>Hello!</h1>
    );
  }
  
  export default AddNewCase;


  // const reader = new FileReader();

  //   reader.onload = async (event) => {
  //     const fileData = event.target.result;
  //     try {
  //       const response = await API.post(myAPI, path, {
  //         body: { pdfData: fileData },
  //       });

  //       console.log(response); // Handle the response from Lambda
  //       let myregexp = new RegExp("\\s+[0-9]+\\.+\\s");

  //       let text = response.data;
  //       const myArray = text.split(myregexp);
  //       setState({ ...state, questions: myArray, inpFile: file });
  //       console.log(myArray);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   reader.readAsDataURL(file);