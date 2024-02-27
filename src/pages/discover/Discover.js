import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import CustomSelect from '../../components/customSelect/CustomSelect'
import './style.css'
import { useSelector, useDispatch } from 'react-redux'
import { capFirstLetter, correctType, getMatchedVals, setTitle } from '../../App'
import './style.css'
import WatchBoxInfinite from '../../components/watchsBox/WatchBoxInfinite'
import Spinner from '../../components/spinner/Spinner'
import fetchDataFromApi from '../../api/fetchURL'
import { setShowGoUpBtn } from '../../components/header/searchSlice'
import NetworkError from '../../components/networkError/networkError'

export default function Discover() {
    const dipatch = useDispatch()
    dipatch(setShowGoUpBtn(true))

    const { mediaType } = useParams()
    const isMovie = mediaType === 'movie'
    const { movieGenres, tvGenres } = useSelector(state => state.home)



    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [networkFailed, setNetworkFailed] = useState(false)
    const [pageNum, setPageNum] = useState(1)
    const getURL = (page) => `/discover/${mediaType}?page=${page}`
    const [totalPages, setTotalPages] = useState(null)
    const [totalResults, setTotalResults] = useState(null)
    const [filterOptions, setFilterOptions] = useState({})
    const [isReachedEnd, setIsReachedEnd] = useState(false)

    const [genresIdAndNames, setGenreIdAndNames] = useState(isMovie ? movieGenres : tvGenres)
    const sortbyValAndNames = [
        { value: "original_title.asc", name: "Title (A-Z)" },
        { value: "primary_release_date.desc", name: "Release Date Descending" },
        { value: "primary_release_date.asc", name: "Release Date Ascending" },
        { value: "popularity.desc", name: "Popularity Descending" },
        { value: "popularity.asc", name: "Popularity Ascending" },
        { value: "vote_average.desc", name: "Rating Descending" },
        { value: "vote_average.asc", name: "Rating Ascending" },
    ]


    const fetchFirstPageData = async () => {
        setLoading(true)
        fetchDataFromApi(getURL(1), filterOptions)
            .then(data => {
                setData(data.results)
                setTotalPages(data.total_pages)
                setTotalResults(data.total_results)
                setLoading(false)
            })
            .catch(er => { })
    }

    const fetchNextPageData = async () => {
        if (navigator.onLine) {
            if (isReachedEnd || pageNum >= totalPages) {
                return;
            }
            const nextPageNum = pageNum + 1;
            if (nextPageNum <= totalPages) {
                fetchDataFromApi(getURL(nextPageNum), filterOptions)
                    .then(data => {
                        setData(prevResults => [...prevResults, ...(data?.results || [])])
                        setTotalPages(data.total_pages)
                        setTotalResults(data.total_results)
                    })
                    .catch(er => { })
                setPageNum(nextPageNum)
            } else {
                setIsReachedEnd(true)
            }
        } else {
            setNetworkFailed(true)
        }
    }

    const onFilteringChange = (values) => {
        if (values.genres) {
            const withGenres = getMatchedVals(genresIdAndNames, values.genres, 'name', 'id')
            if (withGenres) {
                filterOptions.with_genres = JSON.stringify(withGenres).slice(1, -1)
            } else {
                delete filterOptions.with_genres
            }
        } else {
            const sortBy = getMatchedVals(sortbyValAndNames, values.sortby, 'name', 'value')
            if (sortBy) {
                filterOptions.sort_by = sortBy[0]
            } else {
                delete filterOptions.sort_by
            }
        }
        fetchFirstPageData()
    }


    useEffect(() => {
        setTitle('Discover ' + (correctType(mediaType)) + 's')
        setTimeout(() => {
            window.scrollTo(0, 0)
        }, 200);
        setData([])
        setPageNum(1)
        setFilterOptions({})
        fetchFirstPageData()
    }, [mediaType])

    useEffect(() => {
        if (movieGenres && tvGenres) {
            setGenreIdAndNames(isMovie ? movieGenres.genres : tvGenres.genres)
        }
    }, [movieGenres])


    const hasMore = pageNum <= totalPages


    return (
        <>
            {!networkFailed ?
                <div className="discoverContainer">
                    <div className="discoverTopBox">
                        <h1 className='discoverHeading'>Disover {mediaType === 'tv' ? 'TV Shows' : capFirstLetter(mediaType)}</h1>
                        <div className="filterBoxes">
                            <CustomSelect
                                resultName={'sortby'}
                                uniqueId={'sortby'}
                                key={'sortby'}
                                filterList={sortbyValAndNames.map(obj => obj.name)}
                                hideOptionsOnSelect={false}
                                canSelectMulti={false}
                                nameOfSelect='Sortby'
                                searchOption={false}
                                headerHeight={60}
                                onFilterChange={onFilteringChange} />
                            {Array.isArray(genresIdAndNames) &&
                                <CustomSelect
                                    resultName={'genres'}
                                    uniqueId={'mediaCategory'}
                                    key={'mediaCategory'}
                                    filterList={genresIdAndNames.map(obj => obj.name)}
                                    hideOptionsOnSelect={false}
                                    canSelectMulti={true}
                                    nameOfSelect={`${correctType(mediaType)} Category`}
                                    searchOption={true}
                                    headerHeight={60}
                                    onFilterChange={onFilteringChange} />
                            }
                        </div>
                    </div>
                    {!loading && data ?
                        <>
                            <WatchBoxInfinite
                                data={data}
                                onReachEnd={fetchNextPageData}
                                hasMore={hasMore}
                            />
                            <h1 className='reachedEnd pt-12'>{totalResults.length === 0 ? 'Not Found' : 'You Reached the End'}</h1>
                        </>
                        :
                        <Spinner size='3rem' classNames='spinner viewport-center' loadingColor='var(--sky-blue-3)' circleColor='transparent' />
                    }
                </div>
                :
                <NetworkError
                    height='100vh'
                    width='100%'
                    onClickBtn={() => { window.location.reload() }}
                    message='Network failed'
                    btnTxt='Reload'
                />
            }
        </>
    )
}

