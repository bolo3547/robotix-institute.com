import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';

async function getUser(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.sub) return null;
  return { id: token.sub as string, name: token.name as string };
}

// GET /api/chat/channels/[channelId]/messages — get messages for a channel
export async function GET(
  request: NextRequest,
  { params }: { params: { channelId: string } }
) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { channelId } = params;

  // Verify membership
  const membership = await prisma.chatMember.findUnique({
    where: { channelId_userId: { channelId, userId: user.id } },
  });
  if (!membership) {
    return NextResponse.json({ error: 'Not a member of this channel' }, { status: 403 });
  }

  // Pagination
  const url = new URL(request.url);
  const cursor = url.searchParams.get('cursor');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);

  const messages = await prisma.chatMessage.findMany({
    where: { channelId, deleted: false },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: {
      sender: {
        select: { id: true, name: true, email: true, image: true, role: true },
      },
    },
  });

  const hasMore = messages.length > limit;
  if (hasMore) messages.pop();

  // Update last read timestamp
  await prisma.chatMember.update({
    where: { channelId_userId: { channelId, userId: user.id } },
    data: { lastReadAt: new Date() },
  });

  return NextResponse.json({
    messages: messages.reverse(), // chronological order
    hasMore,
    nextCursor: hasMore ? messages[0]?.id : null,
  });
}

// POST /api/chat/channels/[channelId]/messages — send a message
export async function POST(
  request: NextRequest,
  { params }: { params: { channelId: string } }
) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { channelId } = params;

  // Verify membership
  const membership = await prisma.chatMember.findUnique({
    where: { channelId_userId: { channelId, userId: user.id } },
  });
  if (!membership) {
    return NextResponse.json({ error: 'Not a member of this channel' }, { status: 403 });
  }

  const body = await request.json();
  const { content, type: msgType, fileUrl } = body;

  if (!content?.trim()) {
    return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
  }

  const message = await prisma.chatMessage.create({
    data: {
      channelId,
      senderId: user.id,
      content: content.trim(),
      type: msgType || 'text',
      fileUrl: fileUrl || null,
    },
    include: {
      sender: {
        select: { id: true, name: true, email: true, image: true, role: true },
      },
    },
  });

  // Touch channel updatedAt so it sorts to top
  await prisma.chatChannel.update({
    where: { id: channelId },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json(message, { status: 201 });
}
