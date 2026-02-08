import walk from "pug-walk"

const VUE_ATTR_PATTERNS = {
  bind: /^v-bind:|^:/,
  on: /^v-on:|^@/,
  slot: /^v-slot:|^#/,
  directive: /^v-([a-z-]+)(?:$|:(.*)$)/,
  shorthand: /^@|^:|^#/,
}

export default function createVueAttributesPlugin() {
  return {
    postParse(ast, options) {
      walk(ast, (node, replace) => {
        if (node.type === "Tag" && node.attrs && node.attrs.length > 0) {
          node.attrs = node.attrs.map(attr => {
            const name = attr.name

            // Check if this is a Vue attribute
            if (isVueAttribute(name)) {
              // Don't escape Vue attribute values - they contain JavaScript expressions
              attr.mustEscape = false
            }

            return attr
          })
        }
      })
      return ast
    },
  }
}

function isVueAttribute(attrName) {
  return (
    VUE_ATTR_PATTERNS.bind.test(attrName) ||
    VUE_ATTR_PATTERNS.on.test(attrName) ||
    VUE_ATTR_PATTERNS.slot.test(attrName) ||
    VUE_ATTR_PATTERNS.directive.test(attrName) ||
    VUE_ATTR_PATTERNS.shorthand.test(attrName)
  )
}
