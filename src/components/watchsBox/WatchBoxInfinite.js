import React, { } from 'react'
import { WatchCard } from './WatchsBox'
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from '../spinner/Spinner';
import './style2.css'
import { useParams } from 'react-router-dom';

export default function WatchBoxInfinite({
    mergeTop = false,
    heading = false,
    data = [],
    onReachEnd = () => { },
    hasMore = false,
}) {
    const { mediaType } = useParams()

    return (
        <div className={mergeTop ? 'watchBoxInfiniteContainer' : ''}>
            <h1 className='watchBoxHeading text-2xl text-gray-100'>{data.length === 0 ? 'Not Found' : heading}</h1>
            <InfiniteScroll
                className='watchBoxInfinite'
                dataLength={data.length || []}
                next={onReachEnd}
                hasMore={hasMore}
                loader={<Spinner
                    style={{ height: '100px', width: '100%' }}
                    classNames='center'
                    size='1rem'
                    circleColor='transparent'
                    loadingColor='sky-blue' />}
            >
                {data.map((obj, index) => {
                    return (
                        <div key={index} className='watchBoxInfiniteBox'>
                            <WatchCard
                                key={index}
                                dataObj={obj}
                                imgEffect={false}
                                showRating={false}
                                showGenres={false} />
                        </div>
                    );
                })}
            </InfiniteScroll>
        </div>
    )
}
