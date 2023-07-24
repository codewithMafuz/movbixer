import React from 'react'
import './style.css'

export default function Spinner({ circleColor = 'whitesmoke', loadingColor = 'green', size = '1rem', classNames = 'viewport-center', loadingEffect = 'linear', eachSpinTakeSec = 1 }) {
    return (
        <div className={"spinnerBox " + classNames}>
            <div className='spinner' aria-label="Loading..." role="status">
                <svg style={{ width: size, height: size, animation: `spin ${eachSpinTakeSec}s ${loadingEffect} infinite` }} className="animate-spin" viewBox="3 3 18 18">
                    <path style={{ fill: circleColor }} d="M12 5C8.13401 5 5 8.13401 5 12c0 3.866 3.13401 7 7 7 3.866.0 7-3.134 7-7 0-3.86599-3.134-7-7-7zM3 12c0-4.97056 4.02944-9 9-9 4.9706.0 9 4.02944 9 9 0 4.9706-4.0294 9-9 9-4.97056.0-9-4.0294-9-9z"></path>
                    <path style={{ fill: loadingColor }} d="M16.9497 7.05015c-2.7336-2.73367-7.16578-2.73367-9.89945.0-.39052.39052-1.02369.39052-1.41421.0-.39053-.39053-.39053-1.02369.0-1.41422 3.51472-3.51472 9.21316-3.51472 12.72796.0C18.7545 6.02646 18.7545 6.65962 18.364 7.05015c-.390599999999999.39052-1.0237.39052-1.4143.0z"></path></svg>
            </div>
        </div>
    )
}
