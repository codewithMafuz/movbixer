import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import Spinner from '../../components/spinner/Spinner';
import ErrorPage from '../pageNotFound.js/PageNotFound';
import { useDispatch } from 'react-redux';
import WatchBoxInfinite from '../../components/watchsBox/WatchBoxInfinite';
import { setSearchVal, setShowGoUpBtn } from '../../components/header/searchSlice';
import { setTitle } from '../../App';

export default function SearchResults() {
  const dispatch = useDispatch()
  dispatch(setShowGoUpBtn(true))

  const { query } = useParams();
  const [pageNum, setPageNum] = useState(1)

  const { data, loading, error, totalPages } = useFetch(`/search/multi?query=${query}&page=${pageNum}`);
  const [prevDatas, setPrevDatas] = useState([])
  const [datas, setDatas] = useState(false)
  const hasMore = pageNum <= totalPages

  useEffect(() => {
    setPrevDatas([])
    setDatas(false)
    dispatch(setSearchVal(query))
    setTitle(`Search - '${query}'`)
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 200);
  }, [query])

  useEffect(() => {
    if (data) {
      const newDatas = [...prevDatas, ...data]
      setDatas(newDatas)
      setPrevDatas(newDatas)
    }
  }, [data?.length])

  const pageNumIncrement = () => {
    if (pageNum < totalPages) {
      setPageNum(prevPageNum => prevPageNum + 1)
    }
  }

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorPage />
  }


  return (
    <>
      {!loading && datas ?
        <>
          <WatchBoxInfinite
            mergeTop
            heading={`Search result for '${query}'`}
            data={datas}
            onReachEnd={pageNumIncrement}
            hasMore={hasMore} />
        </>
        :
        <Spinner loadingColor='skyblue' size='3rem' classNames='viewport-center' />
      }
    </>
  );
}

