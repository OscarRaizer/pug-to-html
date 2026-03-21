# Pug to HTML Converter for Vue

## Wiki

[Open full documentation](https://github.com/OscarRaizer/pug-to-html/wiki)

## Installation
📦 NPM  
https://www.npmjs.com/package/@alexbolt/pug-to-html-cli

```bash
pnpm add -g @alexbolt/pug-to-html-cli
```

## Usage

```bash
# Convert all Vue files in current directory
pug-to-html

# Convert specific directory
pug-to-html src/components

# Convert specific file
pug-to-html src/components/component.vue

# Convert with options
pug-to-html . --backup --dry-run --verbose

# Show help
pug-to-html --help
```

## Features

- 🚀 Fast recursive scanning for Vue files
- 🔧 Preserves Vue attributes and directives
- 📦 Creates backup files before conversion
- ✅ Dry run mode to preview changes
- 🎨 Preserves formatting and indentation
- 📊 Detailed conversion statistics
- 🚫 Intelligent ignore patterns

## Vue Features Supported

- `v-bind:` / `:` - Data bindings
- `v-on:` / `@` - Event handlers
- `v-slot:` / `#` - Slots
- `v-if`, `v-else-if`, `v-else` - Conditional rendering
- `v-for` - List rendering
- `v-show`, `v-model` - Display and form bindings
- All `v-*` directives and custom directives
- Event modifiers (`@click.stop.prevent`)
- Dynamic attributes (`:[key]="value"`)
- Interpolations `{{ }}`

## Options

| Option                       | Description                                         |
| ---------------------------- | --------------------------------------------------- |
| `-i, --ignore <patterns...>` | Ignore patterns (default: node_modules, .git, dist) |
| `-d, --dry-run`              | Show what would be converted without making changes |
| `-b, --backup`               | Create backup files before converting               |
| `-o, --output <dir>`         | Output directory (default: overwrite files)         |
| `-v, --verbose`              | Verbose output                                      |
| `-p, --pretty`               | Format HTML output with indentation                 |
| `--no-recursive`             | Disable recursive search                            |

## Example

Before conversion:

```vue
<template lang="pug">
.container
  h1 {{ title }}
  button(@click="increment") Click me
  div(v-if="showContent", :class="{ active: isActive }") Content
</template>
```

After conversion:

```vue
<template>
  <div class="container">
    <h1>{{ title }}</h1>
    <button @click="increment">Click me</button>
    <div v-if="showContent" :class="{ active: isActive }">Content</div>
  </div>
</template>
```

## Architecture

```
src/
├── index.js                    # CLI interface
├── scanner.js                  # File scanning logic
├── converters/
│   ├── vue-converter.js        # Main conversion logic
│   └── pug-processor.js        # Pug compilation
├── utils/
│   ├── vue-parser.js          # Vue SFC parsing
│   └── file-utils.js          # File operations
└── plugins/
    └── vue-attributes-plugin.js # Pug plugin for Vue attributes
```

## License

MIT
