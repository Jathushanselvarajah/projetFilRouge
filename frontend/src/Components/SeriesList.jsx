import SeriesCard from "./SeriesCard";

const SeriesList = ({ series }) => {
  return (
    <div className="series-list">
      {series.map((item) => (
        <SeriesCard key={item.id} series={item} />
      ))}
    </div>
  );
};

export default SeriesList;