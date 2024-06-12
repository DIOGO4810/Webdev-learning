import React, { useState, useEffect } from 'react';
import { ref, listAll, getDownloadURL, getMetadata, deleteObject } from 'firebase/storage';
import { storage } from './cloudConfig'; // Importe a instância do Firebase Storage



const Gallery = () => {
    const [images, setImages] = useState({});
    const [hoveredImage, setHoveredImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        displayImages();
    }, []);

    const displayImages = async () => {
        try {
            const imagesRef = ref(storage, 'images');
            const imageList = await listAll(imagesRef);

            const imagesByDate = {};
            await Promise.all(imageList.items.map(async (imageRef) => {
                const [imageUrl, metadata] = await Promise.all([
                    getDownloadURL(imageRef),
                    getMetadata(imageRef),
                ]);

                const date = new Date(metadata.timeCreated).toLocaleDateString();

                if (!imagesByDate[date]) {
                    imagesByDate[date] = [];
                }
                imagesByDate[date].push({ url: imageUrl, ref: imageRef.fullPath });
            }));

            setImages(imagesByDate);
        } catch (error) {
            console.error('Error loading images:', error);
        }
    };



    const deleteImage = async (imagePath, index) => {
        try {
            const imageRef = ref(storage, imagePath);
            await deleteObject(imageRef);
            setImages((prevImages) => {
                const newImages = { ...prevImages };
                for (const date in newImages) {
                    newImages[date] = newImages[date].filter((image) => image.ref !== imagePath);
                    if (newImages[date].length === 0) delete newImages[date];
                }
                return newImages;
            });
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

    const openLightbox = (image) => {
        setSelectedImage(image);
    };

    const closeLightbox = () => {
        setSelectedImage(null);
    };

    return (
        <div className="container ml-4 mr-4 py-4">
            {Object.keys(images).map((date) => (
                <div key={date} className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">{date}</h2>
                    <div className="grid grid-cols-8 gap-4">
                        {images[date].map((image, index) => (
                            <div
                                key={index}
                                className="relative flex-grow overflow-hidden"
                                onMouseEnter={() => setHoveredImage(`${date}-${index}`)}
                                onMouseLeave={() => setHoveredImage(null)}
                            >
                                <div className="relative overflow-hidden cursor-pointer">
                                    <img 
                                        src={image.url} 
                                        alt={`Imagem ${index + 1}`} 
                                        className="w-full h-auto object-cover max-w-xs"
                                        loading="lazy" 
                                        onClick={() => openLightbox(image)}
                                    />
                                    {hoveredImage === `${date}-${index}` && (
                                        <div >
                                            <img
                                                src={`${process.env.PUBLIC_URL}/delete.png`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteImage(image.ref, index);
                                                }}
                                                className="absolute top-0 right-0 cursor-pointer bg-blue-500 hover:bg-blue-600 p-0.5 rounded shadow"
                                                alt=''
                                            />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToAlbum(image.ref, index);
                                                }}
                                                className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white font-bold text-2xl p-1 rounded-full shadow cursor-pointer"
                                            >
                                                +
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {selectedImage && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75"
                    onClick={closeLightbox}
                >
                    <div className="relative max-w-3xl max-h-3/4">
                        <img 
                            src={selectedImage.url} 
                            alt="Imagem maior" 
                            className="max-w-full max-h-full object-contain"
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                closeLightbox();
                            }}
                            className="absolute top-0 right-0 m-4 bg-white text-black rounded-full p-2"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
