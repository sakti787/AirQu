// API endpoint to test OpenAQ connectivity
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Test the OpenAQ API directly
    const testUrl = 'https://api.openaq.org/v2/locations?limit=1&country=ID';
    
    const response = await fetch(testUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({
        status: 'error',
        message: `OpenAQ API returned ${response.status}: ${response.statusText}`,
        fallback: 'Using mock data'
      }, { status: 503 });
    }

    const data = await response.json();
    
    return NextResponse.json({
      status: 'success',
      message: 'OpenAQ API is accessible',
      resultCount: data.results?.length || 0,
      meta: data.meta
    });

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      fallback: 'Using mock data'
    }, { status: 503 });
  }
}