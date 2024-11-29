import axios from 'axios';
// axios default configuration
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Request Interceptor - Attach the access token if it exists
axios.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor - Handle token refresh if access token expires
axios.interceptors.response.use(
    (response) => response, // Pass through successful responses
    async (error) => {
        const originalRequest = error.config;

        // Check if the error is 401 (Unauthorized) and the token is expired
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Try to refresh the access token using the refresh token
            try {
                const refreshToken = localStorage.getItem('refreshToken');

                // Send a request to the refresh-token endpoint
                const response = await axios.post('/refresh-token', { refreshToken });

                // If successful, update localStorage with the new access token
                const { accessToken, refreshToken: newRefreshToken } = response.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                // Retry the original request with the new access token
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return axios(originalRequest);
            } catch (refreshError) {
                // If the refresh fails, log the user out or redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href='/login'
                return Promise.reject(refreshError);
            }
        } else if (error.response.status === 500) {
            alert(error.response.data.message);
            window.location.href='/login';
        }

        return Promise.reject(error);
    }
);

export default axios;
