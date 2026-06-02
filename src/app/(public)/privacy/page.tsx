'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function PrivacyPage() {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('privacy_versions').select('content').eq('is_current', true).single().then(({ data }) => { setContent(data?.content || 'Privacy policy coming soon.'); setLoading(false) })
  }, [])

  return (
    <div className="container-narrow py-16">
      <h1 className="mb-8">Privacy Policy</h1>
      {loading ? <div className="space-y-3">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-4 skeleton" />)}</div> : <div className="prose prose-sm max-w-none text-muted leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />}
    </div>
  )
}
