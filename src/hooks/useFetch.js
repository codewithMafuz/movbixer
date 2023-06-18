import { useEffect, useState } from "react";
import fetchDataFromApi from "../utils/Api";
const useFetch = (url) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)
        setData(null)
        setError(null)
        fetchDataFromApi(url).then((res) => {
            setLoading(null)
            setError(null)
            setData(res.data)
        }).catch((err) => {
            setLoading(null)
            setError({
                error: err,
                defaultMsg: 'Something went wrong, try again'
            })
        })
    }, [url])

    return { data, loading, error }
}

export default useFetch