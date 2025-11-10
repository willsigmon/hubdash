import { cacheKeys, getCached } from '@/lib/knack/cache-manager'
import { getKnackClient } from '@/lib/knack/client'
import { errorResponse } from '@/lib/knack/write-utils'
import { NextResponse } from 'next/server'

/**
 * GET /api/counties
 * Get county reference data (read-only)
 */
export async function GET() {
  try {
    const counties = await getCached(
      'counties',
      async () => {
        const knack = getKnackClient()
        const objectKey = process.env.KNACK_COUNTIES_OBJECT || 'object_10'

        try {
          const knackRecords = await knack.getRecords(objectKey, { rows_per_page: 1000 })

          if (!Array.isArray(knackRecords)) {
            console.warn('Counties object not found or empty, returning NC counties list')
            // Fallback to NC counties list if Knack object doesn't exist
            return getNCCountiesList();
          }

          return knackRecords.map((r: any) => ({
            id: r.id,
            name: r.field_name || r.field_county_name || '',
            code: r.field_code || r.field_county_code || '',
            region: r.field_region || '',
          }));
        } catch (error) {
          // If counties object doesn't exist, return static NC list
          console.warn('Counties object not accessible, returning NC counties list')
          return getNCCountiesList();
        }
      },
      3600 // 1 hour TTL (county data rarely changes)
    );

    return NextResponse.json(counties, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600' },
    })
  } catch (error: any) {
    console.error('Counties API Error:', error)
    const message = error?.message || error?.toString() || 'Unknown error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/**
 * Fallback list of North Carolina counties
 */
function getNCCountiesList() {
  return [
    { id: '1', name: 'Alamance', code: 'AL', region: 'Piedmont' },
    { id: '2', name: 'Alexander', code: 'ALX', region: 'Piedmont' },
    { id: '3', name: 'Alleghany', code: 'ALG', region: 'Mountains' },
    { id: '4', name: 'Anson', code: 'ANS', region: 'Piedmont' },
    { id: '5', name: 'Ashe', code: 'ASH', region: 'Mountains' },
    { id: '6', name: 'Avery', code: 'AVY', region: 'Mountains' },
    { id: '7', name: 'Beaufort', code: 'BEA', region: 'Coastal' },
    { id: '8', name: 'Bertie', code: 'BER', region: 'Coastal' },
    { id: '9', name: 'Bladen', code: 'BLA', region: 'Coastal' },
    { id: '10', name: 'Brunswick', code: 'BRU', region: 'Coastal' },
    { id: '11', name: 'Buncombe', code: 'BUN', region: 'Mountains' },
    { id: '12', name: 'Burke', code: 'BUR', region: 'Mountains' },
    { id: '13', name: 'Cabarrus', code: 'CAB', region: 'Piedmont' },
    { id: '14', name: 'Caldwell', code: 'CAL', region: 'Mountains' },
    { id: '15', name: 'Camden', code: 'CAM', region: 'Coastal' },
    { id: '16', name: 'Carteret', code: 'CAR', region: 'Coastal' },
    { id: '17', name: 'Caswell', code: 'CAS', region: 'Piedmont' },
    { id: '18', name: 'Catawba', code: 'CAT', region: 'Piedmont' },
    { id: '19', name: 'Chatham', code: 'CHA', region: 'Piedmont' },
    { id: '20', name: 'Cherokee', code: 'CHE', region: 'Mountains' },
    { id: '21', name: 'Chowan', code: 'CHO', region: 'Coastal' },
    { id: '22', name: 'Clay', code: 'CLA', region: 'Mountains' },
    { id: '23', name: 'Cleveland', code: 'CLE', region: 'Piedmont' },
    { id: '24', name: 'Columbus', code: 'COL', region: 'Coastal' },
    { id: '25', name: 'Craven', code: 'CRA', region: 'Coastal' },
    { id: '26', name: 'Cumberland', code: 'CUM', region: 'Coastal' },
    { id: '27', name: 'Currituck', code: 'CUR', region: 'Coastal' },
    { id: '28', name: 'Dare', code: 'DAR', region: 'Coastal' },
    { id: '29', name: 'Davidson', code: 'DAV', region: 'Piedmont' },
    { id: '30', name: 'Davie', code: 'DAV', region: 'Piedmont' },
    { id: '31', name: 'Duplin', code: 'DUP', region: 'Coastal' },
    { id: '32', name: 'Durham', code: 'DUR', region: 'Piedmont' },
    { id: '33', name: 'Edgecombe', code: 'EDG', region: 'Coastal' },
    { id: '34', name: 'Forsyth', code: 'FOR', region: 'Piedmont' },
    { id: '35', name: 'Franklin', code: 'FRA', region: 'Piedmont' },
    { id: '36', name: 'Gaston', code: 'GAS', region: 'Piedmont' },
    { id: '37', name: 'Gates', code: 'GAT', region: 'Coastal' },
    { id: '38', name: 'Graham', code: 'GRA', region: 'Mountains' },
    { id: '39', name: 'Granville', code: 'GRA', region: 'Piedmont' },
    { id: '40', name: 'Greene', code: 'GRE', region: 'Coastal' },
    { id: '41', name: 'Guilford', code: 'GUI', region: 'Piedmont' },
    { id: '42', name: 'Halifax', code: 'HAL', region: 'Coastal' },
    { id: '43', name: 'Harnett', code: 'HAR', region: 'Piedmont' },
    { id: '44', name: 'Haywood', code: 'HAY', region: 'Mountains' },
    { id: '45', name: 'Henderson', code: 'HEN', region: 'Mountains' },
    { id: '46', name: 'Hertford', code: 'HER', region: 'Coastal' },
    { id: '47', name: 'Hoke', code: 'HOK', region: 'Coastal' },
    { id: '48', name: 'Hyde', code: 'HYD', region: 'Coastal' },
    { id: '49', name: 'Iredell', code: 'IRE', region: 'Piedmont' },
    { id: '50', name: 'Jackson', code: 'JAC', region: 'Mountains' },
    { id: '51', name: 'Johnston', code: 'JOH', region: 'Piedmont' },
    { id: '52', name: 'Jones', code: 'JON', region: 'Coastal' },
    { id: '53', name: 'Lee', code: 'LEE', region: 'Piedmont' },
    { id: '54', name: 'Lenoir', code: 'LEN', region: 'Coastal' },
    { id: '55', name: 'Lincoln', code: 'LIN', region: 'Piedmont' },
    { id: '56', name: 'McDowell', code: 'MCD', region: 'Mountains' },
    { id: '57', name: 'Macon', code: 'MAC', region: 'Mountains' },
    { id: '58', name: 'Madison', code: 'MAD', region: 'Mountains' },
    { id: '59', name: 'Martin', code: 'MAR', region: 'Coastal' },
    { id: '60', name: 'Mecklenburg', code: 'MEC', region: 'Piedmont' },
    { id: '61', name: 'Mitchell', code: 'MIT', region: 'Mountains' },
    { id: '62', name: 'Montgomery', code: 'MON', region: 'Piedmont' },
    { id: '63', name: 'Moore', code: 'MOO', region: 'Piedmont' },
    { id: '64', name: 'Nash', code: 'NAS', region: 'Coastal' },
    { id: '65', name: 'New Hanover', code: 'NEW', region: 'Coastal' },
    { id: '66', name: 'Northampton', code: 'NOR', region: 'Coastal' },
    { id: '67', name: 'Onslow', code: 'ONS', region: 'Coastal' },
    { id: '68', name: 'Orange', code: 'ORA', region: 'Piedmont' },
    { id: '69', name: 'Pamlico', code: 'PAM', region: 'Coastal' },
    { id: '70', name: 'Pasquotank', code: 'PAS', region: 'Coastal' },
    { id: '71', name: 'Pender', code: 'PEN', region: 'Coastal' },
    { id: '72', name: 'Perquimans', code: 'PER', region: 'Coastal' },
    { id: '73', name: 'Person', code: 'PER', region: 'Piedmont' },
    { id: '74', name: 'Pitt', code: 'PIT', region: 'Coastal' },
    { id: '75', name: 'Polk', code: 'POL', region: 'Mountains' },
    { id: '76', name: 'Randolph', code: 'RAN', region: 'Piedmont' },
    { id: '77', name: 'Richmond', code: 'RIC', region: 'Piedmont' },
    { id: '78', name: 'Robeson', code: 'ROB', region: 'Coastal' },
    { id: '79', name: 'Rockingham', code: 'ROC', region: 'Piedmont' },
    { id: '80', name: 'Rowan', code: 'ROW', region: 'Piedmont' },
    { id: '81', name: 'Rutherford', code: 'RUT', region: 'Mountains' },
    { id: '82', name: 'Sampson', code: 'SAM', region: 'Coastal' },
    { id: '83', name: 'Scotland', code: 'SCO', region: 'Coastal' },
    { id: '84', name: 'Stanly', code: 'STA', region: 'Piedmont' },
    { id: '85', name: 'Stokes', code: 'STO', region: 'Piedmont' },
    { id: '86', name: 'Surry', code: 'SUR', region: 'Piedmont' },
    { id: '87', name: 'Swain', code: 'SWA', region: 'Mountains' },
    { id: '88', name: 'Transylvania', code: 'TRA', region: 'Mountains' },
    { id: '89', name: 'Tyrrell', code: 'TYR', region: 'Coastal' },
    { id: '90', name: 'Union', code: 'UNI', region: 'Piedmont' },
    { id: '91', name: 'Vance', code: 'VAN', region: 'Piedmont' },
    { id: '92', name: 'Wake', code: 'WAK', region: 'Piedmont' },
    { id: '93', name: 'Warren', code: 'WAR', region: 'Piedmont' },
    { id: '94', name: 'Washington', code: 'WAS', region: 'Coastal' },
    { id: '95', name: 'Watauga', code: 'WAT', region: 'Mountains' },
    { id: '96', name: 'Wayne', code: 'WAY', region: 'Coastal' },
    { id: '97', name: 'Wilkes', code: 'WIL', region: 'Mountains' },
    { id: '98', name: 'Wilson', code: 'WIL', region: 'Coastal' },
    { id: '99', name: 'Yadkin', code: 'YAD', region: 'Piedmont' },
    { id: '100', name: 'Yancey', code: 'YAN', region: 'Mountains' },
  ];
}
