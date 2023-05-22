import axios from 'axios';

const BASE_URL = 'https://api.thecatapi.com/v1';
const API_KEY = process.env.REACT_APP_API_KEY;

// Set default headers for all requests
axios.defaults.headers.common['x-api-key'] = API_KEY;

export const fetchBreeds = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/breeds`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching breeds:`, error);
    return [];
  }
};

export const fetchBreedImages = async breedId => {
  try {
    const response = await axios.get(
      `${BASE_URL}/images/search?limit=10&breed_ids=${breedId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching images for breed ${breedId}:`, error);
    return [];
  }
};

export const fetchBreed = async breedId => {
  const response = await axios.get(
    `${BASE_URL}/images/search?breed_ids=${breedId}`
  );
  return response.data;
};

export const fetchRandomImage = async () => {
  const response = await axios.get(`${BASE_URL}/images/search`);
  return response.data;
};

export const fetchRandomImages = async (limit = 10) => {
  const response = await axios.get(`${BASE_URL}/images/search?limit=${limit}`);
  return response.data;
};

export const fetchRandomBreed = async () => {
  const allBreeds = await fetchBreeds();
  const randomIndex = Math.floor(Math.random() * allBreeds.length);
  return allBreeds[randomIndex];
};
