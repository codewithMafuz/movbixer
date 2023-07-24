import { createSlice } from "@reduxjs/toolkit";

export const homeSlice = createSlice({
    name: 'home',
    initialState: {
        currentSituationOfPages: {
            '/': 'loading',
            '/movie': 'loading',
            '/tv': 'loading',
            '/details': 'loading',
            '/explore': 'loading',
            '/searchResults': 'loading',
            '/setting': 'loading',
        },
        imageBaseURL: 'http://image.tmdb.org/t/p/original/',
        trendingAllDay: null,
        trendingAllWeek: null,
        popularMoviesDataArr: null,
        popularTVsDataArr: null,
        movieDatas: null,
        tvDatas: null,
        movieGenres: null,
        tvGenres: null,
    },
    reducers: {
        setCurrentSituationOfPages: (state, action) => {
            console.log(action);
            state.currentSituationOfPages[action.payload.page] = action.payload.situation
        },
        setImageBaseURL: (state, action) => {
            state.imageBaseURL = action.payload;
        },
        setPopularMoviesDataArr: (state, action) => {
            state.popularMoviesDataArr = action.payload;
        },
        setPopularTVsDataArr: (state, action) => {
            state.popularTVsDataArr = action.payload;
        },
        setTrendingAllDay: (state, action) => {
            state.trendingAllDay = action.payload;
        },
        setTrendingAllWeek: (state, action) => {
            state.trendingAllWeek = action.payload;
        },
        setMovieData: (state, action) => {
            state.movieDatas = action.payload;
        },
        setTvData: (state, action) => {
            state.tvDatas = action.payload;
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
    setCurrentSituationOfPages,
    setImageBaseURL,
    setPopularMoviesDataArr,
    setPopularTVsDataArr,
    setTrendingAllDay,
    setTrendingAllWeek,
    setMovieData,
    setTvData,
    setMovieGenres,
    setTvGenres,
} = homeSlice.actions;

export default homeSlice.reducer;
