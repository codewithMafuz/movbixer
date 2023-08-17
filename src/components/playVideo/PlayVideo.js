import React, { useState } from "react";
import ReactPlayer from "react-player/youtube";
import { useDispatch, useSelector } from 'react-redux';
import { setVideoKey, setShowVideo } from '../playVideo/videoPlayerSlice';
import "./Style.css";

export const PlayBtn = ({
    className = '',
    onlyImg = false,
    src = false,
    showAnimationOnNoImage = true,
    videoKeyProp = false,
    withTxt = false,
    name = false,
    title = 'Play' }) => {

    const dispatch = useDispatch()
    if (onlyImg) {
        return <div className="videoBox">{src ? <img src={src} alt='' /> : <div style={{ height: '280px', width: '180px' }} className="skeleton-loading"></div>}</div>
    }

    const handlePlayYoutubeVideo = () => {
        dispatch(setVideoKey(videoKeyProp))
        dispatch(setShowVideo(true))
    }


    return (
        <div className={className + ' ' +
            (showAnimationOnNoImage ?
                ("box videoBox" + (src ? '' : ' videoBoxWithoutImg')) : '')
        }>
            {src ?
                <img src={src} alt="" />
                : (!showAnimationOnNoImage && <div className="skeleton-loading"></div>)}
            {!onlyImg &&
                <div
                    onClick={handlePlayYoutubeVideo}
                    title={title}
                    className={withTxt ? 'normal cursor-pointer moving-border playTrailerBox flex items-center gap-3' : 'moving-border playTrailerBox red absolute'}>
                    {withTxt &&
                        <span>{withTxt}</span>
                    }
                    <div className={"playBtnBox " + (withTxt ? '' : 'absolute')}>
                        <i className="text-base fas fa-play"></i>
                    </div>
                </div>}
            {!onlyImg && name &&
                <div className="videoName">{name}
                </div>}
        </div>
    )

}



export default function VideoPlayer() {
    const dispatch = useDispatch()

    const { showVideo, videoKey } = useSelector(state => state.videoPlayer)
    const [hideEffect, setHideEffect] = useState(false)

    const hideVideo = () => {
        setHideEffect(true)
        setTimeout(() => {
            dispatch(setShowVideo(false))
            dispatch(setVideoKey(false))
            setHideEffect(false)
        }, 800);
    }

    return (
        <div className={`videoPlayerBox ${hideEffect ? 'hideEffect' : ''} ${showVideo && videoKey ? "visible" : ""}`}>
            <div className={"opacityLayer" + (window.innerWidth > 800 ? ' biggerScreen' : '')}>
                <div className={"opacityLayerBox" + (window.innerWidth > 800 ? ' biggerScreen' : '')}>
                    <i onClick={hideVideo} title="Close" className="bi bi-x-lg"></i>
                </div>
            </div>
            <div className={"videoPlayer"}>
                <span className="closeBtn" onClick={hideVideo}>
                    Close
                </span>
                <ReactPlayer
                    url={`https://www.youtube.com/watch?v=${videoKey}`}
                    controls
                    width="100%"
                    height="100%"
                    playing={true}
                />
            </div>
        </div>
    );
};
