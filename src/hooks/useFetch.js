import { useEffect, useState } from "react";
import fetchDataFromApi from "../api/fetchURL";
import { localGet, localSet, isTmDone } from "../App";

const useFetch = (url, timeDif = false, params = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setData(null);
            setError(null);

            try {
                if (typeof (url) === 'string') {
                    if (timeDif) {
                        if ((localGet(url) === null) || isTmDone(localGet(url + ".lastFetchedTime"), timeDif)) {
                            const response = await fetchDataFromApi(url, params);
                            setData(response?.results);
                            setTotalPages(response?.total_pages)
                            localSet(url, response)
                            localSet(url + ".lastFetchedTime", Date.now());
                        } else {
                            const response = localGet(url)
                            setData(response?.results)
                            setTotalPages(response?.total_pages)
                        }
                    }
                    else {
                        const response = await fetchDataFromApi(url, params);
                        setData(response?.results);
                        setTotalPages(response?.total_pages)
                        localSet(url, response)
                        localSet(url + ".lastFetchedTime", Date.now());
                    }
                } else {
                    setData(url)
                }
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, loading, error, totalPages };
};

export default useFetch;




