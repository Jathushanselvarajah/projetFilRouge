import { render, screen } from "@testing-library/react";
import SeriesCard from "../../Components/SeriesCard";

describe("SeriesCard", () => {
  const mockFilm = {
    titre: "Inception",
    genre: "Science-Fiction",
    annee: 2010,
    description: "Film de rêve",
    image_url: "https://example.com/image.jpg",
  };

  test("affiche les informations du film", () => {
    render(<SeriesCard film={mockFilm} />);

    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText("Film de rêve")).toBeInTheDocument();
    expect(screen.getByText(/Science-Fiction/)).toBeInTheDocument();
    expect(screen.getByText(/2010/)).toBeInTheDocument();
  });

  test("affiche une image avec le bon alt", () => {
    render(<SeriesCard film={mockFilm} />);
    const image = screen.getByAltText("Inception");
    expect(image).toBeInTheDocument();
    expect(image.src).toContain(mockFilm.image_url);
  });
});