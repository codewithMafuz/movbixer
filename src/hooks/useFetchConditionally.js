import { localGet, localSet, isTmDone } from "../App";
import { useEffect, useState } from "react";
import fetchDataFromApi from "../api/fetchURL";


const useFetchConditionally = (endPointAndTimeDifs, jsonVersion) => {
    const [datas, setDatas] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const finalDatasObj = {};

        const addDataInFinalDatasObj = (data, name, saving = true) => {
            const endPoint = name;
            if (saving) {
                localSet(endPoint, data);
                localSet(endPoint + ".lastFetchedTime", Date.now());
            }
            finalDatasObj[endPoint] = data;
        };

        const addDatasInFinalDatasObj = (responsesDatas, names) => {
            responsesDatas.forEach((data, i) => {
                addDataInFinalDatasObj(data, names[i]);
            });
        };

        const fetchData = async () => {
            setLoading(true);
            const promises = [];
            const promisesDataNames = [];

            for (const endPointAndTmDif of endPointAndTimeDifs) {
                const endPoint = endPointAndTmDif.endPoint;

                if (
                    localGet(endPoint) === null ||
                    isTmDone(localGet(endPoint + ".lastFetchedTime"), endPointAndTmDif.timeDif)
                ) {
                    promises.push(fetchDataFromApi(endPoint, {}));
                    promisesDataNames.push(endPoint);
                } else {
                    const responsesDatas = localGet(endPoint);
                    addDataInFinalDatasObj(responsesDatas, endPoint, false);
                }
            }

            if (promises.length !== 0) {
                try {
                    const responsesDatas = await Promise.all(promises);
                    addDatasInFinalDatasObj(responsesDatas, promisesDataNames);
                } catch (err) {
                    setError(err);
                }
            }

            setDatas(Object.entries(finalDatasObj).length !== 0 ? finalDatasObj : false);
            setLoading(false)
        };

        fetchData();
    }, [jsonVersion]);

    return { datas, loading, error };
};

export default useFetchConditionally;
