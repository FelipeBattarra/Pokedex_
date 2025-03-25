import React, { useState, useEffect } from 'react';
import './Pokedex.css'; 

function Pokedex() {
  const [pokemonName, setPokemonName] = useState('');
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1025')
      .then((response) => response.json())
      .then((data) => setPokemonList(data.results));
  }, []);

  function fetchPokemon(pokemonName) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      .then((response) => response.json())
      .then((data) => setPokemon(data))
      .catch((err) => console.log(err));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (pokemonName.trim() !== '') {
      fetchPokemon(pokemonName);
    }
  }

  return (
    <div className="pokedex-container">
      <header className="pokedex-header">
        <h1>Pokedex</h1>
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search"
            value={pokemonName}
            onChange={(e) => setPokemonName(e.target.value)}
            className="search-bar"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </header>

      {pokemon && (
        <div className="pokemon-details">
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          <h2>{pokemon.name}</h2>
          <p>Number: #{pokemon.id}</p>
          <p>Height: {pokemon.height / 10}m</p>
          <p>Weight: {pokemon.weight / 10}kg</p>
        </div>
      )}

      <div className="pokemon-grid">
        {pokemonList.map((pokemon, index) => (
          <div className="pokemon-card" key={index} onClick={() => fetchPokemon(pokemon.name)}>
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`}
              alt={pokemon.name}
            />
            <div className="pokemon-info">
              <span>#{index + 1}</span>
              <h3>{pokemon.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pokedex;
