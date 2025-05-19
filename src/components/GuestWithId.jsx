
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

import toast, { Toaster } from 'react-hot-toast';
import Loder from './Loder';
const GuestWithId = () => {
    const { id } = useParams();
  const navigate = useNavigate();
    useEffect(() => {
    // fetch data using the id
    const fetchData = async () => {
      try {
        const response = await axios.get(
            import.meta.env.VITE_BACKEND_URL + "/api/file/get-file",
            { params: { id } }
        )
        if(response.data.success === false){
          toast.error(response.data.message);
          await new Promise(resolve => setTimeout(resolve, 500));
          navigate('/notfound');
          return;
        }
        localStorage.setItem('lang', response.data.file.lang);
        localStorage.setItem('code', response.data.file.code);  
        // After fetching, navigate to /guest
        // navigate('/guest');
        navigate('/guest', {
  state: {
    haveid: true,
    slink: `http://localhost:5173/guest/${id}`,
  }
});
      } catch (error) {
        console.error("Fetch failed", error);
        // Optionally navigate to an error page or /guest anyway
        navigate('/notound');
        toast.error("Some error occurred");
      }
    };

    fetchData();
  }, [id, navigate]);
  return (
  <>
  hello
  <Loder />
  </>
  );
}

export default GuestWithId
