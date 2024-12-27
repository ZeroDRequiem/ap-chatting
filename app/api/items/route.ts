import { NextResponse } from 'next/server';

/**
 * @openapi
 * /api/items:
 *   get:
 *     summary: Get all items
 *     description: Returns a list of hardcoded items.
 *     responses:
 *       200:
 *         description: A list of items.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "1"
 *                   name:
 *                     type: string
 *                     example: "Item 1"
 */
export async function GET() {
  const items = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' },
  ];

  return NextResponse.json(items);
}
