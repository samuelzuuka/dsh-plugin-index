#!/usr/bin/env node
/**
 * Build custom DSH plugin index by merging upstream index with own plugins.
 *
 * Usage: node build-index.js [--upstream-url URL] [--output FILE]
 */

import fs from 'fs';
import path from 'path';

const DEFAULT_UPSTREAM = 'https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json';
const DEFAULT_OUTPUT = 'index.json';

// Own plugins to add
const OWN_PLUGINS = [
  {
    name: '@z-imagine/dsh-free-light-search',
    title: { en: 'Free Light Search', zh: '轻量纯 AI 搜索' },
    description: { en: 'Multi-engine web search and fetch with free tiers, intelligent fallback, and API key rotation.', zh: '轻量纯 AI 搜索插件，面向 DeepSeek Harness (dsh)，零成本起步，多引擎回退。' },
    author: 'z-imagine',
    homepage: 'https://github.com/z-imagine/dsh-free-light-search',
    metadata: {
      category: 'tools'
    },
    keywords: ['search', 'web', 'fetch', 'free', 'lightweight'],
    versions: [
      {
        version: '1.0.0',
        source: {
          type: 'git',
          url: 'https://github.com/z-imagine/dsh-free-light-search.git',
          commit: 'd05264858ceb75f7a16b45505f48928191667015'
        },
        engines: { dsh: '>=0.2.0' },
        publishTimestamp: Math.floor(Date.now() / 1000)
      }
    ]
  }
];

function parseArgs() {
  const args = process.argv.slice(2);
  let upstreamUrl = DEFAULT_UPSTREAM;
  let output = DEFAULT_OUTPUT;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--upstream-url' && i + 1 < args.length) {
      upstreamUrl = args[++i];
    } else if (args[i] === '--output' && i + 1 < args.length) {
      output = args[++i];
    }
  }

  return { upstreamUrl, output };
}

async function fetchUpstream(url) {
  console.log(`Fetching upstream index from ${url}...`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`Fetched ${data.plugins.length} plugins from upstream`);
    return data;
  } catch (error) {
    console.error(`Failed to fetch upstream: ${error.message}`);
    throw error;
  }
}

function mergeIndexes(upstream, ownPlugins) {
  console.log(`Merging ${ownPlugins.length} own plugins...`);

  // Preserve upstream metadata (categories, labels, sortKeys)
  const merged = {
    format: 1,
    title: { en: 'z-imagine DSH Plugin Index', zh: 'z-imagine DSH 插件索引' },
    description: { en: 'Custom DSH plugin index by z-imagine, merging upstream with own plugins.', zh: 'z-imagine 自定义 DSH 插件索引，合并上游与自有插件。' },
    plugins: []
  };

  if (upstream && upstream.metadata) {
    merged.metadata = upstream.metadata;
  }

  // Add upstream plugins
  if (upstream && upstream.plugins) {
    merged.plugins.push(...upstream.plugins);
  }

  // Add own plugins
  for (const plugin of ownPlugins) {
    // Check if plugin already exists (by name)
    const existing = merged.plugins.find(p => p.name === plugin.name);
    if (existing) {
      console.log(`  Updating existing: ${plugin.name}`);
      existing.title = plugin.title;
      existing.description = plugin.description;
      existing.author = plugin.author;
      existing.homepage = plugin.homepage;
      if (plugin.metadata) existing.metadata = plugin.metadata;
      existing.keywords = plugin.keywords;
      existing.versions = plugin.versions;
    } else {
      console.log(`  Adding: ${plugin.name}`);
      merged.plugins.push(plugin);
    }
  }

  console.log(`Total plugins in merged index: ${merged.plugins.length}`);
  return merged;
}

function writeIndex(index, outputPath) {
  console.log(`Writing index to ${outputPath}...`);
  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2) + '\n');
  console.log('Done.');
}

async function main() {
  const { upstreamUrl, output } = parseArgs();

  // Try to fetch upstream, fall back to own plugins only if it fails
  let upstream = null;
  try {
    upstream = await fetchUpstream(upstreamUrl);
  } catch (error) {
    console.warn('Warning: Could not fetch upstream index. Building with own plugins only.');
  }

  const merged = mergeIndexes(upstream, OWN_PLUGINS);
  writeIndex(merged, output);
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
