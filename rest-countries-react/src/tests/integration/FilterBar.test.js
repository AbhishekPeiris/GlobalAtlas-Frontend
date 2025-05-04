/* eslint-disable no-undef */
// src/tests/integration/FilterBar.test.js
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterBar from "../../components/home/FilterBar";

describe("<FilterBar />", () => {
    it("emits selected region & language", async () => {
        const onRegion = jest.fn();
        const onLanguage = jest.fn();

        render(<FilterBar onRegion={onRegion} onLanguage={onLanguage} />);

        // open region dropdown and pick "Asia"
        await userEvent.click(
            screen.getByRole("button", { name: /filter by region/i })
        );
        await userEvent.click(screen.getByRole("option", { name: "Asia" }));
        expect(onRegion).toHaveBeenCalledWith("Asia");

        // open language dropdown and pick "English"
        await userEvent.click(
            screen.getByRole("button", { name: /filter by language/i })
        );
        await userEvent.click(screen.getByRole("option", { name: "English" }));
        expect(onLanguage).toHaveBeenCalledWith("English");
    });
});