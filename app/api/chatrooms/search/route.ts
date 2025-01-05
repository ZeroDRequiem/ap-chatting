import { PrismaClient, ChatRoom } from '@prisma/client';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const secretKey = process.env.JWT_SECRET_KEY;

/**
 * @openapi
 * /api/chatrooms/search:
 *   get:
 *     summary: Find an existing chatroom by ID
 *     description: Finds a chatroom by ID.
 *     tags:
 *       - Chatrooms
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           example: "chatroom-id"
 *     responses:
 *       200:
 *         description: Chatroom found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "chatroom-id"
 *                 name:
 *                   type: string
 *                   example: "Chatroom Name"
 *                 createdById:
 *                   type: string
 *                   example: "user-id"
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
    // const token = req.headers.get('authorization')?.split(' ')[1];
    // if (!token) {
    //     return NextResponse.json({ message: 'Authorization token missing' }, { status: 401 });
    // }

    try {
        // const decoded: any = jwt.verify(token, secretKey);
        // const userId = decoded.id;

        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'Chatroom ID is required' }, { status: 400 });
        }

        const chatroom = await prisma.chatRoom.findUnique({
            where: { id },
        });

        if (!chatroom) {
            return NextResponse.json({ message: 'Chatroom not found' }, { status: 404 });
        }
    
        return NextResponse.json(chatroom, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}