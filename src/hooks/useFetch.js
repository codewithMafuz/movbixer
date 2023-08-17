import { useEffect, useState } from "react";
import fetchDataFromApi from "../api/fetchURL";
import { localGet, localSet, isTmDone } from "../App";

const useFetch = (url, timeDif = false, params = {}, refresh = false, prop = 'results') => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setData(null);
            setError(null);

            const foundErrorOperation = (er) => {
                setData(false)
                setLoading(false);
                setError(er);
            }

            const setDataOperationByFetch = async () => {
                fetchDataFromApi(url, params)
                    .then((response) => {
                        const isError = response.code
                        if (isError) {
                            foundErrorOperation(isError)
                        } else {
                            setData(prop ? response[prop] : response);
                            setTotalPages(response?.total_pages);
                            localSet(url, response);
                            localSet(url + ".lastFetchedTime", Date.now());
                        }
                    })
                    .catch((err) => {
                        foundErrorOperation(err)
                    });

            }

            try {
                if (typeof (url) === 'string') {
                    if (timeDif) {
                        if ((localGet(url) === null) || isTmDone(localGet(url + ".lastFetchedTime"), timeDif)) {
                            setDataOperationByFetch()
                        } else {
                            const response = localGet(url)
                            setData(prop ? response[prop] : response)
                            setTotalPages(response?.total_pages)
                        }
                    }
                    else {
                        setDataOperationByFetch()
                    }
                }
                else {
                    setData(url)
                }
                setLoading(false);
            } catch (err) {
                foundErrorOperation(err)
            }
        };

        fetchData();
    }, [url, refresh]);

    return { data, loading, error, totalPages };
};

export default useFetch;




