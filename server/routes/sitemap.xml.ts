export default defineEventHandler(() => {
  const baseUrl = 'https://renttrack.app'
  const pages = [
    { url: '/', changefreq: 'weekly', priority: 1.0 },
    { url: '/auth/login', changefreq: 'monthly', priority: 0.3 },
    { url: '/auth/register', changefreq: 'monthly', priority: 0.8 },
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>${baseUrl}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    }
  })
})
