const { create } = require('xmlbuilder2')

/**
 * @typedef {{}} MergeStringsOptions
 */

/**
 * Merges contents of given XML strings and returns resulting XML string.
 * @param {String[]} srcStrings   Array of strings to merge together.
 * @param {MergeStringsOptions} [options]   Merge options. Currently unused.
 * @return {String}
 */
module.exports.mergeToString = function (srcStrings, options) {
  const targetDoc = create({
    testExecutions: {}
  })

  const attrs = {
    version: 1
  }

  srcStrings.forEach((srcString) => {
    const doc = create(srcString, {})

    doc.root().each(
      (xmlBuilder) => {
        if (xmlBuilder.node.nodeName.toLowerCase() === 'file') {
          for (const attrNode of xmlBuilder.node.attributes) {
            const name = attrNode.name
            if (name in attrs) {
              attrs[name] += Number(attrNode.value)
            }
          }
          targetDoc.root().import(xmlBuilder)
        }
      },
      true,
      true
    )

    for (const attr in attrs) {
      targetDoc.root().att(attr, attrs[attr])
    }
  })

  return targetDoc.toString({
    prettyPrint: true,
    noDoubleEncoding: true
  })
}
