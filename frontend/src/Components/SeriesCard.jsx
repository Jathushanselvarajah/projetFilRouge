const SeriesCard = ({ series }) => {
  return (
    <div className="series-card">
      <img src={series.image} alt={series.title} />
      <h3>{series.title}</h3>
      <p>{series.description}</p>
    </div>
  );
};

export default SeriesCard;