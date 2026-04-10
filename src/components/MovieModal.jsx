import orangeStar from '../assets/star_orange.png';

function MovieModal({ movie, onClose }) {
  if (!movie) return null; 

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Закрыть модальное окно"
        >
          &times;
        </button>
        
        <img
          src={movie.poster_path
            ? "https://image.tmdb.org/t/p/w500" + movie.poster_path
            : 'https://via.placeholder.com/500x750?text=No+Image'}
          alt={movie.title}
        />

        
        <div className="modal-info">
          <h2>{movie.title}</h2>
          <div className="modal-rating-container">
            <img src={orangeStar} alt="" className="star-icon-modal" />
            <span className="rating-value">{movie.vote_average ? movie.vote_average.toFixed(1) : '—'}</span>
          </div>

          <p className="modal-overview">{movie.overview || "Описание отсутствует."}</p>
          <p><strong>Дата выхода:</strong>{' '}
            {movie.release_date
              ? new Date(movie.release_date).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
              : "Неизвестна"}
              </p>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;
