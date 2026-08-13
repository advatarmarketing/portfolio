import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function checkAuth(req) {
  const pw = req.headers.get('x-edit-password');
  return pw && process.env.EDIT_PASSWORD && pw === process.env.EDIT_PASSWORD;
}

export async function POST(req) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const html = typeof body.html === 'string' ? body.html : '';
  if (!html) {
    return NextResponse.json({ error: 'no content provided' }, { status: 400 });
  }

  try {
    const blob = await put('content.html', html, {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'text/html; charset=utf-8',
    });
    return NextResponse.json({ ok: true, url: blob.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'save failed';
    console.error('save error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
