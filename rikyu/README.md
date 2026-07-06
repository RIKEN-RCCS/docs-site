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
zensical serve -f en/zensical.toml
```

Open http://127.0.0.1:8000 in your browser. To preview the Japanese site, run `zensical serve -f ja/zensical.toml -a localhost:8001` and open http://127.0.0.1:8001.

### Build static files

To generate the static HTML under `site/`:

```bash
zensical build -f en/zensical.toml
zensical build -f ja/zensical.toml
```

## Contributing

Edit the Markdown files under `en/docs/` or `ja/docs/` and open a pull request against `main`.

The published pages are updated within a few minutes of a push to `main`.

## Note

The English and Japanese sites are built independently because the current search engine does not support searching each language separately within a single multilingual build. If Zensical supports language-scoped search in the future, merging the configuration back into a single build would be more convenient.
