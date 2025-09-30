import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    const imagePath = path.join('/app', 'data', 'uploads', ...pathSegments);
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      return new NextResponse('Image not found', { status: 404 });
    }
    
    // Read the file
    const fileBuffer = fs.readFileSync(imagePath);
    
    // Determine content type based on file extension
    const ext = path.extname(imagePath).toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case '.webp':
        contentType = 'image/webp';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
    }
    
    // Return the image with appropriate headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
