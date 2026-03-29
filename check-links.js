import { readFileSync, existsSync, readdirSync } from 'fs'
import { dirname, join } from 'path'

const mdFiles = readdirSync('content', { recursive: true })
  .filter((f) => f.endsWith('.md'))
  .map((f) => join('content', f))

// Build set of valid blog slugs (without index)
const blogSlugs = new Set(
  mdFiles
    .filter((f) => f.startsWith('content/blog/'))
    .map((f) => f.replace('content/blog/', '').replace('.md', ''))
    .filter((s) => s !== 'index')
)

// Valid absolute routes
const validRoutes = new Set(['/', '/blog', '/resume', ...Array.from(blogSlugs).map((s) => `/blog/${s}`)])

const TEST_POST = 'content/blog/test-post.md'
const expectedBroken = new Set([`${TEST_POST} -> nonexistent-post`])
const foundExpected = new Set()

let broken = 0

for (const md of mdFiles) {
  const isTestPost = md === TEST_POST
  const dir = dirname(md)
  const content = readFileSync(md, 'utf8')

  function report(type, target) {
    const key = `${md} -> ${target}`
    if (isTestPost && expectedBroken.has(key)) {
      foundExpected.add(key)
      return
    }
    console.log(`${type}: ${key}`)
    broken++
  }

  // Check markdown images: ![...](path)
  for (const match of content.matchAll(/!\[.*?\]\(([^)]+)\)/g)) {
    const img = match[1].replace(/ ".*$/, '')
    if (/^https?:\/\//.test(img)) continue
    if (!existsSync(join(dir, img))) report('broken image', img)
  }

  // Check frontmatter splashimage/image fields
  for (const match of content.matchAll(/^\s*(?:splashimage|image):\s*(\S+)/gm)) {
    const img = match[1]
    if (!img || /^https?:\/\//.test(img)) continue
    if (!existsSync(join(dir, img))) report('broken image', img)
  }

  // Check markdown links: [text](path) — skip image syntax [![...](...)
  for (const match of content.matchAll(/(?<!\!)\[(?:!\[.*?\]\([^)]*\)|[^\]])*\]\(([^)]+)\)/g)) {
    const href = match[1].replace(/#.*$/, '').replace(/ ".*$/, '')
    if (!href || /^https?:\/\//.test(href)) continue

    if (href.startsWith('/')) {
      if (!validRoutes.has(href)) report('broken link', match[1])
    } else if (!href.startsWith('mailto:')) {
      const resolved = '/' + join(dirname(md).replace(/^content\/?/, ''), href)
      if (!validRoutes.has(resolved)) report('broken link', href)
    }
  }
}

// Verify test post has all expected broken links
const missing = [...expectedBroken].filter((e) => !foundExpected.has(e))
if (missing.length > 0) {
  for (const m of missing) console.log(`expected broken not found: ${m}`)
  broken += missing.length
}

if (broken === 0) console.log('No broken links found.')
else {
  console.log(`\nFound ${broken} broken link(s).`)
  process.exit(1)
}
