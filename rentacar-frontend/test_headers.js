import axios from 'axios';

async function test() {
  try {
    await axios.post('http://localhost:8080/api/auth/login', {
      email: 'asdasd@gas.com',
      password: 'password1'
    }, {
      headers: {
        'Origin': 'http://localhost:5173'
      }
    });
  } catch (error) {
    if (error.response) {
      console.log('STATUS:', error.response.status);
      console.log('HEADERS:', error.response.headers);
    } else {
      console.log('NO RESPONSE (CORS or Network Error):', error.message);
    }
  }
}
test();
