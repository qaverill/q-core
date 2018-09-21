import requests
import json
import ast

response = requests.get('http://localhost:8888/aws/listens')
json_response = json.loads(response.text)
listens = []
for listen in json_response:
    listens.append({
        "timestamp": listen['timestamp'],
        "track": listen['trackID'],
        "album": listen['albumID'],
        "artists": ast.literal_eval(listen['artistIDs']),
        "popularity": listen['popularity'],
        "duration": listen['duration'],
    })

print("Total listens:", len(listens))

listensToAdd = []
for i in range(len(listens)):
    if len(listensToAdd) == 500 or i == len(listens) - 1:
        response = requests.post('http://localhost:8888/mongo/listens', json=listensToAdd)
        print(response.status_code, response.reason)
        listensToAdd = []
    listensToAdd.append(listens[i])
