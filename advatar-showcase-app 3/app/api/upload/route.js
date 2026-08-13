import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request) {
  const body = await request.json();

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        let password = '';
        try {
          password = clientPayload ? JSON.parse(clientPayload).password : '';
        } catch {
          password = '';
        }
        if (!password || !process.env.EDIT_PASSWORD || password !== process.env.EDIT_PASSWORD) {
          throw new Error('unauthorized');
        }
        return {
          allowedContentTypes: ['video/*', 'image/*'],
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // no server-side follow-up needed once the file lands in Blob storage
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'upload failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
