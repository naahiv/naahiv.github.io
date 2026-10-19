import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { workDirectory } from '../scripts/work-directory.mjs';

const preview = process.env.PREVIEW_URL || 'http://127.0.0.1:4321';
const production = process.env.PRODUCTION_URL || 'http://127.0.0.1:4322';
const specimen = '/blog/mathematical-writing-specimen/';
const shortPost = '/blog/a-small-pullback/';
const screenshots = path.join(workDirectory, 'screenshots');
const widths = [320, 390, 768, 1440];
const canonicalPortfolio = JSON.parse(await fs.readFile('src/data/portfolio.json', 'utf8'));
const scrollRegions = '.math-scroll, .diagram-scroll';

async function readPostMetadata(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const metadata = await Promise.all(entries.map(async entry => {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) return readPostMetadata(filename);
    if (!entry.isFile() || !entry.name.endsWith('.md')) return [];
    const { data } = matter(await fs.readFile(filename, 'utf8'));
    return [{ slug: data.slug, draft: data.draft !== false }];
  }));
  return metadata.flat();
}
const sourcePosts = await readPostMetadata('src/content/posts');
const publishedSlugs = sourcePosts.filter(post => !post.draft).map(post => post.slug).sort();
const draftSlugs = sourcePosts.filter(post => post.draft).map(post => post.slug).sort();

async function settled(page) {
  await page.evaluate(() => document.fonts.ready);
}
async function assertNoPageOverflow(page) {
  const geometry = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(geometry.page, JSON.stringify(geometry)).toBeLessThanOrEqual(geometry.viewport + 1);
  expect(geometry.body, JSON.stringify(geometry)).toBeLessThanOrEqual(geometry.viewport + 1);
}
async function screenshot(page, name, testInfo, width, options = {}) {
  await fs.mkdir(screenshots, { recursive: true });
  await page.screenshot({ path: path.join(screenshots, `${testInfo.project.name}-${name}-${width}.png`), fullPage: true, ...options });
}

for (const width of widths) {
  test(`reading and navigation at ${width} CSS pixels`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const [name, route] of [['portfolio', '/'], ['papers', '/papers/'], ['blog', '/blog/'], ['article', specimen], ['short-post', shortPost]]) {
      const response = await page.goto(route);
      expect(response?.status(), route).toBe(200);
      await settled(page);
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('h1')).toHaveCount(1);
      await assertNoPageOverflow(page);
      if ((width === 390 || width === 1440) && (name === 'article' || testInfo.project.name === 'chromium')) {
        await screenshot(page, name, testInfo, width);
        if (name === 'article') {
          await page.locator('#pullback-square').screenshot({ path: path.join(screenshots, `${testInfo.project.name}-tikzcd-${width}.png`) });
        }
      }
    }
    expect(errors).toEqual([]);
  });
}

