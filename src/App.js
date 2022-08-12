import React, { useState, useEffect } from "react";
import Axios from "axios";
import Navbar from "./components/Navbar";
import Card from "./components/Card";
import { getPokemon, getAllPokemon } from "./services/pokemon";
import "./App.css";

function App() {
  // new code for search--
  const [pokemonSearch, setPokemonSearch] = useState("");
  const [pokemonChosen, setPokemonChosen] = useState(false);
  const [pokemonS2, setPokemonS2] = useState({
    name: "",
    species: "",
    img: "",
    hp: "",
    attack: "",
    defence: "",
    type: "",
  });

  const [pokemonData, setPokemonData] = useState([]);
  const [nextUrl, setNextUrl] = useState("");
  const [prevUrl, setPrevUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const initialURL = "https://pokeapi.co/api/v2/pokemon";

  useEffect(() => {
    async function fetchData() {
      let response = await getAllPokemon(initialURL);
      setNextUrl(response.next);
      setPrevUrl(response.previous);
      await loadPokemon(response.results);
      setLoading(false);
    }
    fetchData();
  }, []);

  const searchPokemon = () => {
    Axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonSearch}`).then(
      (response) => {
        setPokemonS2({
          name: pokemonSearch,
          species: response.data.species.name,
          img: response.data.sprites.front_default,
          hp: response.data.stats[0].base_stat,
          attack: response.data.stats[1].base_stat,
          defence: response.data.stats[2].base_stat,
          type: response.data.types[0].type.name,
        });
        setPokemonChosen(true);
      }
    );
  };

  const next = async () => {
    setLoading(true);
    let data = await getAllPokemon(nextUrl);
    await loadPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  };

  const prev = async () => {
    if (!prevUrl) return;
    setLoading(true);
    let data = await getAllPokemon(prevUrl);
    await loadPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  };

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data.map(async (pokemon) => {
        let pokemonRecord = await getPokemon(pokemon);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  };

  return (
    <>
      <Navbar />
      <div>
        {loading ? (
          <h1 style={{ textAlign: "center" }}>Loading...</h1>
        ) : (
          <>
            <div>
              <input
                placeholder="Search pokemon here:"
                type="text"
                onChange={(event) => {
                  setPokemonSearch(event.target.value);
                }}
              />
              <button onClick={searchPokemon} className="search-btn">
                Search
              </button>
              <div className="displaySection">
                {!pokemonChosen ? (
                  <h1>^ Please choose a pokemon.</h1>
                ) : (
                  <>
                  <h1>{pokemonSearch}</h1>
                  <img src={pokemonS2.img}/>
                  <h3>Species: {pokemonS2.species}</h3>
                  <h3>Type: {pokemonS2.type}</h3>
                  <h4>Hp: {pokemonS2.hp}</h4>
                  <h4>Attack: {pokemonS2.attack}</h4>
                  <h4>Defence: {pokemonS2.defence}</h4>
                  </>
                )}
                
              </div>
            </div>
            <div className="btn">
              <button onClick={prev}>Prev</button>
              <button onClick={next}>Next</button>
            </div>
            <div className="grid-container">
              {pokemonData.map((pokemon, i) => {
                return <Card key={i} pokemon={pokemon} />;
              })}
            </div>
            <div className="btn">
              <button onClick={prev}>Prev</button>

              <button onClick={next}>Next</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
