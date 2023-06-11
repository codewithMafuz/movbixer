import React, { useEffect, useState } from 'react';
import './App.css';
import { fetchDataFromApi } from './utils/Api';
import { useSelector, useDispatch } from 'react-redux';
import { setApiConfiguration, setGenres} from './pages/home/homeSlice'

export default function App() {
  const [watchCategory, setWatchCategory] = useState('movie')
  const [moviesOrTvsArr, setmoviesOrTvsArr] = useState(null)
  const dispatch = useDispatch()
  const apiData = useSelector(state => state.home.apiData)

  useEffect(() => {
    apiFetch();
  }, [watchCategory]);
  
  
  const apiFetch = async () => {
    try {
      const response = await fetchDataFromApi(`/${watchCategory.toLowerCase()}/popular`);
      dispatch(setApiConfiguration(response.data))
      setmoviesOrTvsArr(await response.data.results)
      
    } catch (err) {
      console.error(err);
    }
  };
  const { page, results, total_pages, total_results } = apiData

  return (
    <>
      <h1>Tatal Results : {total_results}</h1>
      <h1>App</h1>
    </>
  );
}