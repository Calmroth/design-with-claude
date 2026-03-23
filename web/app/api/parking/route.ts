import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ENDPOINTS = [
  'ptillaten',
  'servicedagar',
  'pbuss',
  'plastbil',
  'prorelsehindrad',
  'pmotorcykel',
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const radius = searchParams.get('radius') ?? '80';

  if (!endpoint || !ALLOWED_ENDPOINTS.includes(endpoint)) {
    return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
  }
  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat and lng are required' }, { status: 400 });
  }

  const apiKey = process.env.STOCKHOLM_API_KEY;
  const url =
    `https://openparking.stockholm.se/LTF-Tolken/v1/${endpoint}/within` +
    `?radius=${radius}&lat=${lat}&lng=${lng}&maxFeatures=100&outputFormat=json&apiKey=${apiKey}`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Stockholm API ${res.status}`, detail: text },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Fetch failed', detail: String(err) }, { status: 500 });
  }
}
