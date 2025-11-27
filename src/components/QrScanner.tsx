import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { RotateCcw } from 'lucide-react';

interface QrScannerProps {
  onScan: (data: string | null) => void;
  onError: (error: string) => void;
  delay?: number;
  style?: React.CSSProperties;
}

const QrScanner: React.FC<QrScannerProps> = ({ onScan, onError, delay = 300, style }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const scanningRef = useRef(false);

  const startScanning = async (deviceIndex: number = currentDeviceIndex) => {
    if (!videoRef.current || isScanning || scanningRef.current) return;

    try {
      setIsScanning(true);
      scanningRef.current = true;
      
      // Reset previous scanner
      if (readerRef.current) {
        try {
          readerRef.current.reset();
        } catch (e) {
          console.log('Reset error:', e);
        }
      }
      
      readerRef.current = new BrowserMultiFormatReader();
      
      const videoInputDevices = await readerRef.current.listVideoInputDevices();
      setVideoDevices(videoInputDevices);
      
      if (videoInputDevices.length === 0) {
        onError('No camera found');
        return;
      }

      // Use the selected device or default to first one
      const selectedDeviceId = videoInputDevices[deviceIndex]?.deviceId || videoInputDevices[0].deviceId;
      
      // Start decoding from video device
      readerRef.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, error) => {
          if (result) {
            // Successfully scanned QR code
            onScan(result.getText());
            return;
          }
          
          if (error && !(error instanceof NotFoundException)) {
            // Only log non-NotFoundException errors
            console.error('Scanning error:', error);
          }
        }
      );

    } catch (error) {
      console.error('Camera access error:', error);
      onError('Camera access denied or not available');
      setIsScanning(false);
      scanningRef.current = false;
    }
  };

  const switchCamera = () => {
    if (videoDevices.length <= 1) return;
    
    const newIndex = (currentDeviceIndex + 1) % videoDevices.length;
    setCurrentDeviceIndex(newIndex);
    
    // Stop current scanning
    if (readerRef.current) {
      try {
        readerRef.current.reset();
      } catch (e) {
        console.log('Switch camera reset error:', e);
      }
    }
    
    setIsScanning(false);
    scanningRef.current = false;
    
    // Start with new camera after a brief delay
    setTimeout(() => {
      startScanning(newIndex);
    }, 100);
  };

  useEffect(() => {
    startScanning();

    // Cleanup function
    return () => {
      if (readerRef.current) {
        try {
          readerRef.current.reset();
        } catch (e) {
          console.log('Scanner reset error:', e);
        }
      }
      scanningRef.current = false;
      setIsScanning(false);
    };
  }, [onScan, onError]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <video
        ref={videoRef}
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          ...style 
        }}
        playsInline
        muted
      />
      
      {/* Camera Switch Button - Increase z-index to be above overlays */}
      {videoDevices.length > 1 && (
        <button
          onClick={switchCamera}
          className="absolute top-4 left-4 w-12 h-12 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition-colors shadow-xl border-2 border-white/40 backdrop-blur-sm"
          style={{ zIndex: 30 }}
          type="button"
          title="Switch Camera"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default QrScanner;
