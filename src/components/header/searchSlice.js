import { createSlice } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
    name: 'search',
    initialState: {
        searchVal: null,
        recentSearchedVals: [],
    },
    reducers: {
        setSearchVal: (state, action) => {
            state.searchVal = action.payload
        },
        addInRecentSearchVals: (state, action) => {
            state.recentSearchedVals.push(action.payload)
        },
    }
})

export const { setSearchVal, addInRecentSearchVals } = searchSlice.actions
export default searchSlice.reducer