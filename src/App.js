import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import fetchDataFromApi from './utils/Api';
import { useSelector, useDispatch } from 'react-redux';
import { setApiData, setApiURL, setImageBaseURL } from './pages/home/homeSlice'
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import PageNotFound from './pages/404/PageNotFound';
import Details from './pages/details/Details';
import Explore from './pages/explore/Explore'
import Home from './pages/home/Home'
import SearchResults from './pages/searchResults/SearchResult'



export default function App() {
  const dispatch = useDispatch()

  const [watchMovieOrNot, setWatchMovieOrNot] = useState(true)
  const [category, setCategory] = useState('popular')
  const startingURL = `/${watchMovieOrNot ? 'movie' : 'tv'}/${category}`
  const apiData = useSelector(state => state.home.apiData)

  const setImageBaseURLByFetch = () => {
    fetchDataFromApi('/configuration').then(response => {
      return response.data
    }).then(data => {
      const imgBaseURL = data.images['secure_base_url'] + 'original'
      if (imgBaseURL) {
        dispatch(setImageBaseURL(imgBaseURL))
      }
    }
    ).catch((err) => {
      console.log(err)
    })
  }
  const fetchApis = async () => {
    // first impression of fetching API movies/tv shows
    fetchDataFromApi(startingURL).then(response => {
      const data = response.data
      dispatch(setApiData(data))
      dispatch(setApiURL({
        prop: 'startingFetchURL',
        val: startingURL,
      }))
      return response
    }).catch((err) => {
      console.log(err);
    })
    // setting base url of API for image fetching
    setImageBaseURLByFetch()
  };
  useEffect(() => {
    fetchApis();
  }, [watchMovieOrNot, category]);

  return (
    <>
      <Header />
      <Router>
        <Routes>
          <Route path='/' index element={<Home />} />
          <Route path='/:mediaType/:id' element={<Details />} />
          <Route path='/search/:query' element={<SearchResults />} />
          <Route path='/explore/:mediaType' element={<Explore />} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </Router>
      <Footer />
    </>
  );
}