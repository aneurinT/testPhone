import axios from 'axios'

export function getPosts() {
  return axios.get('/api/getList').then(res => res.data)
}

export function getUserInfo() {
  return axios.get('/api/user').then(res => res.data)
}