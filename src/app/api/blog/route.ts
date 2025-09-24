import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/blog';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'ko';
    
    const posts = await getAllPosts(locale);
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Blog API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}