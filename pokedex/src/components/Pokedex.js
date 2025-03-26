import React, { useState, useEffect, useCallback } from 'react';
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

  // Função memorizada para buscar Pokémons com base no offset
  const fetchPokemons = useCallback(() => {
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
  }, [offset]);

  // Chama fetchPokemons sempre que a função (offset) mudar
  useEffect(() => {
    fetchPokemons();
  }, [fetchPokemons]);

  // Detectar o scroll para carregar mais Pokémons
  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight;
      if (bottom && !loading) {
        setOffset((prevOffset) => prevOffset + 20); // Carregar mais Pokémons
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  // UseEffect para buscar detalhes (tipos) dos Pokémons que ainda não os possuem
  useEffect(() => {
    // Para cada Pokémon que não possui a propriedade "types", busca seus detalhes.
    pokemonList.forEach((pokemonItem, idx) => {
      if (!pokemonItem.types) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonItem.name}`)
          .then((response) => response.json())
          .then((data) => {
            // Atualiza apenas o item que não possui os tipos
            const updatedList = [...pokemonList];
            updatedList[idx].types = data.types;
            setPokemonList(updatedList);
          })
          .catch((err) => console.log(err));
      }
    });
  }, [pokemonList]);

  // Função para buscar detalhes do Pokémon individual (quando clicado ou buscado)
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
              {/* Exibe os tipos de Pokémon abaixo do nome */}
              <div className="pokemon-types">
                {pokemon.types &&
                  pokemon.types.map((typeInfo, i) => (
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