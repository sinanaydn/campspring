import axios from 'axios';

async function test() {
  try {
    await axios.post('http://localhost:8080/api/auth/login', {
      email: 'asdasd@gas.com',
      password: 'password1'
    });
  } catch (error) {
    if (error.response) {
      console.log('STATUS:', error.response.status);
      console.log('DATA:', error.response.data);
      console.log('DETAIL:', error.response.data.detail);
    } else {
      console.log('NO RESPONSE (CORS or Network Error):', error.message);
    }
  }
}
test();
