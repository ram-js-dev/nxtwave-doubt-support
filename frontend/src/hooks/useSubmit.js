const useSubmit = () => {
  const {
    auth: { jwtToken },
  } = useContext(AuthContext);
  const [error, setError] = useState({});
  const [response, setResponse] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const submitFn = async (method, url, payload) => {
    setIsLoading(true);
    const options = {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${jwtToken}`,
      },
      method,
      body: JSON.stringify(payload),
    };
    try {
      const res = await fetch(url, options);
      if (res.ok) {
        const resJson = await res.json();
        setResponse(resJson);
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    response,
    isLoading,
    error,
    submitFn,
  };
};

export default useSubmit;
