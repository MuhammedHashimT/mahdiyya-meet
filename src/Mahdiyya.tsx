import React, { useState, useRef } from 'react';
import { Download, Upload, X } from 'lucide-react';

const MahdiyyaFrameGenerator = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [frameImage, setFrameImage] = useState('./frame.png');
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(1);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const frameInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFrameUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFrameImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadFramedImage = () => {
    if (!frameImage) {
      alert('Please upload a frame image first!');
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const frame = new Image();
    frame.onload = () => {
      // Set canvas size to match the frame image
      canvas.width = frame.width;
      canvas.height = frame.height;
      
      // Draw the frame as background
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
      
      // If there's an uploaded image, draw it on top
      if (uploadedImage) {
        const img = new Image();
        img.onload = () => {
          // Calculate the content area (adjust these values based on your frame)
          const contentArea = {
            x: canvas.width * 0.05, // 5% from left
            y: canvas.height * 0.2,  // 20% from top
            width: canvas.width * 0.9, // 90% of width
            height: canvas.height * 0.5 // 50% of height
          };
          
          // Save context for clipping
          ctx.save();
          ctx.beginPath();
          ctx.rect(contentArea.x, contentArea.y, contentArea.width, contentArea.height);
          ctx.clip();
          
          // Calculate scaled dimensions
          const scaledWidth = img.width * imageScale;
          const scaledHeight = img.height * imageScale;
          
          // Center the image in the content area and apply position offset
          const drawX = contentArea.x + contentArea.width/2 - scaledWidth/2 + imagePosition.x;
          const drawY = contentArea.y + contentArea.height/2 - scaledHeight/2 + imagePosition.y;
          
          ctx.drawImage(img, drawX, drawY, scaledWidth, scaledHeight);
          ctx.restore();
          
          // Download the combined image
          const link = document.createElement('a');
          link.download = 'mahdiyya-meet-framed.png';
          link.href = canvas.toDataURL();
          link.click();
        };
        img.src = uploadedImage;
      } else {
        // Download frame only
        const link = document.createElement('a');
        link.download = 'mahdiyya-meet-frame.png';
        link.href = canvas.toDataURL();
        link.click();
      }
    };
    frame.src = frameImage;
  };

  // Remove the drawFrame, drawFrameOverlay, drawCherryBlossoms, drawCrowdSilhouette, and drawDecorations functions
  // as they are no longer needed

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-8">
          Mahdiyya Meet Frame Generator
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Controls</h2>
            
            <div className="space-y-4">
             

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Content Image
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                >
                  <Upload size={20} />
                  Choose Content Image
                </button>
              </div>
              
              {uploadedImage && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Scale: {imageScale.toFixed(1)}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={imageScale}
                      onChange={(e) => setImageScale(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horizontal Position: {imagePosition.x}px
                    </label>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={imagePosition.x}
                      onChange={(e) => setImagePosition(prev => ({...prev, x: parseInt(e.target.value)}))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vertical Position: {imagePosition.y}px
                    </label>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={imagePosition.y}
                      onChange={(e) => setImagePosition(prev => ({...prev, y: parseInt(e.target.value)}))}
                      className="w-full"
                    />
                  </div>
                  
                  <button
                    onClick={() => {
                      setUploadedImage(null);
                      setFrameImage(null);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X size={20} />
                    Clear All Images
                  </button>
                </>
              )}
              
              <button
                onClick={downloadFramedImage}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download size={20} />
                Download Framed Image
              </button>
            </div>
          </div>
          
          {/* Preview */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Preview</h2>
            
            <div className="relative">
              <FramePreview 
                frameImage={frameImage}
                uploadedImage={uploadedImage}
                imagePosition={imagePosition}
                imageScale={imageScale}
              />
            </div>
          </div>
        </div>
        
        {/* Hidden canvas for download */}
        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

const FramePreview = ({ frameImage, uploadedImage, imagePosition, imageScale }) => {
  if (!frameImage) {
    return (
      <div className="w-full max-w-sm mx-auto h-96 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Upload size={48} className="mx-auto mb-2" />
          <p className="text-sm">Upload frame image first</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="relative rounded-lg overflow-hidden shadow-lg">
        {/* Content image as background */}
        {uploadedImage && (
          <div 
            className="absolute inset-0"
            style={{
              top: '0%',
              left: '0%',
              right: '0%',
              bottom: '0%',
              overflow: 'hidden',
              zIndex: 0
            }}
          >
            <img
              src={uploadedImage}
              alt="Content"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
            transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale})`,
            transformOrigin: 'center'
              }}
            />
          </div>
        )}

        {/* Frame image as foreground */}
        <img 
          src={frameImage} 
          alt="Frame" 
          className="w-full h-auto block relative z-10"
        />
        
        
        {/* Overlay message when no content image */}
        {!uploadedImage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="bg-black bg-opacity-50 text-white p-4 rounded-lg text-center"
              style={{
                top: '20%',
                position: 'absolute'
              }}
            >
              <Upload size={32} className="mx-auto mb-2" />
              <p className="text-sm">Upload content image</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MahdiyyaFrameGenerator;