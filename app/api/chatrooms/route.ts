import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { ChatRoom, PrismaClient } from '@prisma/client';

const secretKey = process.env.JWT_SECRET_KEY;
const prisma = new PrismaClient();

/**
 * @openapi
 * /api/chatrooms:
 *   get:
 *     summary: Get all chatrooms associated with the current user
 *     description: Retrieves all chatrooms that the current user is a member of.
 *     tags:
 *       - Chatrooms
 *     responses:
 *       200:
 *         description: A list of chatrooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "chatroom-id"
 *                   name:
 *                     type: string
 *                     example: "Chatroom Name"
 *                   createdById:
 *                     type: string
 *                     example: "user-id"
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
 */
export async function GET(req: Request) {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
        return NextResponse.json({ message: 'Authorization token missing' }, { status: 401 });
    }

    try {
        const decoded: any = jwt.verify(token, secretKey);
        const userId = decoded.id;

        // const chatrooms = await prisma.chatRoom.findMany({
        //     where: {
        //         users: {
        //             some: {
        //                 userId: userId,
        //             },
        //         },
        //     },
        // });

        const chatroomIds = await prisma.chatRoomUser.findMany({
            where: {
                userId,
            },
            select: {
                chatRoomId: true,
            },
        });

        const chatrooms = await prisma.chatRoom.findMany({
            where: {
                id: {
                    in: chatroomIds.map((chatroom) => chatroom.chatRoomId),
                },
            },
        });

        return NextResponse.json(chatrooms, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
}

/**
 * @openapi
 * /api/chatrooms:
 *   post:
 *     summary: Create a new chatroom and insert the current user in the chatroom
 *     description: Creates a new chatroom and adds the current user as a member.
 *     tags:
 *       - Chatrooms
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New Chatroom"
 *     responses:
 *       201:
 *         description: Chatroom created successfully
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
 *                   example: "New Chatroom"
 *                 createdById:
 *                   type: string
 *                   example: "user-id"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chatroom name is required"
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
 */
export async function POST(req: Request) {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
        return NextResponse.json({ message: 'Authorization token missing' }, { status: 401 });
    }

    try {
        const decoded: any = jwt.verify(token, secretKey);
        const userId = decoded.id;

        const { name } = await req.json();
        if (!name) {
            return NextResponse.json({ message: 'Chatroom name is required' }, { status: 400 });
        }

        const newChatroom = await prisma.chatRoom.create({
            data: {
                name,
                createdById: userId,
            }
        });

        await prisma.chatRoomUser.create({ 
            data: {
                chatRoomId: newChatroom.id,
                userId,
            }
        });

        return NextResponse.json(newChatroom, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
}
