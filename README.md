# list-field-values
[![Build Status](https://travis-ci.com/reergymerej/list-field-values.svg?branch=master)](https://travis-ci.com/reergymerej/list-field-values)

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

// Find extra fields that are in a minority of lists.
app.extra('key', list, list2, list3)
[
  ['z'], // list
  [], // list2
  ['d'], // list3
]

// Find field value dupes in a single list.
app.dupes('color', [
    { color: 'red' },
    { color: 'orange' },
    { color: 'yellow' },
    { color: 'green' },
    { color: 'red' },
    { color: 'green' },
])
[
  'green',
  'red',
]

// Find field value dupes in a list, across two dimensions.
app.dupes(['type', 'color'],
  [
    { type: 'eyes', color: 'blue', other: 'junk', },
    { type: 'eyes', color: 'blue', },
    { type: 'eyes', color: 'green', },
    { type: 'hair', color: 'blonde', },
    { type: 'hair', color: 'green', },
  ]
)
[
  {
    type: 'eyes',
    color: 'blue',
  },
]



// Tally by multiple dimensions
app.tallyDimensions(['a', 'b'], [
  { a: 'one', b: 'three' },
  { a: 'one', b: 'two' },
  { a: 'one', b: 'two' },
  { a: 'three', b: 'four' },
  { a: 'three', b: 'four' },
  { a: 'three', b: 'two' },
  { c: 'one', b: 'two' },
])
[
  {
    one: { two: 2, three: 1, },
    three: { two: 1, four: 2, },
  },
]


app.tallyDimensions(['type', 'color'],
  [
    { type: 'eyes', color: 'blue', },
    { type: 'eyes', color: 'brown', },
    { type: 'hair', color: 'brown', },
  ],
  [
    { type: 'eyes', color: 'blue', },
    { type: 'eyes', color: 'brown', },
    { type: 'hair', color: 'green', },
    { type: 'hair', color: 'green', },
    { type: 'jeans', color: 'blue', },
  ],
  [
    { type: 'eyes', color: 'blue', other: 'junk', },
    { type: 'eyes', color: 'brown', },
    { type: 'eyes', color: 'green', },
    { type: 'hair', color: 'blonde', },
    { type: 'hair', color: 'green', },
  ],
)
[
  {
    eyes: { blue: 1, brown: 1, },
    hair: { brown: 1, },
  },
  {
    eyes: { brown: 1, blue: 1, },
    hair: { green: 2, },
    jeans: { blue: 1, },
  },
  {
    eyes: { brown: 1, blue: 1, green: 1, },
    hair: { blonde: 1, green: 1, },
  },
]

```
