import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./style.css";

const RatingShow = ({ rating, parentClassName = '', size = false }) => {
    return (
        <div className={parentClassName}>
            <div className="circleRatingShow" style={{ height: size ? size : '100%', width: size ? size : '100%', }}>
                <CircularProgressbar
                    value={rating}
                    maxValue={10}
                    text={rating}
                    styles={buildStyles({
                        pathColor: rating < 5 ? "red" : rating < 7 ? "orange" : "green",
                        textColor: 'var(--sky-blue-2)',
                    })}
                />
            </div>
        </div>
    );
};

export default RatingShow;