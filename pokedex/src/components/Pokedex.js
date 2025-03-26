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
  // ---------- ESTADOS ----------
  const [pokemonName, setPokemonName] = useState('');
  const [pokemonList, setPokemonList] = useState([]);    // Lista para lazy loading
  const [allPokemonList, setAllPokemonList] = useState([]); // Lista completa para autocomplete
  const [suggestions, setSuggestions] = useState([]);    // Sugestões do autocomplete
  const [pokemon, setPokemon] = useState(null);          // Pokémon selecionado
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0); // Controle de offset para paginação

  // ========== 1) Carrega a lista completa (1025) para o autocomplete ==========
  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1025')
      .then((res) => res.json())
      .then((data) => setAllPokemonList(data.results))
      .catch((err) => console.log(err));
  }, []);

  // ========== 2) Lazy loading: busca Pokémons em blocos de 20 ==========
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

  // Chamado sempre que offset muda
  useEffect(() => {
    fetchPokemons();
  }, [fetchPokemons]);

  // ========== 3) Ao mudar a lista principal, buscar detalhes (types) de cada Pokémon ==========
  useEffect(() => {
    pokemonList.forEach((poke, idx) => {
      // Se ainda não tiver types, busca detalhes
      if (!poke.types) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${poke.name}`)
          .then((res) => res.json())
          .then((data) => {
            const updatedList = [...pokemonList];
            updatedList[idx] = {
              ...poke,
              types: data.types,
            };
            setPokemonList(updatedList);
          })
          .catch((err) => console.log(err));
      }
    });
  }, [pokemonList]);

  // ========== 4) Scroll infinito ==========
  useEffect(() => {
    const handleScroll = () => {
      const bottom = window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight;
      if (bottom && !loading) {
        setOffset((prevOffset) => prevOffset + 20); // Carregar mais Pokémons
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  // ========== 5) Função para buscar detalhes de um Pokémon específico ==========
  function fetchPokemon(name) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((response) => response.json())
      .then((data) => setPokemon(data))
      .catch((err) => console.log(err));
  }

  // ========== 6) Autocomplete: filtra allPokemonList conforme o usuário digita ==========
  function handleSearchChange(e) {
    const value = e.target.value;
    setPokemonName(value);

    if (value.trim() !== '') {
      const filtered = allPokemonList.filter((p) =>
        p.name.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8)); // Mostra até 8 sugestões
    } else {
      setSuggestions([]);
    }
  }

  // Clique na sugestão
  function handleSuggestionClick(name) {
    setPokemonName(name);
    setSuggestions([]); // fecha sugestões
    fetchPokemon(name);
  }

  // ========== 7) Submeter busca (Enter) ==========
  function handleSubmit(e) {
    e.preventDefault();
    if (pokemonName.trim() !== '') {
      fetchPokemon(pokemonName);
      setSuggestions([]);
    }
  }

  // ========== RENDERIZAÇÃO ==========
  return (
    <div className="pokedex-container">
      <header className="pokedex-header">
        <h1>Pokedex</h1>

        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search"
            value={pokemonName}
            onChange={handleSearchChange}
            className="search-bar"
          />
          <button type="submit" className="search-button">Search</button>

          {/* Lista de sugestões do autocomplete */}
          {suggestions.length > 0 && (
            <div className="suggestion-list">
              {suggestions.map((pokeItem) => {
                // Extrair o ID do Pokémon da URL
                const urlParts = pokeItem.url.split('/');
                const id = urlParts[urlParts.length - 2];

                return (
                  <div
                    key={pokeItem.name}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(pokeItem.name)}
                  >
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                      alt={pokeItem.name}
                      className="suggestion-img"
                    />
                    <span>{pokeItem.name.charAt(0).toUpperCase() + pokeItem.name.slice(1)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </form>
      </header>

      {/* Pokémon Selecionado */}
      {pokemon && (
        <div className="pokemon-details">
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
          <p>Number: #{pokemon.id}</p>
          <p>Height: {pokemon.height / 10}m</p>
          <p>Weight: {pokemon.weight / 10}kg</p>
        </div>
      )}

      {/* Lista Principal (Lazy Loading) */}
      <div className="pokemon-grid">
        {pokemonList.map((p, index) => {
          // Extrair ID do Pokémon para exibir imagem
          const urlParts = p.url.split('/');
          const pokeId = urlParts[urlParts.length - 2];

          return (
            <div
              className="pokemon-card"
              key={index}
              onClick={() => fetchPokemon(p.name)}
            >
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png`}
                alt={p.name}
              />
              <div className="pokemon-info">
                <span>#{pokeId}</span>
                <h3>{p.name.charAt(0).toUpperCase() + p.name.slice(1)}</h3>
                
                {/* Exibe os tipos do Pokémon (se já carregados) */}
                <div className="pokemon-types">
                  {p.types &&
                    p.types.map((typeInfo, i) => (
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
          );
        })}
      </div>

      {/* Mostrar "Loading..." enquanto carrega */}
      {loading && <div className="loading">Loading...</div>}
    </div>
  );
}

export default Pokedex;