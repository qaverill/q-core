import boto3
import json
import psycopg2
import time

with open('../../config/aws-config.json') as file:
  config = json.load(file)

dynamo_db = boto3.resource(
	'dynamodb',
	region_name = config.region,
	aws_access_key_id = config.accessKeyId,
  aws_secret_access_key=config.secretAccessKey
) 

pg_db = psycopg2.connect(
)
pg_cursor = pg_db.cursor()
'''
pg_tracks_query = pg_cursor.execute("SELECT q_tracks.\"Track_ID\", q_tracks.\"Title\", q_tracks.\"Artist\", q_tracks.\"Album\", q_tracks.\"Duration\", q_tracks.\"Popularity\", q_library.\"Added_On\" FROM q_tracks LEFT JOIN q_library ON q_tracks.\"Track_ID\" = q_library.\"Track_ID\"")
pg_tracks = pg_cursor.fetchall()
 counter = 0;
for track in pg_tracks:
	q_track = {
		"trackID": track[0],
		"title": track[1],
		"artist": track[2],
		"album": track[3],
		"duration": track[4],
		"popularity": track[5]
	}
	
	if track[6] is not None:
		q_track["saved"] = track[6]

	dynamo_db.Table('qTracks').put_item(Item = q_track)
	counter += 1
'''
pg_history_query = pg_cursor.execute("SELECT * FROM q_history")
pg_history = pg_cursor.fetchall()

counter = 0
for listen in pg_history:
	dynamo_db.Table('qListens').put_item(Item = {
		"timestamp": listen[0],
		"trackID": listen[1]
	})
	time.sleep(.15)
	counter += 1

print("Added " + str(counter) + " history listens")





