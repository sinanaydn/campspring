import axios from 'axios';

async function test() {
  try {
    const response = await axios.post('http://localhost:8080/api/auth/login', {
      email: 'admin@rentacar.com',
      password: '12345'
    });
    console.log('SUCCESS:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('STATUS:', error.response.status);
      console.log('DATA:', error.response.data);
    } else {
      console.log('NETWORK ERROR');
    }
  }
}
test();
