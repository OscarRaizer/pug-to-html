export function parseVueFile(content) {
  const templateMatch = content.match(/<template[^>]*>([\s\S]*?)<\/template>/);
  const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/);
  const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/);

  return {
    template: templateMatch ? templateMatch[0] : null,
    templateContent: templateMatch ? templateMatch[1].trim() : null,
    script: scriptMatch ? scriptMatch[0] : null,
    scriptContent: scriptMatch ? scriptMatch[1].trim() : null,
    style: styleMatch ? styleMatch[0] : null,
    styleContent: styleMatch ? styleMatch[1].trim() : null,
  };
}

export function hasPugTemplate(content) {
  return /<template\s+lang=["']pug["']/.test(content);
}

export function extractPugTemplate(content) {
  const templateMatch = content.match(/<template\s+lang=["']pug["']>([\s\S]*?)<\/template>/);

  if (!templateMatch) {
    return null;
  }

  const pugContent = templateMatch[1].trim();

  // Remove common indentation
  const lines = pugContent.split("\n");
  const firstLineIndent = lines.find((line) => line.trim())?.match(/^(\s*)/)?.[1]?.length || 0;

  if (firstLineIndent > 0) {
    const dedentedLines = lines.map((line) =>
      line.length >= firstLineIndent ? line.slice(firstLineIndent) : line
    );
    return dedentedLines.join("\n");
  }

  return pugContent;
}

export function replaceTemplate(content, htmlTemplate) {
  const templateMatch = content.match(/<template\s+lang=["']pug["']>([\s\S]*?)<\/template>/);

  if (!templateMatch) {
    return content;
  }

  // Format HTML with proper indentation for Vue template
  const formattedHtml = htmlTemplate
    .split("\n")
    .map((line) => (line ? `  ${line}` : line))
    .join("\n");

  const newTemplate = `<template>\n${formattedHtml}\n</template>`;

  return content.replace(templateMatch[0], newTemplate);
}

export function getVueTemplateLang(content) {
  const templateMatch = content.match(/<template\s+lang=["']([^"']+)["']/);
  return templateMatch ? templateMatch[1] : null;
}
