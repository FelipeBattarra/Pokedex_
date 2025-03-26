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
  // ---------- ESTADOS GERAIS ----------
  const [pokemonName, setPokemonName] = useState('');
  const [pokemonList, setPokemonList] = useState([]);
  const [allPokemonList, setAllPokemonList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  // ---------- ESTADOS PARA O MODAL ----------
  const [showModal, setShowModal] = useState(false);
  const [pokemonDetail, setPokemonDetail] = useState(null);

  // ========== 1) Carrega a lista completa para autocomplete ==========
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

  useEffect(() => {
    fetchPokemons();
  }, [fetchPokemons]);

  // ========== 3) Ao mudar a lista principal, buscar detalhes (types) de cada Pokémon ==========
  useEffect(() => {
    pokemonList.forEach((poke, idx) => {
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
        setOffset((prevOffset) => prevOffset + 20);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  // ========== 5) Buscar Pokémon individual (usado no "Search") ==========
  function fetchPokemon(name) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((response) => response.json())
      .then((data) => setPokemon(data))
      .catch((err) => console.log(err));
  }

  // ========== 6) Autocomplete ==========
  function handleSearchChange(e) {
    const value = e.target.value;
    setPokemonName(value);

    if (value.trim() !== '') {
      const filtered = allPokemonList.filter((p) =>
        p.name.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8));
    } else {
      setSuggestions([]);
    }
  }

  function handleSuggestionClick(name) {
    setPokemonName(name);
    setSuggestions([]);
    fetchPokemon(name);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (pokemonName.trim() !== '') {
      fetchPokemon(pokemonName);
      setSuggestions([]);
    }
  }

  // ========== 7) Abrir modal ao clicar no card ==========
  // Aqui buscamos também a descrição do Pokémon via /pokemon-species
  function openModal(name) {
    // Reseta antes de buscar
    setPokemonDetail(null);
    setShowModal(true);

    // 1. Buscar dados gerais do Pokémon
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((res) => res.json())
      .then((pokeData) => {
        // 2. Buscar espécie para obter a descrição
        fetch(pokeData.species.url)
          .then((res2) => res2.json())
          .then((speciesData) => {
            // Pega a flavor text em inglês
            const flavorEntry = speciesData.flavor_text_entries.find(
              (entry) => entry.language.name === 'en'
            );
            const flavorText = flavorEntry ? flavorEntry.flavor_text.replace(/\f/g, ' ') : '';

            // Monta um objeto com dados importantes
            const detail = {
              id: pokeData.id,
              name: pokeData.name,
              sprite: pokeData.sprites.front_default,
              height: pokeData.height / 10,
              weight: pokeData.weight / 10,
              types: pokeData.types,
              description: flavorText,
            };
            setPokemonDetail(detail);
          })
          .catch((err2) => console.log(err2));
      })
      .catch((err) => console.log(err));
  }

  // Fecha o modal
  function closeModal() {
    setShowModal(false);
  }

  // Se clicar no overlay (fora do conteúdo), fecha
  function handleOverlayClick(e) {
    // Verifica se o clique foi no próprio overlay
    if (e.target.classList.contains('modal-overlay')) {
      closeModal();
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

          {suggestions.length > 0 && (
            <div className="suggestion-list">
              {suggestions.map((pokeItem) => {
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
                    <span>
                      {pokeItem.name.charAt(0).toUpperCase() + pokeItem.name.slice(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </form>
      </header>

      {/* Detalhes do Pokémon buscado (via search) */}
      {pokemon && (
        <div className="pokemon-details">
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
          <p>Number: #{pokemon.id}</p>
          <p>Height: {pokemon.height / 10}m</p>
          <p>Weight: {pokemon.weight / 10}kg</p>
        </div>
      )}

      {/* Lista principal (lazy loading) */}
      <div className="pokemon-grid">
        {pokemonList.map((p, index) => {
          const urlParts = p.url.split('/');
          const pokeId = urlParts[urlParts.length - 2];
          return (
            <div
              className="pokemon-card"
              key={index}
              onClick={() => openModal(p.name)} // Abre modal ao clicar
            >
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png`}
                alt={p.name}
              />
              <div className="pokemon-info">
                <span>#{pokeId}</span>
                <h3>{p.name.charAt(0).toUpperCase() + p.name.slice(1)}</h3>
                {/* Exibe os tipos, se disponíveis */}
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

      {loading && <div className="loading">Loading...</div>}

      {/* ========== MODAL ========== */}
      {showModal && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content">
            {pokemonDetail ? (
              <>
                <div className="modal-header">
                  <h2>
                    #{pokemonDetail.id}{' '}
                    {pokemonDetail.name.charAt(0).toUpperCase() + pokemonDetail.name.slice(1)}
                  </h2>
                  <button className="close-button" onClick={closeModal}>
                    X
                  </button>
                </div>
                <div className="modal-body">
                  <img src={pokemonDetail.sprite} alt={pokemonDetail.name} />
                  <div className="modal-info">
                    <div className="modal-types">
                      {pokemonDetail.types.map((typeInfo, i) => (
                        <img
                          key={i}
                          src={typeImages[typeInfo.type.name]}
                          alt={typeInfo.type.name}
                          className="pokemon-type-img"
                        />
                      ))}
                    </div>
                    <p>Height: {pokemonDetail.height}m</p>
                    <p>Weight: {pokemonDetail.weight}kg</p>
                    <p className="modal-description">{pokemonDetail.description}</p>
                  </div>
                </div>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Pokedex;