test('mathematics, native diagrams, and references survive direct loading', async ({ page }) => {
  await page.goto(specimen);
  await settled(page);
  await expect(page.locator('article math').first()).toBeAttached();
  expect(await page.locator('article math').count()).toBeGreaterThan(15);
  await expect(page.locator('.katex-error')).toHaveCount(0);
  expect(await page.locator('article svg[role="img"]').count()).toBeGreaterThanOrEqual(2);
  const svgIssues = await page.locator('article svg[role="img"]').evaluateAll(svgs => {
    const ids = new Set();
    const issues = [];
    for (const svg of svgs) {
      if (!svg.querySelector('title')?.textContent.trim()) issues.push('missing SVG title');
      const accessibleIds = (svg.getAttribute('aria-labelledby') || '').trim().split(/\s+/).filter(Boolean);
      if (!accessibleIds.length) issues.push('missing accessible SVG name');
      for (const id of accessibleIds) {
        const target = Array.from(svg.querySelectorAll('[id]')).find(element => element.id === id);
        if (!target?.textContent.trim()) issues.push(`missing or empty accessible SVG reference ${id}`);
      }
      const description = svg.querySelector('desc');
      if (description && !description.textContent.trim()) issues.push('empty optional SVG description');
      const box = svg.getBoundingClientRect();
      if (box.width < 30 || box.height < 10) issues.push('invisible SVG');
      for (const element of svg.querySelectorAll('[id]')) {
        if (ids.has(element.id)) issues.push(`duplicate SVG ID ${element.id}`);
        ids.add(element.id);
      }
      for (const use of svg.querySelectorAll('use')) {
        const href = use.getAttribute('href') || use.getAttribute('xlink:href');
        if (href?.startsWith('#') && !svg.querySelector(`[id="${href.slice(1)}"]`)) issues.push(`missing glyph ${href}`);
      }
    }
    return issues;
  });
  expect(svgIssues).toEqual([]);
  const internalLinks = await page.locator('article a[href^="#"]').evaluateAll(links => links.map(link => link.getAttribute('href')));
  expect(internalLinks.length).toBeGreaterThan(4);
  for (const href of new Set(internalLinks)) {
    const id = decodeURIComponent(href.slice(1));
    expect(await page.evaluate(id => Boolean(document.getElementById(id)), id), href).toBe(true);
  }
  const target = '#universal-property';
  const expectFragmentVisible = async () => {
    await settled(page);
    await expect.poll(() => page.evaluate(id => {
      const top = document.getElementById(decodeURIComponent(id.slice(1))).getBoundingClientRect().top;
      return top >= -1 && top < 400;
    }, target)).toBe(true);
  };
  // Use a fresh document navigation, then let native anchor placement finish
  // before reloading; reloading during same-document navigation races restoration.
  await page.goto('/blog/');
  await page.goto(`${specimen}${target}`);
  await expectFragmentVisible();
  await page.reload();
  await expectFragmentVisible();
});

