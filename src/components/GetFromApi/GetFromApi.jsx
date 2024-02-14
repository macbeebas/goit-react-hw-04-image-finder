import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const URL_API = 'https://pixabay.com/api/';
const KEY_API = '39270567-a82d11f42742c28a9e6d14c5c';
const PARAMS_API = {
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 12,
};

export async function GetFromApi(searchQuery, actualPage) {
  const url = `${URL_API}?key=${KEY_API}&q=${searchQuery}&page=${actualPage}`;
  try {
    const response = await axios.get(`${url}`, { params: PARAMS_API });
    const pictures = response.data.hits;
    const totalHits = response.data.totalHits;
    const totalPages = Math.ceil(response.data.totalHits / PARAMS_API.per_page);
    return { pictures, totalHits, totalPages };
  } catch (error) {
    Notify.failure('ERROR!!! Something went wrong!');
  }
}
