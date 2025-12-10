import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_URL = 'https://potterapi-fedeperin.vercel.app/en/books/random'; 

export default function Home() {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 
  const location = useLocation();

  const processAndNavigate = async (navigateToDetails = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Falha ao buscar os dados do livro.');
      }
      const data = await response.json(); 
      
      if (!data || !(data.id || data.number)) { 
          throw new Error('Resposta da API incompleta ou inválida.');
      }
      
      setBook(data);

      const existingBooks = JSON.parse(localStorage.getItem('allBooksData') || '[]');
      if (!existingBooks.some(b => b.number === data.number)) {
          existingBooks.push(data);
      }
      // Garante que o localStorage seja escrito ANTES de qualquer navegação
      localStorage.setItem('allBooksData', JSON.stringify(existingBooks));

      // Se a chamada veio de um clique (e não do useEffect), navega.
      if (navigateToDetails) {
          const identifier = data.number;
          if (identifier) {
              navigate(`/detalhes/${identifier}`);
          }
      }

    } catch (e) {
      setError('Erro ao carregar o livro. Tente recarregar a página.');
      setBook(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Roda no mount e sempre que a rota mudar (garantindo um novo livro na Home)
    processAndNavigate(false);
  }, [location.pathname]); 

  const handleCoverClick = () => {
    // Navega diretamente para os detalhes do livro atual exibido na home
    navigate(`/detalhes/${book.number}`);
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Carregando um livro aleatório...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</p>;
  if (!book) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Nenhum livro encontrado.</p>;

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>📚 Livro Aleatório em Destaque</h1>
      
      <h2>Livro #{book.number} - {book.originalTitle}</h2>

      <img 
        src={book.cover} 
        alt={`Capa do livro ${book.originalTitle}`} 
        onClick={handleCoverClick} // Chama a função que agora navega APÓS salvar
        style={{ cursor: 'pointer', maxWidth: '250px', margin: '20px 0', border: '5px solid #740001' }}
      />
      
      <p>Clique na capa para ver os detalhes ou <a href="#" onClick={() => processAndNavigate(false)}>carregar outro livro</a>.</p>

      <button 
        onClick={() => navigate('/favoritos')}
        style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}
      >
        Ir para Meus Favoritos
      </button>
      
    </div>
  );
}