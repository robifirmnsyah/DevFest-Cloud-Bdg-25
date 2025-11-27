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

  const enumerateVideoDevices = async () => {
    // First enumerate to get devices
    let devices = await navigator.mediaDevices.enumerateDevices();
    let videoInputDevices = devices.filter((d) => d.kind === "videoinput");

    // If labels are empty (no permission yet), request temporary stream to obtain labels
    const hasEmptyLabels = videoInputDevices.some((d) => !d.label || d.label.trim() === "");
    if (hasEmptyLabels) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((t) => t.stop());
        // Re-enumerate after getting permission
        devices = await navigator.mediaDevices.enumerateDevices();
        videoInputDevices = devices.filter((d) => d.kind === "videoinput");
      } catch (e) {
        console.warn("Permission for camera denied or not available");
      }
    }

    // Deduplicate by deviceId and filter out invalid entries
    const map = new Map<string, MediaDeviceInfo>();
    for (const d of videoInputDevices) {
      if (!d.deviceId || d.deviceId === "") continue;
      // Skip if already added
      if (!map.has(d.deviceId)) {
        map.set(d.deviceId, d);
      }
    }
    
    return Array.from(map.values());
  };

  const startScanning = async () => {
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
      
      const devices = await enumerateVideoDevices();
      
      if (devices.length === 0) {
        onError('No camera found');
        setIsScanning(false);
        scanningRef.current = false;
        return;
      }

      // Find preferred back/rear camera
      let preferredIndex = devices.findIndex((d) =>
        /back|rear|environment/i.test(d.label || "")
      );
      
      // If no back camera found, use last device (commonly back camera on mobile)
      if (preferredIndex === -1) {
        preferredIndex = devices.length - 1;
      }
      
      const selectedDeviceId = devices[preferredIndex].deviceId;
      
      // Use decodeFromVideoDevice for continuous scanning
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
