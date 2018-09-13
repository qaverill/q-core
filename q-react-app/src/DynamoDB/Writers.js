import axios from "axios";

export function writeQSaves(QSaves){
  return axios.post('http://localhost:8888/QSaves', {
    saves: QSaves
  })
}

export function writeQListens(QListens){
  return axios.post('http://localhost:8888/QListens', {
    listens: QListens
  })
}