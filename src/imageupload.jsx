import React, { useState } from 'react';
import { storage } from './cloudConfig';
import { ref, uploadBytes } from 'firebase/storage';

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const resizeImage = (image) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous'; // Habilitar CORS

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = 400;
        let height = 250;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Converter canvas para base64
        const dataUrl = canvas.toDataURL('image/jpeg');

        resolve(dataUrl);
      };

      img.onerror = (error) => reject(error);

      img.src = URL.createObjectURL(image);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const storageRef = ref(storage, `images/${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const resizedImageUrl = await resizeImage(file); // Redimensionar imagem
      setImages([...images, resizedImageUrl]);
      console.log('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-center mb-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input 
            type="file" 
            onChange={handleFileChange} 
            className="border border-gray-300 rounded-lg p-2 bg-white text-gray-900 shadow-sm focus:outline-none focus:ring focus:ring-blue-400 focus:border-blue-500" 
          />
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Upload
          </button>
        </form>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {images.map((url, index) => (
          <img 
            key={index} 
            src={url} 
            alt={`Uploaded ${index}`} 
            className="w-full h-auto rounded shadow" 
          />
        ))}
      </div>
    </div>
  );
  

};

export default ImageUpload;
