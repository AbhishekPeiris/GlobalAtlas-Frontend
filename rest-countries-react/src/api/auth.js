// api/auth.js
import axios from "axios";

const API_URL = import.meta.env.VITE_BASE_URL;

export const signUp = async (name, email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/register`,
      { name, email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Registration error:",
      error.response ? error.response.data : error.message
    );
    throw new Error(
      error.response ? error.response.data.msg : "Registration failed"
    );
  }
};

export const signIn = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/login`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Login error:",
      error.response ? error.response.data : error.message
    );
    throw new Error(error.response ? error.response.data.msg : "Login failed");
  }
};

// Add these functions to api/auth.js
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/forgot-password`,
      { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Forgot password error:",
      error.response ? error.response.data : error.message
    );
    throw new Error(
      error.response ? error.response.data.msg : "Failed to send reset email"
    );
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await axios.put(
      `${API_URL}/auth/reset-password/${token}`,
      { password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Reset password error:",
      error.response ? error.response.data : error.message
    );
    throw new Error(
      error.response ? error.response.data.msg : "Failed to reset password"
    );
  }
};
