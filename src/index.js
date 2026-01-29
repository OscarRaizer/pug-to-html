#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanProject } from './scanner.js';
import { VueConverter } from './converters/vue-converter.js';
import { fileExists } from './utils/file-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
  .name('pug-to-html')
  .description('Convert Pug templates in Vue components to HTML')
  .version('1.0.0')
  .argument('[path]', 'Path to scan for Vue files', '.')
  .option('-i, --ignore <patterns...>', 'Ignore patterns', ['**/node_modules/**', '**/.git/**', '**/dist/**'])
  .option('-d, --dry-run', 'Show what would be converted without making changes')
  .option('-b, --backup', 'Create backup files before converting')
  .option('-o, --output <dir>', 'Output directory (default: overwrite files)')
  .option('-v, --verbose', 'Verbose output')
  .option('--no-recursive', 'Disable recursive search')
  .action(async (scanPath, options) => {
    try {
      // Validate input path
      const absolutePath = path.resolve(scanPath);
      if (!(await fileExists(absolutePath))) {
        console.error(chalk.red(`Error: Path does not exist: ${absolutePath}`));
        process.exit(1);
      }

      console.log(chalk.blue(`Scanning for Vue files in: ${absolutePath}`));

      // Scan for Vue files
      const vueFiles = await scanProject(absolutePath, {
        ignore: options.ignore,
        recursive: options.recursive
      });

      if (vueFiles.length === 0) {
        console.log(chalk.yellow('No Vue files found'));
        return;
      }

      console.log(chalk.green(`Found ${vueFiles.length} Vue file(s)`));

      if (options.verbose) {
        vueFiles.forEach(file => console.log(`  - ${file}`));
      }

      // Create converter
      const converter = new VueConverter({
        backup: options.backup,
        dryRun: options.dryRun,
        output: options.output,
        verbose: options.verbose
      });

      console.log(chalk.blue('Converting Pug templates to HTML...'));

      // Convert files
      const results = await converter.convertMultipleFiles(vueFiles);
      const stats = converter.getStats(results);

      // Display results
      console.log('\n' + chalk.bold('Conversion Summary:'));
      console.log(`  Total files: ${stats.total}`);
      console.log(`  ${chalk.green('Converted:')} ${stats.converted}`);
      console.log(`  ${chalk.yellow('Skipped:')} ${stats.skipped}`);
      
      if (stats.failed > 0) {
        console.log(`  ${chalk.red('Failed:')} ${stats.failed}`);
        
        if (options.verbose) {
          console.log('\n' + chalk.red('Failed files:'));
          results.filter(r => !r.success).forEach(result => {
            console.log(`  ${result.inputPath}: ${result.error}`);
          });
        }
      }

      if (stats.failed > 0) {
        process.exit(1);
      }

    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program.parse();