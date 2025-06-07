import './App.css';
import { useEffect, useState } from 'react'

function App() {
  const [images, setImages] = useState([])
  const [eingabeSeite, setEingabeSeite] = useState(1)
  const [suche, setSuche] = useState("lolcats funny")
  const [fallbackActive, setFallbackActive] = useState(false)

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
        setFallbackActive(!!data.fallbackActive)
      })
      .catch(error => {
        console.error('Fetch-Fehler:', error);
        setFallbackActive(false)
      }
    
    );

  }, [eingabeSeite, suche]);

  return (

    <div className="site" >
      <h1>Image Search</h1>
      <br />
      {fallbackActive && (
      <div style={{ color: 'orange', marginBottom: '1em' }}>
        ⚠️ Es werden aktuell Fallback-Bilder angezeigt, da die API nicht erreichbar ist.
      </div>)}
      <label >Gib eine Seitenummer ein:&nbsp;
        <input className="nummerFeld" type="number" value={eingabeSeite} onChange={(e) => setEingabeSeite(Number(e.target.value))} />
      </label>
      <br />
      <br />
      <label>Gib deine Suche ein:&nbsp;
        <input value={suche} onChange={(e) => setSuche((e.target.value))} />
      </label>
      <br />
      <br />
      <div className="pics">

        {images.map((image, index) => (
  <div key={index} className='pic'>
    <a href={image.url} target="_blank" rel="noreferrer">
      <img 
        src={image.thumbnail?.url || image.url} 
        alt={image.description || "Bild"} 
        width={150} 
        height={150} 
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Cat_crying_%28Lolcat%29.jpg/960px-Cat_crying_%28Lolcat%29.jpg'
        }}
      />
            </a>
          </div>
        ))}

      </div>
    </div>

  )
}

export default App
