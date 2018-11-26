import boto3
import json

table_name = raw_input("Enter table name: ")

with open('../../config/aws-config.json') as file:
  config = json.load(file)

dynamo_db = boto3.resource(
	'dynamodb',
	region_name = config['region'],
	aws_access_key_id = config['accessKeyId'],
  	aws_secret_access_key = config['secretAccessKey']
) 

items = dynamo_db.Table(table_name).scan()

counter = 0
for item in items['Items']:
	counter += 1

print(table_name + " has " + str(counter) + " items")



