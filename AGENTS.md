# Seraine Creations — AGENTS.md
> AI assistant: read this entire file before making ANY change. Apply targeted fixes only. Do NOT rebuild from scratch.

---

## 1. Project Identity

| Key | Value |
|---|---|
| Business | Seraine Creations |
| Tagline | Printing Perfected |
| Services | DESIGN \| PRINTING \| BRANDING \| GIFTS \| EVENT DECOR |
| Phone | 0705525890 |
| Email | seraine.creation@gmail.com |
| Address | AFYA BUSINESS PLAZA, KOJA 5th Floor Rm 506A |
| Instagram | https://www.instagram.com/seraine_creations?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw== |
| LinkedIn | https://www.linkedin.com/in/seraine-creation-1b83a3377/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BzXIstFK3SkynmlG00N2ORg%3D%3D |

---

## 2. Tech Stack (DO NOT CHANGE)

| Layer | Choice |
|---|---|
| Framework | **Next.js 14 App Router** |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Icons | Lucide React |
| DB / Auth / Storage | Supabase (`kuiguvaurlhfuwcsyeni`) |
| State | Zustand (auth.store, cart.store) |
| Toasts | Sonner |
| Animations | Framer Motion |
| Dev command | `npm run dev` |
| Build command | `npm run build` |

**Supabase client:** `src/lib/supabase.ts` — already initialized, just import `{ supabase }`.

---

## 3. Brand System (STRICT — do not deviate)

### Colors (CSS variables defined in `globals.css`)
```
--bg            #F5F5F5 light / #1C1C1C dark
--text          #1C1C1C light / #F5F5F5 dark  
--card-bg       #FFFFFF light / #2A2A2A dark
--primary       #2563C4   → navbar, links, borders, highlights
--cta           #A020C8   → CTA buttons ONLY ("Get a Quote", "Order Now")
--promo         #F5A800   → badges: "New", "Sale", "Special Offer" ONLY
--success       #5BBD2F   → "In Stock", confirmations
--danger        #E8231A   → errors, "Low Stock"
--muted         #6B6B6B
--border        rgba(37,99,196,0.2)
```

### Rules — Non-negotiable
- **No gradients.** Flat colors only.
- **Max 2 accent colors** visible on any screen. Blue + Purple lead.
- **Buttons** → `border-radius: 999px` (pill shape)
- **Cards** → `border-radius: 12px`, `border: 0.5px solid var(--border)`
- **No drop shadows.** Use borders and spacing.
- **Section padding** → minimum 80px vertical (`section-padding` class)

### Typography
- Headings: **Montserrat 700** → `font-heading` class
- Body: **Inter 400** → `font-body` class
- Both imported from Google Fonts in `globals.css`

---

## 4. File Structure (key files)

```
src/
  app/
    layout.tsx               # Root layout — ThemeProvider + AuthProvider + Toaster
    (public)/
      page.tsx               # Homepage — imports section components
      sections/              # hero, featured-products, services, marquee-strip, etc.
      catalog/               # /catalog and /catalog/[id]
      contact/page.tsx
      about/page.tsx
      services/page.tsx
      portfolio/page.tsx
      track/page.tsx
    (auth)/
      login/page.tsx
      signup/page.tsx
      forgot-password/page.tsx
      reset-password/page.tsx
    admin/page.tsx            # /admin — products + banners CRUD
    profile/page.tsx          # /profile — account details, dark mode, favourites
    cart/page.tsx
    dashboard/               # customer, admin, staff, logistics, agent
  components/
    layout/
      navbar.tsx             # Logo + nav links + profile icon + dark mode + cart count
      footer.tsx             # Real business details + social links
    providers/
      auth-provider.tsx      # Supabase session restore + onAuthStateChange
      theme-provider.tsx     # Dark mode via localStorage + html.dark class
    ui/                      # button, input, textarea, badge, skeleton, dialog, tabs, etc.
    shared/
      whatsapp-button.tsx    # Fixed bottom-right, links to wa.me/254705525890
      scroll-to-top.tsx
  stores/
    auth.store.ts            # user, profile, role, isAuthenticated
    cart.store.ts            # items[], addItem, removeItem, Zustand persist
  lib/
    supabase.ts              # createClient — untyped (no Database generic)
    supabase-server.ts       # Server-side client + service role
  styles/
    globals.css              # All CSS variables, base styles, component classes
```

---

## 5. Supabase Schema (5 core tables)

```sql
-- profiles (extend auth.users)
id uuid PK, full_name text, email text, phone text, 
dark_mode boolean default false, role text default 'user'

-- products
id uuid PK, name text, sku text unique, description text,
price numeric, category text, images text[], video_url text,
in_stock boolean default true, created_at timestamptz

-- favourites
id uuid PK, user_id uuid FK→auth.users, product_id uuid FK→products

-- cart_items
id uuid PK, user_id uuid FK→auth.users, product_id uuid FK→products, quantity int

-- banners
id uuid PK, title text, image_url text, video_url text, link text,
start_date date, end_date date, active boolean default true
```

**Product categories:** Large Format, Notebooks, Event Planning, T-Shirt Printing, Mug Branding, Bouquets, Event Decor

**Admin access:** `UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';`

---

## 6. Routes

