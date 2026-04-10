import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import MovieCard from './components/MovieCard';
import MovieModal from './components/MovieModal';
import { getLikedMovies, saveLikedMovies } from "./utils/likes";
import { SkeletonCard } from './components/SkeletonCard';




const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_URL = "https://api.themoviedb.org/3";


function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [selectedMovie, setSelectedMovie] = useState(null); // Храним объект выбранного фильма
  const [likedIds, setLikedIds] = useState(() => getLikedMovies());
  const [page, setPage] = useState(1);
  const [showScroll, setShowScroll] = useState(false);


  useEffect(() => {
  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 300) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 300) {
      setShowScroll(false);
    }
  };

  window.addEventListener('scroll', checkScrollTop);
  return () => window.removeEventListener('scroll', checkScrollTop);
}, [showScroll]);

const scrollTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

useEffect(() => {
  if (selectedMovie) {
    document.body.style.overflow = 'hidden'; 
  } else {
    document.body.style.overflow = 'auto';  
  }
  
  
  return () => { document.body.style.overflow = 'auto'; };
}, [selectedMovie]);

useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setSelectedMovie(null); 
    }
  };

  if (selectedMovie) {
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
  } else {
    document.body.style.overflow = 'auto';
  }

  
  return () => {
    document.body.style.overflow = 'auto';
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [selectedMovie]);


  useEffect(() => {
  
  const handler = setTimeout(() => {
    setDebouncedQuery(query);
  }, 600); 
  return () => {
    clearTimeout(handler);
  };
}, [query]);

useEffect(() => {
  setPage(1);
}, [debouncedQuery]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const endpoint = debouncedQuery ? "/search/movie" : "/movie/popular";

        const response = await axios.get(`${API_URL}${endpoint}`, {
        params: {
          api_key: API_KEY,
          language: 'ru-RU',
          page: page,
          query: debouncedQuery 
        }
        });
        setMovies(response.data.results);
      } catch (err) {
        console.error("Ошибка загрузки:", err);
        setError("Ошибка загрузки данных");
        } finally {
        setLoading(false); 
      }
    };
    fetchMovies();
  }, [debouncedQuery, page]);


  const toggleFavorite = (movieId) => {
    let updatedIds;
    if (likedIds.includes(movieId)) {
      updatedIds = likedIds.filter(id => id !== movieId); 
    } else {
      updatedIds = [...likedIds, movieId]; 
    }
    
    setLikedIds(updatedIds); 
    saveLikedMovies(updatedIds); 
  };

  return (
    <div className="App">
      <header>
        <h1>Movie App</h1>
        <div className="search-container">
        <label htmlFor="movie-search" className="visually-hidden">Поиск фильмов</label>
    
    <input 
      type="text" 
      id="movie-search"      
      name="search" 
      placeholder="Поиск фильмов..." 
      value={query} 
      onChange={(e) => setQuery(e.target.value)} 
    />

    {query && (
    <button 
      className="clear-btn" 
      onClick={() => setQuery("")} 
    >
      ✖
    </button>
  )}
  </div>
      </header>

      <main>

        {error && <div className="error-message">{error}</div>}

        <div className="movie-grid">
  {loading 
    ? [...Array(12)].map((_, i) => <SkeletonCard key={i} />) 
    : movies.map(movie => (
        
        <div key={movie.id} className="fade-in">
          <MovieCard 
            movie={movie} 
            isFavorite={likedIds.includes(movie.id)} 
            onFavoriteClick={() => toggleFavorite(movie.id)}
            onCardClick={() => setSelectedMovie(movie)}
          />
        </div>
  ))}
</div>



        <div className={`pagination ${loading ? 'pagination-loading' : ''}`}>
  <button
    disabled={page === 1 || loading} 
    onClick={() => setPage(prev => prev - 1)}
  >
    Назад
  </button>

  <span>Страница {page}</span>

  <button
    disabled={loading} 
    onClick={() => setPage(prev => prev + 1)}
  >
    Вперед
  </button>
</div>

<footer>
  <div className="footer-content">
    <p>© {new Date().getFullYear()} MovieApp. Все права защищены.</p>
    <div className="footer-links">
      <span>Данные предоставлены</span>
      <a href="https://themoviedb.org" target="_blank" rel="noreferrer">
        TMDB API
      </a>
    </div>
  </div>
</footer>

{showScroll && (
  <button className="scroll-to-top" onClick={scrollTop} aria-label="Наверх">
    ↑
  </button>
)}

      </main>
      
      <MovieModal 
  movie={selectedMovie} 
  onClose={() => setSelectedMovie(null)} 
/>
    </div>

    
  );
}

export default App;
