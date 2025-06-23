import axios from './axios' ;

export const loginUser = async () => {
  console.log('Calling loginUser API');
  const response = await axios.get('');
  console.log('Response from loginUser API:', response.data);
  return response.data;
};
