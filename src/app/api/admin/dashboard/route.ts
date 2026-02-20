import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - Admin dashboard overview stats
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch real counts
    const [totalUsers, totalStudents, totalParents, totalInstructors, totalEnrollments, activeEnrollments, payments, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'student' } }),
      prisma.user.count({ where: { role: 'parent' } }),
      prisma.user.count({ where: { role: 'instructor' } }),
      prisma.enrollment.count(),
      prisma.enrollment.count({ where: { status: 'active' } }),
      prisma.payment.findMany({
        select: { amount: true, status: true, paidAt: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    // Compute revenue
    const paidPayments = payments.filter(p => p.status === 'paid');
    const totalRevenue = paidPayments.reduce((sum, p) => sum + p.amount, 0);
    const pendingPayments = payments.filter(p => p.status === 'pending').length;

    // Format revenue
    const revenueDisplay = totalRevenue >= 1000000
      ? `${(totalRevenue / 1000000).toFixed(1)}M`
      : totalRevenue >= 1000
        ? `${(totalRevenue / 1000).toFixed(0)}K`
        : String(totalRevenue);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalStudents,
        totalParents,
        totalInstructors,
        totalEnrollments,
        activeEnrollments,
        totalRevenue,
        revenueDisplay,
        pendingPayments,
      },
      recentUsers: recentUsers.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        joinedAt: u.createdAt.toISOString(),
      })),
      recentPayments: payments.slice(0, 10).map(p => ({
        amount: p.amount,
        status: p.status,
        date: (p.paidAt || p.createdAt).toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: 500 });
  }
}
