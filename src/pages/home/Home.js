import React, { useEffect } from 'react'
import Banner from '../../components/banner/Banner'
import Spinner from '../../components/spinner/Spinner'
import ErrorPage from '../pageNotFound.js/PageNotFound'
import WatchsBox from '../../components/watchsBox/WatchsBox'
import NetworkError from '../../components/networkError/networkError'
import { useParams } from 'react-router-dom'
import { setTitle } from '../../App'

export default function Home({ loading, error, isOnline }) {
  const refrshHomePage = () => {
    localStorage.clear()
    window.location.reload()
  }

  useEffect(() => {
    setTitle('Movbixer')
  }, [])


  return (
    <div className="page home">
      {(!loading && !error && isOnline) ?
        <>
          <Banner />

          <WatchsBox
            fetchProp={'results'}
            videos={false}
            dataParam={{
              'Today': '/trending/all/day',
              'Week': '/trending/all/week',
            }}
            heading={'Trending Movie & TV Shows'}
            tabViewDropboxType={false}
            isIndexNavigate={false}
          />
          <WatchsBox
            fetchProp={'results'}
            videos={false}
            dataParam={{
              'Movie': '/movie/popular',
              'TV': '/tv/popular',
              'Crew': '/person/popular'
            }}
            heading={'Popular Now'}
            tabViewDropboxType={false}
            isIndexNavigate={false} />
        </>
        :
        !loading && error ?
          <ErrorPage />
          :
          !isOnline ?
            <NetworkError onClickBtn={refrshHomePage} height='100vh' width='100vw' />
            :
            <Spinner classNames='viewport-center' size='3rem' loadingColor='var(--sky-blue-3)' />
      }
    </div>
  )
}
