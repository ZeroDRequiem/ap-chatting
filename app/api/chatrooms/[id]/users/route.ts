import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const secretKey = process.env.JWT_SECRET_KEY;

/**
 * @openapi
 * /api/chatrooms/{id}/users:
 *   get:
 *     summary: Get all users in the specified chatroom
 *     description: Retrieves all users that are members of the specified chatroom.
 *     tags:
 *       - Chatrooms
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "chatroom-id"
 *     responses:
 *       200:
 *         description: A list of users in the chatroom
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "user-id"
 *                   firstName:
 *                     type: string
 *                     example: "John"
 *                   lastName:
 *                     type: string
 *                     example: "Doe"
 *                   username:
 *                     type: string
 *                     example: "johndoe"
 *                   screenName:
 *                     type: string
 *                     example: "JohnD"
 *                   jobTitle:
 *                     type: string
 *                     example: "Developer"
 *       404:
 *         description: Chatroom not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chatroom not found"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Authorization token missing"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
export async function GET(req: Request) {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
        return NextResponse.json({ message: 'Authorization token missing' }, { status: 401 });
    }

    try {
        const decoded: any = jwt.verify(token, secretKey);
        const userId = decoded.id;

        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();

        if (!id) {
            return NextResponse.json({ message: 'Chatroom ID is required' }, { status: 400 });
        }

        const isChatRoomExists = await prisma.chatRoom.findFirst({
            where: { id },
        });

        if (!isChatRoomExists) {
            return NextResponse.json({ message: 'Chatroom not found' }, { status: 404 });
        }

        const usersInChatroom = await prisma.chatRoomUser.findMany({
            where: { chatRoomId: id },
            select: {
                userId: true,
            },
        });

        const users = await prisma.user.findMany({
            where: { id: { in: usersInChatroom.map(user => user.userId) } }
        });

        return NextResponse.json(users, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}