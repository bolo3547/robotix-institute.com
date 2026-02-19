import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - List community posts (public)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: Record<string, unknown> = { published: true };
    if (category && category !== 'all') where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.communityPost.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, role: true, image: true } },
          comments: {
            include: {
              user: { select: { id: true, name: true, role: true, image: true } },
              likes: { select: { userId: true } },
            },
            orderBy: { createdAt: 'asc' },
          },
          likes: { select: { userId: true } },
          _count: { select: { comments: true, likes: true } },
        },
        orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.communityPost.count({ where }),
    ]);

    return NextResponse.json({ posts, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Error fetching community posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST - Create a new community post (requires auth)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'You must be signed in to create a post' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const { title, content, category, tags, image } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const post = await prisma.communityPost.create({
      data: {
        userId: user.id,
        title: title.trim(),
        content: content.trim(),
        category: category || 'general',
        tags: tags || null,
        image: image || null,
      },
      include: {
        user: { select: { id: true, name: true, role: true, image: true } },
        comments: true,
        likes: { select: { userId: true } },
        _count: { select: { comments: true, likes: true } },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating community post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

// PUT - Update a post (author or admin only)
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await req.json();
    const { id, title, content, category, tags, image, pinned, published } = body;

    if (!id) return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });

    // Check ownership or admin
    const existing = await prisma.communityPost.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    if (existing.userId !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Not authorized to edit this post' }, { status: 403 });
    }

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content.trim();
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags;
    if (image !== undefined) updateData.image = image;
    // Only admins can pin/unpublish
    if (user.role === 'admin') {
      if (pinned !== undefined) updateData.pinned = pinned;
      if (published !== undefined) updateData.published = published;
    }

    const updated = await prisma.communityPost.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, role: true, image: true } },
        _count: { select: { comments: true, likes: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating community post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE - Delete a post (author or admin only)
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });

    const existing = await prisma.communityPost.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    if (existing.userId !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Not authorized to delete this post' }, { status: 403 });
    }

    await prisma.communityPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting community post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
