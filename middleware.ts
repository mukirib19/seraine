import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ROUTE_ROLES: Record<string, string[]> = {
  '/dashboard/admin': ['admin'],
  '/dashboard/staff': ['staff', 'admin'],
  '/dashboard/logistics': ['logistics', 'admin'],
  '/dashboard/agent': ['delivery_agent', 'logistics', 'admin'],
  '/dashboard/customer': ['customer', 'admin'],
}

const PUBLIC_ROUTES = [
  '/',
  '/catalog',
  '/services',
  '/portfolio',
  '/about',
  '/contact',
  '/track',
  '/terms',
  '/privacy',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/setup',
  '/admin',
  '/profile',
  '/cart',
]

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  const pathname = request.nextUrl.pathname

  // Check if route is public
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  )

  // Allow catalog slug routes
  if (pathname.startsWith('/catalog/')) return response

  // Allow invite routes
  if (pathname.startsWith('/invite/')) return response

  // Allow public and static routes
  if (isPublicRoute || pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return response
  }

  // Dashboard routes require authentication
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Get user role from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Check role-based access
    for (const [route, roles] of Object.entries(ROUTE_ROLES)) {
      if (pathname.startsWith(route)) {
        if (!roles.includes(profile.role)) {
          // Redirect to their correct dashboard
          const correctPath = profile.role === 'admin' ? '/dashboard/admin'
            : profile.role === 'staff' ? '/dashboard/staff'
            : profile.role === 'logistics' ? '/dashboard/logistics'
            : profile.role === 'delivery_agent' ? '/dashboard/agent'
            : '/dashboard/customer'
          return NextResponse.redirect(new URL(correctPath, request.url))
        }
        break
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
