import React, { useState } from 'react';
import ImageUpload from './imageupload';
import Gallery from './displayGallery';
import Footer from './footer';

const App = () => {
  const [showGallery, setShowGallery] = useState(false);

  const handleToggleGallery = () => {
    setShowGallery(!showGallery);
  };

  return (
    <div className="App flex flex-col min-h-screen">
      <header className="flex items-center h-16 bg-zinc-900 p-4">
        <h1 className="text-4xl font-extrabold text-blue-500 tracking-wide">
          PhotoVault
        </h1>
        <div className="ml-auto">
          <button
            onClick={handleToggleGallery}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow"
          >
            {showGallery ? 'Home' : 'Gallery'}
          </button>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4">
        {showGallery ? (
          <div className='mt-8'>
            <Gallery />
          </div>
        ) : (
          <div className='flex justify-center'>
            <ImageUpload />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
