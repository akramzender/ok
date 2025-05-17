import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];

const corsHeaders = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Define protected routes
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/payment(.*)']);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const origin = req.headers.get('origin') || '';
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsHeaders,
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  // Protect routes
  if (isProtectedRoute(req)) {
    const { sessionId, userId } = await auth();
    if (!sessionId || !userId) {
      // Return a 401 Unauthorized response if the user is not authenticated
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
  }

  // Proceed with the request
  const response = NextResponse.next();

  // Set CORS headers for allowed origins
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
});

// Middleware configuration
export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};