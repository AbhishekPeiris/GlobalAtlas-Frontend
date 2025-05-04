import { useCallback, useEffect, useState } from "react";
import {
  fetchAll,
  searchByName,
  filterByRegion,
  filterByLanguage,
} from "../services/api";

export default function useCountries() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await fetchAll();
      setCountries(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const search = async (name) => {
    try {
      setLoading(true);
      const { data } = await searchByName(name);
      setCountries(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const byRegion = async (region) => {
    try {
      setLoading(true);
      const { data } = await filterByRegion(region);
      setCountries(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const byLanguage = async (lang) => {
    try {
      setLoading(true);
      const { data } = await filterByLanguage(lang);
      setCountries(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return {
    countries,
    loading,
    error,
    search,
    byRegion,
    byLanguage,
    reload: loadAll,
  };
}
