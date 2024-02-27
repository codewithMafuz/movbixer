import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_TOKEN = process.env.REACT_APP_API_TOKEN;
const headers = {
    Authorization: 'Bearer ' + API_TOKEN
};

const fetchDataFromApi = async (url, params) => {
    try {
        const response = await axios.get(BASE_URL + url, {
            headers,
            params
        });
        return response.data;
    } catch (err) {
        console.log(err);
        return err
    }
};

export default fetchDataFromApi;
