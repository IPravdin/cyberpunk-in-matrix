#!/usr/bin/env python3
"""Offline integrity checks. Uses only Python's standard library."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
import re

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
CSS_URL = re.compile(r'url\(\s*([\'"]?)(.*?)\1\s*\)', re.I)
errors = []
checked = 0


def check_reference(reference, owner, external_allowed=False):
    global checked
    if not reference or reference.startswith(('data:', '#', 'mailto:', 'tel:')):
        return
    parsed = urlsplit(reference)
    if parsed.scheme or parsed.netloc:
        if not external_allowed:
            errors.append(f'{owner.relative_to(ROOT)}: remote dependency {reference}')
        return
    local = PUBLIC / unquote(parsed.path.lstrip('/')) if reference.startswith('/') else owner.parent / unquote(parsed.path)
    if local.is_dir():
        local /= 'index.html'
    checked += 1
    if not local.is_file():
        errors.append(f'{owner.relative_to(ROOT)}: missing {reference}')


class Page(HTMLParser):
    def __init__(self, path, validate=True):
        super().__init__(convert_charrefs=True)
        self.path, self.validate, self.depth, self.text = path, validate, 0, []
        self.feed(path.read_text())

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == 'div':
            if self.depth:
                self.depth += 1
            elif attrs.get('id') == 'wsite-content':
                self.depth = 1
        if not self.validate:
            return
        if attrs.get('href') and tag == 'a':
            check_reference(attrs['href'], self.path, external_allowed=True)
            if attrs['href'].startswith('javascript:'):
                errors.append(f'{self.path.name}: inert JavaScript link')
        elif attrs.get('href'):
            check_reference(attrs['href'], self.path)
        if attrs.get('src'):
            check_reference(attrs['src'], self.path, external_allowed=tag == 'iframe')
        for match in CSS_URL.finditer(attrs.get('style', '')):
            check_reference(match[2], self.path)
        if any(key.lower().startswith('on') for key in attrs):
            errors.append(f'{self.path.name}: inline handler retained')

    def handle_endtag(self, tag):
        if tag == 'div' and self.depth:
            self.depth -= 1

    def handle_data(self, data):
        if self.depth:
            self.text.append(data)

    def content(self):
        return ' '.join(' '.join(self.text).split())


manifest = json.loads((ROOT / 'archive/migration-manifest.json').read_text())
assert not manifest['download_failures'], 'Asset downloads failed'
for original in sorted((ROOT / 'archive/original-pages').glob('*.html')):
    local = PUBLIC / original.name
    if not local.is_file():
        errors.append(f'Missing page: {original.name}')
        continue
    page = Page(local)
    if page.content() != Page(original, validate=False).content():
        errors.append(f'{original.name}: original page text changed')
for stylesheet in PUBLIC.rglob('*.css'):
    for match in CSS_URL.finditer(stylesheet.read_text()):
        check_reference(match[2], stylesheet)
for url, info in manifest['assets'].items():
    path = PUBLIC / info['path'].lstrip('/')
    if not path.is_file() or path.stat().st_size != info['bytes']:
        errors.append(f'Asset missing or changed: {url}')
if errors:
    print('\n'.join(errors))
    raise SystemExit(1)
print(f'PASS: {len(manifest["pages"])} pages retain their original text; '
      f'{len(manifest["assets"])} assets archived; {checked} local references resolve. '
      f'Only {len(manifest["external_embeds"])} YouTube embeds require an external service.')