test('wide equations and diagrams are keyboard-scrollable local regions', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto(specimen);
  await settled(page);
  const regions = page.locator(scrollRegions);
  expect(await regions.count()).toBeGreaterThan(2);
  let overflowed = 0;
  for (const region of await regions.all()) {
    const dimensions = await region.evaluate(el => ({ width: el.clientWidth, scroll: el.scrollWidth, tabIndex: el.tabIndex, overflow: getComputedStyle(el).overflowX, label: el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') }));
    if (dimensions.scroll <= dimensions.width + 2) continue;
    overflowed++;
    expect(dimensions.tabIndex).toBe(0);
    expect(dimensions.label).toBeTruthy();
    expect(['auto', 'scroll']).toContain(dimensions.overflow);
    await region.focus();
    await page.keyboard.press('ArrowRight');
    await expect.poll(() => region.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
  }
  expect(overflowed).toBeGreaterThan(1);
  await assertNoPageOverflow(page);
});

test('skip navigation, legacy fragments, and contact are usable by keyboard', async ({ page, request }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
  for (const fragment of ['top', 'work', 'about', 'contact']) {
    await page.goto(`/#${fragment}`);
    await expect(page.locator(`[id="${fragment}"]`)).toBeAttached();
    const top = await page.locator(`[id="${fragment}"]`).evaluate(el => el.getBoundingClientRect().top);
    expect(top, fragment).toBeGreaterThanOrEqual(-1);
  }
  await expect(page.locator('a[href="mailto:naahiv@caltech.edu"]').first()).toBeVisible();
  const resume = page.getByRole('link', { name: 'Resume', exact: true });
  await expect(resume).toBeVisible();
  await expect(resume).toBeDisabled();
  await expect(page.locator('a[href="/resume.pdf"]')).toHaveCount(0);
  expect((await request.get('/resume.pdf')).ok()).toBeTruthy();
});

test('full article and portfolio render without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${preview}/papers/`);
  await expect(page.locator('[data-work-item]')).toHaveCount(canonicalPortfolio.length);
  await expect(page.getByRole('link', { name: 'Book PDF', exact: true })).toBeVisible();
  await page.goto(`${preview}${specimen}`);
  expect(await page.locator('article math').count()).toBeGreaterThan(15);
  expect(await page.locator('article svg[role="img"]').count()).toBeGreaterThanOrEqual(2);
  await expect(page.locator('article').getByRole('heading', { name: 'References', exact: true })).toBeVisible();
  await assertNoPageOverflow(page);
  await context.close();
});

test('reading has no third-party network dependency', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const blocked = [];
  const origin = new URL(preview).origin;
  await context.route('**/*', route => {
    if (new URL(route.request().url()).origin === origin) return route.continue();
    blocked.push(route.request().url());
    return route.abort();
  });
  const page = await context.newPage();
  await page.goto(`${preview}${specimen}`);
  await settled(page);
  expect(await page.locator('article math').count()).toBeGreaterThan(15);
  expect(await page.locator('article svg[role="img"]').count()).toBeGreaterThanOrEqual(2);
  expect(blocked).toEqual([]);
  await assertNoPageOverflow(page);
  await context.close();
});

test('automated accessibility for portfolio, index, and mathematical article', async ({ page }, testInfo) => {
  for (const route of ['/papers/', '/blog/', specimen]) {
    await page.goto(route);
    await settled(page);
    // Do not suppress mathematical content. Review any engine/MathML limitation explicitly.
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    await testInfo.attach(`axe-${route.replaceAll('/', '-')}`, { body: JSON.stringify(result, null, 2), contentType: 'application/json' });
    expect(result.violations.map(v => ({ id: v.id, description: v.description, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
  }
});

test('published posts appear in production routes and all public indexes', async ({ page, request }) => {
  const searchResponse = await request.get(`${production}/search.json`);
  expect(searchResponse.status()).toBe(200);
  const searchEntries = await searchResponse.json();
  expect(searchEntries.map(entry => entry.slug).sort()).toEqual(publishedSlugs);
  for (const entry of searchEntries) expect(entry.url).toBe(`/blog/${entry.slug}/`);

  for (const route of ['/blog/', '/blog/archive/']) {
    const response = await page.goto(`${production}${route}`);
    expect(response?.status(), route).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const entries = page.locator('[data-post-entry]');
    expect(await entries.evaluateAll(cards => cards.map(card => card.dataset.slug).sort())).toEqual(publishedSlugs);
    expect(await entries.locator('h2 a').evaluateAll(links => links.map(link => link.getAttribute('href')).sort()))
      .toEqual(publishedSlugs.map(slug => `/blog/${slug}/`));
    await expect(page.locator('.draft-label')).toHaveCount(0);
  }

  const rssResponse = await request.get(`${production}/rss.xml`);
  const sitemapResponse = await request.get(`${production}/sitemap.xml`);
  expect(rssResponse.status()).toBe(200);
  expect(sitemapResponse.status()).toBe(200);
  const indexes = await page.evaluate(({ rss, sitemap }) => {
    const feed = new DOMParser().parseFromString(rss, 'application/xml');
    const map = new DOMParser().parseFromString(sitemap, 'application/xml');
    return {
      errors: feed.querySelectorAll('parsererror').length + map.querySelectorAll('parsererror').length,
      feedLinks: Array.from(feed.querySelectorAll('item > link'), link => link.textContent).sort(),
      articleLocations: Array.from(map.querySelectorAll('loc'), location => location.textContent).filter(url => {
        const parts = new URL(url).pathname.split('/').filter(Boolean);
        return parts.length === 2 && parts[0] === 'blog' && !['archive', 'tags'].includes(parts[1]);
      }).sort(),
    };
  }, { rss: await rssResponse.text(), sitemap: await sitemapResponse.text() });
  const canonicalURLs = publishedSlugs.map(slug => `https://naahiv.github.io/blog/${slug}/`);
  expect(indexes.errors).toBe(0);
  expect(indexes.feedLinks).toEqual(canonicalURLs);
  expect(indexes.articleLocations).toEqual(canonicalURLs);

  for (const slug of publishedSlugs) {
    const route = `/blog/${slug}/`;
    const response = await page.goto(`${production}${route}`);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator('article.prose')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://naahiv.github.io${route}`);
    await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
    await expect(page.locator('.draft-label, .specimen-note')).toHaveCount(0);
    await expect(page.locator('.article-topline')).not.toContainText('Draft preview');
    await expect(page.locator('.article-topline')).not.toContainText('Development specimen');
  }
});

test('every source draft stays absent from production routes and indexes', async ({ page, request }) => {
  for (const slug of draftSlugs) {
    const route = `/blog/${slug}/`;
    const response = await request.get(`${production}${route}`);
    expect(response.status(), route).toBe(404);
  }
  for (const route of ['/blog/', '/blog/archive/', '/rss.xml', '/sitemap.xml', '/search.json']) {
    const response = await request.get(`${production}${route}`);
    expect(response.status(), route).toBe(200);
    const text = await response.text();
    for (const slug of draftSlugs) expect(text, `${slug} in ${route}`).not.toContain(slug);
  }
  await page.goto(`${production}/blog/`);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const links = await page.locator('a[href^="/blog/"]').evaluateAll(anchors => anchors.map(anchor => anchor.getAttribute('href')));
  for (const slug of draftSlugs) expect(links).not.toContain(`/blog/${slug}/`);
});

test('200 percent reflow and enlarged text preserve reading', async ({ page }, testInfo) => {
  // A 1440px desktop viewport at 200% browser zoom yields 720 CSS pixels.
  await page.setViewportSize({ width: 720, height: 500 });
  await page.goto(specimen);
  await settled(page);
  await assertNoPageOverflow(page);
  const originalSize = await page.locator('.prose').evaluate(el => parseFloat(getComputedStyle(el).fontSize));
  await page.addStyleTag({ content: `.prose { font-size: ${originalSize * 2}px !important; }` });
  expect(await page.locator('.prose').evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBe(originalSize * 2);
  await assertNoPageOverflow(page);
  await expect(page.locator('article')).toBeVisible();
  if (testInfo.project.name === 'chromium') await screenshot(page, 'enlarged-text', testInfo, 720);
});

test('print layout preserves the article and hides navigation', async ({ page }, testInfo) => {
  await page.goto(specimen);
  await settled(page);
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('article')).toBeVisible();
  await expect(page.locator('.site-header')).not.toBeVisible();
  await expect(page.locator('article').getByRole('heading', { name: 'References', exact: true })).toBeVisible();
  if (testInfo.project.name === 'chromium') {
    await fs.mkdir(screenshots, { recursive: true });
    await page.pdf({ path: path.join(screenshots, 'article-print.pdf'), format: 'A4', printBackground: true, margin: { top: '15mm', bottom: '15mm', left: '15mm', right: '15mm' } });
  }
});

test('fallback fonts preserve readable layout when font loading fails', async ({ browser }, testInfo) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.route(/\.(woff2?|ttf|otf)(\?.*)?$/, route => route.abort());
  const page = await context.newPage();
  await page.goto(`${preview}${specimen}`);
  await assertNoPageOverflow(page);
  expect(await page.locator('article math').count()).toBeGreaterThan(15);
  if (testInfo.project.name === 'chromium') await screenshot(page, 'font-fallback', testInfo, 390);
  await context.close();
});

test('portfolio filters keep normalized categories, content, and intentional order', async ({ page }) => {
  const canonical = canonicalPortfolio;
  await page.goto('/papers/');
  const cards = page.locator('[data-work-item]');
  await expect(cards).toHaveCount(canonical.length);
  expect(await cards.locator('h3').allTextContents()).toEqual(canonical.map(item => item.title));
  await expect(cards.first().getByRole('link', { name: 'PDF', exact: true })).toHaveAttribute('href', '/stable-infty-cats-in-ag.pdf');
  await expect(cards.first().locator('.work-meta')).toContainText(`${canonical[0].pages} pages`);
  await expect(cards.nth(1).getByRole('link', { name: 'PDF', exact: true })).toHaveAttribute('href', '/derived-cats-in-ag.pdf');
  await expect(cards.nth(1).getByRole('link', { name: 'Book PDF', exact: true })).toHaveAttribute('href', '/derived-cats-in-ag-book.pdf');
  await page.getByRole('button', { name: 'Notes & surveys', exact: true }).click();
  const visible = page.locator('[data-work-item]:visible');
  await expect(visible).toHaveCount(canonical.filter(item => item.category === 'note').length);
  expect(await visible.locator('h3').allTextContents()).toEqual(canonical.filter(item => item.category === 'note').map(item => item.title));
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await page.getByRole('searchbox', { name: 'Search papers and notes' }).fill('Book PDF');
  await expect(visible).toHaveCount(1);
  await expect(visible.locator('h3')).toHaveText(canonical[1].title);
  await page.getByRole('searchbox', { name: 'Search papers and notes' }).fill('no-such-work-acceptance-check');
  await expect(visible).toHaveCount(0);
  await expect(page.locator('[data-work-empty]')).toBeVisible();
  await page.getByRole('searchbox', { name: 'Search papers and notes' }).fill('');
  await expect(visible).toHaveCount(canonical.length);
});

test('blog prose search, empty results, topics, archive, and nested refresh work', async ({ page, request }) => {
  const entries = await (await request.get('/search.json')).json();
  const generators = entries.filter(entry => [entry.title, entry.summary, ...entry.tags, entry.text].join(' ').toLowerCase().includes('generators'));
  await page.goto('/blog/');
  const search = page.getByRole('searchbox', { name: 'Search blog posts' });
  await expect(page.locator('[data-post-entry]:visible')).toHaveCount(entries.length);
  await search.fill('generators');
  await expect(page.locator('[data-post-entry]:visible')).toHaveCount(generators.length);
  expect(await page.locator('[data-post-entry]:visible').evaluateAll(cards => cards.map(card => card.dataset.slug))).toEqual(generators.map(entry => entry.slug));
  await expect(page.locator('[data-post-entry][data-slug="mathematical-writing-specimen"]')).toBeVisible();
  await search.fill('no-such-blog-acceptance-check');
  await expect(page.locator('[data-search-empty]')).toBeVisible();
  await expect(page.locator('[data-post-entry]:visible')).toHaveCount(0);
  await search.fill('');
  await expect(page.locator('[data-post-entry]:visible')).toHaveCount(entries.length);
  await page.goto('/blog/tags/category-theory/');
  await expect(page.locator('[data-post-entry]')).toHaveCount(entries.filter(entry => entry.tags.includes('category-theory')).length);
  await page.goto('/blog/archive/');
  await expect(page.locator('[data-post-entry]')).toHaveCount(entries.length);
  await page.goto(specimen.slice(0, -1));
  await expect(page).toHaveURL(new RegExp(`${specimen}$`));
  await page.reload();
  await expect(page.locator('#universal-property')).toBeAttached();
  const searchResponse = await request.get('/search.json');
  expect(searchResponse.ok()).toBe(true);
  expect(await searchResponse.json()).toEqual(entries);
  expect(entries.map(entry => entry.slug)).toContain('mathematical-writing-specimen');
  for (const entry of entries) {
    expect(entry.text).not.toMatch(/katex-html|<math|<svg|\\begin\{tikzcd\}/);
  }
});

test('failed search enhancement leaves every article available', async ({ page, request }) => {
  const entries = await (await request.get('/search.json')).json();
  await page.route('**/search.json', route => route.abort());
  await page.goto('/blog/');
  await expect(page.locator('[data-post-entry]:visible')).toHaveCount(entries.length);
  await expect(page.locator('[data-search-summary]')).toHaveText('Search is unavailable. All posts are listed below.');
  await expect(page.getByRole('searchbox', { name: 'Search blog posts' })).toBeDisabled();
  await expect(page.locator(`[data-post-entry] a[href="${specimen}"]`)).toBeVisible();
});

test('touch disclosure controls and native horizontal diagram scrolling', async ({ browser, browserName }) => {
  const context = await browser.newContext({ viewport: { width: 320, height: 844 }, hasTouch: true, ...(browserName === 'chromium' ? { isMobile: true } : {}) });
  const page = await context.newPage();
  await page.goto(`${preview}${specimen}`);
  const details = page.locator('#arrow-variations .diagram-source');
  await details.locator('summary').tap();
  await expect(details).toHaveAttribute('open', '');
  await details.locator('summary').tap();
  await expect(details).not.toHaveAttribute('open', '');
  if (browserName === 'chromium') {
    const region = page.locator('#arrow-variations .diagram-scroll');
    await region.scrollIntoViewIfNeeded();
    expect(await region.evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true);
    const box = await region.boundingBox();
    const start = box.x + box.width - 35;
    const end = box.x + 35;
    const y = box.y + Math.min(box.height / 2, 150);
    const cdp = await context.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: start, y }] });
    for (let step = 1; step <= 8; step++) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: start + (end - start) * step / 8, y }] });
      await page.waitForTimeout(20);
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect.poll(() => region.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
  }
  await assertNoPageOverflow(page);
  await context.close();
});
