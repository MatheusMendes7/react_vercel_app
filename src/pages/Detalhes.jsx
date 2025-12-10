import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function Detalhes() {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Converte o ID da URL para número, se possível
  const parsedBookId = bookId ? (isNaN(parseInt(bookId)) ? bookId : parseInt(bookId)) : null;

  useEffect(() => {
    setIsLoading(true);
    setIsFavorite(false);

    if (parsedBookId) {
      const allBooks = JSON.parse(localStorage.getItem('allBooksData') || '[]'); 
      
      // Lógica de Busca FINAL:
      const foundBook = allBooks.find(b => b.number === parsedBookId);

      if (foundBook) {
        setBook(foundBook);

        const favorites = JSON.parse(localStorage.getItem('hp_favorites') || '[]');
        const isFav = favorites.some(fav => fav.number === foundBook.number);
        setIsFavorite(isFav);
      } else {
        setBook(null);
      }
    }
    setIsLoading(false);
  }, [parsedBookId]); // Dependência alterada para o parsedBookId

  const toggleFavorite = () => {
    if (!book) return;

    let favorites = JSON.parse(localStorage.getItem('hp_favorites') || '[]');
    const isCurrentlyFavorite = favorites.some(fav => fav.number === book.number);

    if (isCurrentlyFavorite) {
      favorites = favorites.filter(fav => fav.number !== book.number);
      setIsFavorite(false);
    } else {
      favorites.push(book);
      setIsFavorite(true);
      alert('Livro adicionado aos favoritos!');
    }

    localStorage.setItem('hp_favorites', JSON.stringify(favorites));
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Carregando livro...</div>;
  }
  
  if (!book) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p>Livro não encontrado ou erro ao carregar dados.</p>
        <button onClick={() => navigate('/')}>Voltar à Página Inicial</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate('/')}>← Voltar à Página Inicial</button>
      
      <div className="detalhes-container" style={{ display: 'flex', gap: '30px', marginTop: '20px', alignItems: 'flex-start' }}>
        
        <img 
          src={book.cover} 
          alt={`Capa do livro ${book.originalTitle}`} 
          style={{ width: '300px', height: 'auto', border: '5px solid #740001' }} 
        />
        
        <div>
          <h1>Livro #{book.number} - {book.originalTitle}</h1>
          
          <button 
            onClick={toggleFavorite}
            style={{ 
              padding: '10px 20px', 
              background: isFavorite ? 'orange' : 'green', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            {isFavorite ? '⭐️ Remover dos Favoritos' : '⭐ Adicionar aos Favoritos'}
          </button>

          <p><strong>Data de publicação:</strong> {book.releaseDate}</p>
          <p><strong>Páginas:</strong> {book.pages}</p>
          <p><strong>Descrição:</strong> {book.description}</p>
        </div>
      </div>
    </div>
  );
}