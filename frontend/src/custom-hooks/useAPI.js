import { useState } from 'react';

import { axios } from '../axios';

export const useAPI = (reqType, url) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    const cb = async (req) => {
        setLoading(true);
        setError(null);

        try {
            const res = await axios({
                method: reqType,
                url,
                data: req
            });
            setData(res.data);
        } catch (err) {
            setError(err.message);
        }

        setLoading(false);
    };

    return { error, loading, cb, data };
};
