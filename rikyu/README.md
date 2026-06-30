# The supercomputer RIKYU manual

Documentation site for the supercomputer RIKYU, built with [Zensical](https://github.com/zensical/zensical).

## Published pages

| Language | URL |
|----------|-----|
| English  | https://docs.r-ccs.riken.jp/rikyu/en/ |
| Japanese | https://docs.r-ccs.riken.jp/rikyu/ja/ |

## Local development

### Prerequisites

Install Zensical via pip:

```bash
pip install zensical
```

### Preview locally

Run a local dev server with live reload:

```bash
zensical serve
```

Open http://127.0.0.1:8000 in your browser. The page refreshes automatically whenever you save a file.

### Build static files

To generate the static HTML under `site/`:

```bash
zensical build
```

## Contributing

Edit the Markdown files under `docs/` and open a pull request against `main`.

The published pages are updated within a few minutes of a push to `main`.

