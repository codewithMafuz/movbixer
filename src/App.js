import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home/Home'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import Details from './pages/details/Details'
import SearchResults from './pages/searchResults/SearchResults'
import Explore from './pages/explore/Explore'
import PageNotFound from './pages/pageNotFound.js/PageNotFound'
import Discover from './pages/discover/Discover'
import { useDispatch } from 'react-redux'
import useFetchConditionally from './hooks/useFetchConditionally'
import { setCurrentSituationOfPages, setImageBaseURL, setPopularMoviesDataArr, setMovieGenres, setTvGenres, setPopularTVsDataArr } from './pages/home/homeSlice'
import Fuse from 'fuse.js'

export const getObjectLength = (obj) => {
  var count = 0;
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      count++;
    }
  }
  return count;
}
export const localGet = (str) => {
  return JSON.parse(localStorage.getItem(str))
}
export const localSet = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val))
}
export const isTmDone = (time, min = 3) => {
  return (parseInt(time) + (60000 * min)) < Date.now()
}
export const isEndpoint = (endPoint) => {
  return typeof (endPoint) === 'string' && endPoint.includes('/')
}
export const findClosestMatches = (inputString, arr) => {
  const options = {
    shouldSort: true,
    threshold: 0.3,
    keys: ['value'],
  };
  const fuse = new Fuse(arr.map(item => ({ value: item })), options);
  const result = fuse.search(inputString);
  return result.map(item => item.item.value); // Multiple closest matches found
}
export const capFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export const getAllValsOfProp = (arr = false, prop = 'name') => {
  console.log(arr);
  if (!arr) {
    return []
  }
  return arr.map(obj => obj[prop])
}





export default function App() {
  const dispatch = useDispatch()

  const configurationEndpoint = '/configuration'

  const popularMoviesEndpoint = '/movie/popular'
  const popularTvsEndpoint = '/tv/popular'

  const movieGenresEndpoint = '/genre/movie/list'
  const tvGenresEndpoint = '/genre/tv/list'

  const endPointAndTimeDif = [
    { endPoint: configurationEndpoint, timeDif: 60 },

    { endPoint: popularMoviesEndpoint, timeDif: 100 },
    { endPoint: popularTvsEndpoint, timeDif: 100 },

    { endPoint: movieGenresEndpoint, timeDif: 500 },
    { endPoint: tvGenresEndpoint, timeDif: 500 },
  ]
  const { loading, datas, error } = useFetchConditionally(endPointAndTimeDif, JSON.stringify(endPointAndTimeDif))

  useEffect(() => {
    try {
      if (loading && !error) {
        dispatch(setCurrentSituationOfPages({ page: '/', situation: 'loading' }))
      } else if (error) {
        dispatch(setCurrentSituationOfPages({ page: '/', situation: error }))
      }
      else {
        dispatch(setCurrentSituationOfPages({ page: '/', situation: 'success' }))
        if (datas[configurationEndpoint]) {
          dispatch(setImageBaseURL(datas[configurationEndpoint]['images']['secure_base_url'] + 'original'))
        }

        if (datas[popularMoviesEndpoint]) {
          dispatch(setPopularMoviesDataArr(datas[popularMoviesEndpoint].results))
        }
        if (datas[popularTvsEndpoint]) {
          dispatch(setPopularTVsDataArr(datas[popularTvsEndpoint].results))
        }
        // genres
        if (datas[movieGenresEndpoint]) {
          dispatch(setMovieGenres(datas[movieGenresEndpoint]))
        }
        if (datas[tvGenresEndpoint]) {
          dispatch(setTvGenres(datas[tvGenresEndpoint]))
        }
      }

    } catch (er) {
      console.log(er);
    }
  }, [loading])







  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home error={error} />} />
        <Route path='/discover/:mediaType' element={<Discover />} />
        <Route path='/discover/:mediaType' element={<Discover />} />
        <Route path="/:mediaType/:id" element={<Details />} />
        <Route path="/search/:query" element={<SearchResults />} />
        <Route path="/explore/:mediaType" element={<Explore />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </Router>
  )
}
