import Image from "next/image";
import { Inter } from "next/font/google";
import { Camera } from "web-gphoto2";
import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [images, setImages] = useState([])
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const camera = new Camera();

  const connectCamera = async () => {
    await Camera.showPicker()
    await camera.connect();
    this.setState({ type: 'Status', message: '⌛ Connecting...' });
    console.log(await camera.connect());
  }

  const captureCamera = async () => {
    const file = await camera.captureImageAsFile()
    const imageUrl = URL.createObjectURL(file);
    // let a = document.createElement('a')
    // a.download = 'images.jpeg'
    // a.href = imageUrl
    // a.click();

    // console.log('full response imageURL', file);
    // console.log('imageURL', imageUrl);
    // setImages(imageUrl)
    // setPreviewImageUrl(imageUrl);
    // setImages(imageUrl);

    // Update the images array with the new image URL
    setImages([...images, imageUrl]);
    // setPreviewImageUrl(imageUrl);
  }

  const getCameraConfig = async() => {
    const config = await camera.getConfig();
    console.log("Config:", config);
  }

  const getSupportedOps = async () => {
    const ops = await camera.getSupportedOps();
    console.log("Supported Ops:", ops);
  }

  const capturePreviewAsBlob = async () => {
    // Capture a frame while in live view mode
    const blob = await camera.capturePreviewAsBlob();
    const imageUrl = URL.createObjectURL(blob);

    setImages([...images, imageUrl]);
    // setPreviewImageUrl(imageUrl);
  }

  // const capturePreviewAsBlob = async() => {
  //   // Capture a frame while in live view mode
  //   const blob = await camera.capturePreviewAsBlob();
  //   const imageUrl = URL.createObjectURL(blob);
  //   console.log('preview blob', imageUrl)
  //   // Set the imageUrl as the src of an image element in your HTML
  // }

  // useEffect to automatically connect the camera on component mount
  useEffect(() => {
    // connectCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // empty dependency array ensures it runs only once on mount
  
  return (
    <main
      className={`flex min-h-screen flex-col items-center p-24 ${inter.className}`}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <button onClick={() => connectCamera()}>Pilih Kamera</button>
        <button onClick={() => captureCamera()}>Capture Kamera as File</button>
        <button onClick={() => capturePreviewAsBlob()}>Capture Kamera as Blob</button>
        <button onClick={() => getCameraConfig()}>Kamera Konfig</button>
        <button onClick={() => getSupportedOps()}>Kamera Support</button>
      </div>

      <div>
        <h2 className="w-full text-center p-10">Captured Images:</h2>
        <div className="grid grid-cols-4 gap-4">
          {images.length > 0 && (
            images.map((imgUrl, index) => (
              <div key={index}>
                <Image src={imgUrl} alt={`Captured Image ${index + 1}`} width={300} />
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
