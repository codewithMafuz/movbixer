import React, { useEffect, useState } from 'react'
import useFetch from './hooks/useFetch'
import fetchDataFromApi from './api/fetchURL'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home/Home'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import Details from './pages/details/Details'
import SearchResults from './pages/searchResults/SearchResults'
import Explore from './pages/explore/Explore'
import PageNotFound from './components/pageNotFound.js/PageNotFound'
import { useDispatch } from 'react-redux'
import { setImageBaseURL, setPopularMoviesDataArr } from './pages/home/homeSlice'
import Movie from './pages/movie/Movie'
import Tv from './pages/tv/Tv'
function localGet(str) {
  return JSON.parse(localStorage.getItem(str))
}
function localSet(key, val) {
  localStorage.setItem(key, JSON.stringify(val))
}

export default function App() {
  const dispatch = useDispatch()

  const dataObj = useFetch('/movie/popular')
  const localConfigObj = localGet('localConfigObj')
  const localConfigObjTime = localGet('localConfigObjTime')
  const hour12ToMills = 86400000
  const setConfiguration = (configurationResponse) => {
    const imageBaseURL = configurationResponse.data.images['secure_base_url'] + 'original'
    dispatch(setImageBaseURL(imageBaseURL))
  }

  useEffect(() => {
    if (dataObj?.data) {
      const dataArr = dataObj.data.results
      dispatch(setPopularMoviesDataArr(dataArr))
    }
  }, [dataObj])

  if (localConfigObj === null || ((parseInt(localConfigObjTime) + hour12ToMills) < (new Date().getTime()))) {
    try {
      fetchDataFromApi('/configuration').then((response) => {
        console.log('fetched configuration'); // delete
        localSet('localConfigObj', response)
        localSet('localConfigObjTime', new Date().getTime())
        setConfiguration(response)
      })
    } catch (er) {
      console.log(er);
    }
  } else {
    setConfiguration(localConfigObj)
  }


  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/movie' element={<Movie />} />
        <Route path='/tv' element={<Tv />} />
        <Route path="/:mediaType/:id" element={<Details />} />
        <Route path="/search/:query" element={<SearchResults />} />
        <Route path="/explore/:mediaType" element={<Explore />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </Router>
  )
}
