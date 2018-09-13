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
	region_name = config['region'],
	aws_access_key_id = config['accessKeyId'],
  	aws_secret_access_key = config['secretAccessKey']
) 

items = dynamo_db.Table('QSaves').scan()

counter = 0
URIS = []
for item in items['Items']:
	URIS.append('spotify:track:' + item['trackID'])

	if len(URIS) == 100:
		response = requests.post(
			'https://api.spotify.com/v1/users/qaverill15/playlists/0XnMSkmCPctn9mWZMkTNI6/tracks', 
			headers={
				'Authorization': 'Bearer ' + auth_token,
				'Content-Type': 'application/json'
			},
			data=json.dumps({ 'uris': URIS }))
		json_response = json.loads(response.text)
		print(json_response)
		URIS = []
		counter += 100

response = requests.post(
	'https://api.spotify.com/v1/users/qaverill15/playlists/0XnMSkmCPctn9mWZMkTNI6/tracks', 
	headers={
		'Authorization': 'Bearer ' + auth_token,
		'Content-Type': 'application/json'
	},
	data=json.dumps({ 'uris': URIS }))
json_response = json.loads(response.text)
print(json_response)
counter += len(URIS)

print('Added ' + str(counter) + ' songs to library archives')





