import { useState } from 'react';
import axios from 'axios';

const UseFormSender = (reqType, url) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    const cb = async (requestBody) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios({
                method: reqType,
                url,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: requestBody
            });
            setData(response.data);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return { error, loading, cb, data };
};

export default UseFormSender;
