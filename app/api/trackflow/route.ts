const TRACKFLOW_ENDPOINT = 'https://app.upnexa.com.br/api/public/track';
const TRACKFLOW_PUBLIC_ID = 'tf_Bzm6TqPn820c1sG_';
const ALLOWED_EVENTS = new Set(['pageview', 'view_content', 'begin_checkout']);
const MAX_BODY_BYTES = 32 * 1024;

async function readLimitedBody(request: Request): Promise<string> {
  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new Error('PAYLOAD_TOO_LARGE');
    }
    chunks.push(value);
  }

  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(body);
}

export async function POST(request: Request): Promise<Response> {
  try {
    const rawBody = await readLimitedBody(request);
    const event = JSON.parse(rawBody) as Record<string, unknown>;
    if (
      event.public_id !== TRACKFLOW_PUBLIC_ID ||
      typeof event.event_name !== 'string' ||
      !ALLOWED_EVENTS.has(event.event_name) ||
      typeof event.visitor_id !== 'string' ||
      !event.visitor_id ||
      typeof event.session_id !== 'string' ||
      !event.session_id
    ) {
      return Response.json({ ok: false, error: 'invalid_tracking_event' }, { status: 400 });
    }

    const upstream = await fetch(TRACKFLOW_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: rawBody,
      signal: AbortSignal.timeout(5000),
    });

    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        'content-type': upstream.headers.get('content-type') || 'application/json',
        'cache-control': 'no-store',
        'x-trackflow-proxy': 'upstream',
      },
    });
  } catch (error) {
    const status = error instanceof Error && error.message === 'PAYLOAD_TOO_LARGE' ? 413 : 502;
    return Response.json({ ok: false, error: status === 413 ? 'payload_too_large' : 'trackflow_unavailable' }, {
      status,
      headers: { 'cache-control': 'no-store' },
    });
  }
}
