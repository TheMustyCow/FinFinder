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

    location_counts = Counter(item['Location'] for item in items if 'Location' in item)

    ranked = [
        {'location': location, 'count': count}
        for location, count in location_counts.most_common()
    ]

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(ranked)
    }