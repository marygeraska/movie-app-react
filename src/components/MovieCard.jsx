import orangeStar from '../assets/star_orange.png';

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function MovieCard({ movie, isFavorite, onFavoriteClick, onCardClick}) {
  
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

  return (
    <div className="movie-card" onClick={onCardClick}>
      <div className="poster-container">
        <img 
          src={movie.poster_path 
            ? IMAGE_BASE_URL + movie.poster_path 
            : 'https://via.placeholder.com/500x750?text=No+Image'} 
          alt={`Poster of ${movie.title}`} 
        />
        <div className="rating-badge">
  <img src={orangeStar} alt="rating" className="star-icon" />
  {movie.vote_average ? movie.vote_average.toFixed(1) : '—'}
</div>

      </div>
      
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p className="year">{releaseYear}</p>
        <button 
        className={isFavorite ? "fav active" : "fav"} 
        onClick={(e) => {
          e.stopPropagation(); 
          onFavoriteClick();
        }}
      >
        {isFavorite ? '🧡' : '🤍'}
      </button>
      </div>
    </div>
  );
}

export default MovieCard;
