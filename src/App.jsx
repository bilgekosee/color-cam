import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);

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
  };

  return (
    <div className="color-cam-container">
      <span className="color-cam-title">Color Cam</span>
      <div className="video-wrapper">
        <video ref={videoRef} autoPlay className="color-cam-video" />
      </div>

      <button onClick={takePhoto} className="color-cam-button">
        Fotoğraf Çek
      </button>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {photo && (
        <div>
          <h3>Çekilen Fotoğraf:</h3>
          <img src={photo} alt="Çekilen fotoğraf" />
          <br />
          <a href={photo} download="photo.png">
            İndir
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
