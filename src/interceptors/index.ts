import axios, { AxiosError } from 'axios';
import { useAuthContext } from '@/hooks/UseAuth';


const axiosInterceptor = axios.create();

axiosInterceptor.interceptors.request.use(
    (config) => {
        const { authState } = useAuthContext();
        if (config.headers && authState.userName !== '' && authState.userToken !== 0) {
            config.headers['userToken'] = authState.userToken;
            config.headers['userName'] = authState.userName;
            config.headers['tokenExpiry'] = authState.tokenExpiry;
        }
        return config;
    },
    (error: AxiosError): AxiosError | Promise<AxiosError> => {
        // Handle specific error types
        if (error.response && error.response.status === 401) {
            // Handle authentication errors
            console.error('Authentication error:', error);
        } else if (error.message === 'Network Error') {
            // Handle network errors
            console.error('Network error:', error);
        } else {
            // Handle other errors
            console.error('Error:', error);
        }

        return Promise.reject(error);
    }
);

export default axiosInterceptor;