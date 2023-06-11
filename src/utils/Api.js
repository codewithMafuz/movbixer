import axios from 'axios'

const BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MDRjMWVkOTIxODYwNWIzZmVjOTA5MjEwZjU3YTVmYyIsInN1YiI6IjY0ODMwZTUxYmYzMWYyNTA1NWEwMTEzZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mkDMmS_quBq051vXNNFw-a-sOZyvaAYE-El1r3A0w-U'
const headers = {
    Authorization: 'Bearer ' + TMDB_API_KEY
}

export const fetchDataFromApi = async (url, params) => {
    try {
        const response = axios.get(BASE_URL + url, {
            headers,
            params
        })
        return await response
    } catch (err) {
        console.log(err);
        return err
    }
}