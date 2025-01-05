import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const secretKey = process.env.JWT_SECRET_KEY;

/**
 * @openapi
 * /api/chatrooms/{id}:
 *   put:
 *     summary: Add the current user to the chatroom
 *     description: Adds the current user to the chatroom based on the chatroom ID provided in the URL.
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
 *         description: User added to chatroom successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User added to chatroom successfully"
 *                 chatroom:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "chatroom-id"
 *                     name:
 *                       type: string
 *                       example: "Chatroom Name"
 *                     createdById:
 *                       type: string
 *                       example: "user-id"
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
export async function PUT(req: Request) {
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

        const chatroom = await prisma.chatRoom.findUnique({
            where: { id },
        });

        if (!chatroom) {
            return NextResponse.json({ message: 'Chatroom not found' }, { status: 404 });
        }

        await prisma.chatRoomUser.create({
            data: {
                chatRoomId: chatroom.id,
                userId,
            },
        });

        return NextResponse.json({ message: 'User added to chatroom successfully', chatroom }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}

/**
 * @openapi
 * /api/chatrooms/{id}:
 *   delete:
 *     summary: Remove the current user from the chatroom
 *     description: Removes the current user from the chatroom based on the chatroom ID provided in the URL.
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
 *         description: User removed from chatroom successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User removed from chatroom successfully"
 *       404:
 *         description: Chatroom or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chatroom or user not found"
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
export async function DELETE(req: Request) {
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

        const chatroomUser = await prisma.chatRoomUser.findUnique({
            where: {
                chatRoomId_userId: {
                    chatRoomId: id,
                    userId: userId,
                },
            },
        });

        if (!chatroomUser) {
            return NextResponse.json({ message: 'Chatroom or user not found' }, { status: 404 });
        }

        await prisma.chatRoomUser.delete({
            where: {
                chatRoomId_userId: {
                    chatRoomId: id,
                    userId: userId,
                },
            },
        });

        return NextResponse.json({ message: 'User removed from chatroom successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}