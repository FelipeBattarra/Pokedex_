import React, { useState, useEffect } from 'react';
import './Pokedex.css'; 

// Mapeia os tipos para as imagens
const typeImages = {
  grass: "/images/types/Grass.png",
  poison: "/images/types/Poison.png",
  fire: "/images/types/Fire.png",
  water: "/images/types/Water.png",
  electric: "/images/types/Electric.png",
  bug: "/images/types/Bug.png",
  dark: "/images/types/Dark.png",
  dragon: "/images/types/Dragon.png",
  fairy: "/images/types/Fairy.png",
  fighting: "/images/types/Fight.png",
  flying: "/images/types/Flying.png",
  ghost: "/images/types/Ghost.png",
  ground: "/images/types/Ground.png",
  ice: "/images/types/Ice.png",
  normal: "/images/types/Normal.png",
  psychic: "/images/types/Psychc.png",
  rock: "/images/types/Rock.png",
  steel: "/images/types/Steel.png",
};

function Pokedex() {
  const [pokemonName, setPokemonName] = useState('');
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0); // Controle de offset para paginação

  // Carregar Pokémons ao inicializar
  useEffect(() => {
    fetchPokemons();
  }, [offset]);

  // Função para buscar Pokémons com base no offset
  function fetchPokemons() {
    setLoading(true);
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`)
      .then((response) => response.json())
      .then((data) => {
        setPokemonList((prevList) => [...prevList, ...data.results]);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  // Detectar o scroll para carregar mais Pokémons
  useEffect(() => {
    const handleScroll = () => {
      const bottom = window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight;
      if (bottom && !loading) {
        setOffset(offset + 20); // Carregar mais Pokémons
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, offset]);

  // Função para buscar detalhes do Pokémon
  function fetchPokemon(pokemonName) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      .then((response) => response.json())
      .then((data) => setPokemon(data))
      .catch((err) => console.log(err));
  }

  // Função de busca
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
          <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
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
              <h3>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>

              {/* Exibe os tipos de Pokémon */}
              <div className="pokemon-types">
                {pokemon.types && pokemon.types.map((typeInfo, i) => (
                  <img
                    key={i}
                    src={typeImages[typeInfo.type.name]}
                    alt={typeInfo.type.name}
                    className="pokemon-type-img"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mostrar "Loading..." enquanto os Pokémons estão sendo carregados */}
      {loading && <div className="loading">Loading...</div>}
    </div>
  );
}

export default Pokedex;