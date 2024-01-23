import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';

const decodeAccessToken = () => {
  try {
    const token = Cookies.get('accessToken');
    const decodedToken = jwt_decode(token);
    return decodedToken;
  } catch (error) {
    return null;
  }
};

export { decodeAccessToken };
