'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: Window & { google: any };

// ─── Types ────────────────────────────────────────────────────────────────────

type ParkingStatus = 'legal' | 'restricted' | 'timelimited' | 'unknown' | 'loading';
type DataMode = 'live' | 'mock';

interface GpsPosition {
  lat: number;
  lng: number;
  accuracy: number;
}

interface ParkingRule {
  text: string;
  type: 'ok' | 'warning' | 'error' | 'info';
  detail: string;
}

interface ParkingEvaluation {
  status: ParkingStatus;
  rules: ParkingRule[];
  until?: string;
  zone?: string;
  source: 'live' | 'mock';
}

// Stockholm API feature
interface SthlmFeature {
  type: 'Feature';
  geometry: { type: string; coordinates: unknown };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: Record<string, any>;
}
interface SthlmResponse {
  type: 'FeatureCollection';
  features: SthlmFeature[];
  error?: string;
}

// ─── Dark Map Style ───────────────────────────────────────────────────────────

const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#0d1117' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0d1117' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#161b22' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#21262d' }] },
  { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#4b5563' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#1c2230' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#21262d' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#7d8590' }] },
  { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#3d4451' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#060c14' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#111827' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#374151' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#0a1a10' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#0d1117' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#21262d' }] },
];

// ─── Live Data Fetcher ────────────────────────────────────────────────────────

async function fetchEndpoint(endpoint: string, pos: GpsPosition): Promise<SthlmResponse> {
  const url = `/api/parking?endpoint=${endpoint}&lat=${pos.lat}&lng=${pos.lng}&radius=80`;
  const res = await fetch(url);
  return res.json();
}

async function fetchAllLiveData(pos: GpsPosition) {
  const [ptillaten, servicedagar, pbuss, plastbil, prorelsehindrad] = await Promise.all([
    fetchEndpoint('ptillaten', pos),
    fetchEndpoint('servicedagar', pos),
    fetchEndpoint('pbuss', pos),
    fetchEndpoint('plastbil', pos),
    fetchEndpoint('prorelsehindrad', pos),
  ]);
  return { ptillaten, servicedagar, pbuss, plastbil, prorelsehindrad };
}

// ─── Live Data Evaluation ─────────────────────────────────────────────────────

// Attempt to parse time string "HH:MM" or "HHMM" to minutes since midnight
function parseTime(t: unknown): number | null {
  if (typeof t !== 'string' && typeof t !== 'number') return null;
  const s = String(t).replace(':', '').trim();
  if (s.length < 3) return null;
  const h = parseInt(s.slice(0, s.length - 2), 10);
  const m = parseInt(s.slice(-2), 10);
  if (isNaN(h) || isNaN(m)) return null;
  return h * 60 + m;
}

// Swedish weekday map: 1=Mon … 7=Sun (ISO), JS getDay 0=Sun
function jsWeekdayToIso(day: number) {
  return day === 0 ? 7 : day;
}

function isTimeInWindow(props: Record<string, unknown>, now: Date): boolean {
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const isoDay = jsWeekdayToIso(now.getDay());

  // Try common property names used in Stockholm LTF data
  const keys = Object.keys(props).map(k => k.toUpperCase());

  const timeFromKey = keys.find(k => k.includes('TID_FR') || k.includes('KLOCKSLAG_FR') || k === 'START_TIME');
  const timeToKey   = keys.find(k => k.includes('TID_TOM') || k.includes('TID_TILL') || k.includes('KLOCKSLAG_TO') || k === 'END_TIME');
  const dayFromKey  = keys.find(k => k.includes('DAG_FR') || k.includes('VECKODAG_FR') || k === 'WEEKDAY_FROM');
  const dayToKey    = keys.find(k => k.includes('DAG_TOM') || k.includes('DAG_TILL') || k.includes('VECKODAG_TO') || k === 'WEEKDAY_TO');

  const getProp = (upperKey: string | undefined) => {
    if (!upperKey) return undefined;
    const origKey = Object.keys(props).find(k => k.toUpperCase() === upperKey);
    return origKey ? props[origKey] : undefined;
  };

  const tFrom = parseTime(getProp(timeFromKey));
  const tTo   = parseTime(getProp(timeToKey));
  const dFrom = typeof getProp(dayFromKey) === 'number' ? getProp(dayFromKey) as number : null;
  const dTo   = typeof getProp(dayToKey)   === 'number' ? getProp(dayToKey)   as number : null;

  // Check weekday range
  if (dFrom !== null && dTo !== null) {
    const inDayRange = dFrom <= dTo
      ? isoDay >= dFrom && isoDay <= dTo
      : isoDay >= dFrom || isoDay <= dTo;
    if (!inDayRange) return false;
  }

  // Check time range
  if (tFrom !== null && tTo !== null) {
    const inTimeRange = tFrom <= tTo
      ? nowMin >= tFrom && nowMin < tTo
      : nowMin >= tFrom || nowMin < tTo;
    return inTimeRange;
  }

  // No time info — assume active
  return true;
}

function featuresToRules(features: SthlmFeature[], label: string, ruleType: ParkingRule['type']): ParkingRule[] {
  if (!features || features.length === 0) return [];
  return features.slice(0, 2).map(f => {
    const p = f.properties;
    const keys = Object.keys(p);
    // Grab any time/day fields for display
    const info = keys
      .filter(k => /TID|DAG|KLOCKSLAG|TIME|WEEKDAY/i.test(k))
      .map(k => `${k}: ${p[k]}`)
      .slice(0, 3)
      .join(', ');
    return {
      text: label,
      type: ruleType,
      detail: info || 'Ingen tidsinfo tillgänglig',
    };
  });
}

function evaluateLiveData(
  data: Awaited<ReturnType<typeof fetchAllLiveData>>,
  now: Date
): ParkingEvaluation {
  const { ptillaten, servicedagar, pbuss, plastbil, prorelsehindrad } = data;

  // 1. Hard restricted zones
  if (pbuss?.features?.length > 0) {
    return {
      status: 'restricted', source: 'live', zone: 'Busszon',
      rules: [
        { text: 'Busszon — förbjudet', type: 'error', detail: 'Reserverat för bussar' },
        ...featuresToRules(pbuss.features, 'Bussrestriktion', 'error'),
      ],
    };
  }
  if (plastbil?.features?.length > 0) {
    return {
      status: 'restricted', source: 'live', zone: 'Lastzon',
      rules: [
        { text: 'Lastzon — förbjudet', type: 'error', detail: 'Reserverat för lastbilar' },
        ...featuresToRules(plastbil.features, 'Lastbilsrestriktion', 'error'),
      ],
    };
  }
  if (prorelsehindrad?.features?.length > 0) {
    return {
      status: 'restricted', source: 'live', zone: 'Handikapplats',
      rules: [
        { text: 'Handikapplats — kräver tillstånd', type: 'error', detail: 'Rörelsehindrade med tillstånd' },
      ],
    };
  }

  // 2. Service day active right now?
  const activeService = (servicedagar?.features ?? []).filter(f =>
    isTimeInWindow(f.properties, now)
  );
  if (activeService.length > 0) {
    return {
      status: 'restricted', source: 'live', zone: 'Servicedag',
      rules: [
        { text: 'Servicedag aktiv', type: 'error', detail: 'Gatan städas/underhålls just nu' },
        ...featuresToRules(activeService, 'Renhållningsrestriktion', 'error'),
      ],
    };
  }

  // 3. Servicedag within 2h (upcoming warning)
  const upcomingService = (servicedagar?.features ?? []).filter(f => {
    const keys = Object.keys(f.properties).map(k => k.toUpperCase());
    const timeFromKey = keys.find(k => k.includes('TID_FR') || k.includes('KLOCKSLAG_FR'));
    const getProp = (upperKey: string | undefined) => {
      if (!upperKey) return undefined;
      const origKey = Object.keys(f.properties).find(k => k.toUpperCase() === upperKey);
      return origKey ? f.properties[origKey] : undefined;
    };
    const tFrom = parseTime(getProp(timeFromKey));
    if (tFrom === null) return false;
    const nowMin = now.getHours() * 60 + now.getMinutes();
    return tFrom > nowMin && tFrom - nowMin <= 120;
  });

  // 4. Evaluate ptillaten (allowed parking conditions)
  const ptFeatures = ptillaten?.features ?? [];

  if (ptFeatures.length === 0 && servicedagar?.features?.length === 0) {
    // No data at all = unknown
    return {
      status: 'unknown', source: 'live',
      rules: [
        { text: 'Ingen parkeringsdata', type: 'info', detail: 'Inga regler hittades inom 80m' },
        { text: 'Kontrollera skyltar', type: 'warning', detail: 'Fysiska skyltar gäller alltid' },
      ],
    };
  }

  // Check if any active time restriction on allowed parking
  const activeRestrictions = ptFeatures.filter(f => isTimeInWindow(f.properties, now));
  const rules: ParkingRule[] = [];

  if (upcomingService.length > 0) {
    rules.push({ text: 'Servicedag snart', type: 'warning', detail: 'Parkering förbjuds inom 2h' });
  }

  if (activeRestrictions.length > 0) {
    // Restrictions active = time-limited or specific conditions
    const exampleProps = activeRestrictions[0].properties;
    const keys = Object.keys(exampleProps);
    const timeInfo = keys
      .filter(k => /TID|KLOCKSLAG|TIME/i.test(k))
      .map(k => `${k.replace(/^.*_/,'')}: ${exampleProps[k]}`)
      .slice(0, 2)
      .join(' · ');

    rules.push({ text: 'Parkeringsrestriktion aktiv', type: 'warning', detail: timeInfo || 'Se skylt' });
    rules.push(...featuresToRules(activeRestrictions.slice(0, 2), 'Tillåten parkering med villkor', 'warning'));
    return {
      status: 'timelimited', source: 'live', zone: 'Tidsbegränsad',
      rules,
    };
  }

  // Allowed parking features exist but not active right now
  if (ptFeatures.length > 0) {
    rules.push({ text: 'Parkering tillåten nu', type: 'ok', detail: `${ptFeatures.length} zon(er) inom 80m` });
    rules.push(...featuresToRules(ptFeatures.slice(0, 2), 'Parkeringsvillkor', 'info'));
    return {
      status: 'legal', source: 'live', zone: 'Fri parkering',
      rules,
    };
  }

  return {
    status: 'legal', source: 'live', zone: 'Ingen restriktion funnen',
    rules: [
      { text: 'Inga aktiva restriktioner', type: 'ok', detail: 'Inom 80m av din position' },
      { text: 'Kontrollera alltid skyltar', type: 'info', detail: 'Fysiska skyltar är alltid gällande' },
    ],
  };
}

// ─── Mock Evaluation ──────────────────────────────────────────────────────────

function evaluateMock(pos: GpsPosition, now: Date): ParkingEvaluation {
  const hour = now.getHours();
  const day = now.getDay();
  const date = now.getDate();
  const isWeekday = day >= 1 && day <= 5;
  const isWorkHours = hour >= 8 && hour < 18;
  const isEvenDate = date % 2 === 0;
  const seed = Math.abs(Math.sin(pos.lat * 1000 + pos.lng * 1000));

  if (seed > 0.85) {
    return {
      status: 'restricted', source: 'mock', zone: 'Lastzon',
      rules: [
        { text: 'Lastzon Mån-Fre 07-19', type: 'error', detail: 'Förbjudet att parkera nu' },
        { text: 'Gäller hela dygnet helger', type: 'info', detail: 'Lördag-söndag 00-24' },
      ],
    };
  }
  if (seed > 0.65) {
    return {
      status: isWeekday && isWorkHours ? 'timelimited' : 'legal',
      source: 'mock', zone: 'P Max 2h',
      until: isWeekday && isWorkHours ? '18:00' : 'Obegränsad',
      rules: [
        { text: 'Max 2h Mån-Fre 08-18', type: isWeekday && isWorkHours ? 'warning' : 'ok', detail: isWeekday && isWorkHours ? 'Tidsbegränsning aktiv' : 'Ingen begränsning nu' },
        { text: `Avgiftsplikt: ${isWeekday && isWorkHours ? 'Ja' : 'Nej'}`, type: isWeekday && isWorkHours ? 'warning' : 'ok', detail: isWeekday && isWorkHours ? 'Betala i automat' : 'Gratis' },
        { text: `Datumpark: ${isEvenDate ? 'Jämna' : 'Udda'} sidan`, type: 'info', detail: `Idag den ${date}:e` },
      ],
    };
  }
  return {
    status: 'legal', source: 'mock', zone: 'P1',
    until: isWeekday ? '18:00' : 'Obegränsad',
    rules: [
      { text: 'P1 Mån-Fre 08-18', type: 'ok', detail: isWeekday && isWorkHours ? 'Tillåten nu' : 'Utanför restriktion' },
      { text: `Datumpark: ${isEvenDate ? 'Jämna' : 'Udda'} sidan`, type: isEvenDate ? 'ok' : 'warning', detail: `Den ${date}:e — ${isEvenDate ? 'JÄMN ✓' : 'UDDA'}` },
      { text: 'Avstånd korsning: OK', type: 'ok', detail: 'Mer än 8m från närmaste korsning' },
    ],
  };
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CFG = {
  legal:       { color: '#22C55E', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.4)',   icon: '✓', label: 'LAGLIG PARKERING', glow: '0 0 24px rgba(34,197,94,0.25)'  },
  timelimited: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.4)', icon: '⏱', label: 'TIDSBEGRÄNSAD',     glow: '0 0 24px rgba(245,158,11,0.25)' },
  restricted:  { color: '#EF4444', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.4)',  icon: '✕', label: 'FÖRBJUDET',         glow: '0 0 24px rgba(239,68,68,0.25)'  },
  unknown:     { color: '#6B7280', bg: 'rgba(107,114,128,0.08)',border: 'rgba(107,114,128,0.4)',icon: '?', label: 'OKÄND DATA',        glow: 'none'                            },
  loading:     { color: '#3B82F6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.4)', icon: '◌', label: 'LOKALISERAR…',     glow: '0 0 24px rgba(59,130,246,0.25)' },
};

const ZONE_COLORS: Record<string, { stroke: string; fill: string }> = {
  ptillaten:       { stroke: '#22C55E', fill: 'rgba(34,197,94,0.12)'   },
  servicedagar:    { stroke: '#EF4444', fill: 'rgba(239,68,68,0.12)'   },
  pbuss:           { stroke: '#8B5CF6', fill: 'rgba(139,92,246,0.12)'  },
  plastbil:        { stroke: '#F97316', fill: 'rgba(249,115,22,0.12)'  },
  prorelsehindrad: { stroke: '#3B82F6', fill: 'rgba(59,130,246,0.12)'  },
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ParkingDashboard() {
  const mapRef            = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const googleMapRef      = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userMarkerRef     = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const accuracyCircleRef = useRef<any>(null);
  const watchIdRef        = useRef<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataLayersRef     = useRef<any[]>([]);

  const [gps,           setGps]           = useState<GpsPosition | null>(null);
  const [gpsError,      setGpsError]      = useState<string | null>(null);
  const [evaluation,    setEvaluation]    = useState<ParkingEvaluation>({ status: 'loading', rules: [], source: 'mock' });
  const [mapLoaded,     setMapLoaded]     = useState(false);
  const [dataMode,      setDataMode]      = useState<DataMode>('live');
  const [liveLoading,   setLiveLoading]   = useState(false);
  const [liveError,     setLiveError]     = useState<string | null>(null);
  const [time,          setTime]          = useState(new Date());
  const [sidebarOpen,   setSidebarOpen]   = useState(true);
  const [rawData,       setRawData]       = useState<unknown>(null);
  const [showRaw,       setShowRaw]       = useState(false);

  const DAY_NAMES   = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'];
  const MONTH_NAMES = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  const pad = (n: number) => String(n).padStart(2, '0');

  // ── Clock ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  // ── Clear map data layers ─────────────────────────────────────────────────
  const clearDataLayers = useCallback(() => {
    if (!googleMapRef.current) return;
    dataLayersRef.current.forEach(layer => {
      layer.forEach((f: unknown) => googleMapRef.current.data.remove(f));
    });
    dataLayersRef.current = [];
  }, []);

  // ── Add GeoJSON overlays from live API data ───────────────────────────────
  const addLiveOverlays = useCallback((data: Awaited<ReturnType<typeof fetchAllLiveData>>) => {
    if (!googleMapRef.current) return;
    clearDataLayers();

    const map = googleMapRef.current;

    Object.entries(data).forEach(([key, response]) => {
      if (!response?.features?.length) return;
      const col = ZONE_COLORS[key] ?? { stroke: '#7D8590', fill: 'rgba(125,133,144,0.1)' };

      try {
        const added = map.data.addGeoJson({
          type: 'FeatureCollection',
          features: response.features,
        });
        added.forEach((f: unknown) => {
          map.data.overrideStyle(f, {
            strokeColor: col.stroke,
            strokeWeight: 2.5,
            strokeOpacity: 0.9,
            fillColor: col.fill.replace('rgba(', '').split(',').slice(0, 3).join(','),
            fillOpacity: 0.15,
            zIndex: 1,
          });
        });
        dataLayersRef.current.push(added);
      } catch {
        // Feature may not be renderable (e.g. Point geometry)
      }
    });
  }, [clearDataLayers]);

  // ── Evaluate position ─────────────────────────────────────────────────────
  const evaluate = useCallback(async (pos: GpsPosition, now: Date, mode: DataMode) => {
    if (mode === 'mock') {
      setEvaluation(evaluateMock(pos, now));
      clearDataLayers();
      return;
    }

    // Live mode
    setLiveLoading(true);
    setLiveError(null);
    try {
      const data = await fetchAllLiveData(pos);
      setRawData(data);
      addLiveOverlays(data);
      setEvaluation(evaluateLiveData(data, now));
    } catch (err) {
      setLiveError('Kunde inte nå Stockholms API');
      setEvaluation(evaluateMock(pos, now)); // Fallback to mock
    } finally {
      setLiveLoading(false);
    }
  }, [clearDataLayers, addLiveOverlays]);

  // ── Load Google Maps ──────────────────────────────────────────────────────
  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current) return;
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 59.3293, lng: 18.0686 },
        zoom: 18,
        styles: DARK_MAP_STYLE,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: { position: window.google.maps.ControlPosition.LEFT_BOTTOM },
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        clickableIcons: false,
        backgroundColor: '#0d1117',
      });
      googleMapRef.current = map;
      setMapLoaded(true);
    };

    if (window.google?.maps) { initMap(); return; }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.onload = initMap;
    script.onerror = () => console.error('Google Maps failed to load');
    document.head.appendChild(script);

    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  // ── GPS Watch ─────────────────────────────────────────────────────────────
  const startGpsWatch = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError('GPS stöds inte i denna webbläsare');
      setEvaluation({ status: 'unknown', source: 'mock', rules: [{ text: 'GPS ej tillgänglig', type: 'error', detail: 'Aktivera platsbehörighet' }] });
      return;
    }
    if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    setEvaluation({ status: 'loading', source: 'mock', rules: [] });

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const pos: GpsPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setGps(pos);
        setGpsError(null);

        evaluate(pos, new Date(), dataMode);

        if (googleMapRef.current) {
          googleMapRef.current.panTo({ lat: pos.lat, lng: pos.lng });

          if (userMarkerRef.current) {
            userMarkerRef.current.setPosition({ lat: pos.lat, lng: pos.lng });
          } else {
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="rgba(59,130,246,0.15)"/>
              <circle cx="24" cy="24" r="10" fill="#3B82F6"/>
              <circle cx="24" cy="24" r="6" fill="#FFFFFF"/>
              <circle cx="24" cy="24" r="3" fill="#3B82F6"/>
            </svg>`;
            userMarkerRef.current = new window.google.maps.Marker({
              position: { lat: pos.lat, lng: pos.lng },
              map: googleMapRef.current,
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
                scaledSize: new window.google.maps.Size(48, 48),
                anchor: new window.google.maps.Point(24, 24),
              },
              title: 'Din position',
              zIndex: 1000,
            });
          }

          if (accuracyCircleRef.current) {
            accuracyCircleRef.current.setCenter({ lat: pos.lat, lng: pos.lng });
            accuracyCircleRef.current.setRadius(pos.accuracy);
          } else {
            accuracyCircleRef.current = new window.google.maps.Circle({
              map: googleMapRef.current,
              center: { lat: pos.lat, lng: pos.lng },
              radius: pos.accuracy,
              fillColor: '#3B82F6',
              fillOpacity: 0.08,
              strokeColor: '#3B82F6',
              strokeOpacity: 0.4,
              strokeWeight: 1.5,
            });
          }
        }
      },
      (error) => {
        const messages: Record<number, string> = {
          1: 'Platsbehörighet nekad — tillåt GPS',
          2: 'Position ej tillgänglig',
          3: 'GPS-timeout — försök igen',
        };
        setGpsError(messages[error.code] ?? 'GPS-fel');
        setEvaluation({ status: 'unknown', source: 'mock', rules: [{ text: messages[error.code] ?? 'GPS-fel', type: 'error', detail: 'Kontrollera platsbehörighet' }] });
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );
  }, [evaluate, dataMode]);

  // Auto-start GPS after map loads
  useEffect(() => {
    if (mapLoaded) startGpsWatch();
  }, [mapLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-evaluate when clock ticks (rules change with time)
  useEffect(() => {
    if (gps) evaluate(gps, time, dataMode);
  }, [time]); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-evaluate when data mode changes
  useEffect(() => {
    if (gps) evaluate(gps, time, dataMode);
  }, [dataMode]); // eslint-disable-line react-hooks/exhaustive-deps

  const cfg = STATUS_CFG[evaluation.status];
  const isEvenDay = time.getDate() % 2 === 0;
  const next7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(time);
    d.setDate(time.getDate() + i);
    return d;
  });

  return (
    <div style={{
      height: '100dvh', background: '#0D1117', display: 'flex', flexDirection: 'column',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#E6EDF3', overflow: 'hidden',
    }}>

      {/* ── Top Nav ── */}
      <nav style={{
        background: '#161B22', borderBottom: '1px solid #21262D', padding: '0 0.75rem',
        height: 52, display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0, zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
          <div style={{
            width: 30, height: 30, background: 'linear-gradient(135deg,#3B82F6,#2563EB)',
            borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 800, color: '#fff',
          }}>P</div>
          <span style={{ fontWeight: 700, fontSize: 15 }}>ParkSmart</span>
        </div>

        <div style={{ width: 1, height: 24, background: '#21262D' }} />

        <select style={{
          background: '#21262D', border: '1px solid #30363D', borderRadius: 6,
          color: '#E6EDF3', padding: '4px 8px', fontSize: 12, cursor: 'pointer', flexShrink: 0,
        }}>
          <option>Stockholm</option>
          <option>Göteborg</option>
          <option>Malmö</option>
        </select>

        <div style={{ flex: 1 }} />

        {/* ── Data Mode Toggle ── */}
        <div style={{
          display: 'flex', alignItems: 'center',
          background: '#0D1117', border: '1px solid #21262D', borderRadius: 8,
          padding: 3, gap: 3, flexShrink: 0,
        }}>
          <button
            onClick={() => setDataMode('live')}
            style={{
              padding: '4px 10px', borderRadius: 5, fontSize: 11, fontWeight: 700,
              border: 'none', cursor: 'pointer', letterSpacing: '0.05em',
              background: dataMode === 'live' ? '#22C55E' : 'transparent',
              color: dataMode === 'live' ? '#000' : '#4B5563',
              transition: 'all 0.15s ease',
            }}
          >
            ● LIVE
          </button>
          <button
            onClick={() => setDataMode('mock')}
            style={{
              padding: '4px 10px', borderRadius: 5, fontSize: 11, fontWeight: 700,
              border: 'none', cursor: 'pointer', letterSpacing: '0.05em',
              background: dataMode === 'mock' ? '#F59E0B' : 'transparent',
              color: dataMode === 'mock' ? '#000' : '#4B5563',
              transition: 'all 0.15s ease',
            }}
          >
            DEMO
          </button>
        </div>

        {/* GPS badge */}
        {gps && (
          <div style={{
            fontSize: 11, background: 'rgba(34,197,94,0.1)', color: '#22C55E',
            border: '1px solid rgba(34,197,94,0.2)', borderRadius: 4,
            padding: '2px 7px', fontFamily: 'monospace', flexShrink: 0,
          }}>
            ● GPS ±{Math.round(gps.accuracy)}m
          </div>
        )}
        {gpsError && (
          <div style={{
            fontSize: 11, background: 'rgba(239,68,68,0.1)', color: '#EF4444',
            border: '1px solid rgba(239,68,68,0.2)', borderRadius: 4, padding: '2px 7px', flexShrink: 0,
          }}>
            ⚠ GPS
          </div>
        )}
        {liveLoading && (
          <div style={{ fontSize: 11, color: '#3B82F6', flexShrink: 0, fontFamily: 'monospace' }}>
            ↻ hämtar…
          </div>
        )}

        {/* Clock */}
        <div style={{
          background: '#21262D', border: '1px solid #30363D', borderRadius: 6,
          padding: '4px 8px', fontSize: 12, fontFamily: 'monospace', color: '#7D8590', flexShrink: 0,
        }}>
          {pad(time.getHours())}:{pad(time.getMinutes())}
        </div>

        <button
          onClick={() => setSidebarOpen(o => !o)}
          style={{
            background: '#21262D', border: '1px solid #30363D', borderRadius: 6,
            color: '#7D8590', width: 32, height: 32, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0,
          }}
        >
          {sidebarOpen ? '›' : '‹'}
        </button>
      </nav>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

        {/* ── Map ── */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

          {/* Loading overlay */}
          {!mapLoaded && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', background: '#0D1117', gap: 12,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                border: '3px solid #21262D', borderTopColor: '#3B82F6',
                animation: 'spin 0.8s linear infinite',
              }} />
              <span style={{ color: '#7D8590', fontSize: 14 }}>Laddar karta…</span>
            </div>
          )}

          {/* Mode banner on map */}
          {dataMode === 'mock' && (
            <div style={{
              position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(245,158,11,0.9)', borderRadius: 6, padding: '4px 12px',
              fontSize: 11, fontWeight: 700, color: '#000', zIndex: 5, whiteSpace: 'nowrap',
              backdropFilter: 'blur(4px)',
            }}>
              ⚠ DEMOLÄGE — simulerad data
            </div>
          )}
          {dataMode === 'live' && liveError && (
            <div style={{
              position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(239,68,68,0.9)', borderRadius: 6, padding: '4px 12px',
              fontSize: 11, fontWeight: 700, color: '#fff', zIndex: 5, whiteSpace: 'nowrap',
            }}>
              ⚠ {liveError} — visar demodata
            </div>
          )}

          {/* Legend for live layers */}
          {dataMode === 'live' && mapLoaded && (
            <div style={{
              position: 'absolute', bottom: 40, left: 52,
              background: 'rgba(22,27,34,0.92)', border: '1px solid #21262D',
              borderRadius: 8, padding: '8px 10px',
              display: 'flex', flexDirection: 'column', gap: 4, zIndex: 5,
              backdropFilter: 'blur(4px)',
            }}>
              {Object.entries(ZONE_COLORS).map(([key, col]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 16, height: 3, background: col.stroke, borderRadius: 2 }} />
                  <span style={{ fontSize: 10, color: '#7D8590', fontFamily: 'monospace' }}>{key}</span>
                </div>
              ))}
            </div>
          )}

          {/* Locate button */}
          <button
            onClick={startGpsWatch}
            style={{
              position: 'absolute', bottom: 80, left: 12,
              background: '#161B22', border: '1px solid #21262D', borderRadius: 8,
              width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.5)', zIndex: 5,
            }}
            title="Centrera på min position"
          >
            📍
          </button>

          {/* Attribution */}
          <div style={{
            position: 'absolute', bottom: 12, right: 12,
            fontSize: 10, color: '#21262D',
          }}>
            {dataMode === 'live' ? '© ParkSmart · Data: Stockholms Stad · CC0' : '© ParkSmart · Demo'}
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div style={{
          width: sidebarOpen ? 300 : 0, background: '#161B22',
          borderLeft: sidebarOpen ? '1px solid #21262D' : 'none',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          flexShrink: 0, transition: 'width 0.25s ease',
        }}>
          {sidebarOpen && (
            <div style={{ flex: 1, overflowY: 'auto', width: 300 }}>

              {/* ── Status Card ── */}
              <div style={{
                margin: '0.75rem', padding: '1.1rem',
                background: cfg.bg, border: `2px solid ${cfg.border}`,
                borderRadius: 12, textAlign: 'center', boxShadow: cfg.glow,
                transition: 'all 0.4s ease', position: 'relative',
              }}>
                {/* Source badge */}
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
                  padding: '2px 6px', borderRadius: 4,
                  background: evaluation.source === 'live' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                  color: evaluation.source === 'live' ? '#22C55E' : '#F59E0B',
                  border: `1px solid ${evaluation.source === 'live' ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.3)'}`,
                }}>
                  {evaluation.source === 'live' ? '● LIVE' : '⚠ DEMO'}
                </div>

                <div style={{
                  fontSize: 44, lineHeight: 1, color: cfg.color, fontWeight: 700,
                  animation: evaluation.status === 'loading' ? 'pulse 1.2s ease-in-out infinite' : 'none',
                }}>
                  {cfg.icon}
                </div>
                <div style={{ color: cfg.color, fontWeight: 700, fontSize: 15, letterSpacing: '0.08em', marginTop: 8 }}>
                  {cfg.label}
                </div>
                {evaluation.zone && (
                  <div style={{ color: '#7D8590', fontSize: 12, marginTop: 4 }}>{evaluation.zone}</div>
                )}
                {evaluation.until && (
                  <div style={{
                    color: '#E6EDF3', fontSize: 12, marginTop: 8,
                    background: '#21262D', borderRadius: 6, padding: '4px 10px',
                    display: 'inline-block', fontFamily: 'monospace',
                  }}>
                    Till {evaluation.until}
                  </div>
                )}
                {gps && (
                  <div style={{ color: '#4B5563', fontSize: 10, marginTop: 8, fontFamily: 'monospace' }}>
                    {gps.lat.toFixed(5)}, {gps.lng.toFixed(5)}
                  </div>
                )}
              </div>

              <div style={{ height: 1, background: '#21262D', margin: '0 0.75rem 0.75rem' }} />

              {/* ── Active Rules ── */}
              <div style={{ padding: '0 0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#7D8590', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Aktiva regler
                  </div>
                  {dataMode === 'live' && rawData && (
                    <button
                      onClick={() => setShowRaw(s => !s)}
                      style={{
                        background: 'transparent', border: '1px solid #21262D', borderRadius: 4,
                        color: '#4B5563', fontSize: 10, padding: '2px 6px', cursor: 'pointer',
                      }}
                    >
                      {showRaw ? 'dölj' : 'rådata'}
                    </button>
                  )}
                </div>

                {showRaw && rawData ? (
                  <pre style={{
                    background: '#0D1117', border: '1px solid #21262D', borderRadius: 6,
                    padding: 8, fontSize: 9, color: '#7D8590', overflow: 'auto',
                    maxHeight: 200, fontFamily: 'monospace',
                  }}>
                    {JSON.stringify(rawData, null, 2).slice(0, 2000)}
                  </pre>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {liveLoading && (
                      <div style={{ color: '#3B82F6', fontSize: 12, padding: '8px 0', fontFamily: 'monospace' }}>
                        ↻ Hämtar Stockholms data…
                      </div>
                    )}
                    {!liveLoading && evaluation.rules.length === 0 && (
                      <div style={{ color: '#4B5563', fontSize: 12, padding: '8px 0' }}>Lokaliserar position…</div>
                    )}
                    {evaluation.rules.map((rule, i) => {
                      const dot: Record<string, string> = { ok: '#22C55E', warning: '#F59E0B', error: '#EF4444', info: '#3B82F6' };
                      return (
                        <div key={i} style={{
                          background: '#1C2230', borderRadius: 7, padding: '7px 10px',
                          display: 'flex', alignItems: 'flex-start', gap: 8,
                        }}>
                          <div style={{ width: 7, height: 7, borderRadius: '50%', background: dot[rule.type], marginTop: 4, flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: 12, color: '#E6EDF3', fontFamily: 'monospace' }}>{rule.text}</div>
                            <div style={{ fontSize: 10, color: '#7D8590', marginTop: 2 }}>{rule.detail}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div style={{ height: 1, background: '#21262D', margin: '0 0.75rem 0.75rem' }} />

              {/* ── Datumparkering ── */}
              <div style={{ padding: '0 0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#7D8590', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Datumparkering
                </div>
                <div style={{ background: '#1C2230', border: '1px solid #21262D', borderRadius: 8, padding: '0.65rem' }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: isEvenDay ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)',
                    borderRadius: 6, padding: '6px 10px', marginBottom: 8,
                    border: `1px solid ${isEvenDay ? 'rgba(34,197,94,0.2)' : 'rgba(59,130,246,0.2)'}`,
                  }}>
                    <div>
                      <div style={{ fontSize: 10, color: '#7D8590' }}>Idag</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#E6EDF3', fontFamily: 'monospace' }}>
                        {DAY_NAMES[time.getDay()]} {time.getDate()} {MONTH_NAMES[time.getMonth()]}
                      </div>
                    </div>
                    <div style={{
                      fontSize: 12, fontWeight: 700,
                      color: isEvenDay ? '#22C55E' : '#3B82F6',
                      background: isEvenDay ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.15)',
                      borderRadius: 5, padding: '3px 8px',
                    }}>
                      {isEvenDay ? 'JÄMNA' : 'UDDA'}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
                    {next7.map((d, i) => {
                      const even = d.getDate() % 2 === 0;
                      const isToday = i === 0;
                      return (
                        <div key={i} style={{
                          textAlign: 'center', borderRadius: 4, padding: '3px 1px',
                          background: isToday ? (even ? 'rgba(34,197,94,0.2)' : 'rgba(59,130,246,0.2)') : 'transparent',
                          border: isToday ? `1px solid ${even ? '#22C55E' : '#3B82F6'}` : '1px solid transparent',
                        }}>
                          <div style={{ fontSize: 8, color: '#4B5563', fontFamily: 'monospace' }}>
                            {['S','M','T','O','T','F','L'][d.getDay()]}
                          </div>
                          <div style={{ fontSize: 11, color: even ? '#22C55E' : '#3B82F6', fontFamily: 'monospace', fontWeight: 600 }}>
                            {d.getDate()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div style={{ height: 1, background: '#21262D', margin: '0 0.75rem 0.75rem' }} />

              {/* ── Legend ── */}
              <div style={{ padding: '0 0.75rem 1rem' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#7D8590', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Kartlager (live)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {Object.entries(ZONE_COLORS).map(([key, col]) => (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 20, height: 3, background: col.stroke, borderRadius: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: '#7D8590', fontFamily: 'monospace' }}>{key}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile status bar (sidebar closed) ── */}
      {!sidebarOpen && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: '#161B22', borderTop: `2px solid ${cfg.border}`,
          padding: '10px 1rem', display: 'flex', alignItems: 'center', gap: 12,
          zIndex: 20, boxShadow: cfg.glow,
        }}>
          <div style={{ fontSize: 24, color: cfg.color }}>{cfg.icon}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: cfg.color }}>{cfg.label}</div>
            {evaluation.zone && <div style={{ fontSize: 11, color: '#7D8590' }}>{evaluation.zone}</div>}
          </div>
          <div style={{
            marginLeft: 'auto', fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
            padding: '2px 6px', borderRadius: 4,
            background: evaluation.source === 'live' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
            color: evaluation.source === 'live' ? '#22C55E' : '#F59E0B',
          }}>
            {evaluation.source === 'live' ? '● LIVE' : '⚠ DEMO'}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  );
}
