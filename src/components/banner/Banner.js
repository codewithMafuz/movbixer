import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './style.css';
import LazyLoadImg from '../lazyLoadImage/LazyLoadImage';

export default function Banner() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { imageBaseURL, popularMoviesDataArr } = useSelector((state) => state.home);
    const { maxWatchsInBanner } = useSelector(state => state.setting)
    const [bannerObj, setBannerObj] = useState(null)
    const [bannerObjs, setBannerObjs] = useState(null)
    const [blur, setBlur] = useState(false)
    const max = maxWatchsInBanner - 1


    useEffect(() => {
        if (popularMoviesDataArr) {
            let nums = []
            let bannerObjs = []
            while (nums.length < maxWatchsInBanner) {
                let randomNums = (Math.floor(Math.random() * 20) + 1) - 1;
                if (!nums.includes(randomNums)) {
                    nums.push(randomNums);
                    bannerObjs.push(popularMoviesDataArr[randomNums])
                }
            }
            setBannerObjs(bannerObjs)
        }
    }, [maxWatchsInBanner, popularMoviesDataArr])

    useEffect(() => {
        if (bannerObjs) {
            setBannerObj(bannerObjs[currentIndex])
        }
    }, [bannerObjs, currentIndex])



    const blurManage = () => {
        setBlur(true)
        setTimeout(() => {
            setBlur(false)
        }, 500);
    }
    const goLeft = () => {
        blurManage()
        console.log(currentIndex);
        setCurrentIndex(currentIndex !== max ? currentIndex + 1 : 0);
    }
    const goRight = () => {
        blurManage()
        console.log(bannerObjs);
        setCurrentIndex(currentIndex !== 0 ? currentIndex - 1 : max);
    }

    return (
        <>
            <div className={(bannerObj && blur ? 'blur-effect ' : '') + "bannerContainer"}>
                {bannerObj && !blur ? <button
                    onClick={goLeft}
                    className="arrow-btn left"
                >
                    <i className="bi bi-arrow-left"></i>
                </button> : ''}
                <div className="bannerImgBox">
                    {bannerObj && imageBaseURL ?
                        <LazyLoadImg
                            className="bannerImg"
                            src={imageBaseURL + bannerObj['backdrop_path']}
                            alt=""
                        /> : ''}
                    <div className={bannerObj ? "bannerOverlay" : 'bannerOverlay bg-black'}></div>
                    <div className={"bannerContentBox " + (!blur ? 'black-back' : '')}>
                        {bannerObj ? <>
                            <h1 className="title">{bannerObj['original_title']}</h1>
                            <p className="font-mono overview">{bannerObj['overview']}</p>
                            <button className="detailsBox bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">Details</button>
                        </> : <>
                            <h1 className="title">Something went wrong, try again</h1>
                            <button onClick={() => { window.location.reload() }} className="btn-sm detailsBox bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">Reload</button>
                        </>}
                    </div>
                </div>

                {bannerObj && !blur ? <button
                    onClick={goRight}
                    className="arrow-btn right"
                >
                    <i className="bi bi-arrow-right"></i>
                </button> : ''}
            </div>
        </>
    );
}
