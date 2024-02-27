import React from 'react'
import LazyLoadImg from '../lazyLoadImage/LazyLoadImage'
import { useDispatch, useSelector } from 'react-redux'
import './Style.css'
import GenresBox from '../genres/GenresBox'
import RatingShow from '../ratingShow/RatingShow'
import { setShowGoUpBtn } from '../header/searchSlice'
import { PlayBtn } from '../playVideo/PlayVideo'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { capFirstLetter, correctType, setTitle } from '../../App'
import WatchsBox from '../watchsBox/WatchsBox'
import TabsSwitch from '../tabsSwitch/TabsSwitch'


export default function DetailsBannerInfo({ dataObj = {}, videos = false, ofMedia = { mediaType: false, id: false, mediaName: false }, changingTitleOptions = false, titlePrefix = false, moreBy = false }) {

    const dispatch = useDispatch()
    dispatch(setShowGoUpBtn(false))
    const navigate = useNavigate()
    const { mediaType, seasonNumber, episodeNumber } = useParams()
    const isPerson = dataObj.profile_path
    const isTv = dataObj.name

    const { imageBaseURL } = useSelector(state => state.home)
    const backdropImg = dataObj.backdrop_path ? imageBaseURL + dataObj.backdrop_path : false
    const posterEndpint = (dataObj.poster_path || dataObj.profile_path || dataObj.still_path || false)
    const posterImg = posterEndpint ? imageBaseURL + posterEndpint : false

    const formateToHourMin = (min = false) => {
        if (!min) return ''
        else {
            min = parseInt(min)
            const hours = parseInt(min / 60)
            const mins = parseInt(min % 60)
            return (hours >= 1 ? hours + 'h ' : '') + (mins > 1 ? mins + 'm' : '')
        }
    }
    const getGender = (num = false) => {
        if (!num) return ''
        else {
            return num === 1 ? 'Female' : num === 2 ? 'Male' : ''
        }
    }
    const onTabChange = (index) => {
        navigate(`/${window.location.href.split('//')[1].split('/').slice(1, -1).join('/')}/${index + 1}`)
    }

    const ofMediaPass = ofMedia && !Object.values(ofMedia).includes(false)
    const toSetAsTitle = dataObj.title || dataObj.name || dataObj.original_title || ''
    const _homePage = dataObj.homepage ? capFirstLetter(new URL(dataObj.homepage).hostname.split('.com')[0].split('www.')[1] || '').slice(0, 12) : ''
    const addOnPrevTitle = ofMediaPass ? ofMedia.mediaName + ` - ${seasonNumber && !ofMedia.mediaName.includes(seasonNumber) ? 'Season ' + seasonNumber + ' - ' : ''}` : ''

    return (
        <>
            <div className="detailsContainer">
                <div className='backImgBox keepTopViewport'>
                    {backdropImg &&
                        <LazyLoadImg
                            src={backdropImg}
                            alt=''
                            effect='blur'
                        />}
                </div>
                <div className="keepTopViewport infoBoxContainer">
                    <PlayBtn
                        onlyImg={!isPerson && videos && videos.length > 0 ? false : true}
                        src={posterImg ? posterImg : false}
                        title={videos[0]?.type || 'Play Trailer'}
                        videoKeyProp={videos[0]?.key || false}
                        withTxt={false} />

                    <div className="infoBoxes">
                        <div className="md:flex flex-col gap-2 lg:infoBox">
                            <h2 className={(changingTitleOptions ? 'listingBoxParent ' : '') + "pl-4 text-2xl text-blue-200 title"}>
                                {titlePrefix || ''}

                                {(!isPerson ? (addOnPrevTitle + toSetAsTitle) : toSetAsTitle).replace(/(.{2,})(?=\1)/g, '')}
                                {setTitle((correctType(mediaType) + ' - ' + (addOnPrevTitle + toSetAsTitle)).replace(/(.{2,})(?=\1)/g, ''))}</h2>
                            {changingTitleOptions &&
                                <TabsSwitch
                                    tabNames={changingTitleOptions.map(([name]) => name)}
                                    onTabChange={onTabChange}
                                    hideIndex={episodeNumber ? episodeNumber - 1 : seasonNumber - 1}
                                    dropboxType={true}
                                    className='tabBox bg-dark'
                                    classNameSelectedTab='text-2xl text-blue-200 title'
                                    toggleButtonStyle={{ left: '320px' }}
                                />
                            }
                            {ofMediaPass &&
                                <Link className='text-base cursor-pointer text-blue-200 mx-4' to={`/${ofMedia.mediaType}/${ofMedia.id}${episodeNumber ? '/' + seasonNumber : ''}`}>
                                    <span className='underline text-gray-100'>{ofMedia.mediaName}{episodeNumber ? ' - Season ' + seasonNumber : ''}</span>
                                </Link>
                            }
                            {dataObj.imdb_id &&
                                <a target='_blank' rel='noreferrer' href={`https://www.imdb.com/${isPerson ? 'name' : 'title'}/${dataObj.imdb_id}`} className="underline ml-4 text-base">IMDB</a>
                            }
                            {dataObj.homepage &&
                                <a target='_blank' rel='noreferrer' href={dataObj.homepage} className="underline ml-4 text-base">{_homePage}{(_homePage || '').length > 12 ? '..' : ''}</a>}
                        </div>
                        {(dataObj.tagline || dataObj.place_of_birth) &&
                            <div className="infoBox">
                                <h4 className="text-xl tagline mb-4">{dataObj.tagline || dataObj.place_of_birth || ''}</h4>
                            </div>}
                        <div className="infoBox">
                            <p className='text-sm overview'>{dataObj.overview || dataObj.biography || ''}</p>
                        </div>
                        <div className="infoBox">
                            {dataObj.genres &&
                                <GenresBox
                                    className='relative carousel genreBox px-6 pt-4 pb-2'
                                    spanClassName='text-xs carousel inline-block bg-gray-200 rounded-full px-2 py-1 text-base font-semibold'
                                    directData={dataObj.genres.map(obj => obj.name)} />}
                        </div>
                        <div className="leftOnSm infoBox flex flex-row items-start text-blue-200 md:flex flex-col gap-2 items-start text-left lg:flex-row lg:gap-8 xl:flex-row xl:gap-8">
                            <span className="bold text-sm">{
                                isPerson ? 'Born' : isTv ? 'First time has released' : 'Released'} on {new Date(dataObj.release_date || dataObj.first_air_date || dataObj.birthday || dataObj?.air_date).toLocaleDateString
                                    (undefined, { dateStyle: 'medium', })
                                }</span>
                            {dataObj.runtime &&
                                <span className="bold text-sm">{isPerson ? '' : 'Watch time '}{!isPerson ? (formateToHourMin(dataObj.runtime || false)) : getGender(dataObj.gender || false)}</span>}
                        </div>
                        {
                            <div className="infoBox lg:flex gap-8 md:flex md:items-center mt-2">
                                {!isPerson && videos && videos.length > 0 ?
                                    <>
                                        <PlayBtn
                                            className='responsive-m-auto'
                                            showAnimationOnNoImage={false}
                                            onlyImg={false}
                                            src={false}
                                            title='Play'
                                            videoKeyProp={videos[0]?.key || false}
                                            withTxt={'Play'}
                                        />
                                        <div className="flex items-center justify-center gap-4">
                                            <RatingShow size='50px' rating={dataObj?.vote_average?.toFixed(1)} />
                                            <span className="text-base">{dataObj.vote_count} people rated</span>
                                        </div>
                                    </>
                                    :
                                    (isPerson &&
                                        <span className="text-base">Profession : {dataObj.known_for_department || ''}</span>)
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
            {moreBy && Array.isArray(moreBy) && moreBy.length > 0 &&
                <WatchsBox
                    heading={`${ofMediaPass ? 'More' : 'Popular to explore '} by '${dataObj.name || 'this person'}'`}
                    dataParam={moreBy}
                />}

        </>
    )
}
