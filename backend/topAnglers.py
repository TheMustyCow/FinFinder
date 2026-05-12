import json
import boto3
from collections import Counter

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('FinFinder')

def lambda_handler(event, context):

    # Scan the entire table
    response = table.scan()

    items = response.get('Items', [])

    # Count catches per username
    angler_counts = Counter(item['Username'] for item in items if 'Username' in item)

    # Return top 3 only
    ranked = [
        {'username': username, 'count': count}
        for username, count in angler_counts.most_common(3)
    ]

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(ranked)
    }