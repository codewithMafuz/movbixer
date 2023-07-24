import { configureStore } from '@reduxjs/toolkit'
import homeSlice from '../pages/home/homeSlice'
import searchSlice from '../components/header/searchSlice'
import settingSlice from '../pages/settting/settingSlice'

const store = configureStore({
    reducer: {
        home: homeSlice,
        search: searchSlice,
        setting: settingSlice,
    }
})
export default store