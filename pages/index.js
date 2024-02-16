import Image from "next/image";
import { Inter } from "next/font/google";
import { Camera } from "web-gphoto2";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [images, setImages] = useState(null)
  const [status, setStatus] = useState("")
  const [message, setMessage] = useState("")
  const [type, setType] = useState("")

  const camera = new Camera();

  const connectCamera = async () => {
    await Camera.showPicker()
    await camera.connect();
  }

  const captureCamera = async () => {
    const file = await camera.captureImageAsFile()
    const imageUrl = URL.createObjectURL(file);
    let a = document.createElement('a')
    a.download = 'images.jpeg'
    a.href = imageUrl
    a.click();

    console.log('full response imageURL', file);
    console.log('imageURL', imageUrl);
    setImages(imageUrl)
  }

  const getCameraConfig = async () => {
    const config = await camera.getConfig();
    console.log("Config:", config);
  }

  useEffect(() => {
    addEventListener('error', ({ message }) => {
      setType("Status")
      setMessage(message)
    });

    addEventListener(
      'beforeunload',
      () => {
        if (!this.camera) return;
        this.camera.disconnect();
        this.camera = undefined;
      },
      { once: true }
    );
    setType("Status")
    setMessage("Loading")
    tryToConnectToCamera()
  }, [])

  const tryToConnectToCamera = async () => {
    let camera;
    try {
      camera = new Camera();
      await camera.connect();
    } catch (e) {
      console.warn(e);
      setType("CameraPicker")
      return;
    }
    this.camera = camera;
    let supportedOps = await camera.getSupportedOps();
    let capturePreview;
    if (supportedOps.capturePreview) {
      capturePreview = () => camera.capturePreviewAsBlob();
    }
    let triggerCapture;
    if (supportedOps.captureImage) {
      triggerCapture = () => camera.captureImageAsFile();
    }
  }

  const getSupportedOps = async () => {
    const ops = await camera.getSupportedOps();
    console.log("Supported Ops:", ops);
  }

  const capturePreviewAsBlob = async () => {
    // Capture a frame while in live view mode
    const blob = await camera.capturePreviewAsBlob();
    const imageUrl = URL.createObjectURL(blob);
    console.log('preview blob', imageUrl)
    // Set the imageUrl as the src of an image element in your HTML
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <button onClick={() => connectCamera()}>Pilih Kamera</button>
        <button onClick={() => captureCamera()}>Capture Kamera as File</button>
        <button onClick={() => capturePreviewAsBlob()}>Capture Kamera as Blob</button>
        <button onClick={() => getCameraConfig()}>Kamera Konfig</button>
        <button onClick={() => getSupportedOps()}>Kamera Support</button>
      </div>
    </main>
  );
}
