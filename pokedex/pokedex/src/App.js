import { useState } from 'react';
import './style.css';

function App() {
  const [pokemonName, setPokemonName] = useState('');
  const [pokemon, setPokemon] = useState(null);

  function fetchPokemon(pokemonName) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      .then((response) => response.json())
      .then((data) => {
        setPokemon(data);
      })
      .catch((err) => console.log(err));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (pokemonName.trim() !== '') {
      fetchPokemon(pokemonName);
    }
  }

  return (
    <div className="Container">
      <header>
        <strong>Pokemon API</strong>
      </header>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={(e) => setPokemonName(e.target.value)}
          placeholder="Enter Pokémon name"
        />
        <button type="submit">Search</button>
      </form>

      <div>
        {pokemon ? (
          <>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            <div>Name: {pokemon.name}</div>
            <div>N°: {pokemon.id}</div>
            <div>Altura: {pokemon.height / 10}kg</div>
            <div>Peso: {pokemon.weight / 10}kg</div>
          </>
        ) : (
          <div>Search for a Pokémon!</div>
        )}
      </div>
    </div>
  );
}

export default App;