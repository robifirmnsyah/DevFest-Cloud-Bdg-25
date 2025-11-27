import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { RotateCw } from 'lucide-react';

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

  const startScanning = async (deviceIndex?: number) => {
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
        /back|rear|environment|wide/i.test(d.label || "")
      );
      
      // If no back camera found, use last device (commonly back camera on mobile)
      if (preferredIndex === -1) {
        preferredIndex = devices.length - 1;
      }
      
      // Use explicit deviceIndex if provided, otherwise use preferred
      const startIndex = typeof deviceIndex === "number" ? deviceIndex : preferredIndex;
      
      setVideoDevices(devices);
      setCurrentDeviceIndex(startIndex);
      
      const selectedDeviceId = devices[startIndex].deviceId;
      
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
    }, 120);
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
      
      {/* Camera Switch Button - Inside scanner frame at bottom center */}
      {showSwitchButton && videoDevices.length > 1 && (
        <button
          onClick={switchCamera}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-white/90 hover:bg-white text-gray-800 rounded-full flex items-center justify-center transition-colors shadow-lg border-2 border-gray-200"
          style={{ zIndex: 50 }}
          type="button"
          title="Switch Camera"
        >
          <RotateCw className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default QrScanner;
