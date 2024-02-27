import React from "react";
import { Link } from "react-router-dom";

const GoogleSearch = ({ prefix, query, id = false, navigatePrefix = false }) => {

    if (id) {
        return (
            <Link className="nameOfMember" to={navigatePrefix + id}>{query}</Link>
        )
    } else {
        return (
            <a
                className="nameOfMember"
                href={`https://www.google.com/search?q=${encodeURIComponent(prefix + ' ' + query)}`}
                target={'_blank'}
                rel={"noopener noreferrer"} >
                {query}
            </a >
        )
    }

};

export default GoogleSearch;