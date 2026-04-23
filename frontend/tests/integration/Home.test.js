import { render, screen, waitFor } from "@testing-library/react";
import Home from "../../pages/Home";
import * as api from "../../services/api";

jest.mock("../../services/api");

describe("Home page", () => {
  test("affiche les films depuis l'API", async () => {
    const mockFilms = [
      {
        id: 1,
        titre: "Inception",
        genre: "Sci-Fi",
        annee: 2010,
        description: "Film de rêve",
        image_url: "https://example.com/image.jpg",
      },
    ];

    api.getAllFilms.mockResolvedValue(mockFilms);

    render(<Home />);

    expect(screen.getByText(/Chargement/)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Inception")).toBeInTheDocument();
    });
  });
});