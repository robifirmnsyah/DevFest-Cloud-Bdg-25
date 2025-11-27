import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { Camera } from 'lucide-react';

interface QrScannerProps {
  onScan: (data: string | null) => void;
  onError: (error: string) => void;
  delay?: number;
  style?: React.CSSProperties;
  showSwitchButton?: boolean;
}

const QrScanner: React.FC<QrScannerProps> = ({ onScan, onError, delay = 300, style, showSwitchButton = true }) => {
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
      
      // Filter out devices without labels (these are usually invalid/duplicate entries)
      const validDevices = videoInputDevices.filter(device => device.label && device.label.trim() !== '');
      setVideoDevices(validDevices);
      
      if (validDevices.length === 0) {
        onError('No camera found');
        return;
      }

      // Use the selected device or default to back camera (usually index 0 on mobile)
      const selectedDeviceId = validDevices[deviceIndex]?.deviceId || validDevices[0].deviceId;
      
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
    <>
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
      
      {/* Camera Switch Button - Moved outside, controlled by parent */}
      {showSwitchButton && videoDevices.length > 1 && (
        <div style={{ position: 'absolute', bottom: '-60px', left: '50%', transform: 'translateX(-50%)', zIndex: 50 }}>
          <button
            onClick={switchCamera}
            className="w-14 h-14 bg-gray-700 hover:bg-gray-800 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
            type="button"
            title="Switch Camera"
          >
            <Camera className="w-6 h-6" />
          </button>
        </div>
      )}
    </>
  );
};

export default QrScanner;
