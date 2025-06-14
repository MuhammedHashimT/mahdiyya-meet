import React, { useState, useRef } from 'react';
import { Download, Upload, X } from 'lucide-react';

interface ImagePosition {
  x: number;
  y: number;
}

interface FramePreviewProps {
  frameImage: string | null;
  uploadedImage: string | null;
  imagePosition: ImagePosition;
  imageScale: number;
}

const MahdiyyaFrameGenerator: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [frameImage, setFrameImage] = useState<string>('./frame-2.png');
  const [imagePosition, setImagePosition] = useState<ImagePosition>({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setUploadedImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

 

  const downloadFramedImage = (): void => {
    if (!frameImage) {
      alert('Please upload a frame image first!');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const frame = new Image();
    frame.onload = () => {
      // Set canvas size to match the frame image
      canvas.width = frame.width;
      canvas.height = frame.height;
      
      // If there's an uploaded image, draw it first as background (same as preview)
      if (uploadedImage) {
        const img = new Image();
        img.onload = () => {
          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Calculate scaled dimensions
          const scaledWidth = img.width * imageScale;
          const scaledHeight = img.height * imageScale;
          
          // Center the image and apply position offset (same as preview)
          const drawX = canvas.width/2 - scaledWidth/2 + imagePosition.x;
          const drawY = canvas.height/2 - scaledHeight/2 + imagePosition.y;
          
          // Draw the background image without clipping
          ctx.drawImage(img, drawX, drawY, scaledWidth, scaledHeight);
          
          // Draw the frame on top
          ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
          
          // Download the combined image
          const link = document.createElement('a');
          link.download = 'mahdiyya-meet-framed.png';
          link.href = canvas.toDataURL();
          link.click();
        };
        img.src = uploadedImage;
      } else {
        // Clear canvas and draw frame only
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
        
        // Download frame only
        const link = document.createElement('a');
        link.download = 'mahdiyya-meet-frame.png';
        link.href = canvas.toDataURL();
        link.click();
      }
    };
    frame.src = frameImage;
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setImageScale(parseFloat(e.target.value));
  };

  const handlePositionXChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setImagePosition(prev => ({ ...prev, x: parseInt(e.target.value) }));
  };

  const handlePositionYChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setImagePosition(prev => ({ ...prev, y: parseInt(e.target.value) }));
  };

  const clearAllImages = (): void => {
    setUploadedImage(null);
    setFrameImage('./frame.png');
  };

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
                  onClick={() => fileInputRef.current?.click()}
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
                      onChange={handleScaleChange}
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
                      onChange={handlePositionXChange}
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
                      onChange={handlePositionYChange}
                      className="w-full"
                    />
                  </div>
                  
                  <button
                    onClick={clearAllImages}
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

            {/* Select the frame */}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frame Image
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFrameImage('./frame-1.png')}
                  className={`px-4 py-2 rounded-lg border ${frameImage === './frame-1.png' ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-pink-100'}`}
                >
                  Frame 1
                </button>
                <button
                  type="button"
                  onClick={() => setFrameImage('./frame-2.png')}
                  className={`px-4 py-2 rounded-lg border ${frameImage === './frame-2.png' ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-pink-100'}`}
                >
                  Frame 2
                </button>
                {/* <button
                  type="button"
                  onClick={() => setFrameImage('./frame-3.png')}
                  className={`px-4 py-2 rounded-lg border ${frameImage === './frame-3.png' ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-pink-100'}`}
                >
                  Frame 3
                </button> */}
              </div>
            </div>
            
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

const FramePreview: React.FC<FramePreviewProps> = ({ 
  frameImage, 
  uploadedImage, 
  imagePosition, 
  imageScale 
}) => {
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
              zIndex: 0
            }}
          >
            <img
              src={uploadedImage}
              alt="Content"
              className="absolute"
              style={{
                width: 'auto',
                height: 'auto',
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${imagePosition.x}px), calc(-50% + ${imagePosition.y}px)) scale(${imageScale})`,
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