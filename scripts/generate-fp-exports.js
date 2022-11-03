const fs = require('fs/promises')
const { default: getExports } = require('ts-file-exports')

const CODE_GEN_START = '/* Build list */'
const CODE_GEN_END = '/* end */'

async function generate(file, primitive) {
  const keys = Object.values(getExports(`./src/${file}.ts`)).map(value => value.escapedName)
  const path = `./src/fp/${file}.ts`
  const stringFile = await fs.readFile(path, 'utf-8')

  const startIndex = stringFile.indexOf(CODE_GEN_START)
  const endIndex = stringFile.indexOf(CODE_GEN_END)
  const codeBefore = stringFile.slice(0, startIndex)
  const codeAfter = stringFile.slice(endIndex + CODE_GEN_END.length)
  
  const code = codeBefore + CODE_GEN_START + keys.join(', ') + CODE_GEN_END + codeAfter
  if (!code) {
    throw new Error('Could not generate code for ', file)
  }
  await fs.writeFile(path, code, 'utf-8')
}

console.log('Generate FP exports')
Promise.all([
  generate('string', ''),
  generate('map', new Map()),
  generate('array', []),
  generate('number', 0),
]).then(() => {
  console.log('Done generating FP exports')
  process.exit(0)
}).catch(error => {
  console.error(error.message)
  process.exit(1)
})