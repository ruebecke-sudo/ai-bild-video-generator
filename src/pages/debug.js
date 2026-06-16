import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function DebugPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase.from('generations').select('*').order('created_at', { ascending: false }).limit(20)
      .then(({ data, error }) => {
        if (error) setError(error)
        else setData(data)
      })
  }, [])

  return (
    <div style={{ padding: '2rem', background: '#0a0f1d', color: '#fff', minHeight: '100vh', fontFamily: 'monospace' }}>
      <h1>Database Generations Debug</h1>
      {error && <pre style={{ color: 'red' }}>{JSON.stringify(error, null, 2)}</pre>}
      {data ? (
        <pre style={{ background: '#131b2e', padding: '1rem', borderRadius: '8px', overflowX: 'auto' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <p>Lade Daten...</p>
      )}
    </div>
  )
}
