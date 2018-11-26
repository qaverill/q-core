import boto3
import json
import psycopg2
import requests
import calendar
from datetime import datetime

auth_token = raw_input("Enter Auth Token: ")

with open('../../config/aws-config.json') as file:
  config = json.load(file)

dynamo_db = boto3.resource(
	'dynamodb',
	region_name = config.region,
	aws_access_key_id = config.accessKeyId,
  aws_secret_access_key = config.secretAccessKey
) 

saves_url = 'https://api.spotify.com/v1/me/tracks'
saves_header = {'Authorization': 'Bearer ' + auth_token}

counter = 0

keep_going = 1
while(saves_url is not None):
	saves_response = requests.get(saves_url, headers=saves_header)
	json_response = json.loads(saves_response.text)
	saves_url = json_response['next']

	for item in json_response['items']:
		artistIDs = []
		for artist in item['track']['artists']:
			artistIDs.append(artist['id'])

		QSave = {
			"timestamp": calendar.timegm(datetime.strptime(item['added_at'], "%Y-%m-%dT%H:%M:%SZ").utctimetuple()),
			"trackID": item['track']['id'],
			"artistIDs": json.dumps(artistIDs),
			"albumID": item['track']['album']['id'],
			"popularity": item['track']['popularity'],
			"duration": item['track']['duration_ms']
		}

		print QSave

		dynamo_db.Table('QSaves').put_item(Item = QSave)

		counter += 1

print("Added " + str(counter) + " QSaves")




