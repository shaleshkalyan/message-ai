import axios, { AxiosError, AxiosInstance } from 'axios';
import { useAuthContext } from '@/hooks/UseAuth';

export interface customHeaderType {
    userToken: number,
    userName: string,
    tokenExpiry: null | Date,
}

const getAxiosInstance = (): AxiosInstance => {
    const { authState } = useAuthContext();

    const axiosInstance = axios.create();

    axiosInstance.interceptors.request.use(
        (config) => {
            if (config.headers && authState.userName && authState.userToken) {
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
    return axiosInstance;
}

export const axiosInterceptor = getAxiosInstance();
