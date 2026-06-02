import { redirect } from 'next/navigation'

// /products → redirect to /catalog
export default function ProductsPage() {
  redirect('/catalog')
}
