import { createSlice } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
    name: 'search',
    initialState: {
        searchVal: '',
        showGoUpBtn: false
    },
    reducers: {
        setShowGoUpBtn: (state, action) => {
            state.showGoUpBtn = action.payload
        },
        setSearchVal: (state, action) => {
            state.searchVal = action.payload
        }
    }
})

export const { setShowGoUpBtn, setSearchVal } = searchSlice.actions
export default searchSlice.reducer