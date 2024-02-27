import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Details from './pages/details/Details';
import SearchResults from './pages/searchResults/SearchResults';
import PageNotFound from './pages/pageNotFound.js/PageNotFound';
import Discover from './pages/discover/Discover';
import { useDispatch } from 'react-redux';
import { setImageBaseURL, setMovieGenres, setTvGenres } from './pages/home/homeSlice';
import Fuse from 'fuse.js';
import TvSeason from './pages/TvSeason/TvSeason';
import useFetch from './hooks/useFetch';
const isOnline = navigator.onLine

export const getObjectLength = (obj) => {
  var count = 0;
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      count++;
    }
  }
  return count;
};
export const localGet = (str) => {
  return JSON.parse(localStorage.getItem(str));
};
export const localSet = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val));
};
export const isTmDone = (time, min = 3) => {
  return parseInt(time) + 60000 * min < Date.now();
};
export const isEndpoint = (endPoint) => {
  return typeof endPoint === 'string' && endPoint.includes('/');
};
export const findClosestMatches = (inputString, arr) => {
  const options = {
    shouldSort: true,
    threshold: 0.3,
    keys: ['value'],
  };
  const fuse = new Fuse(
    arr.map((item) => ({ value: item })),
    options
  );
  const result = fuse.search(inputString);
  return result.map((item) => item.item.value); // Multiple closest matches found
};
export const capFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
export const getMatchedVals = (arrOfObj, arr, toMatch, toReturn) => {
  const res = arrOfObj.filter(obj => arr.includes(obj[toMatch])).map(obj => obj[toReturn])
  return res.length > 0 ? res : false
}
export const isOnlineBrowser = () => {
  return navigator.onLine ? true : false
}
export const setTitle = (newTitle = 'Movbixer', addWithPrev = false) => {
  document.title = capFirstLetter(addWithPrev ? document.title + newTitle : newTitle)
}
export const correctType = (medInp = false) => {
  const med = medInp ? medInp : (window.location.href.split('//')[1].split('/')[1]
    || '')
  return med === 'tv' ? 'TV Show' : capFirstLetter(med)
}
export const strWordSlicer = (str = '', len = 400, ending = '...') => {
  if (str.length > len) {
    for (let i = len - 1; i >= 0; i--) {
      if (str[i] === ' ') {
        return str.slice(0, i) + ending;
      }
    }
  }
  return str;
};


export default function App() {
  const dispatch = useDispatch();

  const {
    data: configurationData,
    loading: configurationLoading,
    error: configurationError
  } = useFetch('/configuration', 60, {}, false, false);

  const {
    data: movieGenresData,
    loading: movieGenresLoading,
    error: movieGenresError
  } = useFetch('/genre/movie/list', 10, {}, false, false);

  const {
    data: tvGenresData,
    loading: tvGenresLoading,
    error: tvGenresError
  } = useFetch('/genre/tv/list', 10, {}, false, false);

  const datas = configurationData && movieGenresData && tvGenresData;
  const loading = configurationLoading || movieGenresLoading || tvGenresLoading;
  const error = configurationError || movieGenresError || tvGenresError;




  useEffect(() => {
    try {
      if (datas && !loading && !error && isOnline) {

        dispatch(setImageBaseURL(configurationData?.images?.secure_base_url + 'original'));
        dispatch(setMovieGenres(movieGenresData));
        dispatch(setTvGenres(tvGenresData));

      }

    } catch (er) {
    }
  }, [loading]);


  const routes = [
    { path: '/', component: Home },
    { path: '/discover/:mediaType', component: Discover },
    { path: '/:mediaType/:id', component: Details },
    { path: '/:mediaType/:id/:seasonNumber', component: TvSeason },
    { path: '/:mediaType/:id/:seasonNumber/:episodeNumber', component: TvSeason },
    { path: '/search/:query', component: SearchResults },
    { path: '*', component: PageNotFound },
  ];

  return (
    <Router>
      <Header />
      <Routes>
        {routes.map(({ path, component: Component }) => (
          <Route key={path} path={path} element={<Component isOnline={isOnline} loading={loading} error={error} />} />
        ))}
      </Routes>
      <Footer />
    </Router>
  );
}
