import { readFile, writeFile, copyFile, fileExists } from '../utils/file-utils.js';
import { 
  parseVueFile, 
  hasPugTemplate, 
  extractPugTemplate, 
  replaceTemplate 
} from '../utils/vue-parser.js';
import { compilePugToHtml, validatePugCode } from './pug-processor.js';

export class VueConverter {
  constructor(options = {}) {
    this.options = {
      backup: false,
      dryRun: false,
      output: null,
      verbose: false,
      ...options
    };
  }

  async convertVueFile(filePath) {
    try {
      // Read file
      const content = await readFile(filePath);
      
      // Check if file has Pug template
      if (!hasPugTemplate(content)) {
        if (this.options.verbose) {
          console.log(`Skipping ${filePath}: No Pug template found`);
        }
        return { success: true, converted: false, reason: 'No Pug template' };
      }

      // Extract Pug template
      const pugCode = extractPugTemplate(content);
      if (!pugCode) {
        return { success: false, error: 'Failed to extract Pug template' };
      }

      // Validate Pug code
      const validation = validatePugCode(pugCode);
      if (!validation.valid) {
        return { success: false, error: `Invalid Pug syntax: ${validation.error}` };
      }

      // Convert Pug to HTML
      const htmlTemplate = compilePugToHtml(pugCode, {
        pretty: true,
        doctype: 'html'
      });

      // Replace template in file
      const newContent = replaceTemplate(content, htmlTemplate);

      // Determine output path
      const outputPath = this.options.output || filePath;

      // Handle backup
      if (this.options.backup && !this.options.dryRun) {
        await copyFile(filePath, `${filePath}.backup`);
        if (this.options.verbose) {
          console.log(`Created backup: ${filePath}.backup`);
        }
      }

      // Write file (unless dry run)
      if (!this.options.dryRun) {
        await writeFile(outputPath, newContent);
      }

      if (this.options.verbose) {
        console.log(`Converted ${filePath} ${this.options.dryRun ? '(dry run)' : ''}`);
      }

      return { 
        success: true, 
        converted: true, 
        inputPath: filePath,
        outputPath: outputPath,
        dryRun: this.options.dryRun
      };

    } catch (error) {
      return { success: false, error: error.message, inputPath: filePath };
    }
  }

  async convertMultipleFiles(filePaths) {
    const results = [];
    
    for (const filePath of filePaths) {
      const result = await this.convertVueFile(filePath);
      results.push(result);
      
      if (!result.success && this.options.verbose) {
        console.error(`Error converting ${filePath}: ${result.error}`);
      }
    }

    return results;
  }

  getStats(results) {
    const successful = results.filter(r => r.success).length;
    const converted = results.filter(r => r.converted).length;
    const failed = results.filter(r => !r.success).length;
    const skipped = results.filter(r => r.success && !r.converted).length;

    return {
      total: results.length,
      successful,
      converted,
      failed,
      skipped
    };
  }
}