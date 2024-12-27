import { NextResponse } from 'next/server';
import { User } from '@/types/User';

const MOCK_USER_CREDENTIALS = {
  username: 'admin',
  password: 'password', // For demonstration only. NEVER store plain-text passwords!
};

const MOCK_USER: User = {
  id: '1',
  firstName: 'Abe',
  lastName: 'Alatas',
  jobTitle: 'Software Engineer',
  profilePicture:
    'https://scontent-lax3-1.xx.fbcdn.net/v/t39.30808-1/358131183_7737110009644665_3274350106225034038_n.jpg?stp=c0.0.1536.1536a_dst-jpg_s200x200_tt6&_nc_cat=104&ccb=1-7&_nc_sid=e99d92&_nc_ohc=MWlZB0MZN0IQ7kNvgHK8Iyk&_nc_zt=24&_nc_ht=scontent-lax3-1.xx&_nc_gid=Ah7jBLCiIl6gHoNs224o_TC&oh=00_AYCQjknYoLGlCV1n8dPBmObj1xTxjd7Ykiw44De9mzRNpw&oe=67742C1B',
  screenName: 'ZeroDRequiem',
};

// Generate a mock token (in real applications, use a library like `jsonwebtoken`)
const generateMockToken = (userId: string) => {
  return `mock-token-${userId}-${Date.now()}`;
};

/**
 * @openapi
 * /api/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user with username and password. Returns a token and user details upon successful login.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "admin"
 *               password:
 *                 type: string
 *                 example: "password"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 token:
 *                   type: string
 *                   example: "mock-token-1-1699999999999"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "1"
 *                     firstName:
 *                       type: string
 *                       example: "Abe"
 *                     lastName:
 *                       type: string
 *                       example: "Alatas"
 *                     jobTitle:
 *                       type: string
 *                       example: "Software Engineer"
 *                     profilePicture:
 *                       type: string
 *                       example: "https://example.com/profile.jpg"
 *                     screenName:
 *                       type: string
 *                       example: "ZeroDRequiem"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid credentials"
 */
export async function POST(request: Request) {
  const { username, password } = await request.json();

  // Validate username and password
  if (
    username === MOCK_USER_CREDENTIALS.username &&
    password === MOCK_USER_CREDENTIALS.password
  ) {
    const token = generateMockToken(MOCK_USER.id!);

    // Set the HTTP-only cookie
    const response = NextResponse.json({
      message: 'Login successful',
      token: token,
      user: MOCK_USER,
    });

    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 60 * 60 * 24, // Token valid for 1 day
      path: '/', // Available to all paths
    });

    return response;
  }

  return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
}
