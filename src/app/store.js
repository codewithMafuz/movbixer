import { configureStore } from '@reduxjs/toolkit'
import homeSlice from '../pages/home/homeSlice'

export const store = configureStore({
    reducer: {
        home : homeSlice,
    }
})