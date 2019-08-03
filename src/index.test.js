import app from '.'

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

describe('all', () => {
  it('should get list of all keys', () => {
    expect(app.all('key', list)).toEqual(
      [ 'a', 'a', 'a', 'z' ]
    )
  })

  it('should get list of all vals', () => {
    expect(app.all('val', list)).toEqual(
      [ 'aaaa', 'asdf', 'asdf', 'zxcv' ]
    )
  })
})

describe('unique', () => {
  it('should get list of unique keys', () => {
    expect(app.unique('key', list)).toEqual(
      [ 'a', 'z' ]
    )
  })

  it('should get list of unique vals', () => {
    expect(app.unique('val', list)).toEqual(
      [ 'aaaa', 'asdf', 'zxcv' ]
    )
  })

  it('should get list of unique keys across lists', () => {
    expect(app.unique('key', list, list2, list3)).toEqual(
      [ 'a', 'b', 'c', 'd', 'z' ]
    )
  })
})

describe('tally', () => {
  it('should get count of fields including dupes', () => {
    expect(
      app.tally('key', list)
    ).toEqual(
      {
        a: 3, // does not dedupe
        z: 1,
      }
    )
  })

  it('should get count of fields across lists', () => {
    expect(
      app.tallyUnique('key', list, list2, list3)
    ).toEqual(
      {
        a: 3,
        b: 2,
        c: 2,
        d: 1,
        z: 1,
      }
    )
  })
})

describe('missing', () => {
  it('should find missing fields that are in a majority of lists', () => {
    expect(
      app.missing('key', list, list2, list3)
    ).toEqual(
      [
        ['b', 'c'], // list
        [], // list2
        [], // list3
      ]
    )
  })
})

describe('extra', () => {
  it('should find extra fields that are in a minority of lists', () => {
    expect(
      app.extra('key', list, list2, list3)
    ).toEqual(
      [
        ['z'], // list
        [], // list2
        ['d'], // list3
      ]
    )
  })
})
