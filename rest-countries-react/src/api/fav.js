// api/fav.js
import axios from "axios";

const API_URL = import.meta.env.VITE_BASE_URL;

// Get token from localStorage
const getToken = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Add a country to favorites
export const addToFavorites = async (countryCode) => {
  try {
    const response = await axios.post(
      `${API_URL}/favourites`,
      { countryCode },
      {
        headers: {
          "Content-Type": "application/json",
          ...getToken(),
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw new Error(error.response?.data?.msg || "Failed to add to favorites");
  }
};

// Remove a country from favorites
export const removeFromFavorites = async (favoriteId) => {
  try {
    const response = await axios.delete(`${API_URL}/favourites/${favoriteId}`, {
      headers: getToken(),
    });
    return response.data.favorite; // Return the updated favorite object
  } catch (error) {
    console.error("Error removing from favorites:", error);
    throw new Error(
      error.response?.data?.msg || "Failed to remove from favorites"
    );
  }
};

// Get user's favorite countries
export const getUserFavorites = async () => {
  try {
    // Use the dedicated favorites endpoint instead of user profile
    const response = await axios.get(`${API_URL}/favourites`, {
      headers: getToken(),
    });
    return response.data || [];
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
};

// Check if a country is in favorites
export const checkFavoriteStatus = async (countryCode) => {
  try {
    const favorites = await getUserFavorites();
    return favorites.find(
      (fav) => fav.countryCode === countryCode && fav.isAdded === true
    );
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return null;
  }
};
