import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register');
  
  if (isAuthRoute) {
    if (user) {
      // User is already logged in, redirect to home or map
      return NextResponse.redirect(new URL('/map', request.url));
    }
    return response;
  }

  // Define protected routes
  const isCitizenRoute = request.nextUrl.pathname.startsWith('/map') || 
                         request.nextUrl.pathname.startsWith('/report') || 
                         request.nextUrl.pathname.startsWith('/my-reports');
                         
  const isDepartmentAdminRoute = request.nextUrl.pathname.startsWith('/admin/department');
  const isSuperAdminRoute = request.nextUrl.pathname.startsWith('/admin/super');

  if (isCitizenRoute || isDepartmentAdminRoute || isSuperAdminRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Fetch user profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile) {
      if (isDepartmentAdminRoute && profile.role !== 'department_admin' && profile.role !== 'super_admin') {
         return NextResponse.redirect(new URL('/map', request.url)); // Unauthorized
      }
      if (isSuperAdminRoute && profile.role !== 'super_admin') {
         return NextResponse.redirect(new URL('/map', request.url)); // Unauthorized
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
