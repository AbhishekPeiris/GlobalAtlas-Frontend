/* eslint-disable no-undef */
// src/tests/integration/CountryList.test.js
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CountryList from "../../pages/CountryList";
import * as api from "../../services/api";

const mockCountries = [
    {
        name: { common: "France" },
        flags: { png: "" },
        region: "Europe",
        population: 1,
        cca3: "FRA",
    },
    {
        name: { common: "Brazil" },
        flags: { png: "" },
        region: "Americas",
        population: 1,
        cca3: "BRA",
    },
];

beforeEach(() => {
    jest.spyOn(api, "fetchAll").mockResolvedValue({ data: mockCountries });
    jest
        .spyOn(api, "searchByName")
        .mockResolvedValue({ data: [mockCountries[0]] });
    jest
        .spyOn(api, "filterByRegion")
        .mockResolvedValue({ data: [mockCountries[1]] });
    jest
        .spyOn(api, "filterByLanguage")
        .mockResolvedValue({ data: mockCountries });
});

afterEach(jest.restoreAllMocks);

describe("<CountryList /> page", () => {
    it("renders initial list then filters by region", async () => {
        render(<CountryList />);

        // wait for initial cards
        await waitFor(() => {
            expect(screen.getByText(/showing 2 countries/i)).toBeInTheDocument();
        });

        // choose region
        await userEvent.click(
            screen.getByRole("button", { name: /filter by region/i })
        );
        await userEvent.click(screen.getByRole("option", { name: /americas/i }));

        // list updates to 1
        await waitFor(() =>
            expect(screen.getByText(/showing 1 countries/i)).toBeInTheDocument()
        );
    });

    it("searches by name", async () => {
        render(<CountryList />);

        const input = screen.getByRole("textbox", {
            name: /search for a country/i,
        });
        await userEvent.type(input, "Fra");

        // debounce + request
        await waitFor(() => expect(api.searchByName).toHaveBeenCalledWith("Fra"));

        // result list shows 1
        expect(await screen.findByText(/showing 1 countries/i)).toBeInTheDocument();
    });
});