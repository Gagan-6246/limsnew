import { Navigate } from 'react-router-dom';

const Root = () => {
    console.log('**********************Root**************************');
    const getRootUrl = () => {
        let url = 'lims/dashboard';
        return url;
    };

    const url = getRootUrl();

    return <Navigate to={`/${url}`} />;
};

export default Root;
