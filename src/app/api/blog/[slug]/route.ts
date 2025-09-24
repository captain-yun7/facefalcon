import { NextRequest, NextResponse } from 'next/server';
import { getPostBySlug, getRelatedPosts } from '@/lib/blog';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'ko';
    
    const post = await getPostBySlug(params.slug, locale);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    const relatedPosts = await getRelatedPosts(post.slug, post.category, locale);
    
    return NextResponse.json({
      post,
      relatedPosts
    });
  } catch (error) {
    console.error('Blog post API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}