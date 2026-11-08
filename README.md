# z-imagine DSH Plugin Index

Custom DeepSeek Harness (DSH) plugin index by z-imagine, merging the upstream awesome-dsh-plugin catalog with own plugins.

## Index URL

```
https://z-imagine.github.io/dsh-plugin-index/index.json
```

## How to Use

Add this index as a custom plugin source in DSH:

1. Open DSH Web UI
2. Go to **Plugins** page
3. Enable **Custom plugin indexes** (Experimental plugins)
4. Go to **Discover** tab
5. Click **Add index source**
6. Enter: `https://z-imagine.github.io/dsh-plugin-index/index.json`

## Build

To rebuild the index locally:

```bash
npm install
node build-index.js
```

This script:
1. Fetches the upstream index from `https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json`
2. Merges own plugins (currently: `@z-imagine/dsh-free-light-search`)
3. Outputs the merged index to `index.json`

## Own Plugins

- **@z-imagine/dsh-free-light-search**: Multi-engine web search and fetch with free tiers

## License

CC0-1.0 (same as upstream)
