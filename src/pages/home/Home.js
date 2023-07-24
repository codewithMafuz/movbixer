import React, { } from 'react'
import Banner from '../../components/banner/Banner'
import { useSelector } from 'react-redux'
import Spinner from '../../components/spinner/Spinner'
import ErrorPage from '../pageNotFound.js/PageNotFound'
import WatchsBox from '../../components/watchsBox/WatchsBox'

export default function Home({ error }) {

  const { currentSituationOfPages, popularMoviesDataArr, popularTVsDataArr } = useSelector(state => state.home)

  return (
    <div className="page home">
      {currentSituationOfPages['/'] === 'success' && popularMoviesDataArr ?
        <>
          <Banner />

          <WatchsBox dataParam={{ 'Today': '/trending/all/day', 'Week': '/trending/all/week' }} heading={'Trending Movie & TV Shows'} />
          <WatchsBox dataParam={popularMoviesDataArr} heading={'Popular Movies'} />
          <WatchsBox dataParam={popularTVsDataArr} heading={'Popular TV Shows'} />
        </>
        :
        currentSituationOfPages['/'] === 'loading' ?
          <>
            <Spinner classNames='viewport-center' size='3rem' loadingColor='var(--sky-blue-3)' />
          </>
          :
          <>
            <ErrorPage />
          </>
      }
    </div>
  )
}
