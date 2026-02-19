import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST - Add a comment to a post (requires auth)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'You must be signed in to comment' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await req.json();
    const { postId, content } = body;

    if (!postId || !content) {
      return NextResponse.json({ error: 'postId and content are required' }, { status: 400 });
    }

    // Verify post exists
    const post = await prisma.communityPost.findUnique({ where: { id: postId } });
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    const comment = await prisma.communityComment.create({
      data: {
        postId,
        userId: user.id,
        content: content.trim(),
      },
      include: {
        user: { select: { id: true, name: true, role: true, image: true } },
        likes: { select: { userId: true } },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

// DELETE - Delete a comment (author or admin)
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });

    const existing = await prisma.communityComment.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    if (existing.userId !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    await prisma.communityComment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
