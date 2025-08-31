import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminEmail = 'admin@crm.com';
  const adminPassword = await bcrypt.hash('admin123', 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create regular user
  const userEmail = 'user@crm.com';
  const userPassword = await bcrypt.hash('user123', 12);

  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      email: userEmail,
      password: userPassword,
      firstName: 'Regular',
      lastName: 'User',
      role: UserRole.USER,
    },
  });

  console.log('✅ Regular user created:', user.email);

  // Create some sample tickets
  const sampleTickets = [
    {
      title: 'Login Issues',
      description: 'Unable to login to the system with correct credentials',
      priority: 'HIGH' as const,
      creatorId: user.id,
    },
    {
      title: 'Feature Request: Dark Mode',
      description: 'Would like to have a dark mode option in the interface',
      priority: 'LOW' as const,
      creatorId: user.id,
    },
    {
      title: 'Bug: Data Export Not Working',
      description: 'When trying to export data to CSV, the file is corrupted',
      priority: 'MEDIUM' as const,
      creatorId: user.id,
      assigneeId: admin.id,
    },
  ];

  for (const ticketData of sampleTickets) {
    const ticket = await prisma.ticket.create({
      data: ticketData,
    });
    console.log('✅ Sample ticket created:', ticket.title);
  }

  console.log('🎉 Database seeding completed!');
  console.log('\n📋 Login credentials:');
  console.log('Admin: admin@crm.com / admin123');
  console.log('User: user@crm.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });