from html import escape
from pathlib import Path
import re


def inline(text: str) -> str:
    rendered = escape(text)
    rendered = re.sub(r'\[([^\]]+)\]\((https?://[^\s)]+)\)', r'<a href="\2">\1</a>', rendered)
    rendered = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', rendered)
    return re.sub(r'\*([^*]+)\*', r'<em>\1</em>', rendered)


def markdown_to_html(markdown: str) -> str:
    output = []
    list_open = False

    def close_list() -> None:
        nonlocal list_open
        if list_open:
            output.append('</ul>')
            list_open = False

    for raw_line in markdown.replace('\r', '').splitlines():
        line = raw_line.strip()
        if not line:
            close_list()
            continue
        heading = re.match(r'^(#{1,3})\s+(.+)$', line)
        item = re.match(r'^[-*]\s+(.+)$', line)
        if heading:
            close_list()
            level = len(heading.group(1))
            text = heading.group(2)
            slug = re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')
            output.append(f'<h{level} id="{slug}">{inline(text)}</h{level}>')
        elif item:
            if not list_open:
                output.append('<ul>')
                list_open = True
            output.append(f'<li>{inline(item.group(1))}</li>')
        else:
            close_list()
            output.append(f'<p>{inline(line)}</p>')

    close_list()
    return '\n'.join(output)


root = Path(__file__).parent
template = (root / '_layouts' / 'default.html').read_text()
content = (root / 'content.md').read_text()
(root / 'index.html').write_text(template.replace('__CONTENT__', markdown_to_html(content)))
