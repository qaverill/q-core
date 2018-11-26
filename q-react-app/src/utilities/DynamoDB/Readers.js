import axios from 'axios';

export function readQSave(trackID){
  return axios.get('http://localhost:8888/QSaves/' + trackID)
}

export function readQListen(timestamp){
  return axios.get('http://localhost:8888/QListens/' + timestamp)
}