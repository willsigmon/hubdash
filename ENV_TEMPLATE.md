# Environment Variables Template

Copy the variables below into your `.env.local` file and fill in your actual Knack credentials.

## Knack API Credentials

```bash
KNACK_APP_ID=your_knack_application_id_here
KNACK_API_KEY=your_knack_api_key_here
KNACK_BASE_URL=https://api.knack.com/v1
```

## Knack Object Keys

```bash
KNACK_DEVICES_OBJECT=object_7
KNACK_ORGANIZATIONS_OBJECT=object_22
KNACK_DONATION_INFO_OBJECT=object_63
KNACK_PARTNERSHIP_APPLICATIONS_OBJECT=object_55
KNACK_LAPTOP_APPLICATIONS_OBJECT=object_62
KNACK_ACTIVITY_OBJECT=object_5
```

## Knack Field Mappings - Donations

```bash
KNACK_DONATION_STATUS_FIELD=field_700
KNACK_DONATION_PRIORITY_FIELD=field_701
KNACK_DONATION_NOTES_FIELD=field_702
```

## Knack Field Mappings - Partnerships

```bash
KNACK_PARTNERSHIP_STATUS_FIELD=field_679
KNACK_PARTNERSHIP_NOTES_FIELD=field_680
KNACK_PARTNERSHIP_INTERNAL_NOTES_FIELD=field_681
```

## Knack Field Mappings - Activity Feed

```bash
KNACK_ACTIVITY_USER_FIELD=field_100
KNACK_ACTIVITY_ACTION_FIELD=field_101
KNACK_ACTIVITY_TARGET_FIELD=field_102
KNACK_ACTIVITY_TYPE_FIELD=field_103
KNACK_ACTIVITY_ICON_FIELD=field_104
KNACK_ACTIVITY_CREATED_AT_FIELD=field_105
```

## Grant Goals & Metrics

```bash
GRANT_LAPTOP_GOAL=1500
GRANT_TRAINING_HOURS_GOAL=125
METRICS_PEOPLE_TRAINED=450
```

## Social Media (Optional)

```bash
FACEBOOK_PAGE_ID=your_facebook_page_id
FACEBOOK_GRAPH_TOKEN=your_facebook_access_token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_instagram_business_account_id
LINKEDIN_ORGANIZATION_URN=urn:li:organization:12345678
LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token
TIKTOK_USERNAME=your_tiktok_username
RAPIDAPI_KEY=your_rapidapi_key
```

## Notes

1. Find your Knack field IDs using the discovery script: `npm run discover-fields`
2. All `KNACK_*_FIELD` variables are optional - the app will warn if missing
3. Restart dev server after changing environment variables
4. Add these same variables to your Vercel deployment
