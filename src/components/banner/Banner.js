import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import "./style.css";
import { useNavigate } from "react-router-dom";
import LazyLoadImg from "../lazyLoadImage/LazyLoadImage";
import useFetch from "../../hooks/useFetch";
import Spinner from "../spinner/Spinner";
import { setTitle } from "../../App";

export default function Banner() {
    const navigate = useNavigate()

    const [currentIndex, setCurrentIndex] = useState(0);
    const { imageBaseURL } = useSelector(state => state.home);
    const { data: popularMoviesDataArr } = useFetch('/movie/popular', 10, {})
    const { maxWatchsInBanner } = useSelector((state) => state.setting);
    const [bannerObjs, setBannerObjs] = useState(null);
    const bannerCarouselContainer = useRef(null);

    const goLeft = useCallback(() => {
        const leftIndex = currentIndex - 1;
        if (leftIndex >= 0) {
            bannerCarouselContainer.current.scrollTo(window.innerWidth * leftIndex, 0);
            setCurrentIndex(leftIndex);
        }
    }, [currentIndex]);

    const goRight = useCallback(() => {
        const rightIndex = currentIndex + 1;
        if (rightIndex !== maxWatchsInBanner) {
            bannerCarouselContainer.current.scrollTo(window.innerWidth * rightIndex, 0);
            setCurrentIndex(rightIndex);
        }
    }, [currentIndex, maxWatchsInBanner]);

    const handleClickDetails = (dataObj) => {
        navigate(`/${dataObj.title ? 'movie' : 'tv'}/${dataObj.id}`)
    }


    useEffect(() => {
        if (popularMoviesDataArr && maxWatchsInBanner) {
            const availableIndexes = popularMoviesDataArr.length;
            const usedIndexes = new Set();
            const bannerObjs = [];

            for (let i = 0; i < maxWatchsInBanner; i++) {
                let randomIndex;
                do {
                    randomIndex = Math.floor(Math.random() * availableIndexes);
                } while (usedIndexes.has(randomIndex));

                usedIndexes.add(randomIndex);
                bannerObjs.push(popularMoviesDataArr[randomIndex]);
            }

            setBannerObjs(bannerObjs);
        }
    }, [popularMoviesDataArr, maxWatchsInBanner]);

    return (
        <>
            {popularMoviesDataArr ?
                (bannerObjs && (
                    <div className="bannerContainer">
                        <div className="bannerOverlay"></div>
                        <button onClick={goLeft} className="arrow-btn left">
                            <i className="bi bi-chevron-left"></i>
                        </button>
                        <button onClick={goRight} className="arrow-btn right">
                            <i className="bi bi-chevron-right"></i>
                        </button>
                        <div
                            className="bannerBoxes"
                            ref={bannerCarouselContainer}
                        >
                            {bannerObjs.map((bannerObj, index) => (
                                <div key={index} className="bannerBox">
                                    <LazyLoadImg
                                        className="bannerImg"
                                        src={imageBaseURL + bannerObj["backdrop_path"]}
                                        alt=""
                                    />
                                    <div className="bannerContentBox">
                                        <h1 className="title">{bannerObj["original_title"]}</h1>
                                        <button onClick={() => {
                                            handleClickDetails(bannerObj)
                                        }} className="detailsBox bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                                            Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
                :
                <div className="full-height-width">
                    <Spinner circleColor="transparent" size="3rem" loadingColor="var(--sky-blue-3)" />
                </div>
            }
        </>
    );
}

export const ImageView = ({ src }) => {
    const { imageBaseURL } = useSelector(state => state.home);
    useEffect(() => {
        setTitle(document.title + '- Image')
    }, [src])

    return (
        <div
            onClick={() => {
                window.open(`https://image.tmdb.org/t/p/original${src}`, '_blank')
            }}
            style={{
                marginTop: '50px',
                display: 'flex',
                alignItems: ' center',
                justifyContent: 'center',
                height: 'auto'
            }}
            className="bannerContainer">
            <div className="bannerBox">
                <LazyLoadImg
                    className="forceImg bannerImg"
                    src={(imageBaseURL || '') + src}
                    alt=""
                />
            </div>
        </div>
    )
}
