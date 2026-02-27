import SeriesCard from "./SeriesCard";

const SeriesList = ({ films }) => {
  return (
    <div className="series-list">
      {films.map((film) => (
        <SeriesCard key={film.id} film={film} />
      ))}
    </div>
  );
};

export default SeriesList;