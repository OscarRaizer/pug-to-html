import pug from "pug";
import createVueAttributesPlugin from "../plugins/vue-attributes-plugin.js";

export function compilePugToHtml(pugCode, options = {}) {
  const defaultOptions = {
    doctype: "html",
    pretty: true,
    plugins: [createVueAttributesPlugin()],
    ...options,
  };

  try {
    return pug.render(pugCode, defaultOptions);
  } catch (error) {
    throw new Error(`Pug compilation error: ${error.message}`);
  }
}

export function validatePugCode(pugCode) {
  try {
    pug.compile(pugCode, { doctype: "html", pretty: true });
    return { valid: true, error: null };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}
