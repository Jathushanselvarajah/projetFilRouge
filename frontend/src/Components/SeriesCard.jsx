const SeriesCard = ({ film }) => {
  return (
    <div className="series-card">
      <img src={film.image_url} alt={film.titre} />
      <h3>{film.titre}</h3>
      <p>{film.description}</p>
      <p><strong>Genre:</strong> {film.genre}</p>
      <p><strong>Année:</strong> {film.annee}</p>
    </div>
  );
};

export default SeriesCard;