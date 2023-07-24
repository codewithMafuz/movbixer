import { createSlice } from "@reduxjs/toolkit";
export const homeSlice = createSlice({
    name: 'home',
    initialState: {
        startFetchingURLAtLoad: '/movie/popular',
        imageBaseURL: null,
        popularMoviesDataArr: null,
        movieData: null,
        tvData: null,
    },
    reducers: {
        setPopularMoviesDataArr: (state, action) => {
            state.popularMoviesDataArr = action.payload
        },
        setStartFetchingURLAtLoad: (state, action) => {
            state.startFetchingURLAtLoad = action.payload
        },
        setImageBaseURL: (state, action) => {
            state.imageBaseURL = action.payload
        },
        setMovieData: (state, action) => {
            state.movieData = action.payload
        },
        setTvData: (state, action) => {
            state.tvData = action.payload
        },
    }
})

export const { setImageBaseURL, setStartFetchingURLAtLoad, setMovieData, setTvData, setBannerObjs, setPopularMoviesDataArr } = homeSlice.actions
export default homeSlice.reducer