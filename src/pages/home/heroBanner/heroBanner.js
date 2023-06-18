import React, { useEffect, useState } from 'react'
import './Style.css'
import { useNavigate } from 'react-router-dom'
import useFetch from '../../../hooks/useFetch'
import { useSelector } from 'react-redux'
import { LazyImageLoader as Img } from '../../../components/LazyLoadImage/LazyLoadImage'
import ContentWrapper from '../../../components/ContentWrapper/ContentWrapper'

export const HeroBanner = () => {
  const navigate = useNavigate()
  const { backdropImageURL } = useSelector(state => state.home.fetchApiURLs)
  const [searchQuery, setSearchQuery] = useState('')
  const [background, setBackground] = useState('')
  const { data } = useFetch('/movie/upcoming')

  const handleSearchInput = ev => {
    if (ev.key === 'Enter') {
      handleSearch()
    }
  }
  useEffect(() => {
    if (data) {
      const bg = backdropImageURL + data.results[Math.floor(Math.random() * 20)].backdrop_path
      console.log(data.results);
      setBackground(bg)
    }
  }, [data])
  const handleSearch = () => {
    if (searchQuery.length > 0) {
      navigate(`search/${searchQuery.toLowerCase()}`)
    }
  }
  console.log(background);
  return (
    <div className='heroBanner'>
      <div className="backdrop-img">
        <Img src={background} />
      </div>
      <ContentWrapper>
        <div className="heroBannerContent">
          <span className="title">Welcome</span>
          <span className="subTitle">Millions of movies, TV shows and people to discover. Explore now.</span>
          <div className="searchInput">
            <input onChange={ev => {
              setSearchQuery(ev.target.value)
            }
            } onKeyDown={handleSearchInput} type="text" name="search" placeholder='Search movies or tv shows' value={searchQuery} />
            <button onClick={handleSearch} className="search">Search</button>
          </div>
        </div>
      </ContentWrapper>
    </div>
  )
}
export default HeroBanner

