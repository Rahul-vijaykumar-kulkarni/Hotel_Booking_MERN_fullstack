import { useEffect, useState } from "react";
import axios from "axios";

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Get the backend URL from environment variable
  const BASE_URL = process.env.REACT_APP_BACKEND_URL || "https://hotel-booking-mern-fullstack-backend.onrender.com/api";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Trim the URL to avoid any unwanted spaces
        const trimmedUrl = url.trim();
        const fullUrl = `${BASE_URL}${trimmedUrl}`;
        console.log("Fetching data from: ", fullUrl);  // Log the final URL

        const res = await axios.get(fullUrl);
        setData(res.data);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };

    fetchData();
  }, [url]);

  const reFetch = async () => {
    setLoading(true);
    try {
      const trimmedUrl = url.trim();
      const fullUrl = `${BASE_URL}${trimmedUrl}`;
      console.log("Fetching data from: ", fullUrl);  // Log the final URL

      const res = await axios.get(fullUrl);
      setData(res.data);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  return { data, loading, error, reFetch };
};

export default useFetch;
