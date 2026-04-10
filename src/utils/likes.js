export function getLikedMovies() {
  const saved = localStorage.getItem("movie-favorites");
  return saved ? JSON.parse(saved) : []; 
}

export function saveLikedMovies(ids) {
  localStorage.setItem("movie-favorites", JSON.stringify(ids));
}
