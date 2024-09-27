import Cookies from 'universal-cookie';

const useCookies = () => {
  const cookies = new Cookies();
  return cookies;
};

export default useCookies;