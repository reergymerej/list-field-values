# key-pair

* list of unique keys
* list of unique values
* duplicate keys
* duplicate values


```js
const list = [
  { key: 'a', val: 'asdf' },
  { key: 'z', val: 'zxcv' },
  { key: 'a', val: 'asdf' },
  { key: 'a', val: 'aaaa' },
]

app.all('key', list)
// [ 'a', 'a', 'a', 'z' ]

app.all('val', list)
// [ 'aaaa', 'asdf', 'asdf', 'zxcv' ]

app.unique('key', list)
// [ 'a', 'z' ]

app.unique('val', list)
// [ 'aaaa', 'asdf', 'zxcv' ]
```
