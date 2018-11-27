import requests
import json
import ast

response = requests.get('http://localhost:8888/aws/saves')
json_response = json.loads(response.text)
saves = []
for save in json_response:
    saves.append({
        "timestamp": save['timestamp'],
        "track": save['trackID'],
        "album": save['albumID'],
        "artists": ast.literal_eval(save['artistIDs']),
        "popularity": save['popularity'],
        "duration": save['duration'],
    })

print("Total saves:", len(saves))

savesToAdd = []
for i in range(len(saves)):
    if saves[i]['timestamp'] is not None:
        if len(savesToAdd) == 500 or i == len(saves):
            response = requests.post('http://localhost:8888/mongodb/saves', json=savesToAdd)
            print(response.status_code, response.reason)
            savesToAdd = []
        savesToAdd.append(saves[i])

