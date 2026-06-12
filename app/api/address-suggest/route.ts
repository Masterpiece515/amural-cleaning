import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  if (q.trim().length < 2) return NextResponse.json([]);

  try {
    const text = encodeURIComponent(`Чита, ${q}`);
    const url = `https://suggest-maps.yandex.ru/suggest-geo?text=${text}&lang=ru_RU&v=9&results=7&search_type=tp&ull=113.499432,52.034158`;

    const res = await fetch(url, {
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) return NextResponse.json([]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await res.json();

    const suggestions: string[] = (data.results ?? [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((r: any) => {
        const title = r.title?.text ?? "";
        const sub = r.subtitle?.text ?? "";
        if (sub && !title.toLowerCase().includes("чита")) {
          return `${title}, ${sub}`;
        }
        return title;
      })
      .filter(Boolean)
      .slice(0, 6);

    return NextResponse.json(suggestions);
  } catch {
    return NextResponse.json([]);
  }
}
