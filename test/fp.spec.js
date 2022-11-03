const test = require('japa')
const str = require('../dist/fp/string')

test.group('Strings', () => {
  test('it can pipe through methods', (assert) => {
    const path = 'App/Controllers/user.js'
    const piped = str.pipe(path, str.afterLast('/'), str.beforeLast('.'), str.endWith('Controller'), str.capitalize)
    assert.equal(piped, 'UserController')
  })
})