import { useEffect, useState } from "react";
import fetchDataFromApi from "../api/fetchURL";

const useFetch =  (url) => {
    const [response, setResponse] = useState(null)
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)
        setResponse(null)
        setData(null)
        setError(null)
        fetchDataFromApi(url).then((res) => {
            setLoading(null)
            setError(null)
            setResponse(res)
            setData(res.data)
        }).catch((err) => {
            setLoading(null)
            setError({
                error: err,
                defaultMsg: 'Something went wrong, try again'
            })
        })
    }, [url])

    return { response, data, loading, error }
}

export default useFetch