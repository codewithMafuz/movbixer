/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LazyLoadImg from '../lazyLoadImage/LazyLoadImage';
import TabsSwitch from '../tabsSwitch/TabsSwitch';
import RatingShow from '../ratingShow/RatingShow';
import Spinner from '../spinner/Spinner';
import useFetch from '../../hooks/useFetch';
import GenresBox from '../genres/GenresBox';
import NetworkError from '../networkError/networkError';
import './style.css';
import { PlayBtn } from '../playVideo/PlayVideo';


export const WatchCard = ({ dataObj, index, serialNumber = false, isPerson = false, showGenres = false, showRating = false, imgEffect = 'blur', isIndexNavigate = false, isSeason = false, isEpisode = false, isImage = false }) => {
    const navigate = useNavigate()
    const id = dataObj.id
    const paths = '/' + window.location.href.split('//')[1].split('/').slice(1).join('/') + '/'
    const lastPath = paths.slice(0, -1).split('/')[2]
    const serial = index + 1
    const mediaType = isPerson ? 'person' : dataObj.title ? 'movie' : 'tv'

    const { imageBaseURL } = useSelector(state => state.home)
    const sr = isPerson ? dataObj.profile_path : (dataObj.poster_path || dataObj.still_path || dataObj.file_path)
    const imgSrc = sr ? imageBaseURL + sr : false

    let navigationTo = (isIndexNavigate || (!isSeason && !isEpisode)) ? ('/' + mediaType + '/' + (isIndexNavigate ? lastPath + '/' + isIndexNavigate : id)) : ''
        +
        (
            isIndexNavigate ? '/' + isIndexNavigate : ''
        )
        +
        (
            (isSeason ? paths + serial : '')
            +
            (isEpisode ? paths + serial : '')
        )


    const handleClickDetails = () => {
        isImage ? window.open('https://image.tmdb.org/t/p/original' + sr, '_blank') : navigate(navigationTo)
    }

    return (
        <div className="carousel max-w-sm rounded overflow-hidden shadow-lg"
            onClick={handleClickDetails}>
            {imgSrc ?
                (imgEffect ? <LazyLoadImg
                    effect='blur'
                    className="carousel w-full"
                    src={imgSrc}
                    alt="img not available"
                /> : <img className="carousel w-full" src={imgSrc} alt='img not available' />)
                :
                <div style={{ minHeight: '380px' }} className='skeleton-loading'></div>
            }

            {!isImage &&
                <div className="carousel titleBox h-16 px-6 py-4">
                    <div className="carousel title text-white font-bold text-lg">{serialNumber ? (index + 1) + '. ' : ''}{dataObj.title || dataObj.name || '---'}</div>
                </div>}
            {!isPerson && showRating &&
                <RatingShow
                    rating={dataObj?.vote_average?.toFixed(1)}
                    parentClassName={'circleRatingBox'} />}

            {!isPerson && showGenres &&
                <GenresBox
                    directData={isPerson ? isPerson.map(obj => obj.title || obj.name) : false}
                    mediaType={dataObj.title ? 'movie' : isPerson ? 'person' : 'tv'}
                    spanClassName={'text-xs carousel inline-block bg-gray-200 rounded-full px-2 py-1 text-sm font-semibold'}
                    genreIds={dataObj.genre_ids}
                    className="carousel genreBox px-6 pt-4 pb-2" />}

        </div>
    )
}


