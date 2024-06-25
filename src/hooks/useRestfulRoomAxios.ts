import axios from 'axios';

// axios 객체 생성
export default axios.create({
  baseURL: 'https://****',
  headers: {
    'Content-Type': 'application/json',
  },
});
