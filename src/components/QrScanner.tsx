import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

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
  const scanningRef = useRef(false);

  useEffect(() => {
    const startScanning = async () => {
      if (!videoRef.current || isScanning || scanningRef.current) return;

      try {
        setIsScanning(true);
        scanningRef.current = true;
        readerRef.current = new BrowserMultiFormatReader();
        
        const videoInputDevices = await readerRef.current.listVideoInputDevices();
        if (videoInputDevices.length === 0) {
          onError('No camera found');
          return;
        }

        // Use the first available camera (usually back camera on mobile)
        const selectedDeviceId = videoInputDevices[0].deviceId;
        
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
  );
};

export default QrScanner;
