"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seeding...');
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
            role: client_1.UserRole.ADMIN,
        },
    });
    console.log('✅ Admin user created:', admin.email);
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
            role: client_1.UserRole.USER,
        },
    });
    console.log('✅ Regular user created:', user.email);
    const sampleTickets = [
        {
            title: 'Login Issues',
            description: 'Unable to login to the system with correct credentials',
            priority: 'HIGH',
            creatorId: user.id,
        },
        {
            title: 'Feature Request: Dark Mode',
            description: 'Would like to have a dark mode option in the interface',
            priority: 'LOW',
            creatorId: user.id,
        },
        {
            title: 'Bug: Data Export Not Working',
            description: 'When trying to export data to CSV, the file is corrupted',
            priority: 'MEDIUM',
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
//# sourceMappingURL=seed.js.map