import { createSlice } from "@reduxjs/toolkit";
export const homeSlice = createSlice({
    name: 'home',
    initialState: {
        apiData: {

        },
        genres: {

        },
    },
    reducers: {
        setApiConfiguration: (state, action) => {
            state.apiData = action.payload
        },
        setGenres: (state, action) => {
            state.genres = action.payload
        },
    }
})

export const { setApiConfiguration, setGenres } = homeSlice.actions

export default homeSlice.reducer