import boto3
import json
import psycopg2
import time
import requests

table_name = raw_input("Table name: ")
attribute = raw_input("Attribute: ")

with open('../../config/aws-config.json') as file:
  config = json.load(file)

dynamo_db = boto3.resource(
	'dynamodb',
	region_name = config.region,
	aws_access_key_id = config.accessKeyId,
  aws_secret_access_key = config.secretAccessKey
) 

items = dynamo_db.Table(table_name).scan()

max = 0
for item in items['Items']:
	if item[attribute] > max:
		max = item[attribute]

print(max)



