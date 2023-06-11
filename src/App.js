import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { fetchDataFromApi } from './utils/Api';
import { useSelector, useDispatch } from 'react-redux';
import { setApiConfiguration, setGenres } from './pages/home/homeSlice'
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import PageNotFound from './pages/404/PageNotFound';
import Details from './pages/details/Details';
import Explore from './pages/explore/Explore'
import Home from './pages/home/Home'
import SearchResults from './pages/searchResults/SearchResult'

export default function App() {
  const [watchCategory, setWatchCategory] = useState('movie')

  const dispatch = useDispatch()
  const apiData = useSelector(state => state.home.apiData)

  useEffect(() => {
    apiFetch();
  }, [watchCategory]);


  const apiFetch = async () => {
    try {
      const response = await fetchDataFromApi(`/${watchCategory.toLowerCase()}/popular`);
      dispatch(setApiConfiguration(response.data))

    } catch (err) {
      console.error(err);
    }
  };
  console.log(apiData);

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </Router>
  );
}