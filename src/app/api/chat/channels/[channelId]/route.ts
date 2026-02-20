import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';

async function getUser(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.sub) return null;
  return { id: token.sub as string, name: token.name as string, role: token.role as string };
}

// GET /api/chat/channels/[channelId] — get channel details with members
export async function GET(
  request: NextRequest,
  { params }: { params: { channelId: string } }
) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const channel = await prisma.chatChannel.findUnique({
    where: { id: params.channelId },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, image: true, role: true } } },
      },
    },
  });

  if (!channel) {
    return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
  }

  // Check membership
  const isMember = channel.members.some((m) => m.userId === user.id);
  if (!isMember) {
    return NextResponse.json({ error: 'Not a member' }, { status: 403 });
  }

  return NextResponse.json({
    id: channel.id,
    name: channel.name,
    description: channel.description,
    type: channel.type,
    avatar: channel.avatar,
    isPrivate: channel.isPrivate,
    createdBy: channel.createdBy,
    members: channel.members.map((m) => ({
      id: m.userId,
      name: m.user.name,
      image: m.user.image,
      role: m.user.role,
      chatRole: m.role,
      joinedAt: m.joinedAt,
    })),
    createdAt: channel.createdAt,
  });
}

// PUT /api/chat/channels/[channelId] — add members or update channel
export async function PUT(
  request: NextRequest,
  { params }: { params: { channelId: string } }
) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();

  // Adding members
  if (body.addMembers && Array.isArray(body.addMembers)) {
    for (const uid of body.addMembers) {
      await prisma.chatMember.upsert({
        where: { channelId_userId: { channelId: params.channelId, userId: uid } },
        update: {},
        create: { channelId: params.channelId, userId: uid, role: 'member' },
      });
    }

    // System message
    const names = await prisma.user.findMany({
      where: { id: { in: body.addMembers } },
      select: { name: true },
    });
    await prisma.chatMessage.create({
      data: {
        channelId: params.channelId,
        senderId: user.id,
        content: `${user.name} added ${names.map((n) => n.name).join(', ')}`,
        type: 'system',
      },
    });

    return NextResponse.json({ success: true });
  }

  // Update channel name/description
  const update: Record<string, string | boolean> = {};
  if (body.name) update.name = body.name;
  if (body.description !== undefined) update.description = body.description;

  if (Object.keys(update).length > 0) {
    await prisma.chatChannel.update({
      where: { id: params.channelId },
      data: update,
    });
  }

  return NextResponse.json({ success: true });
}
