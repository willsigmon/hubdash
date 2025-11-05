#!/bin/bash

# =========================================================================
# HubDash Production Deployment Validator
# =========================================================================
# Usage: ./scripts/validate-deployment.sh
#
# This script validates that all required configuration is in place
# for production deployment to Vercel with Knack sync.
# =========================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
CHECKS_PASSED=0
CHECKS_FAILED=0
CHECKS_WARNING=0

echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}HubDash Production Deployment Validator${NC}"
echo -e "${BLUE}============================================================${NC}"
echo ""

# =========================================================================
# Helper Functions
# =========================================================================

check_file() {
  local file=$1
  local description=$2

  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} $description: $file exists"
    ((CHECKS_PASSED++))
    return 0
  else
    echo -e "${RED}✗${NC} $description: $file NOT FOUND"
    ((CHECKS_FAILED++))
    return 1
  fi
}

check_env_var() {
  local var=$1
  local description=$2

  if [ -z "${!var}" ]; then
    echo -e "${YELLOW}⚠${NC} $description: \$$var not set"
    ((CHECKS_WARNING++))
    return 1
  else
    echo -e "${GREEN}✓${NC} $description: \$$var is set"
    ((CHECKS_PASSED++))
    return 0
  fi
}

check_json_valid() {
  local file=$1
  local description=$2

  if jq empty "$file" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} $description: $file is valid JSON"
    ((CHECKS_PASSED++))
    return 0
  else
    echo -e "${RED}✗${NC} $description: $file is INVALID JSON"
    ((CHECKS_FAILED++))
    return 1
  fi
}

check_cron_config() {
  local file=$1

  if grep -q '"crons"' "$file" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Cron Configuration: Found in $file"
    if grep -q '"/api/cron/sync"' "$file" 2>/dev/null; then
      echo -e "${GREEN}✓${NC}   - /api/cron/sync endpoint configured"
      ((CHECKS_PASSED++))
    else
      echo -e "${RED}✗${NC}   - /api/cron/sync endpoint NOT configured"
      ((CHECKS_FAILED++))
      return 1
    fi

    if grep -q '"0 \* \* \* \*"' "$file" 2>/dev/null; then
      echo -e "${GREEN}✓${NC}   - Hourly schedule configured (0 * * * *)"
      ((CHECKS_PASSED++))
    else
      echo -e "${YELLOW}⚠${NC}   - Custom schedule (not hourly)"
      ((CHECKS_WARNING++))
    fi
    return 0
  else
    echo -e "${RED}✗${NC} Cron Configuration: NOT FOUND in $file"
    ((CHECKS_FAILED++))
    return 1
  fi
}

# =========================================================================
# Check 1: Configuration Files
# =========================================================================
echo -e "${BLUE}[1/6] Configuration Files${NC}"
echo ""

check_file "vercel.json" "Vercel config"
check_cron_config "vercel.json"

check_file ".github/workflows/sync.yml" "GitHub Actions workflow"

check_file ".env.local.example" "Environment template"

check_file "package.json" "Package configuration"
check_json_valid "package.json" "Package configuration JSON"

check_file "tsconfig.json" "TypeScript configuration"

check_file "next.config.js" "Next.js configuration"

echo ""

# =========================================================================
# Check 2: API Route Files
# =========================================================================
echo -e "${BLUE}[2/6] API Route Files${NC}"
echo ""

check_file "src/app/api/cron/sync/route.ts" "Sync endpoint"

check_file "src/lib/knack/sync.ts" "Knack sync library"
check_file "src/lib/knack/client.ts" "Knack client"

check_file "src/lib/supabase/server.ts" "Supabase server client"
check_file "src/lib/supabase/client.ts" "Supabase browser client"
check_file "src/lib/supabase/types.ts" "Supabase types"

echo ""

# =========================================================================
# Check 3: Environment Variables (Local)
# =========================================================================
echo -e "${BLUE}[3/6] Environment Variables (Local)${NC}"
echo ""

if [ -f ".env.local" ]; then
  echo -e "${BLUE}Found .env.local - checking contents...${NC}"

  check_env_var "NEXT_PUBLIC_SUPABASE_URL" "Supabase URL"
  check_env_var "NEXT_PUBLIC_SUPABASE_ANON_KEY" "Supabase anonymous key"
  check_env_var "SUPABASE_SERVICE_ROLE_KEY" "Supabase service role key"
  check_env_var "KNACK_APP_ID" "Knack application ID"
  check_env_var "KNACK_API_KEY" "Knack API key"
  check_env_var "CRON_SECRET" "Cron endpoint secret"
else
  echo -e "${YELLOW}⚠${NC} .env.local not found (create from .env.local.example)"
  echo "   To create: cp .env.local.example .env.local"
  ((CHECKS_WARNING++))
fi

echo ""

# =========================================================================
# Check 4: Build Configuration
# =========================================================================
echo -e "${BLUE}[4/6] Build Configuration${NC}"
echo ""

if grep -q '"type": "module"' package.json; then
  echo -e "${GREEN}✓${NC} ES Modules: package.json configured"
  ((CHECKS_PASSED++))
else
  echo -e "${YELLOW}⚠${NC} ES Modules: NOT configured (may cause issues)"
  ((CHECKS_WARNING++))
