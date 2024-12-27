import { NextResponse } from 'next/server';

/**
 * @openapi
 * /api/logout:
 *   get:
 *     summary: User logout
 *     description: Logs the user out by deleting the authentication token from cookies.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged out successfully"
 */
export async function GET() {
  // Create a response and delete the `authToken` cookie
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.delete('authToken');
  return response;
}
