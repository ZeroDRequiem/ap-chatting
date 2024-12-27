import { NextResponse } from 'next/server';
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Next.js API with OpenAPI',
    version: '1.0.0',
    description: 'A simple API with OpenAPI documentation.',
  },
  servers: [
    {
      url: 'http://localhost:3000', // Replace with your actual server URL
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./app/api/**/*.ts'], // Specify the location of your API files
};

const swaggerSpec = swaggerJSDoc(options);

export async function GET() {
  return NextResponse.json(swaggerSpec);
}
