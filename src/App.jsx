import { useEffect, useState } from 'react'

function App() {
  const [images, setImages] = useState([])
  const [eingabeSeite, setEingabeSeite] = useState(1)
  const [suche, setSuche] = useState("lolcats%20funny")

  useEffect(() => {
    console.log("useEffect wurde gestartet");
    fetch(`http://localhost:3001/api/imagesearch/${suche}?page=${eingabeSeite}`) 
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
    <div>
      <br />
      <label>Gib eine Seitenummer ein:
      <input type="number" value={eingabeSeite} onChange={(e) => setEingabeSeite(Number(e.target.value))} />
      </label>
      <br />
      <br />
      <label>Gib deine Suche ein:
      <input value={suche} onChange={(e) => setSuche((e.target.value))} />
      </label>
      <h1>Image Search Results</h1>
      <ul>
        {images.map((image, index) => (
          <li key={index}>
            <a href={image.url} target="_blank" rel="noreferrer">
              <img src={image.thumbnail.url} alt={image.title} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