fi

if grep -q '@tailwindcss/postcss' package.json; then
  echo -e "${GREEN}✓${NC} Tailwind CSS: Installed"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}✗${NC} Tailwind CSS: NOT installed"
  ((CHECKS_FAILED++))
fi

if grep -q '"next"' package.json; then
  echo -e "${GREEN}✓${NC} Next.js: Installed"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}✗${NC} Next.js: NOT installed"
  ((CHECKS_FAILED++))
fi

if grep -q '@supabase/supabase-js' package.json; then
  echo -e "${GREEN}✓${NC} Supabase: Installed"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}✗${NC} Supabase: NOT installed"
  ((CHECKS_FAILED++))
fi

echo ""

# =========================================================================
# Check 5: Knack Sync Implementation
# =========================================================================
echo -e "${BLUE}[5/6] Knack Sync Implementation${NC}"
echo ""

if grep -q "export async function syncAll" src/lib/knack/sync.ts; then
  echo -e "${GREEN}✓${NC} syncAll function: Implemented"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}✗${NC} syncAll function: NOT FOUND"
  ((CHECKS_FAILED++))
fi

if grep -q "export async function syncDevices" src/lib/knack/sync.ts; then
  echo -e "${GREEN}✓${NC} syncDevices function: Implemented"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}✗${NC} syncDevices function: NOT FOUND"
  ((CHECKS_FAILED++))
fi

if grep -q "export async function syncDonations" src/lib/knack/sync.ts; then
  echo -e "${GREEN}✓${NC} syncDonations function: Implemented"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}✗${NC} syncDonations function: NOT FOUND"
  ((CHECKS_FAILED++))
fi

if grep -q "GET.*Vercel cron" src/app/api/cron/sync/route.ts; then
  echo -e "${GREEN}✓${NC} GET /api/cron/sync: Implemented"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}✗${NC} GET /api/cron/sync: NOT FOUND"
  ((CHECKS_FAILED++))
fi

if grep -q "POST.*manual sync" src/app/api/cron/sync/route.ts; then
  echo -e "${GREEN}✓${NC} POST /api/cron/sync: Implemented"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}✗${NC} POST /api/cron/sync: NOT FOUND"
  ((CHECKS_FAILED++))
fi

echo ""

# =========================================================================
# Check 6: Production Readiness
# =========================================================================
echo -e "${BLUE}[6/6] Production Readiness${NC}"
echo ""

if [ -f ".gitignore" ] && grep -q ".env.local" .gitignore; then
  echo -e "${GREEN}✓${NC} .env.local: Properly ignored by git"
  ((CHECKS_PASSED++))
else
  echo -e "${YELLOW}⚠${NC} .env.local: May not be in .gitignore"
  ((CHECKS_WARNING++))
fi

if [ -f ".github/workflows/sync.yml" ]; then
  if grep -q "YOUR_GITHUB_ORG" .github/workflows/sync.yml; then
    echo -e "${RED}✗${NC} GitHub Actions: Needs organization name (search for YOUR_GITHUB_ORG)"
    ((CHECKS_FAILED++))
  else
    echo -e "${GREEN}✓${NC} GitHub Actions: Organization configured"
    ((CHECKS_PASSED++))
  fi
fi

if [ -f "DEPLOYMENT_CONFIG.md" ]; then
  echo -e "${GREEN}✓${NC} Deployment Guide: DEPLOYMENT_CONFIG.md exists"
  ((CHECKS_PASSED++))
else
  echo -e "${YELLOW}⚠${NC} Deployment Guide: DEPLOYMENT_CONFIG.md not found"
  ((CHECKS_WARNING++))
fi

echo ""

# =========================================================================
# Summary
# =========================================================================
echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}Summary${NC}"
echo -e "${BLUE}============================================================${NC}"
echo ""

TOTAL=$((CHECKS_PASSED + CHECKS_FAILED + CHECKS_WARNING))

echo -e "${GREEN}✓ Passed:${NC}  $CHECKS_PASSED/$TOTAL"
if [ $CHECKS_WARNING -gt 0 ]; then
  echo -e "${YELLOW}⚠ Warnings:${NC} $CHECKS_WARNING/$TOTAL"
fi
if [ $CHECKS_FAILED -gt 0 ]; then
  echo -e "${RED}✗ Failed:${NC}  $CHECKS_FAILED/$TOTAL"
fi

echo ""

# =========================================================================
# Next Steps
# =========================================================================
if [ $CHECKS_FAILED -eq 0 ]; then
  echo -e "${GREEN}Ready for deployment!${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Review DEPLOYMENT_CONFIG.md for production setup"
  echo "2. Add environment variables to Vercel"
  echo "3. Update GitHub Actions workflow with your organization"
  echo "4. Deploy to production: git push origin main"
  echo "5. Verify sync running: Check Vercel logs after 1 hour"
  echo ""
  exit 0
else
  echo -e "${RED}Please fix errors before deploying to production${NC}"
  echo ""
  echo "Issues found:"
  grep "✗" <<< "$(echo -e "${BLUE}[Check output above]${NC}")"
  echo ""
  echo "See DEPLOYMENT_CONFIG.md for troubleshooting help"
  echo ""
  exit 1
fi
