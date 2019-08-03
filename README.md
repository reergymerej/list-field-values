# list-field-values

list
* unique field values
* duplicate field values

compare lists
  * extra field values (not in majority)
  * missing field values
  * repeated field values (across lists)
* unique field values
* key tally


```js
import app from 'list-field-values'

const list = [
  { key: 'a', val: 'asdf' },
  { key: 'z', val: 'zxcv' },
  { key: 'a', val: 'asdf' },
  { key: 'a', val: 'aaaa' },
]

const list2 = [
  { key: 'a', val: 'red' },
  { key: 'b', val: 'orange' },
  { key: 'c', val: 'yellow' },
]

const list3 = [
  { key: 'a', val: 'green' },
  { key: 'b', val: 'blue' },
  { key: 'c', val: 'indigo' },
  { key: 'd', val: 'violet' },
]

app.all('key', list)
[ 'a', 'a', 'a', 'z' ]

app.all('val', list)
[ 'aaaa', 'asdf', 'asdf', 'zxcv' ]

app.unique('key', list)
[ 'a', 'z' ]

app.unique('val', list)
[ 'aaaa', 'asdf', 'zxcv' ]

app.unique('key', list, list2, list3)
[ 'a', 'b', 'c', 'd', 'z']

app.tally('key', list)
{
  a: 3, // does not dedupe
  z: 1,
}

app.tallyUnique('key', list, list2, list3)
{
  a: 3,
  b: 2,
  c: 2,
  d: 1,
  z: 1,
}

// Find missing fields that are in a majority of lists.
app.missing('key', list, list2, list3)
[
  ['b', 'c'], // list
  [], // list2
  [], // list3
]
```
