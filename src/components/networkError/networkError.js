import React from 'react'
import './Style.css'

export default function NetworkError({
    historyBack = false,
    error = false,
    height = '100%',
    width = '100vw',
    className = 'network-failed-box',
    onClickBtn = () => {
        localStorage.clear()
        if (error === 'ERR_BAD_REQUEST') {
            window.history.back()
        } else if (navigator.onLine) {
            window.location.reload()
        }
    },
    message = 'Network connection failed',
    btnTxt = 'Try again' }) {

    return (
        <div className={className} style={{ height: height, width: width }}>
            <h3>{historyBack && error === 'ERR_BAD_REQUEST' ? 'Something went wrong' : message}</h3>
            <button onClick={onClickBtn}>{historyBack && error === 'ERR_BAD_REQUEST' ? 'Back' : btnTxt}</button>
        </div>
    )
}
