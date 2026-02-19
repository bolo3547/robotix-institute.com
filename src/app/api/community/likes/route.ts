import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// POST - Toggle like on a post (requires auth)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'You must be signed in to like a post' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await req.json();
    const { postId, commentId } = body;

    if (!postId && !commentId) {
      return NextResponse.json({ error: 'postId or commentId is required' }, { status: 400 });
    }

    // Like a post
    if (postId) {
      const existing = await prisma.communityPostLike.findUnique({
        where: { postId_userId: { postId, userId: user.id } },
      });

      if (existing) {
        // Unlike
        await prisma.communityPostLike.delete({ where: { id: existing.id } });
        const count = await prisma.communityPostLike.count({ where: { postId } });
        return NextResponse.json({ liked: false, count });
      } else {
        // Like
        await prisma.communityPostLike.create({ data: { postId, userId: user.id } });
        const count = await prisma.communityPostLike.count({ where: { postId } });
        return NextResponse.json({ liked: true, count });
      }
    }

    // Like a comment
    if (commentId) {
      const existing = await prisma.communityCommentLike.findUnique({
        where: { commentId_userId: { commentId, userId: user.id } },
      });

      if (existing) {
        await prisma.communityCommentLike.delete({ where: { id: existing.id } });
        const count = await prisma.communityCommentLike.count({ where: { commentId } });
        return NextResponse.json({ liked: false, count });
      } else {
        await prisma.communityCommentLike.create({ data: { commentId, userId: user.id } });
        const count = await prisma.communityCommentLike.count({ where: { commentId } });
        return NextResponse.json({ liked: true, count });
      }
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
  }
}
