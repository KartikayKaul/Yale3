#!/bin/bash

CONFIG_FILE="config.json"

if [ ! -f "$CONFIG_FILE" ]; then
    echo " config file not found!"
    exit 1
fi

echo " Reading config.json..."
APP_NAME=$(node -p "require('./$CONFIG_FILE').APP_NAME")
DB_NAME=$(node -p "require('./$CONFIG_FILE').DB_NAME")
COLLECTION_NAME=$(node -p "require('./$CONFIG_FILE').COLLECTION_NAME")
MONGODB_URI=$(node -p "require('./$CONFIG_FILE').MONGODB_URI")

if [[ -z "$APP_NAME" || -z "$DB_NAME" || -z "$COLLECTION_NAME" || -z "$MONGODB_URI" ]]; then
    echo " Missing one or more required fields in config file"
    exit 1
fi

echo " Creating function directory..."
mkdir -p vercel/$APP_NAME/api
cd vercel/$APP_NAME || exit 1

echo " Writing api/save.js with CORS support..."
cat <<EOF > api/save.js
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI, {
  tls: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).send("Only POST allowed");
  }

  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const result = await db.collection(process.env.COLLECTION_NAME).insertOne(req.body);
    res.status(200).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
EOF

echo " Creating .env file for Vercel local dev..."
cat <<EOF > .env
MONGODB_URI=$MONGODB_URI
DB_NAME=$DB_NAME
COLLECTION_NAME=$COLLECTION_NAME
EOF

echo ".env" > .gitignore

echo " Creating vercel.json..."
cat <<EOF > vercel.json
{
  "version": 2,
  "env": {
    "MONGODB_URI": "@MONGODB_URI",
    "DB_NAME": "@DB_NAME",
    "COLLECTION_NAME": "@COLLECTION_NAME"
  }
}
EOF

echo " Initializing Node.js project..."
npm init -y > /dev/null
npm install mongodb > /dev/null

echo " Installing Vercel CLI..."
npm install -g vercel > /dev/null

echo " Logging into Vercel..."
vercel login || exit 1

echo " Deploying to Vercel..."
DEPLOYED_URL=$(vercel --env MONGODB_URI=$MONGODB_URI \
                      --env DB_NAME=$DB_NAME \
                      --env COLLECTION_NAME=$COLLECTION_NAME \
                      --name "$APP_NAME" \
                      --prod \
                      --confirm | grep -oE "https://[a-zA-Z0-9-]+\.vercel\.app")

if [ -z "$DEPLOYED_URL" ]; then
    echo "❌ Could not determine deployed URL from Vercel output."
    exit 1
fi

cd ../.. || exit 1

echo " Updating config.json with MONGO_API_ENDPOINT..."
node <<EOF
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('$CONFIG_FILE'));
config.MONGO_API_ENDPOINT = "$DEPLOYED_URL/api/save";
fs.writeFileSync('$CONFIG_FILE', JSON.stringify(config, null, 2));
EOF

echo " Deployment complete!"
echo "  Mongo API available at: $DEPLOYED_URL/api/save"
