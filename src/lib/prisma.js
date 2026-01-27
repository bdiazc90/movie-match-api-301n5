import { PrismaClient, $Enums } from '../generated/prisma/client.js'

const prisma = new PrismaClient();

// Adjuntar todos los enums al objeto prisma para facilitar imports
prisma.$enums = $Enums;

export default prisma;