import React, {useState} from "react";

const ImageUpload = () => {

    const [image,setimage] = useState(null);
    const [name,setname] = useState("");
    
    

    const handleImage = (e) => {
        setimage(e.target.files[0]);
    }

    const handleName = (e) => {
        setname(e.target.value);
    }

    const handleSubmit = (e) => {
    e.preventDefault();
    const formatodata = new FormData();

    formatodata.append('image',image);
    formatodata.append('name',name);


    fetch('http://localhost:5000/upload',{
        method:'POST',
        body: JSON.stringify(formatodata), // data é o corpo da solicitação que você está enviando
  headers: {
    'Content-Type': 'application/json'}
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:',error)
    } ) 
    }




    return (
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Upload Image</label>
            <input type="file" onChange={handleImage} className="mt-1 block w-full" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Image Name</label>
            <input type="text" value={name} onChange={handleName} className="mt-1 block w-full" />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Upload</button>
        </form>
      );
    


};

export default ImageUpload; 