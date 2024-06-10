import React, { useState, useEffect } from 'react';
import { ref, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './cloudConfig'; // Importe a instância do Firebase Storage

const resizeImage = (imageUrl, width, height) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // Habilitar CORS

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Converter canvas para base64
            const dataUrl = canvas.toDataURL('image/jpeg');

            resolve(dataUrl);
        };

        img.onerror = (error) => reject(error);

        img.src = imageUrl;
    });
};

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [deleteIndex, setDeleteIndex] = useState(null); // Estado para controlar o ícone de exclusão
    const [addToAlbumIndex, setAddToAlbumIndex] = useState(null); // Estado para controlar o ícone de adição ao álbum

    useEffect(() => {
        displayImages();
    }, []); // Executar apenas uma vez ao montar o componente

    const displayImages = async () => {
        try {
            // List all images in the 'images' folder
            const imagesRef = ref(storage, 'images');
            const imageList = await listAll(imagesRef);

            // Get download URLs for each image
            const imageUrls = await Promise.all(imageList.items.map(async (imageRef) => {
                const imageUrl = await getDownloadURL(imageRef);
                const lowResUrl = await resizeImage(imageUrl, 100, 100); // Versão de baixa resolução
                const highResUrl = await resizeImage(imageUrl, 500, 300); // Versão de alta resolução
                return { lowResUrl, highResUrl, ref: imageRef.fullPath };
            }));

            // Update state with image data
            setImages(imageUrls);
        } catch (error) {
            console.error('Error loading images:', error);
        }
    };

    const deleteImage = async (imagePath, index) => {
        try {
            const imageRef = ref(storage, imagePath);
            await deleteObject(imageRef);
            setImages((prevImages) => prevImages.filter((image) => image.ref !== imagePath));
            console.log('Image deleted successfully.');
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    const addToAlbum = async (imagePath, index) => {
        try {
            // Lógica para adicionar a imagem ao álbum
            console.log('Image added to album successfully.');
        } catch (error) {
            console.error('Error adding image to album:', error);
        }
    };

    return (
        <div className="container ml-4 mr-4 py-4">
            <div className="flex flex-wrap">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="relative mr-2 mb-2"
                        onMouseEnter={() => {
                            setDeleteIndex(index);
                            setAddToAlbumIndex(index);
                        }}
                        onMouseLeave={() => {
                            setDeleteIndex(null);
                            setAddToAlbumIndex(null);
                        }}
                    >
                        <img src={image.highResUrl} alt={`Imagem ${index + 1}`} className="max-w-full max-h-full" />
                        {deleteIndex === index && (
                            <img
                                src={`${process.env.PUBLIC_URL}/delete.png`}
                                onClick={() => deleteImage(image.ref, index)}
                                className="absolute top-0 right-0 cursor-pointer bg-blue-500 hover:bg-blue-600 p-0.5 rounded shadow "
                                alt=''
                            />
                        )}
                        {addToAlbumIndex === index && (
                            <button onClick={() => addToAlbum(image.ref, index)} className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white font-bold text-2xl p-1 rounded-full shadow cursor-pointer"> + </button>
                            
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;
