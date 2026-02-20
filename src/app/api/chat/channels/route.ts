import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';

async function getUser(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.sub) return null;
  return { id: token.sub as string, name: token.name as string, role: token.role as string };
}

// GET /api/chat/channels — list channels the current user belongs to
export async function GET(request: NextRequest) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const memberships = await prisma.chatMember.findMany({
    where: { userId: user.id },
    include: {
      channel: {
        include: {
          members: {
            include: { user: { select: { id: true, name: true, image: true, role: true } } },
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: { sender: { select: { id: true, name: true } } },
          },
        },
      },
    },
    orderBy: { channel: { updatedAt: 'desc' } },
  });

  const channels = memberships.map((m) => {
    const ch = m.channel;
    const lastMessage = ch.messages[0] || null;
    const unreadCount = 0; // We'll compute this client-side or later
    return {
      id: ch.id,
      name: ch.type === 'direct'
        ? ch.members.find((mem) => mem.userId !== user.id)?.user.name || ch.name
        : ch.name,
      description: ch.description,
      type: ch.type,
      avatar: ch.avatar,
      isPrivate: ch.isPrivate,
      archived: ch.archived,
      members: ch.members.map((mem) => ({
        id: mem.userId,
        name: mem.user.name,
        image: mem.user.image,
        role: mem.user.role,
        chatRole: mem.role,
      })),
      memberCount: ch.members.length,
      lastMessage: lastMessage
        ? {
            content: lastMessage.content,
            senderName: lastMessage.sender.name,
            createdAt: lastMessage.createdAt,
          }
        : null,
      myRole: m.role,
      muted: m.muted,
      lastReadAt: m.lastReadAt,
      createdAt: ch.createdAt,
    };
  });

  return NextResponse.json(channels);
}

// POST /api/chat/channels — create a channel or DM
export async function POST(request: NextRequest) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { name, description, type, memberIds, isPrivate } = body;

  // type: 'direct' | 'group' | 'team' | 'announcement'
  if (!type) {
    return NextResponse.json({ error: 'Channel type is required' }, { status: 400 });
  }

  // For DM, check if one already exists between these two users
  if (type === 'direct') {
    const targetId = memberIds?.[0];
    if (!targetId) {
      return NextResponse.json({ error: 'Target user ID required for DM' }, { status: 400 });
    }

    // Check existing DM
    const existingDM = await prisma.chatChannel.findFirst({
      where: {
        type: 'direct',
        AND: [
          { members: { some: { userId: user.id } } },
          { members: { some: { userId: targetId } } },
        ],
      },
      include: { members: { include: { user: { select: { id: true, name: true } } } } },
    });

    if (existingDM) {
      return NextResponse.json({ id: existingDM.id, existing: true });
    }

    // Get target user name for the channel label
    const targetUser = await prisma.user.findUnique({
      where: { id: targetId },
      select: { name: true },
    });

    const channel = await prisma.chatChannel.create({
      data: {
        name: `${user.name} & ${targetUser?.name || 'User'}`,
        type: 'direct',
        createdBy: user.id,
        members: {
          create: [
            { userId: user.id, role: 'member' },
            { userId: targetId, role: 'member' },
          ],
        },
      },
    });

    return NextResponse.json({ id: channel.id, existing: false }, { status: 201 });
  }

  // Group / Team / Announcement channel
  if (!name) {
    return NextResponse.json({ error: 'Channel name is required' }, { status: 400 });
  }

  const allMemberIds = Array.from(new Set([user.id, ...(memberIds || [])]));

  const channel = await prisma.chatChannel.create({
    data: {
      name,
      description: description || null,
      type,
      createdBy: user.id,
      isPrivate: isPrivate || false,
      members: {
        create: allMemberIds.map((uid: string) => ({
          userId: uid,
          role: uid === user.id ? 'owner' : 'member',
        })),
      },
    },
  });

  // Add system message
  await prisma.chatMessage.create({
    data: {
      channelId: channel.id,
      senderId: user.id,
      content: `${user.name} created the channel "${name}"`,
      type: 'system',
    },
  });

  return NextResponse.json({ id: channel.id }, { status: 201 });
}
