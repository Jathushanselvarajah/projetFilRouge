import { getAllFilms } from "../../services/api";

global.fetch = jest.fn();

describe("API Service", () => {
  test("getAllFilms retourne des données", async () => {
    const mockData = [{ id: 1, titre: "Test" }];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const data = await getAllFilms();

    expect(data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/films");
  });

  test("gère les erreurs", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    await expect(getAllFilms()).rejects.toThrow();
  });
});