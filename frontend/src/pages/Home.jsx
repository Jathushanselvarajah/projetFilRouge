import { useEffect, useState } from "react";
import SeriesList from "../Components/SeriesList";
import SeriesCard from "../Components/SeriesCard";
import { getAllFilms, addFilm, updateFilm, deleteFilm } from "../services/api";

const Home = () => {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFilm, setEditingFilm] = useState(null);
  const [formData, setFormData] = useState({
    titre: "",
    genre: "",
    annee: "",
    description: "",
    image_url: "",
  });

  useEffect(() => {
    fetchFilms();
  }, []);

  const fetchFilms = async () => {
    try {
      const data = await getAllFilms();
      setFilms(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFilm) {
        await updateFilm(editingFilm.id, formData);
        setEditingFilm(null);
      } else {
        await addFilm(formData);
      }
      setFormData({ titre: "", genre: "", annee: "", description: "", image_url: "" });
      fetchFilms();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (film) => {
    setEditingFilm(film);
    setFormData({
      titre: film.titre,
      genre: film.genre,
      annee: film.annee,
      description: film.description,
      image_url: film.image_url,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce film ?")) {
      try {
        await deleteFilm(id);
        fetchFilms();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <p>Chargement des films...</p>;

  return (
    <div>
      <h1>Netflux</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <h2>{editingFilm ? "Modifier un film" : "Ajouter un film"}</h2>
        <input name="titre" placeholder="Titre" value={formData.titre} onChange={handleChange} required />
        <input name="genre" placeholder="Genre" value={formData.genre} onChange={handleChange} required />
        <input name="annee" placeholder="Année" value={formData.annee} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input name="image_url" placeholder="URL de l'image" value={formData.image_url} onChange={handleChange} required />
        <button type="submit">{editingFilm ? "Modifier" : "Ajouter"}</button>
        {editingFilm && <button type="button" onClick={() => { setEditingFilm(null); setFormData({ titre: "", genre: "", annee: "", description: "", image_url: "" }); }}>Annuler</button>}
      </form>

      <div className="film-actions">
        {films.map((film) => (
          <div key={film.id} style={{ border: "1px solid #ccc", marginBottom: "1rem", padding: "1rem" }}>
            <SeriesCard film={film} />
            <button onClick={() => handleEdit(film)}>Modifier</button>
            <button onClick={() => handleDelete(film.id)}>Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;