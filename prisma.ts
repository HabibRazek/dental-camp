import { PrismaClient } from '@prisma/client';
type GlobalThisWithPrisma = typeof globalThis & {
    __prisma?: PrismaClient
}

const globalWithPrisma = globalThis as GlobalThisWithPrisma

const prisma = globalWithPrisma.__prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
    globalWithPrisma.__prisma = prisma
}

export default prisma