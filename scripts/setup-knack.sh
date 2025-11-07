#!/bin/bash

# Knack Setup Script
# Helps you configure HubDash to connect to your Knack database

set -e

echo "🔧 HubDash Knack Setup"
echo "======================="
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "✅ Found existing .env.local file"
    echo ""
    read -p "Do you want to update it? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
else
    echo "📝 Creating new .env.local file..."
    touch .env.local
fi

echo ""
echo "Please provide your Knack API credentials:"
echo "(Get these from Knack Builder → Settings → API & Code)"
echo ""

# Get Knack App ID
read -p "Knack Application ID: " KNACK_APP_ID
if [ -z "$KNACK_APP_ID" ]; then
    echo "❌ Application ID is required"
    exit 1
fi

# Get Knack API Key
read -p "Knack API Key: " KNACK_API_KEY
if [ -z "$KNACK_API_KEY" ]; then
    echo "❌ API Key is required"
    exit 1
fi

echo ""
echo "📦 Configuring Knack object keys..."
echo "(Press Enter to use defaults, or provide your custom object keys)"
echo ""

read -p "Devices object [object_7]: " DEVICES_OBJ
DEVICES_OBJ=${DEVICES_OBJ:-object_7}

read -p "Organizations object [object_22]: " ORGS_OBJ
ORGS_OBJ=${ORGS_OBJ:-object_22}

read -p "Donations object [object_63]: " DONATIONS_OBJ
DONATIONS_OBJ=${DONATIONS_OBJ:-object_63}

read -p "Partnerships object [object_55]: " PARTNERSHIPS_OBJ
PARTNERSHIPS_OBJ=${PARTNERSHIPS_OBJ:-object_55}

read -p "Recipients object [object_62]: " RECIPIENTS_OBJ
RECIPIENTS_OBJ=${RECIPIENTS_OBJ:-object_62}

read -p "Activity object [object_5]: " ACTIVITY_OBJ
ACTIVITY_OBJ=${ACTIVITY_OBJ:-object_5}

# Write to .env.local
cat > .env.local << EOF
# Knack API Credentials
KNACK_APP_ID=$KNACK_APP_ID
KNACK_API_KEY=$KNACK_API_KEY
KNACK_BASE_URL=https://api.knack.com/v1

# Knack Object Keys
KNACK_DEVICES_OBJECT=$DEVICES_OBJ
KNACK_ORGANIZATIONS_OBJECT=$ORGS_OBJ
KNACK_DONATION_INFO_OBJECT=$DONATIONS_OBJ
KNACK_PARTNERSHIP_APPLICATIONS_OBJECT=$PARTNERSHIPS_OBJ
KNACK_LAPTOP_APPLICATIONS_OBJECT=$RECIPIENTS_OBJ
KNACK_ACTIVITY_OBJECT=$ACTIVITY_OBJ

# Grant Goals
GRANT_LAPTOP_GOAL=1500
GRANT_TRAINING_HOURS_GOAL=125
METRICS_PEOPLE_TRAINED=450

# Field mappings (run 'npm run discover-fields' to find these)
# KNACK_DONATION_STATUS_FIELD=
# KNACK_DONATION_PRIORITY_FIELD=
# KNACK_PARTNERSHIP_STATUS_FIELD=field_679
EOF

echo ""
echo "✅ Configuration saved to .env.local"
echo ""
echo "Next steps:"
echo "1. Run 'npm run discover-fields' to find your Knack field IDs"
echo "2. Add the field mappings to .env.local"
echo "3. Restart your dev server: npm run dev"
echo "4. Visit http://localhost:3000/board to see your data!"
echo ""

