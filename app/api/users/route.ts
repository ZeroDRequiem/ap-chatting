import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * @openapi
 * /api/users:
 *   put:
 *     summary: Update user information
 *     description: Updates the user's information based on the passed in authToken in the cookie.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               screenName:
 *                 type: string
 *                 example: "JohnD"
 *               jobTitle:
 *                 type: string
 *                 example: "Developer"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "user-id"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     username:
 *                       type: string
 *                       example: "johndoe"
 *                     screenName:
 *                       type: string
 *                       example: "JohnD"
 *                     jobTitle:
 *                       type: string
 *                       example: "Developer"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 */

export async function PUT(request: Request) {
  const cookies = request.headers.get('cookie');
  const authToken = cookies?.split('; ').find(cookie => cookie.startsWith('authToken='))?.split('=')[1];

  if (!authToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(authToken, JWT_SECRET) as { sub: string };
    const userId = decoded.sub;

    const { firstName, lastName, username, screenName, jobTitle } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        username,
        screenName,
        jobTitle,
      },
    });

    return NextResponse.json({ message: 'User updated successfully', user: updatedUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid token or user not found' }, { status: 401 });
  }
}