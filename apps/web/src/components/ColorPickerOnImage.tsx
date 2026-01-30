import { useState, useRef, useEffect } from 'react';
import { HoldColorIndicator } from './HoldColorIndicator';

interface ColorPickerOnImageProps {
  imageUrl: string;
  onColorSelect: (hexColor: string) => void;
  selectedColor?: string;
  colorCategory?: string;
}

export const ColorPickerOnImage = ({
  imageUrl,
  onColorSelect,
  selectedColor,
  colorCategory,
}: ColorPickerOnImageProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [color, setColor] = useState<string>(selectedColor || '');
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    setColor(selectedColor || '');

    if (!canvasRef.current || !imageRef.current || !imageUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    let objectUrl: string | null = null;

    const loadImageAsBlob = async () => {
      try {
        // Use proxy for external images
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const proxyUrl = `${apiUrl}/api/image/proxy?url=${encodeURIComponent(imageUrl)}`;

        // Fetch image as blob
        const response = await fetch(proxyUrl);

        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        const blob = await response.blob();

        // Create local blob URL
        objectUrl = URL.createObjectURL(blob);

        // Load image from blob URL
        img.onload = () => {
          try {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx?.drawImage(img, 0, 0);
            setImageLoaded(true);
            setImageError(false);
          } catch (err) {
            console.error('Error drawing image on canvas:', err);
            setImageError(true);
            setImageLoaded(false);
          }
        };

        img.onerror = () => {
          console.error('Failed to load blob image');
          setImageError(true);
          setImageLoaded(false);
        };

        img.src = objectUrl;
      } catch (err) {
        console.error('Error loading image:', err);
        setImageError(true);
        setImageLoaded(false);
      }
    };

    loadImageAsBlob();

    // Cleanup: revoke object URL when component unmounts or imageUrl changes
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [imageUrl, selectedColor]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2])
      .toString(16)
      .slice(1)
      .toUpperCase()}`;

    setColor(hex);
    onColorSelect(hex);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    setCursorPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="color-picker-on-image">
      <p className="text-sm font-semibold text-mono-900 mb-2">
        Couleur physique des prises *
      </p>
      <p className="text-xs text-mono-500 mb-3">
        Cliquez sur une prise dans l'image pour détecter sa couleur réelle
      </p>

      {imageError && (
        <div className="p-4 bg-urgent/10 border border-urgent/20 rounded-xl text-urgent text-sm mb-3">
          Erreur lors du chargement de l'image. Veuillez réessayer.
        </div>
      )}

      <div className="relative inline-block w-full">
        <img
          ref={imageRef}
          alt="Route"
          className="hidden"
        />

        {!imageLoaded && !imageError && (
          <div className="flex items-center justify-center h-64 bg-mono-100 rounded-xl border-2 border-mono-200">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mono-900 mx-auto mb-3"></div>
              <p className="text-sm text-mono-600">Chargement de l'image...</p>
            </div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          onClick={imageLoaded ? handleCanvasClick : undefined}
          onMouseMove={imageLoaded ? handleCanvasMouseMove : undefined}
          onMouseLeave={() => setCursorPosition(null)}
          className={`max-w-full border-2 rounded-xl transition-opacity ${
            imageLoaded
              ? 'cursor-crosshair border-mono-300 opacity-100'
              : 'opacity-0 border-mono-200 pointer-events-none'
          }`}
          style={{ maxHeight: '500px', display: imageLoaded ? 'block' : 'none' }}
        />

        {/* Hold Color Indicator - Displayed in top-right corner when color is selected */}
        {color && imageLoaded && (
          <div className="absolute top-4 right-4 pointer-events-none">
            <HoldColorIndicator holdColorHex={color} size={80} className="drop-shadow-xl" />
          </div>
        )}

        {cursorPosition && imageLoaded && (
          <div
            className="absolute w-8 h-8 border-2 border-white rounded-full pointer-events-none"
            style={{
              left: cursorPosition.x - 16,
              top: cursorPosition.y - 16,
              boxShadow: '0 0 0 1px black',
            }}
          />
        )}
      </div>

      {color && (
        <div className="mt-4 flex items-center gap-3 p-3 bg-mono-100 rounded-xl">
          <HoldColorIndicator holdColorHex={color} size={64} />
          <div className="flex-1">
            <p className="text-xs font-medium text-mono-500 uppercase tracking-wider">
              Couleur sélectionnée
            </p>
            <p className="text-lg font-mono font-bold text-mono-900">
              {color}
            </p>
            {colorCategory && (
              <p className="text-xs text-mono-600 mt-1">
                Catégorie: <span className="font-semibold capitalize">{colorCategory}</span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
