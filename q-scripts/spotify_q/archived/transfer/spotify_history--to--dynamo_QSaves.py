import json
import requests
import calendar
from datetime import datetime

auth_token = input("Enter Auth Token: ")

saves_url = 'https://api.spotify.com/v1/me/tracks?limit=50'
saves_header = {'Authorization': 'Bearer ' + auth_token}

counter = 0

keep_going = 1
while(saves_url is not None):
	saves_response = requests.get(saves_url, headers=saves_header)
	json_response = json.loads(saves_response.text)
	saves_url = json_response['next']

	saves_to_add = []
	for item in json_response['items']:
		artistIDs = []
		for artist in item['track']['artists']:
			artistIDs.append(artist['id'])

		saves_to_add.append({
			"timestamp": calendar.timegm(datetime.strptime(item['added_at'], "%Y-%m-%dT%H:%M:%SZ").utctimetuple()),
			"track": item['track']['id'],
			"artists": artistIDs,
			"album": item['track']['album']['id'],
			"popularity": item['track']['popularity'],
			"duration": item['track']['duration_ms']
		})
		counter += 1

	requests.post('http://localhost:8888/mongodb/saves', json=saves_to_add)

print("Added " + str(counter) + " QSaves")




