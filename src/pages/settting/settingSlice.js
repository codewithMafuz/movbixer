import { createSlice } from "@reduxjs/toolkit";

export const settingSlice = createSlice({
    name: 'setting',
    initialState: {
        maxWatchsInBanner: 5,
    },
    reducers: {
        setMaxWatchsInBanner: (state, action) => {
            state.maxWatchsInBanner = action.payload
        },

    }
})

export const { setMaxWatchsInBanner } = settingSlice.actions
export default settingSlice.reducer