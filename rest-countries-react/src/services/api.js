import axios from "axios";

const BASE = import.meta.env.VITE_COUNTRIES_URL;

export const fetchAll = () =>
  axios.get(
    `${BASE}/all?fields=name,cca3,flags,population,region,languages,capital`
  );

export const searchByName = (name) =>
  axios.get(`${BASE}/name/${encodeURIComponent(name)}`);

export const filterByRegion = (region) =>
  axios.get(`${BASE}/region/${encodeURIComponent(region)}`);

export const filterByLanguage = (lang) =>
  axios.get(`${BASE}/lang/${encodeURIComponent(lang)}`);

export const getByCode = (code) =>
  axios.get(`${BASE}/alpha/${encodeURIComponent(code)}`);

export const independent = () =>
  axios.get(`${BASE}/independent?status=true&fields=name,cca3`);
