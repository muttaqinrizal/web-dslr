// import Image from "next/image";
import React, { useEffect, useRef, useState } from 'react';
import { Camera } from 'web-gphoto2';

const Preview = ({ getPreview }) => {
  const canvasRef = useRef(null);
  const [ratio, setRatio] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    let canvas = canvasRef.current;
    let canvasCtx = canvas.getContext('2d');

    let updateCanvasSize = () => {
      let canvasHolder = canvas.parentElement;
      let width = canvasHolder.offsetWidth - 10;
      let height = canvasHolder.offsetHeight;
      let newRatio = ratio;

      if (newRatio === 0) {
        newRatio = 1; // Default ratio to avoid divide by zero
      }

      if (height * newRatio > width) {
        height = width / newRatio;
      } else {
        width = height * newRatio;
      }

      setCanvasSize({ width, height });
    };

    const fetchPreview = async () => {
      try {
        const blob = await getPreview();
        const imageUrl = URL.createObjectURL(blob);
        const img = new Image();

        img.onload = () => {
          setRatio(img.width / img.height);
          updateCanvasSize();
          canvasCtx.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
          URL.revokeObjectURL(imageUrl);
        };

        img.src = imageUrl;
      } catch (err) {
        console.error('Could not refresh preview:', err);
      }
    };

    const intervalId = setInterval(fetchPreview, 100); // Refresh preview every 0.1 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, [getPreview, canvasRef, ratio, canvasSize]);

  return (
    <div>
      <p>Preview</p>
      <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height} />
    </div>
  );
};

export default function Home() {
  const cameraRef = useRef(new Camera());
  const [cameraConnected, setCameraConnected] = useState(false);
  const [supportedOps, setSupportedOps] = useState(null);
  console.log(cameraRef);
  
  const connectCamera = async () => {
    try {
      await cameraRef.current.connect();
      setCameraConnected(true);
      setSupportedOps(await cameraRef.current.getSupportedOps());
      console.log(
        "Operations supported by the camera:",
        await cameraRef.current.getSupportedOps(),
      );
      console.log(
        "Current configuration tree:",
        await cameraRef.current.getConfig(),
      );
    } catch (error) {
      console.error('Error connecting to camera:', error);
    }
  };

  // useEffect(() => {
  //   if (!cameraConnected) {
  //     connectCamera();
  //   }

  //   return () => {
  //     const camera = cameraRef;
  //     if (cameraConnected) {
  //       cameraRef.current.disconnect();
  //       setCameraConnected(false);
  //     }
  //   };
  // }, [cameraConnected]);

  const handleShowPicker = async () => {
    try {
      await Camera.showPicker();
      await connectCamera();
    } catch (error) {
      console.error('Error showing camera picker:', error);
    }
  };

  const getPreview = async () => {
    try {
      if (!cameraConnected) {
        throw new Error('Camera not initialized');
      }
      if (!supportedOps.capturePreview) {
        throw new Error('Camera does not support this operation');
      }
      return await cameraRef.current.capturePreviewAsBlob();
    } catch (error) {
      console.error('Error capturing preview:', error);
      return null;
    }
  };

  const triggerCapture = async () => {
    try {
      if (!cameraConnected) {
        throw new Error('Camera not initialized');
      }
      if (!supportedOps.captureImage) {
        throw new Error('Camera does not support this operation');
      }
      const file = await cameraRef.current.captureImageAsFile();
      let url = URL.createObjectURL(file);
      Object.assign(document.createElement('a'), {
        download: file.name,
        href: url
      }).click();
      return null;
    } catch (error) {
      console.error('Error capturing preview:', error);
      return null;
    }
  };

  return (
    <div>
      {!cameraConnected && <button onClick={handleShowPicker}>Connect Camera</button>}
      {cameraConnected && <button onClick={triggerCapture}>Capture Camera</button>}
      {cameraConnected && <Preview getPreview={getPreview}/>}
    </div>
  );
};