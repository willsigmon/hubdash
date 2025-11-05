#!/bin/bash

# HubDash API Key Setup Script
# Generates secure API keys and creates .env.local
# Run with: chmod +x setup-api-keys.sh && ./setup-api-keys.sh

set -e

echo "==============================================="
echo "HubDash Security Setup"
echo "API Key Generator"
echo "==============================================="
echo ""

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "Warning: .env.local already exists"
    read -p "Overwrite? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborting."
        exit 1
    fi
fi

echo "Generating secure API keys..."
echo ""

# Generate keys
SYNC_KEY="sk_$(openssl rand -hex 32)"
ADMIN_KEY="sk_$(openssl rand -hex 32)"
CRON_KEY="sk_$(openssl rand -hex 32)"

echo "Generated keys:"
echo "  API_KEY_SYNC:  ${SYNC_KEY:0:20}..."
echo "  API_KEY_ADMIN: ${ADMIN_KEY:0:20}..."
echo "  API_KEY_CRON:  ${CRON_KEY:0:20}..."
echo ""

# Create .env.local
echo "Creating .env.local with generated keys..."

cat > .env.local << EOF
# HubDash Security Configuration
# Generated at: $(date)
# DO NOT COMMIT THIS FILE

# API Keys (Generated with setup-api-keys.sh)
API_KEY_SYNC=${SYNC_KEY}
API_KEY_ADMIN=${ADMIN_KEY}
API_KEY_CRON=${CRON_KEY}

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Knack Configuration (Source of Truth)
KNACK_APP_ID=your-knack-app-id
KNACK_API_KEY=your-knack-rest-api-key

# Optional: Knack Object Mapping (auto-discovered if not provided)
# KNACK_DEVICES_OBJECT=object_1
# KNACK_DONATIONS_OBJECT=object_2
# KNACK_PARTNERS_OBJECT=object_3
# KNACK_TRAINING_OBJECT=object_4
# KNACK_ACTIVITY_OBJECT=object_5

# Sync Settings (optional)
# KNACK_SYNC_INTERVAL=3600000  # 1 hour in milliseconds
# KNACK_CACHE_TTL=300000       # 5 minutes in milliseconds
EOF

echo ""
echo "==============================================="
echo "✅ Setup Complete!"
echo "==============================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Update .env.local with your actual credentials:"
echo "   - Edit NEXT_PUBLIC_SUPABASE_URL"
echo "   - Edit NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - Edit SUPABASE_SERVICE_ROLE_KEY"
echo "   - Edit KNACK_APP_ID"
echo "   - Edit KNACK_API_KEY"
echo ""
echo "2. Save your API keys somewhere secure:"
echo ""
echo "   API_KEY_SYNC:  ${SYNC_KEY}"
echo "   API_KEY_ADMIN: ${ADMIN_KEY}"
echo "   API_KEY_CRON:  ${CRON_KEY}"
echo ""
echo "3. For Vercel deployment, add to Vercel Project Settings:"
echo "   - Go to Project Settings > Environment Variables"
echo "   - Add all three API keys"
echo "   - Make sure to set for Production environment"
echo ""
echo "4. Test locally:"
echo "   npm run dev"
echo ""
echo "   Then in another terminal:"
echo "   curl -H \"Authorization: Bearer ${SYNC_KEY}\" http://localhost:3000/api/sync"
echo ""
echo "5. Never commit .env.local:"
echo "   It should already be in .gitignore"
echo "   Verify: grep '.env.local' .gitignore"
echo ""
echo "==============================================="
