import { createSlice } from "@reduxjs/toolkit";
export const homeSlice = createSlice({
    name: 'home',
    initialState: {
        fetchApiURLs: {
            startingFetchURL: '/movie/popular',
            searchingURL: null,
            backdropImageURL: null,
            posterImageURL: null,
            profileImageURL: null,
        },
        apiData: {

        },
        searchApiData: {

        },
        genres: {

        },
    },
    reducers: {
        setImageBaseURL: (state, action) => {
            const baseURL = action.payload
            state.fetchApiURLs.backdropImageURL = baseURL
            state.fetchApiURLs.posterImageURL = baseURL
            state.fetchApiURLs.profileImageURL = baseURL
        },
        setApiURL: (state, action) => {
            state.fetchApiURLs[action.prop] = action.val
        },
        setApiData: (state, action) => {
            state.apiData = action.payload
        },
        setGenres: (state, action) => {
            state.genres = action.payload
        },
        setSearchApiData: (state, action) => {
            state.searchApiData = action.payload
        },
    }
})

export const { setImageBaseURL,setApiURL, setApiData, setGenres, setSearchApiData } = homeSlice.actions

export default homeSlice.reducer