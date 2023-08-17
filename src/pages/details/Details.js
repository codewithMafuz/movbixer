import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import fetchDataFromApi from '../../api/fetchURL';
import Spinner from '../../components/spinner/Spinner';
import DetailsBannerInfo from '../../components/detailsBannerInfo/DetailsBannerInfo';
import WatchsBox from '../../components/watchsBox/WatchsBox';
import './style.css'
import NetworkError from '../../components/networkError/networkError';
import GoogleSearch from '../../components/googleSearch/GoogleSearch';
import { correctType } from '../../App';

const ContentBox = ({
  bothInArray,
  heading,
  queryPrefix = '', }) => {

  const [closed, setClosed] = useState(false)

  const toggleClosed = () => {
    setClosed(!closed)
  }

  return (
    <div className="contentBox">
      <div className="topBar cursor-pointer" onClick={toggleClosed}>
        <h1 className='title text-gray-200 text-3xl'>{
          heading}</h1>
        <div className="flex-center" >
          {
            closed ?
              <i className="icon bi bi-chevron-up"></i>
              :
              <i className="icon bi bi-chevron-down"></i>
          }
        </div>
      </div>
      <div className={"infoBox " + (closed ? 'wrap' : '')}>
        <>
          {closed &&
            bothInArray.map(([name, job, id = false], index) => {
              return (
                <div key={index}
                  className="text-blue-200 infoWrapItem border-b border-blue-200 flex justify-start text-blue-200 px-2 py-2 my-2">
                  <GoogleSearch prefix={queryPrefix} query={name} id={id} navigatePrefix='/person/' />
                  <div className="text-sm font-normal text-blue-200 tracking-wide">{job}</div>
                </div>
              )
            })}
        </>
      </div>
    </div>
  )
}

