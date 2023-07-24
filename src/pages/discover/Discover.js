import React, { useState, useEffect } from 'react'
import { json, useParams } from 'react-router-dom'
import useFetch from '../../hooks/useFetch'
import CustomSelect from '../../components/customSelect/CustomSelect'
import './style.css'
import { useSelector } from 'react-redux'
import { capFirstLetter, getAllValsOfProp } from '../../App'

export default function Discover() {
    const { mediaType } = useParams()
    const isMovie = mediaType === 'movie'

    const [dataArr, setDataArr] = useState([])
    const [pageNum, setPageNum] = useState(1)
    const [url, setURL] = useState(`/discover/${mediaType}?page=${pageNum}`)
    const [filterOptions, setFilterOptions] = useState({})

    const { data, totalPages } = useFetch(url, false, filterOptions)
    const sortbyParams = [
        { value: "popularity.desc", name: "Popularity Descending" },
        { value: "popularity.asc", name: "Popularity Ascending" },
        { value: "vote_average.desc", name: "Rating Descending" },
        { value: "vote_average.asc", name: "Rating Ascending" },
        { value: "primary_release_date.desc", name: "Release Date Descending" },
        { value: "primary_release_date.asc", name: "Release Date Ascending" },
        { value: "original_title.asc", name: "Title (A-Z)" },
    ]
    const sortOptionList = sortbyParams.map(obj => obj.name)
    const movieGenres = useSelector(state => state.home.movieGenres?.genres?.map(obj => obj.name))
    const tvGenres = useSelector(state => state.home.tvGenres?.genres?.map(obj => obj.name))
    const [genresList, setGenreList] = useState(isMovie ? movieGenres : tvGenres)
    const genreChangeDetect = JSON.stringify(isMovie ? movieGenres : tvGenres)

    const onSortingFilterChange = (values) => {
        console.log('running onSortingFilterChange', values);
    }

    useEffect(() => {
        setDataArr([])
        setFilterOptions({})
    }, [mediaType])
    useEffect(() => {
        setGenreList(isMovie ? movieGenres : tvGenres)
    }, [genreChangeDetect])

    useEffect(() => {
        if (data) {
            if (pageNum === 1) {
                setDataArr(data)
            } else {
                setDataArr([...dataArr, ...data])
            }
        }
    }, [data])

    return (
        <div className="filter-select">
            <CustomSelect uniqueId={'sortby'} key={'sortby'} filterList={sortOptionList} hideOptionsOnSelect={false} canSelectMulti={false} nameOfSelect='Sortby' searchOption={true} onFilterChange={onSortingFilterChange} />
            {genresList &&
                <CustomSelect uniqueId={'mediaCategory'} key={'mediaCategory'} filterList={genresList} hideOptionsOnSelect={false} canSelectMulti={true} nameOfSelect={`${capFirstLetter(mediaType)} Category`} searchOption={true} onFilterChange={onSortingFilterChange} />
            }
        </div>
    )
}


// template new card jsx;
/*
<div className="card w-96 bg-base-100 shadow-xl">
  <figure><img src="/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /></figure>
  <div className="card-body">
    <h2 className="card-title">
      Shoes!
      <div className="badge badge-secondary">NEW</div>
    </h2>
    <p>If a dog chews shoes whose shoes does he choose?</p>
    <div className="card-actions justify-end">
      <div className="badge badge-outline">Fashion</div> 
      <div className="badge badge-outline">Products</div>
    </div>
  </div>
</div>
*/