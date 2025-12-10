import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Favoritos() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  const loadFavorites = () => {
    const storedFavorites = JSON.parse(localStorage.getItem('hp_favorites') || '[]');
    setFavorites(storedFavorites);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const removeFavorite = (bookId) => {
    const updatedFavorites = favorites.filter(book => book.number !== bookId);
    setFavorites(updatedFavorites);
    localStorage.setItem('hp_favorites', JSON.stringify(updatedFavorites));
  };
  
  const goToDetails = (book) => {
    navigate(`/detalhes/${book.number}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>⭐ Meus Livros Favoritos</h1>
      
      <button 
        onClick={() => navigate('/')}
        style={{ marginBottom: '20px', padding: '10px 20px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        ← Voltar para a Home
      </button>

      {favorites.length === 0 ? (
        <p>Você ainda não tem livros favoritos salvos. Adicione um na Tela de Detalhes!</p>
      ) : (
        <div className="favoritos-lista" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {favorites.map((book) => (
            <div
              key={book.number}
              style={{ border: '1px solid #ccc', padding: '10px', width: '250px', boxShadow: '2px 2px 5px rgba(0,0,0,0.1)' }}
            >
              <h3 style={{ margin: '0 0 10px 0' }}>Livro #{book.number}</h3>
              <p style={{ fontWeight: 'bold' }}>{book.originalTitle}</p>
              
              <img 
                src={book.cover} 
                alt={`Capa de ${book.originalTitle}`} 
                onClick={() => goToDetails(book)} 
                style={{ width: '100%', height: 'auto', marginBottom: '10px', cursor: 'pointer' }}
              />

              <button
                onClick={() => removeFavorite(book.number)}
                style={{ width: '100%', padding: '8px', background: 'orange', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}