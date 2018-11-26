import boto3
import json
import psycopg2
import time
import requests	
import calendar #Used for converting timestamp to epoch
from datetime import datetime #Used for comparing timestamps
from boto3.dynamodb.conditions import Key, Attr

auth_token = raw_input("Enter Auth Token: ")

with open('../../config/aws-config.json') as file:
  config = json.load(file)

dynamo_db = boto3.resource(
	'dynamodb',
	region_name = config.region,
	aws_access_key_id = config.accessKeyId,
  aws_secret_access_key = config.secretAccessKey
) 

pg_db = psycopg2.connect(
)
pg_cursor = pg_db.cursor()

pg_cursor.execute("SELECT q_library.\"Track_ID\", q_library.\"Added_On\" FROM q_library")

counter = 0
for save in pg_cursor.fetchall(): 

	if dynamo_db.Table('QSaves').query(KeyConditionExpression=Key('trackID').eq(save[0]))['Count'] == 0:
		history_url = 'https://api.spotify.com/v1/tracks/' + save[0]
		history_headers = {'Authorization': 'Bearer ' + auth_token}
		history_response = requests.get(history_url, headers=history_headers)
		json_response = json.loads(history_response.text)
		artistIDs = []

		for artist in json_response['artists']:
			artistIDs.append(artist['id'])
		
		dynamo_db.Table('QSaves').put_item(Item = {
			"timestamp": save[1],
			"trackID": save[0],
			"artistIDs": json.dumps(artistIDs),
			"albumID": json_response['album']['id'],
			"popularity": json_response['popularity'],
			"duration": json_response['duration_ms']
		})

		counter += 1

print ("Added " + str(counter) + " new saves")


	





