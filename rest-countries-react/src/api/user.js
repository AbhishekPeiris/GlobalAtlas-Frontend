// src/api/user.js
import axios from "axios";

const API_URL = import.meta.env.VITE_BASE_URL;

// Get authenticated user's profile
export const getUserProfile = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(`${API_URL}/users`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Delete user account
export const deleteUserAccount = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting user account:", error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};
