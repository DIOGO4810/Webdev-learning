import React, { useState, useEffect } from 'react';
import { ref, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './cloudConfig'; // Importe a instância do Firebase Storage

const resizeImage = async (imageUrl) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // Habilitar CORS

        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = 300;
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

        img.src = imageUrl;
    });
};

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [addToAlbumIndex, setAddToAlbumIndex] = useState(null);

    useEffect(() => {
        displayImages();
    }, []);

    const displayImages = async () => {
        try {
            const imagesRef = ref(storage, 'images');
            const imageList = await listAll(imagesRef);

            const cachedImages = {}; // Cache para imagens redimensionadas

            const imageUrls = await Promise.all(imageList.items.map(async (imageRef) => {
                const imageUrl = await getDownloadURL(imageRef);
                
                // Verificar se a imagem redimensionada está no cache
                if (cachedImages[imageUrl]) {
                    return { resizeUrl: cachedImages[imageUrl], ref: imageRef.fullPath };
                } else {
                    try {
                        const resizeUrl = await resizeImage(imageUrl);
                        cachedImages[imageUrl] = resizeUrl; // Armazenar no cache
                        return { resizeUrl, ref: imageRef.fullPath };
                    } catch (error) {
                        console.error('Error resizing image:', error);
                        return null;
                    }
                }
            }));

            // Filtrar imagens nulas
            const filteredImages = imageUrls.filter((image) => image !== null);
            setImages(filteredImages);
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
            console.log('Image added to album successfully.');
        } catch (error) {
            console.error('Error adding image to album:', error);
        }
    };

    return (
        <div className="container ml-4 mr-4 py-4">
            <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="relative flex-grow mr-2 mb-2"
                        onMouseEnter={() => {
                            setDeleteIndex(index);
                            setAddToAlbumIndex(index);
                        }}
                        onMouseLeave={() => {
                            setDeleteIndex(null);
                            setAddToAlbumIndex(null);
                        }}
                    >
                        <div className="relative overflow-hidden">
                            <img src={                            image.resizeUrl
                        } alt={`Imagem ${index + 1}`} className="w-full h-auto" loading="lazy" />
                        {deleteIndex === index && (
                            <img
                                src={`${process.env.PUBLIC_URL}/delete.png`}
                                onClick={() => deleteImage(image.ref, index)}
                                className="absolute top-0 right-0 cursor-pointer bg-blue-500 hover:bg-blue-600 p-0.5 rounded shadow"
                                alt=''
                            />
                        )}
                        {addToAlbumIndex === index && (
                            <button onClick={() => addToAlbum(image.ref, index)} className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white font-bold text-2xl p-1 rounded-full shadow cursor-pointer"> + </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
);
};

export default Gallery;

