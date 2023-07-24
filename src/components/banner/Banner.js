import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import "./style.css";
import LazyLoadImg from "../lazyLoadImage/LazyLoadImage";

export default function Banner() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { imageBaseURL, popularMoviesDataArr } = useSelector(state => state.home);
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
            {bannerObjs && (
                <div className="bannerContainer">
                    <div className="bannerOverlay"></div>
                    <button onClick={goLeft} className="arrow-btn left">
                        <i className="bi bi-arrow-left"></i>
                    </button>
                    <button onClick={goRight} className="arrow-btn right">
                        <i className="bi bi-arrow-right"></i>
                    </button>
                    <div
                        className="bannerBoxes"
                        ref={bannerCarouselContainer}
                    >
                        {bannerObjs.map((bannerObj, index) => (
                            <div key={index} className="bannerBox">
                                <LazyLoadImg
                                    className="bannerImg"
                                    src={imageBaseURL + bannerObj["poster_path"]}
                                    alt=""
                                />
                                <div className="bannerContentBox">
                                    <h1 className="title">{bannerObj["original_title"]}</h1>
                                    <p className="font-mono overview">{bannerObj["overview"]}</p>
                                    <button className="detailsBox bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                                        Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
