import './App.css';
import { useEffect, useState } from 'react'

function App() {
  const [images, setImages] = useState([])
  const [eingabeSeite, setEingabeSeite] = useState(1)
  const [suche, setSuche] = useState("lolcats%20funny")

  useEffect(() => {
    console.log("useEffect wurde gestartet");
    fetch(`http://localhost:3001/api/imagesearch/${encodeURIComponent(suche)}?page=${eingabeSeite}`) 
      .then(response => {
        if (!response.ok) {
          throw new Error('Netzwerkantwort war nicht ok');
        }
        return response.json();
      })
      .then(data => {
        console.log("hallo", data);
        setImages(data.images);
      })
      .catch(error => console.error('Fetch-Fehler:', error));
  }, [eingabeSeite, suche]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Image Search Results</h1>
      <br />
      <label>Gib eine Seitenummer ein:
      <input type="number" value={eingabeSeite} onChange={(e) => setEingabeSeite(Number(e.target.value))} />
      </label>
      <br />
      <br />
      <label>Gib deine Suche ein:
      <input value={suche} onChange={(e) => setSuche((e.target.value))} />
      </label>
      <br />
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        {images.map((image, index) => (
          <div key={index} style={{ flex: '0 0 200px' }}>
            <a href={image.url} target="_blank" rel="noreferrer">
              <img src={image.thumbnail.url} alt={image.title} />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
