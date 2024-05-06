import { useEffect, useRef, useState } from 'react'
import './App.css'

interface Pokemon { 

}

function getRandomNumber(min:number, max:number){
  const result = Math.floor( Math.random() * (max - min + 1) + min )
  return result
}

function App() {
  const [allPokemons, setAllPokemons] = useState<any[]>([])
  const [pokemon, setPokemon] = useState<any>(undefined)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  let randomNumber:number = 1
  let visibleResults = 5
  let searchRef = useRef('')

  // Fetch name and url from all Pokemon to have them available for search and get random
  const fetchGeneralData = () => {
    fetch('https://pokeapi.co/api/v2/pokemon/?limit=1500')
    .then(response => response.json())
    .then(data => {
      setAllPokemons(data.results)
    })
  }

  const fetchPokemonData = (id:number) => { 
    const randomUrl = allPokemons[0].url
    fetch(randomUrl)
      .then(response => response.json())
      .then( data => {
        console.log('data', data)
        setPokemon(data)
      })
  }

  const fetchPokemonDataFromUrl = (url:string) => {
    fetch(url)
      .then( response => response.json() )
      .then( data => {
        console.log('data', data)
        setPokemon(data)
        setSearchResults([])
        searchRef.current = ''
      })
  }

  useEffect(() => {        
    fetchGeneralData()
  }, [])

  useEffect(() => {
    if(allPokemons.length > 0){
      fetchPokemonData(1)
    }
  },[allPokemons])


  function handleSearch(query:string){
    setSearchQuery(query)
    if (query.length === 0){
     return setSearchResults([]) 
    }
    let filtered = allPokemons.filter(item => item.name.includes(query))
    console.log(filtered)
    setSearchResults(filtered)
  }

  function handleSelectResult(url:string){
    setSearchQuery('')
    fetchPokemonDataFromUrl(url)
  }


  return (
    <div>
      <div className="search">
        <input type="text"
          placeholder='Search'
          onChange={(e) => handleSearch(e.target.value)}
          value={searchQuery}
        />
        <div className="search-results">
          {
            searchResults.length > 0 &&
            <>
              { searchResults.map(item => {
                return (
                  <div onClick={ () => handleSelectResult(item.url)} key={item.url}>
                    {item.name}
                  </div>
                )
              })}
            </>
          }
        </div>
      </div>
      { pokemon &&
        <div className="card">
          <img src={pokemon.sprites.other['official-artwork'].front_default} alt={pokemon.name} height={250} />
          <h1>Name: {pokemon.name}</h1>
        </div>      
      }
    </ div>
  )
}

export default App
