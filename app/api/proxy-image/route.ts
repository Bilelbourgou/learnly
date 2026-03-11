import { NextResponse } from 'next/server';
import { head } from '@vercel/blob';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // We use head() to verify the blob exists and get its metadata
    // This also uses the BLOB_READ_WRITE_TOKEN from env by default
    const blobDetails = await head(url);
    
    // Fetch the actual blob content
    // Since it's a private blob, we need to fetch it using the token
    // The @vercel/blob SDK doesn't have a direct "download" function that returns a stream for private blobs easily in a simple way,
    // but we can fetch it with the token in the header.
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch blob' }, { status: response.status });
    }

    // Stream the response back to the client
    const blob = await response.blob();
    return new NextResponse(blob, {
      headers: {
        'Content-Type': blobDetails.contentType || 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
