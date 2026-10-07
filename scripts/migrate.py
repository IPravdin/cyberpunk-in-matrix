#!/usr/bin/env python3
"""Rebuild the portable site from the archived Weebly pages.

Requires beautifulsoup4 (see requirements-migration.txt), curl, and internet
access only for assets not already cached in archive/downloads.
"""
from pathlib import Path
from urllib.parse import urljoin, urlsplit, urldefrag
import hashlib
import json
import re
import subprocess
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
CACHE = ROOT / 'archive/downloads'
ORIGIN = 'https://cyberpunkinmatrix.weebly.com'
CSS_URL = re.compile(r'url\(\s*([\'"]?)(.*?)\1\s*\)', re.I)
assets = {}
failures = {}
embeds = []


def download(url):
    key = hashlib.sha256(url.encode()).hexdigest()
    cached = CACHE / key
    if not cached.exists():
        CACHE.mkdir(parents=True, exist_ok=True)
        result = subprocess.run(['curl', '-sS', '-L', '--fail', '--retry', '2',
                                 '--max-time', '45', url, '-o', str(cached)])
        if result.returncode:
            cached.unlink(missing_ok=True)
            raise RuntimeError(f'Download failed: {url}')
    return cached.read_bytes()


def asset(reference, context):
    if not reference or reference.startswith(('data:', '#')):
        return reference
    url, fragment = urldefrag(urljoin(context, reference))
    if url in assets:
        return assets[url]['path'] + (f'#{fragment}' if fragment else '')
    parsed = urlsplit(url)
    suffix = Path(parsed.path).suffix
    if parsed.netloc == urlsplit(ORIGIN).netloc:
        local = parsed.path
    else:
        name = Path(parsed.path).name or 'asset'
        if parsed.netloc == 'fonts.googleapis.com':
            name = 'fonts.css'
        local = f'/assets/vendor/{parsed.netloc}/{hashlib.sha256(url.encode()).hexdigest()[:12]}-{name}'
    assets[url] = {'path': local}
    try:
        data = download(url)
        # Process styles recursively so fonts and background images are local too.
        if suffix == '.css' or parsed.netloc == 'fonts.googleapis.com':
            data = rewrite_css(data.decode('utf-8'), url).encode()
            if parsed.path == '/files/main_style.css':
                # The published theme serves invalid WOFF/WOFF2 files. Both the
                # original browser and this copy fall back to its working TTF.
                def working_font(match):
                    block = match[0]
                    ttf = re.search(r'url\("([^"]+\.ttf)"\)\s*format\(\'truetype\'\)', block)
                    if not ttf:
                        return block
                    block = re.sub(r'src:[^;]+;', '', block)
                    return block[:-1] + f'src: url("{ttf[1]}") format("truetype"); }}'
                data = re.sub(r'@font-face\s*\{[^}]+\}', working_font, data.decode()).encode()
        destination = PUBLIC / local.lstrip('/')
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(data)
        assets[url]['bytes'] = len(data)
        print(f'Asset {local} ({len(data)} bytes)', flush=True)
        return local + (f'#{fragment}' if fragment else '')
    except RuntimeError as error:
        failures[url] = str(error)
        assets[url]['error'] = str(error)
        return reference


def rewrite_css(css, context):
    return CSS_URL.sub(lambda match: f'url("{asset(match[2], context)}")', css)


def migrate(path):
    page_url = f'{ORIGIN}/{path.name}'
    soup = BeautifulSoup(path.read_text(), 'html.parser')
    # Published builder/account/analytics code is not a portable site backend.
    # The small local runtime implements the actual interactions used here.
    for tag in soup.select('script, #customer-accounts-app, .footer-wrap'):
        tag.decompose()
    for tag in soup.select('meta[property="og:url"], meta[property="og:image"]'):
        tag.decompose()
    for tag in soup.select('link[rel="stylesheet"]'):
        tag['href'] = asset(tag['href'], page_url)
    for tag in soup.select('[src]'):
        if tag.name == 'iframe':
            tag['src'] = urljoin(page_url, tag['src'])
            tag['title'] = f'YouTube video {urlsplit(tag["src"]).path.rsplit("/", 1)[-1]}'
            tag['loading'] = 'lazy'
            embeds.append({'page': path.name, 'url': tag['src']})
        else:
            tag['src'] = asset(tag['src'], page_url)
    for tag in soup.select('[style]'):
        tag['style'] = rewrite_css(tag['style'], page_url)
    for tag in soup.select('style'):
        tag.string = rewrite_css(tag.get_text(), page_url)
    for tag in soup.find_all(True):
        for name in list(tag.attrs):
            if name.lower().startswith('on'):
                del tag[name]
    for tag in soup.select('a[href]'):
        href = tag['href']
        if href.startswith(ORIGIN):
            tag['href'] = href[len(ORIGIN):] or '/'
        elif href.startswith('//'):
            tag['href'] = 'https:' + href
        if tag.get('target') == '_blank':
            tag['rel'] = ['noopener', 'noreferrer']
    # These three template buttons have no gallery destination in the original.
    # Make them useful by opening the images already present in their section.
    for tag in soup.select('a[href="javascript:;"]'):
        section = tag.find_parent(class_='wsite-section')
        pictures = section.select('img[src]') if section else []
        pictures = [p['src'] for p in pictures if 'divider-graphic' not in p['src']]
        if pictures:
            tag['href'] = pictures[0]
            tag['data-gallery'] = json.dumps(pictures)
        else:
            del tag['href']
    for tag in soup.select('.hamburger'):
        tag.name = 'button'
        tag.attrs.pop('href', None)
        tag['type'] = 'button'
        tag['aria-expanded'] = 'false'
        tag['aria-controls'] = 'navMobile'
    for tag in soup.select('.desktop-nav, #navMobile'):
        tag['aria-label'] = 'Main navigation'
    for tag in soup.select('#navMobile [id="active"]'):
        del tag['id']
    soup.body['class'] = soup.body.get('class', []) + ['fade-in']
    extra_css = soup.new_tag('link', rel='stylesheet', href='/assets/migration.css')
    soup.head.append(extra_css)
    soup.head.append(soup.new_tag('link', rel='icon', href='/favicon.svg', type='image/svg+xml'))
    script = soup.new_tag('script', src='/assets/site.js', defer=True)
    soup.body.append(script)
    (PUBLIC / path.name).write_text(str(soup))
    print(f'Page {path.name}', flush=True)


def main():
    PUBLIC.mkdir(exist_ok=True)
    for path in sorted((ROOT / 'archive/original-pages').glob('*.html')):
        migrate(path)
    report = {'source': ORIGIN, 'pages': sorted(p.name for p in PUBLIC.glob('*.html')),
              'assets': assets, 'download_failures': failures, 'external_embeds': embeds}
    (ROOT / 'archive/migration-manifest.json').write_text(json.dumps(report, indent=2) + '\n')
    print(f'{len(report["pages"])} pages, {len(assets)} assets, {len(failures)} failures')
    if failures:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
