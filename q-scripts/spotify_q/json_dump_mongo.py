import requests
import json

with open('mongo_dump.json', 'w') as json_dump:
    r = requests.get('http://localhost:8888/mongodb/listens')
    if r.status_code == 200:
        json.dump(r.json(), json_dump)
