import { createSlice } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
    name: 'search',
    initialState: {
        recentSearchedVals: [],
    },
    reducers: {
        addInRecentSearchVals: (state, action) => {
            state.recentSearchedVals.push(action.payload)
        }
    }
})

export const { addInRecentSearchVals } = searchSlice.actions
export default searchSlice.reducer