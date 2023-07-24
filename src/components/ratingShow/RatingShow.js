import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./style.css";

const RatingShow = ({ rating, parentClassName }) => {
    return (
        <div className={parentClassName || ''}>
            <div className="circleRatingShow">
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