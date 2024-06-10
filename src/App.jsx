import React, { useState } from 'react';
import ImageUpload from './imageupload';
import Gallery from './displayGallery';

const App = () => {
  const [showGallery, setShowGallery] = useState(false);

  const handleToggleGallery = () => {
    setShowGallery(!showGallery);
  };

  return (
    <div className="App">
      {showGallery ? (
        <Gallery />
      ) : (
        <ImageUpload />
      )}
<div className="fixed top-0 right-0 p-4">
  <button onClick={handleToggleGallery} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow">
    {showGallery ? 'Hide Gallery' : 'Show Gallery'}
  </button>
</div>

    </div>
  );
};

export default App;
