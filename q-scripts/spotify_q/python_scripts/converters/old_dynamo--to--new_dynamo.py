import boto3
import json
import psycopg2
import time
import requests

auth_token = raw_input("Enter Auth Token: ")

with open('../../config/aws-config.json') as file:
  config = json.load(file)

dynamo_db = boto3.resource(
	'dynamodb',
	region_name = config.region,
	aws_access_key_id = config.accessKeyId,
  aws_secret_access_key = config.secretAccessKey
)  

items = dynamo_db.Table('qListens').scan()

counter = 0
for item in items['Items']:
	print(item['trackID'])
	
	history_url = 'https://api.spotify.com/v1/tracks/' + item['trackID']
	history_headers = {'Authorization': 'Bearer ' + auth_token}
	history_response = requests.get(history_url, headers=history_headers)
	json_response = json.loads(history_response.text)
	artistIDs = []

	print(json_response)
	for artist in json_response['artists']:
		artistIDs.append(artist['id'])
	
	dynamo_db.Table('QListens').put_item(Item = {
		"timestamp": item['timestamp'],
		"trackID": item['trackID'],
		"artistIDs": json.dumps(artistIDs),
		"albumID": json_response['album']['id'],
		"popularity": json_response['popularity'],
		"duration": json_response['duration_ms']
	})
	counter += 1
	print(counter)

print("Added " + str(counter) + " listens to QListens")



