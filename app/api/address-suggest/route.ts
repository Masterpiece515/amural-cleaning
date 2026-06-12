import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  if (q.trim().length < 2) return NextResponse.json([]);

  try {
    const query = encodeURIComponent(`Чита ${q}`);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=7&countrycodes=ru&accept-language=ru&addressdetails=1&bounded=1&viewbox=113.1,52.4,114.1,51.7`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "amural-cleaning-app/1.0",
        "Accept-Language": "ru",
      },
      signal: AbortSignal.timeout(4000),
    });

    if (!res.ok) return NextResponse.json([]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any[] = await res.json();

    const seen = new Set<string>();
    const suggestions: string[] = [];

    for (const r of data) {
      const addr = r.address ?? {};
      const road = addr.road ?? addr.pedestrian ?? addr.path ?? "";
      const house = addr.house_number ?? "";
      if (!road) continue;

      const label = house ? `${road}, ${house}` : road;
      if (!seen.has(label)) {
        seen.add(label);
        suggestions.push(label);
      }
      if (suggestions.length >= 6) break;
    }

    return NextResponse.json(suggestions);
  } catch {
    return NextResponse.json([]);
  }
}
