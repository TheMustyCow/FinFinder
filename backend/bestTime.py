import json
import boto3
from collections import Counter

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('FinFinder')

def lambda_handler(event, context):
    species = event.get('queryStringParameters', {}).get('FishSpecies')

    if not species:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'FishSpecies parameter is required'})
        }

    response = table.scan(
        FilterExpression=boto3.dynamodb.conditions.Attr('FishSpecies').eq(species)
    )

    items = response.get('Items', [])

    # Convert CatchTime to a bucket and count them
    buckets = []
    for item in items:
        if 'CatchTime' not in item:
            continue
        hour = int(item['CatchTime'].split(':')[0])
        if 6 <= hour < 12:
            buckets.append('Morning')
        elif 12 <= hour < 17:
            buckets.append('Afternoon')
        elif 17 <= hour < 21:
            buckets.append('Evening')
        else:
            buckets.append('Night')

    time_counts = Counter(buckets)

    ranked = [
        {'timeOfDay': time, 'count': count}
        for time, count in time_counts.most_common()
    ]

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(ranked)
    }