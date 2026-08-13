import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { blobs } = await list({ prefix: 'content.html', limit: 1 });
    if (!blobs || blobs.length === 0) {
      return NextResponse.json({ html: null });
    }
    const res = await fetch(blobs[0].url, { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json({ html: null });
    }
    const html = await res.text();
    return NextResponse.json({ html });
  } catch (err) {
    // No blob store configured yet, or nothing saved — fall back to defaults
    return NextResponse.json({ html: null });
  }
}