export default function Details() {
  const { mediaType, id } = useParams()

  const [mediaTypeAndIdWas, setMediaTypeAndIdWas] = useState(false)

  const [details, setDetails] = useState(false)
  const [credits, setCredits] = useState(false)
  const [personCredits, setPersonCredits] = useState(false)
  const [similarMedia, setSimilarMedia] = useState(false)
  const [recommendations, setRecommendations] = useState(false)
  const [videos, setVideos] = useState(false)
  const [images, setImages] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isTv, setIsTv] = useState(mediaType === 'tv')
  const isPerson = mediaType === 'person'


  const getSeasons = (id, len) => {
    const dataParamsObj = {}
    for (let i = 1; i < len + 1; i++) {
      dataParamsObj[`Season ${i}`] = `/tv/${id}/season/${i}`
    }
    return dataParamsObj
  }


  const getDetails = async () => {
    setLoading(false)
    fetchDataFromApi(`/${mediaType}/${id}`)
      .then(response => {
        setDetails(response)
        setLoading(false)
        if (mediaType !== 'person') {
          setMediaTypeAndIdWas({
            mediaType: mediaType,
            id: id,
            mediaName: response.title || response.name || '',
          })
        }
      })
      .catch(err => {
      })

  }

  const getCredits = async () => {
    let onlyPersonFetching = false
    let endURL = `/${mediaType}/${id}/credits`
    if (mediaType === 'person' && mediaTypeAndIdWas) {
      endURL = `/${mediaTypeAndIdWas.mediaType}/${mediaTypeAndIdWas.id}/credits`
    } else if (mediaType === 'person' && !mediaTypeAndIdWas) {
      onlyPersonFetching = true
      endURL = `/${mediaType}/${id}/credits`
    }
    fetchDataFromApi(endURL)
      .then(response => {
        if (onlyPersonFetching) {
          setPersonCredits(response)
        } else {
          setCredits(response)
        }
      })
      .catch(err => {
      })
  }

  const getVideos = async () => {
    fetchDataFromApi(`/${mediaType}/${id}/videos`)
      .then(response => {
        setVideos(response.results)
      })
      .catch(err => {
      })
  }

  const getImages = async () => {
    fetchDataFromApi(`/${mediaType}/${id}/images`)
      .then(response => {
        const res = response.backdrops || response.profiles
        setImages(res)
      })
      .catch(err => {
      })
  }

  const getSimilar = async () => {
    fetchDataFromApi(`/${mediaType}/${id}/similar`)
      .then(response => {
        setSimilarMedia(response.results)
      })
      .catch(err => {
      })
  }

  const getReccomendations = async () => {
    fetchDataFromApi(`/${mediaType}/${id}/recommendations`)
      .then(response => {
        setRecommendations(response.results)
      })
      .catch(err => {
      })
  }




  const castsJobWithName = (credits?.cast || [])
    .map(({ name = false, known_for_department = false, id = false }) => (name && known_for_department ? [name, known_for_department, id] : false))
    .filter(Boolean);
  const crewsJobWithName = (credits?.crew || [])
    .map(({ name = false, job = false, id = false }) => (name && job ? [name, job, id] : false)).filter(Boolean);
  const productionCompanies = (details?.production_companies || [])
    .map(obj => [obj.name || '---', obj.origin_country || '---'])
  const spokenLanguages = (details?.spoken_languages || [])
    .map(obj => [obj.english_name || '---', obj.name || '---'])


  useEffect(() => {
    setIsTv(mediaType === 'tv')
    window.scrollTo(0, 0)
    setLoading(true)
    getDetails()
    getImages()
    getCredits()
    if (!isPerson) {
      getVideos()
      getSimilar()
      getReccomendations()
    }
    setLoading(false)
  }, [mediaType, id])
  const mediaName = mediaTypeAndIdWas.mediaName || false


  return (
    <div className='detailsPage'>
      {
        !loading && details && (credits || personCredits) && (!isPerson ? (videos && similarMedia && recommendations) : true) && navigator.onLine ? (
          <>
            <DetailsBannerInfo
              ofMedia={isPerson ? mediaTypeAndIdWas : false}
              dataObj={details}
              videos={videos}
              moreBy={isPerson ? personCredits?.cast : false}
            />

            {
              images.length > 0 && details &&
              <WatchsBox
                limit={30}
                dataParam={images}
                videos={false}
                isImage={true}
                heading={`Images of - '${isPerson ? details.name || ' this person' : mediaName || details.name || details.title || details.original_title || '---'}'`} />
            }

            {(!isPerson || (isPerson && credits)) &&
              <>
                {videos.length > 0 &&
                  <WatchsBox
                    dataParam={videos}
                    videos={true}
                    heading={`Official Short Videos of - '${mediaName}'`} />}


                {isTv && details && details?.seasons?.length > 0 &&
                  <WatchsBox
                    eachInPropertyName={''}
                    dataParam={getSeasons(id, details.seasons.length)}
                    addNameWithHeading={true}
                    heading={`Explore Seasons`}
                    fetchProp={'episodes'}
                    isIndexNavigate={true}
                    isSeason={true}
                    limit={false}
                  />
                }


                {mediaName &&
                  <>
                    {credits.cast && Array.isArray(credits.cast) && credits.cast.length > 0 &&
                      <WatchsBox
                        renderOnTop={
                          <ContentBox
                            bothInArray={castsJobWithName}
                            heading={'Cast Details'}
                            queryPrefix={'cast or celebrity'} />
                        }

                        heading={`${isPerson ? 'Other ' : ''} Casts in - '${mediaName}'`}
                        dataParam={credits.cast} />}

                    {credits.crew && Array.isArray(credits.crew) && credits.crew.length > 0 &&
                      <WatchsBox
                        renderOnTop={
                          <ContentBox
                            bothInArray={crewsJobWithName}
                            heading={'Crew Details'}
                            queryPrefix={'crew or cast or celebrity'} />
                        }
                        heading={`${isPerson ? 'Other ' : ''} Crews in - '${mediaName}'`}
                        dataParam={credits.crew} />}

                    {similarMedia && similarMedia.length > 0 &&
                      <WatchsBox
                        dataParam={similarMedia}
                        heading={`Similar ${correctType(mediaTypeAndIdWas.mediaType)} of - '${mediaName}'`} />}

                    {recommendations && recommendations.length > 0 &&
                      <WatchsBox
                        dataParam={recommendations}
                        heading={`Reccomendation for you`} />}

                  </>
                }



                {
                  mediaName &&
                  <>
                    {productionCompanies.length > 0 &&
                      <ContentBox
                        bothInArray={productionCompanies}
                        heading={'Production Companies'}
                        queryPrefix={'production company'} />}

                    {spokenLanguages.length > 0 &&
                      <ContentBox
                        bothInArray={spokenLanguages}
                        heading={'Languages Spoken'}
                        queryPrefix={'language'} />}
                  </>
                }

              </>
            }

          </>
        )
          :
          !navigator.onLine ?
            <NetworkError width='100%' height='100vh' />
            :
            (
              <Spinner classNames='' size='3rem' circleColor='transparent' loadingColor='skyblue' />
            )
      }
    </div>
  )
}

