const Y = require('yjs')
const typeson = require('typeson')
const doc = new Y.Doc()
const yMap = doc.getMap()

class A {
  id = undefined

  constructor (id) {
    this.id = id
  }
}

const instanceA = new A('1')

const tSon = new typeson.Typeson().register({
  'A': [
    x => x instanceof A, x => x.id, x => new A(x)]
})

const result = tSon.stringify(instanceA)
console.log('result 1:', result)

function createMapProxy (map) {
  return new Proxy(map, {
    set: (target, p, value, receiver) => {
      const set = Reflect.get(target, 'set', receiver)
      return Reflect.apply(set, target, [p, tSon.stringify(value)])
    }, get: (target, p, receiver) => {
      const get = Reflect.get(target, 'get', receiver)
      const value = Reflect.apply(get, target, [p])
      return tSon.parse(value)
    }
  })
}

const proxy = createMapProxy(yMap)

proxy.a = instanceA
console.log('proxy.a', proxy.a)
console.log('yMap.a', yMap.get('a'))
