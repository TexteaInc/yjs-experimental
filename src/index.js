const Y = require('yjs')
const doc = new Y.Doc()
const yMap = doc.getMap()
const ref = {
  value: 1
}
yMap.set('foo', ref)

const proxy = new Proxy(yMap, {
  get: (target, p, receiver) => {
    console.log('call', p)
    if (p === 'get') {
      return Reflect.get(target, 'get', receiver)
    }
    if (p === '_map') {
      return Reflect.get(target, '_map', receiver)
    }
    const get = Reflect.get(target, 'get', receiver)
    return Reflect.apply(get, target, [p])
  }
})

console.log('same', proxy.get === yMap.get)
console.log('1', proxy.get('foo') === ref)
console.log('2', proxy['foo'] === ref)