| Route | Description | Auth |
|---|---|---|
| `/` | Homepage | Public |
| `/catalog` | All products grid + filter | Public |
| `/catalog/[id]` | Product detail | Public |
| `/products` | Redirect → /catalog | Public |
| `/services` | Services overview | Public |
| `/portfolio` | Portfolio gallery | Public |
| `/about` | About page | Public |
| `/contact` | Contact + quote form | Public |
| `/track` | Track order by ID | Public |
| `/terms` | Terms & Conditions | Public |
| `/privacy` | Privacy Policy | Public |
| `/login` | Login + Google OAuth | Public |
| `/signup` | Signup + Google OAuth | Public |
| `/forgot-password` | Password reset request | Public |
| `/reset-password` | Password reset confirm | Public |
| `/cart` | Cart page | Public |
| `/profile` | Account, dark mode, favourites | Auth required (client-side) |
| `/admin` | Products + banners management | Admin role only |
| `/dashboard/customer` | Customer portal | Auth required |
| `/dashboard/admin` | Admin dashboard (stats) | Admin only |
| `/dashboard/staff` | Staff dashboard | Staff/Admin |
| `/dashboard/logistics` | Logistics dashboard | Logistics/Admin |
| `/dashboard/agent` | Delivery agent dashboard | Agent/Admin |

---

## 7. What Is Built (as of Session 3 — June 2026)

- ✅ Full brand system: colors, typography, dark mode, CSS variables
- ✅ Navbar: logo, links, dark mode toggle, cart count (getItemCount), mobile hamburger
- ✅ Footer: business details, exact social links, logo
- ✅ Login: Google OAuth, password toggle, router.replace() redirect, role-based routing
- ✅ Signup: Google OAuth, phone saved to profile, auto-login after signup (no email gate), 2-step
- ✅ Hero: large logo, dark bg, purple CTA, blue secondary
- ✅ FeaturedProducts: Supabase, 6 max, next/image, empty state, View All
- ✅ Contact: real details, form → quotations table
- ✅ About: logo, brand colors, real contact
- ✅ Services: 9 categories, static (no DB), brand CSS vars
- ✅ Portfolio: masonry grid, category filter tabs, lightbox, CTA
- ✅ Reviews: static 5-star testimonials carousel (no DB dependency)
- ✅ Availability banner: static hours + contact info
- ✅ Admin `/admin`: products + banners full CRUD, image upload to Supabase storage
- ✅ Profile `/profile`: edit details, dark mode toggle, favourites, delete account
- ✅ Cart: Zustand store, localStorage + Supabase sync on login
- ✅ WhatsApp button + ScrollToTop on all public pages
- ✅ Track page: fixed icon/label spacing
- ✅ `/products` → redirects to `/catalog`
- ✅ `/catalog`: uses `in_stock`, brand vars, next/image
- ✅ `/catalog/[id]`: product detail with add to cart + Supabase sync
- ✅ Supabase schema: 6 tables + RLS + trigger + storage bucket in `schema-and-seed.sql`
- ✅ Seed: 7 products + 3 banners with working Unsplash URLs
- ✅ Build: 28 routes, 0 errors

---

## 8. Known Issues / Next Steps

### Remaining
1. **Google OAuth** — requires Google Cloud Console setup (see Section 11)
2. **Admin video upload** — admin page needs optional `video_url` field for products
3. **`<img>` tags in admin/profile** — replace with `next/image` to fix ESLint warnings
4. **Supabase email confirmation** — disable in Supabase Dashboard → Auth → Settings → "Enable email confirmations" = OFF for instant login after signup

### Supabase Auth Settings (do once)
- Dashboard → Authentication → Settings
- **Disable email confirmations** = ON (so users log in immediately)
- **Site URL** = `http://localhost:3000` (dev) or your production domain
- **Redirect URLs** = add `http://localhost:3000/**`

### Google OAuth Setup (Section 11)
See Section 11 below for step-by-step Google Cloud Console setup.

---

## 9. Coding Rules for AI

### ALWAYS
- Import `{ supabase }` from `'@/lib/supabase'` (already initialized)
- Use CSS variables (`var(--primary)`, `var(--cta)`, etc.) not hardcoded hex in inline styles
- Use `'use client'` at top of any component with useState/useEffect/event handlers
- Every async button: show spinner + disable during loading, toast on success/error
- All images: `loading="lazy"` or use `next/image`
- Social links: `target="_blank" rel="noopener noreferrer"`
- Toasts via `import { toast } from 'sonner'`

### NEVER
- `alert()` or `confirm()` — use toasts or modal confirmations
- Hardcode colors — use CSS variables
- Add `setTimeout` artificial delays
- Import from `@/types/database.types` — supabase client is untyped
- Rebuild pages from scratch when a targeted fix is needed
- Add gradients, drop shadows, or sharp (non-pill) buttons for primary CTAs

### Performance
- `useEffect` dependency arrays must be correct — no duplicate Supabase calls
- `React.memo` on expensive list components
- Skeleton loaders instead of full-page spinners

---

## 10. Quick Reference: Key Patterns

### Supabase query
```ts
const { data, error } = await supabase.from('products').select('*').eq('in_stock', true)
if (error) { toast.error(error.message); return }
```

### Auth check (client)
```ts
const { user, role } = useAuthStore()
if (!user) { router.push('/login'); return }
if (role !== 'admin') { router.push('/'); return }
```

### Toast
```ts
toast.success('Saved!')
toast.error('Something went wrong')
```

### Cart add
```ts
const addItem = useCartStore(s => s.addItem)
addItem({ product_id: p.id, product_name: p.name, unit_price: p.price, quantity: 1, ... })
toast.success('Added to cart')
```

### Dark mode CSS variable usage
```tsx
<div style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text)' }}>
```

### Brand button patterns
```tsx
// CTA (purple)
<button style={{ backgroundColor: 'var(--cta)', color: '#fff' }} className="rounded-pill">Get a Quote</button>
// Secondary (blue outline)
<button style={{ border: '1px solid var(--primary)', color: 'var(--primary)' }} className="rounded-pill">Learn More</button>
```