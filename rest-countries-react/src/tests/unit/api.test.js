/* eslint-disable no-undef */
// src/tests/unit/api.test.js
import axios from 'axios';
import {
    fetchAll,
    searchByName,
    filterByRegion,
    filterByLanguage,
    getByCode,
    independent,
} from '../../services/api';

vi.mock('axios');

const BASE = import.meta.env.VITE_COUNTRIES_URL || 'https://restcountries.com/v3.1'; // pick any value
beforeAll(() => {
    vi.stubEnv('VITE_COUNTRIES_URL', BASE);
});

beforeEach(() => {
    axios.get.mockResolvedValue({ data: [] });
    axios.get.mockClear();
});

describe('REST-Countries service helpers', () => {
    it('fetchAll()', async () => {
        await fetchAll();
        expect(axios.get).toHaveBeenCalledWith(
            `${BASE}/all?fields=name,cca3,flags,population,region,languages,capital`
        );
    });

    it('searchByName()', async () => {
        await searchByName('France');
        expect(axios.get).toHaveBeenCalledWith(`${BASE}/name/France`);
    });

    it('filterByRegion()', async () => {
        await filterByRegion('Europe');
        expect(axios.get).toHaveBeenCalledWith(`${BASE}/region/Europe`);
    });

    it('filterByLanguage()', async () => {
        await filterByLanguage('French');
        expect(axios.get).toHaveBeenCalledWith(`${BASE}/lang/French`);
    });

    it('getByCode()', async () => {
        await getByCode('FRA');
        expect(axios.get).toHaveBeenCalledWith(`${BASE}/alpha/FRA`);
    });

    it('independent()', async () => {
        await independent();
        expect(axios.get).toHaveBeenCalledWith(
            `${BASE}/independent?status=true&fields=name,cca3`
        );
    });
});