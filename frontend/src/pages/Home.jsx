import SeriesList from "../Components/SeriesList";
import { seriesData } from "../services/api";

const Home = () => {
  return (
    <div>
      <h1>Netflux</h1>
      <SeriesList series={seriesData} />
    </div>
  );
};

export default Home;