import json
import boto3
from collections import Counter

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('FinFinder')

def lambda_handler(event, context):

    # Scan the entire table, no filter needed
    response = table.scan()

    items = response.get('Items', [])

    # Count how many times each species appears
    species_counts = Counter(item['FishSpecies'] for item in items if 'FishSpecies' in item)

    # Sort ascending (least caught first)
    ranked = [
        {'species': species, 'count': count}
        for species, count in species_counts.most_common()[::-1]
    ]

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(ranked)
    }