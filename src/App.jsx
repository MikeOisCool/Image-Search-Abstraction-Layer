import './App.css';
import { useEffect, useState } from 'react'

function App() {
  const [images, setImages] = useState([])
  const [eingabeSeite, setEingabeSeite] = useState(1)
  const [suche, setSuche] = useState("lolcats funny")
  const [fallbackActive, setFallbackActive] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchInput, setSearchInput] = useState(suche);





  useEffect(() => {
    // console.log("useEffect wurde gestartet");
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


  useEffect(() => {
    console.log("useEffect für recentSearches startet");
    fetch('http://localhost:3001/api/recentsearches')
      .then(response => {
        if (!response.ok) {
          throw new Error('Netzwerkantwort war nicht ok');
        }
        return response.json();
      })
      .then(data => {
        setRecentSearches(data);

        console.log('RecentSearches (Frontend):', data);
      })
      .catch(error => {
        console.error('Fetch-Fehler:', error)
      });
  }, [])

  const handleSearch = () => {
    setSuche(searchInput);
    setRecentSearches(prev => [
      { term: searchInput, date: new Date().toISOString() },
      ...prev.filter(item => item.term !== searchInput)
    ].slice(0, 10))
  }


  return (

    <div className="site" >
      <div>
        <h1>Image Search</h1>

        {fallbackActive && (
          <div className="fallback" style={{ color: 'orange', marginBottom: '1em' }}>
            ⚠️ Es werden aktuell Fallback-Bilder angezeigt, da die API nicht erreichbar ist. 502 Bad Gateway!
          </div>)}
        <label >Gib eine Seitenummer ein:&nbsp;
          <input
            className="nummerFeld"
            type="number"
            min="1"
            value={eingabeSeite}
            onChange={(e) => {
              const val = Number(e.target.value)
              if (val >= 1) {
                setEingabeSeite(val)
              } else if (e.target.value === "") {
                setEingabeSeite('')
              }
            }} />
        </label>
    

        <label>Gib deine Suche ein:     &nbsp;
          
        </label>
        <div className="search-row">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <button type="button" onClick={handleSearch}>Suchen</button>
        </div>



        {/* Recent Searches  */}
        <div>
          <h2 className='research' onClick={() => { setIsExpanded(!isExpanded) }}>Hier klicken! Letzte 10 Suchanfragen! Hier klicken!</h2>

          <div className={`recentSearchesContainer ${isExpanded ? 'expanded' : ''}`}>
            <ul>
              {recentSearches.map((item, index) => (
                <li key={index}>
                  {item.term} ({item.date ? new Date(item.date).toLocaleString() : 'Kein Datum'})

                </li>
              ))}
            </ul></div>
        </div>

        {/* Bilder */}
        <div className="pics">

          {images.map((image, index) => (
            <div key={index} className='pic'>
              <a href={image.url} target="_blank" rel="noreferrer" title="Bild in voller Größe ansehen">
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
    </div>


  )
}

export default App
