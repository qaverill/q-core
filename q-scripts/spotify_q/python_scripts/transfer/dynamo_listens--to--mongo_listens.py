import requests
import json

response = requests.get('http://localhost:8888/aws/listens')
json_response = json.loads(response.text)
for listen in json_response:
    mongo_listen = {
        "timestamp": listen['timestamp'],
        "trackId": listen['trackID'],
        "albumId": listen['albumID'],
        "artistIds": listen['artistIDs'],
        "popularity": listen['popularity'],
        "duration": listen['duration'],
    }
