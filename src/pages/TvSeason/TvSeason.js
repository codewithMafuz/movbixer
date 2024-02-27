import React, { useEffect, useState } from 'react'
import './Style.css'
import { useParams } from 'react-router-dom'
import useFetch from '../../hooks/useFetch'
import NetworkError from '../../components/networkError/networkError'
import DetailsBannerInfo from '../../components/detailsBannerInfo/DetailsBannerInfo'
import Spinner from '../../components/spinner/Spinner'
import WatchsBox from '../../components/watchsBox/WatchsBox'
import fetchDataFromApi from '../../api/fetchURL'

export default function TvSeason() {
    const { id, seasonNumber, episodeNumber } = useParams()

    const tvSeriesRequest = useFetch(`/tv/${id}`, 2, {}, false, false)
    const nameOfTvSeries = tvSeriesRequest?.data?.name || ''
    const seasons = (tvSeriesRequest?.data?.seasons || []).map(obj => [obj.name, obj.id])
    const [episodes, setEpisodes] = useState(false)

    const preURL = `/tv/${id}/season/${seasonNumber}${episodeNumber ? '/episode/' + episodeNumber : ''}`

    const detailsRequest = useFetch(preURL, false, {}, false, false);
    const detailsData = detailsRequest.data
    const detailsLoading = detailsRequest.loading
    const detailsError = detailsRequest.error

    const imagesRequest = useFetch(preURL + '/images', false, {}, false, false);
    const imagesData = imagesRequest.data?.posters || imagesRequest.data?.stills
    const imagesLoading = imagesRequest.loading
    const imagesError = imagesRequest.error

    const creditsRequest = useFetch(preURL + '/credits', false, {}, false, false);
    const creditsData = creditsRequest.data
    const creditsLoading = creditsRequest.loading
    const creditsError = creditsRequest.error

    const videosRequest = useFetch(preURL + '/videos', false, {}, false, 'results');
    const videosData = videosRequest.data
    const videosLoading = videosRequest.loading
    const videosError = videosRequest.error

    useEffect(() => {
        if (seasonNumber)
            fetchDataFromApi(`/tv/${id}/season/${seasonNumber}`)
                .then(response => {
                    setEpisodes((response?.episodes || []).map(obj => [obj.name, obj.id]))
                })
                .catch(er => {
                })
    }, [seasonNumber])


    return (
        <>
            {(detailsLoading || creditsLoading || videosLoading || imagesLoading) ?
                <Spinner />
                :
                (detailsError || creditsError || videosError || imagesError) ?
                    <>
                        <NetworkError error={detailsError || creditsError || videosError || imagesError} height='100vh' width='100%' />
                    </>
                    :

                    <>
                        {detailsData &&
                            <DetailsBannerInfo
                                changingTitleOptions={!episodeNumber && seasons && seasons.length > 1 ? seasons : episodes && episodes.length > 1 ? episodes : false}
                                dataObj={detailsData}
                                videos={videosData && videosData.length > 0 ? videosData : false}
                                isPerson={false}
                                ofMedia={{
                                    mediaType: 'tv',
                                    id: id,
                                    mediaName: nameOfTvSeries,
                                }}
                            />
                        }

                        {detailsData && detailsData.episodes &&
                            <WatchsBox
                                dataParam={detailsData.episodes}
                                heading={`Episodes of ${!nameOfTvSeries.includes('Season') ? nameOfTvSeries : ''} - Season ${seasonNumber}`}
                                serialNumber={true}
                                isEpisode={true}
                            />
                        }

                        {videosData && videosData.length > 0 &&
                            <WatchsBox
                                dataParam={videosData}
                                videos={true}
                                heading={`Explore short videos of ${nameOfTvSeries} - Season ${seasonNumber}${episodeNumber ? ' - Episode ' + episodeNumber : ''}`}
                            />
                        }

                        {imagesData && imagesData.length > 0 &&
                            <WatchsBox
                                limit={50}
                                dataParam={imagesData}
                                videos={false}
                                heading={`Images of ${nameOfTvSeries} - Season ${seasonNumber}${episodeNumber ? ' - Episode ' + episodeNumber : ''}`}
                                isImage={true}
                            />
                        }

                        {creditsData?.cast && creditsData.cast.length > 0 &&
                            <WatchsBox

                                dataParam={creditsData.cast}
                                heading={`Casts of ${nameOfTvSeries} - Season ${seasonNumber}${episodeNumber ? ' - Episode ' + episodeNumber : ''}`}
                            />}
                        {creditsData?.crew && creditsData.crew.length > 0 &&
                            <WatchsBox

                                dataParam={creditsData.crew}
                                heading={`Crews of ${nameOfTvSeries} - Season ${seasonNumber}${episodeNumber ? ' - Episode ' + episodeNumber : ''}`}
                            />}
                    </>
            }
        </>
    )
}
