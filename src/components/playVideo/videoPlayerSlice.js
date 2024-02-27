import { createSlice } from "@reduxjs/toolkit";

export const videoPlayerSlice = createSlice({
    name: 'videoPlayer',
    initialState: {
        showVideo: false,
        videoKey: false,
    },
    reducers: {
        setShowVideo: (state, action) => {
            state.showVideo = action.payload
        },
        setVideoKey: (state, action) => {
            state.videoKey = action.payload
        }
    },
});

export const {
    setShowVideo,
    setVideoKey,
} = videoPlayerSlice.actions;

export default videoPlayerSlice.reducer;