export default function WatchsBox({ dataParam = [], heading = 'To Explore', renderOnTop = '', videos = false, isImage = false, fetchProp = false, isSeason = false, isEpisode = false, isIndexNavigate = false, limit = 100, tabViewDropboxType = true }) {
    try {

    } catch (er) {
    }
    const isDataParamIsObj = !Array.isArray(dataParam)
    const [refresh, setRefresh] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)
    const [toFetchOrShow, setToFetchOrShow] = useState(isDataParamIsObj ? Object.values(dataParam)[activeIndex] : dataParam)

    useEffect(() => {
        setToFetchOrShow(
            (isDataParamIsObj)
                ? (Object.values(dataParam)[activeIndex]).toLowerCase()
                : dataParam
        )
    }, [activeIndex, JSON.stringify(dataParam)])

    const { data, loading, error } = useFetch(toFetchOrShow, 1, {}, refresh, fetchProp)

    const slidesPerView = Math.round(window.innerWidth / (videos || (Array.isArray(data) && data?.find(obj => obj.hasOwnProperty('still_path'))) ? 400 : 250))


    const handleRefresh = () => {
        setRefresh(Date.now())
    }


    return (
        <>
            {renderOnTop}
            <div className="carousel container">
                {loading ?
                    <Spinner classNames='center' size='2.5rem' loadingColor='var(sky-blue-3)' circleColor='transparent' />
                    :
                    <>
                        <div className="carousel topContent my-2">
                            <span className="carousel heading">{heading}</span>
                            {isDataParamIsObj &&
                                <TabsSwitch
                                    dropboxType={tabViewDropboxType}
                                    className='tabBox'
                                    classNameSelectedTab='tab'
                                    activeClass='active'
                                    tabNames={Object.keys(dataParam)}
                                    onTabChange={(index) => {
                                        setActiveIndex(index)
                                    }} />
                            }
                        </div>
                        {!error ?
                            <Swiper
                                slidesPerView={slidesPerView}
                                spaceBetween={slidesPerView * 2}
                                effect="fade"
                                navigation={{
                                    nextEl: '.swiper-button-next',
                                    prevEl: '.swiper-button-prev',
                                    clickable: true,
                                    disabledClass: '_empty'
                                }}
                                className="carousel swiper_container"
                                modules={[EffectCoverflow, Pagination, Navigation]}>
                                {data && Array.isArray(data) && data.slice(0, limit ? limit : data.length).map((dataObj, index) => {
                                    const isPerson = dataObj.hasOwnProperty('profile_path') || dataObj.hasOwnProperty('gender')
                                    const isTvEp = dataObj.hasOwnProperty('still_path')

                                    return (
                                        <SwiperSlide
                                            className={`carousel swiper-slide-customize`}
                                            key={index}>
                                            {!videos ?
                                                <WatchCard
                                                    index={index}
                                                    serialNumber={true}
                                                    showRating={dataObj.vote_average}
                                                    showGenres={dataObj.genres}
                                                    key={index}
                                                    dataObj={dataObj}
                                                    isPerson={isPerson}
                                                    isImage={isImage}
                                                    detailsBtn={isTvEp}
                                                    isIndexNavigate={(isIndexNavigate === true && typeof isIndexNavigate === 'boolean') ? activeIndex + 1 : (isIndexNavigate || false)}
                                                    isSeason={isSeason}
                                                    isEpisode={isEpisode}
                                                />
                                                :
                                                <PlayBtn
                                                    src={dataObj.key ? (`https://img.youtube.com/vi/${dataObj.key}/hqdefault.jpg`) : false}
                                                    videoKeyProp={dataObj.key || false}
                                                    title={'Play ' + (dataObj.type || 'Video')}
                                                    showAnimationOnNoImage={true}
                                                    name={dataObj.name || '---'}
                                                />
                                            }
                                        </SwiperSlide>
                                    );
                                })}
                                <div className="carousel slider-controler">
                                    <div className="carousel swiper-button-prev slider-arrow">
                                        <ion-icon name="arrow-back-outline"></ion-icon>
                                    </div>
                                    <div className="carousel swiper-button-next slider-arrow">
                                        <ion-icon name="arrow-forward-outline"></ion-icon>
                                    </div>
                                </div>
                            </Swiper>
                            :
                            (
                                error === 'ERR_NETWORK'
                                    ?
                                    <NetworkError onClickBtn={handleRefresh} historyBack={true} />
                                    :
                                    <Spinner classNames='center' size='2.5rem' loadingColor='red' circleColor='transparent' />
                            )
                        }
                    </>
                }
            </div>
        </>
    );
}

