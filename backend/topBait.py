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

    # Scan the table filtering by species
    # (For a demo this is fine — in production you'd use a GSI)
    response = table.scan(
        FilterExpression=boto3.dynamodb.conditions.Attr('FishSpecies').eq(species)
    )

    items = response.get('Items', [])

    # Count how many times each bait appears
    bait_counts = Counter(item['Bait'] for item in items if 'bait' in item)

    # Sort by count descending, return as list of objects
    ranked = [
        {'bait': bait, 'count': count}
        for bait, count in bait_counts.most_common()
    ]

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},  # needed for React Native to talk to it
        'body': json.dumps(ranked)
    }