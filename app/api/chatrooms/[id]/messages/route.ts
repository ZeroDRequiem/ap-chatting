import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const secretKey = process.env.JWT_SECRET_KEY;

/**
 * @openapi
 * /api/chatrooms/{id}/messages:
 *   get:
 *     summary: Get all messages in the specified chatroom
 *     description: Retrieves all messages that are part of the specified chatroom.
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
 *         description: A list of messages in the chatroom
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "message-id"
 *                   content:
 *                     type: string
 *                     example: "Hello, world!"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-01-01T00:00:00.000Z"
 *                   userId:
 *                     type: string
 *                     example: "user-id"
 *                   chatRoomId:
 *                     type: string
 *                     example: "chatroom-id"
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

        const messages = await prisma.message.findMany({
            where: { chatRoomId: id },
            orderBy: { createdAt: 'asc' },
        });

        return NextResponse.json(messages, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}