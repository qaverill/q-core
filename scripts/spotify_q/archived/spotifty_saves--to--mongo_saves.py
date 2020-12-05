import requests

token = input("Access token: ")

start = 'https://api.spotify.com/v1/me/tracks?offset=0&limit=20'

def get_url(url):
    r = requests.get(url)