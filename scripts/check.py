#!/usr/bin/env python3
"""Check the retained static site using only Python's standard library."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import re

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
CSS_URL = re.compile(r'url\(\s*([\'"]?)(.*?)\1\s*\)', re.I)
errors = []
referenced = set()
external_embeds = set()
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
    path = unquote(parsed.path)
    local = (PUBLIC / path.lstrip('/') if path.startswith('/') else owner.parent / path).resolve()
    if local.is_dir():
        local /= 'index.html'
    checked += 1
    referenced.add(local)
    if not local.is_file():
        errors.append(f'{owner.relative_to(ROOT)}: missing {reference}')


def check_css(css, owner):
    for match in CSS_URL.finditer(css):
        check_reference(match[2], owner)


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path, self.in_style = path, False
        self.feed(path.read_text())

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == 'style':
            self.in_style = True
        if attrs.get('href'):
            check_reference(attrs['href'], self.path, external_allowed=tag == 'a')
            if attrs['href'].strip().lower().startswith('javascript:'):
                errors.append(f'{self.path.name}: inert JavaScript link')
        if attrs.get('src'):
            check_reference(attrs['src'], self.path, external_allowed=tag == 'iframe')
            if tag == 'iframe' and urlsplit(attrs['src']).netloc:
                external_embeds.add((self.path.name, attrs['src']))
        if attrs.get('poster'):
            check_reference(attrs['poster'], self.path)
        check_css(attrs.get('style', ''), self.path)
        if any(key.lower().startswith('on') for key in attrs):
            errors.append(f'{self.path.name}: inline handler retained')

    def handle_endtag(self, tag):
        if tag == 'style':
            self.in_style = False

    def handle_data(self, data):
        if self.in_style:
            check_css(data, self.path)


pages = sorted(PUBLIC.rglob('*.html'))
if not (PUBLIC / 'index.html').is_file():
    errors.append('Missing homepage: public/index.html')
for page in pages:
    Page(page)
# Follow linked CSS so orphan stylesheets cannot keep unused assets alive.
stylesheets = set()
while pending := {p for p in referenced if p.suffix == '.css' and p.is_file()} - stylesheets:
    stylesheet = sorted(pending)[0]
    stylesheets.add(stylesheet)
    check_css(stylesheet.read_text(), stylesheet)
assets = {p.resolve() for p in PUBLIC.rglob('*') if p.is_file() and p.suffix != '.html'}
for asset in sorted(assets - referenced):
    errors.append(f'Unreferenced asset: {asset.relative_to(ROOT)}')
if errors:
    print('\n'.join(errors))
    raise SystemExit(1)
print(f'PASS: {len(pages)} pages; {len(assets)} referenced assets; '
      f'{checked} local references resolve; {len(external_embeds)} external embeds.')
