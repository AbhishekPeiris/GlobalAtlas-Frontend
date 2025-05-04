/* eslint-disable no-undef */
// src/tests/unit/useCountries.test.js
import { renderHook, act } from "@testing-library/react";
import useCountries from "../../hooks/useCountries";
import * as api from "../../services/api";

describe("useCountries hook", () => {
    const stub = [{ name: "France", cca3: "FRA" }];

    beforeEach(() => {
        jest.spyOn(api, "fetchAll").mockResolvedValue({ data: stub });
        jest.spyOn(api, "searchByName").mockResolvedValue({ data: stub });
        jest.spyOn(api, "filterByRegion").mockResolvedValue({ data: stub });
        jest.spyOn(api, "filterByLanguage").mockResolvedValue({ data: stub });
    });

    afterEach(jest.restoreAllMocks);

    it("loads all countries on mount", async () => {
        const { result } = renderHook(() => useCountries());

        // initial state
        expect(result.current.loading).toBe(true);

        // wait for state to settle
        await act(() => Promise.resolve());

        expect(api.fetchAll).toHaveBeenCalledTimes(1);
        expect(result.current.countries).toEqual(stub);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
    });

    it("search(), byRegion() and byLanguage() update countries", async () => {
        const { result } = renderHook(() => useCountries());

        await act(() => Promise.resolve()); // skip initial fetch

        await act(async () => result.current.search("france"));
        expect(api.searchByName).toHaveBeenCalledWith("france");
        expect(result.current.countries).toEqual(stub);

        await act(async () => result.current.byRegion("Europe"));
        expect(api.filterByRegion).toHaveBeenCalledWith("Europe");

        await act(async () => result.current.byLanguage("French"));
        expect(api.filterByLanguage).toHaveBeenCalledWith("French");
    });
});