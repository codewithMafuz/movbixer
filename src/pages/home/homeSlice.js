import { createSlice } from "@reduxjs/toolkit";

export const homeSlice = createSlice({
    name: 'home',
    initialState: {
        imageBaseURL: 'http://image.tmdb.org/t/p/original/',
        movieGenres: null,
        tvGenres: null,
    },
    reducers: {
        setImageBaseURL: (state, action) => {
            state.imageBaseURL = action.payload;
        },
        setMovieGenres: (state, action) => {
            state.movieGenres = action.payload
        },
        setTvGenres: (state, action) => {
            state.tvGenres = action.payload
        },
    },
});

export const {
    setImageBaseURL,
    setMovieGenres,
    setTvGenres,
} = homeSlice.actions;

export default homeSlice.reducer;
