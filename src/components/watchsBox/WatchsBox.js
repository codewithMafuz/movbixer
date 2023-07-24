/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import BlackImage from '../../assets/full-black-image.jpg';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LazyLoadImg from '../lazyLoadImage/LazyLoadImage';
import RatingShow from '../ratingShow/RatingShow';
import Spinner from '../spinner/Spinner';
import useFetch from '../../hooks/useFetch';
import GenresBox from '../genres/GenresBox';


export const WatchCard = ({ dataObj }) => {
    const sr = dataObj['poster_path'];
    const formatDate = (dtStr) =>
        new Date(dtStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    return (
        <div className="card w-96 bg-base-100 shadow-xl">
            <figure><img src={dataObj} alt="Shoes" /></figure>
            <div className="card-body">
                <h2 className="card-title">
                    {dataObj.title || dataObj.name || 'Unknown'}
                    <div className="badge badge-secondary">NEW</div>
                </h2>
                <p>{formatDate(dataObj.release_date || dataObj.first_air_date)}</p>
                <div className="card-actions justify-end">

                    <div className="badge badge-outline">Fashion</div>
                    <div className="badge badge-outline">Products</div>
                </div>
            </div>
        </div>
    )
}

export const Tabs = ({ tabNames, handleActiveIndex, activeIndex }) => {

    return (
        <div className="tabBox right custom-badge">
            {tabNames.map((tabName, tabIndex) => {
                return (
                    <span
                        key={tabIndex}
                        onClick={() => {
                            handleActiveIndex(tabIndex)
                        }}
                        className={"tab" + (tabIndex === activeIndex ? ' active' : '')}
                    >{tabName}
                    </span>
                )
            }
            )}
        </div>
    )

}


export default function WatchsBox({ dataParam = [], heading = 'To Explore' }) {
    const {imageBaseURL } = useSelector(state => state.home)
    const navigate = useNavigate()
    const [activeIndex, setActiveIndex] = useState(0)
    const [toFetchOrShow, setToFetchOrShow] = useState(!Array.isArray(dataParam) ? Object.values(dataParam)[activeIndex] : dataParam)
    useEffect(() => {
        setToFetchOrShow(
            (!Array.isArray(dataParam))
                ? (Object.values(dataParam)[activeIndex]).toLowerCase()
                : dataParam
        )

    }, [activeIndex, dataParam])

    const { data, loading } = useFetch(toFetchOrShow, 1)
    const [slidesPerView, setSlidesPerView] = useState(5);

    useEffect(() => {
        const handleResize = () => {
            setSlidesPerView(Math.round(window.innerWidth / 250))
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    const handleClickDetails = (dataObj) => {
        let mediaType = dataObj.title ? 'movie' : 'tv'
        navigate(`/${mediaType}/${dataObj.id}`)
    }
    const handleActiveIndex = (index) => {
        setActiveIndex(index)
    }

    return (
        <div className="carousel container">
            {loading ?
                <Spinner classNames='center' size='2.5rem' loadingColor='var(--sky-blue-3)' circleColor='transparent' />
                :
                <>
                    <div className="carousel topContent my-2">
                        <span className="custom-badge size-2">{heading}</span>
                        {!Array.isArray(dataParam) &&
                            <Tabs
                                tabNames={Object.keys(dataParam)}
                                handleActiveIndex={handleActiveIndex}
                                activeIndex={activeIndex} />
                        }
                    </div>
                    <Swiper
                        effect="creative"
                        slidesPerView={slidesPerView}
                        spaceBetween={slidesPerView * 2}
                        navigation={{
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                            clickable: true,
                        }}
                        className="carousel swiper_container"
                        modules={[EffectCoverflow, Pagination, Navigation]}>
                        {data && Array.isArray(data) && data.map((dataObj, id) => {
                            const sr = dataObj['poster_path'];
                            return (
                                <SwiperSlide
                                    onClick={() => { handleClickDetails(dataObj) }}
                                    className={`carousel swiper-slide-customize`}
                                    key={id}>
                                    <div className="carousel max-w-sm rounded overflow-hidden shadow-lg">
                                        <LazyLoadImg
                                            className="carousel w-full"
                                            src={sr ? imageBaseURL + sr : BlackImage}
                                            alt="img not available"
                                        />
                                        <RatingShow
                                            rating={dataObj.vote_average.toFixed(1)}
                                            parentClassName={'circleRatingBox'}
                                        />
                                        <div className="carousel titleBox h-16 px-6 py-4">
                                            <div className="carousel title text-white font-bold text-lg">{dataObj.title || dataObj.name}</div>
                                        </div>
                                        <GenresBox mediaType={dataObj.title ? 'movie' : 'tv'} spanClassName={'text-xs carousel inline-block bg-gray-200 rounded-full px-2 py-1 text-sm font-semibold'} genreIds={dataObj.genre_ids} className="carousel genreBox px-6 pt-4 pb-2" />
                                    </div>
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
                </>
            }
        </div>
    );
}

