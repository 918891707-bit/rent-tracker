export const useApi = () => {
  function headers(): Record<string, string> {
    const h: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (typeof window !== 'undefined') {
      const t = localStorage.getItem('rent_track_token')
      if (t) h['Authorization'] = `Bearer ${t}`
    }
    return h
  }

  async function get<T = any>(url: string): Promise<T> {
    return $fetch(url, { headers: headers() })
  }

  async function post<T = any>(url: string, body?: any): Promise<T> {
    return $fetch(url, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body),
    })
  }

  async function patch<T = any>(url: string, body?: any): Promise<T> {
    return $fetch(url, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify(body),
    })
  }

  async function del<T = any>(url: string): Promise<T> {
    return $fetch(url, {
      method: 'DELETE',
      headers: headers(),
    })
  }

  return { get, post, patch, del }
}
