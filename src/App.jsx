import { useEffect, useRef, useState } from "react";
import "./App.css";
import Lottie from "lottie-react";

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [animationData, setAnimationData] = useState(null);
  const lottieRef = useRef();

  useEffect(() => {
    fetch("/download.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Animasyon yüklenemedi:", err));
  }, []);

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = photo;
    link.download = "photo.png";
    link.click();
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Kamera erişimi reddedildi:", err);
      });
  }, []);

  const takePhoto = () => {
    const width = videoRef.current.videoWidth;
    const height = videoRef.current.videoHeight;
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, width, height);

    const imageDataURL = canvas.toDataURL("image/png");
    setPhoto(imageDataURL);

    const cameraEl = document.querySelector(".camera");
    cameraEl.classList.add("clicked");

    setTimeout(() => {
      cameraEl.classList.remove("clicked");
    }, 1000);
  };

  return (
    <div className="color-cam-container">
      <span className="color-cam-title">Color Cam</span>
      <div className="color-cam-wrapper">
        <div className="video-wrapper">
          <video ref={videoRef} autoPlay className="color-cam-video" />
        </div>

        <div className="camera" onClick={takePhoto}>
          <div className="button-container">
            <div className="button"></div>
          </div>
          <div className="shutter"></div>
          <div className="flash"></div>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {photo && (
        <div className="download">
          <span className="cam-download-title">Photo</span>
          <img src={photo} alt="Çekilen fotoğraf" className="download-photo" />
          <br />
          {animationData && (
            <div
              style={{ width: 100, height: 100, cursor: "pointer" }}
              onClick={() => {
                lottieRef.current?.stop();
                lottieRef.current?.play();
              }}
            >
              <Lottie
                lottieRef={lottieRef}
                animationData={animationData}
                loop={false}
                autoplay={false}
                onComplete={() => {
                  downloadImage();
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
