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

  it('should tally by multiple dimensions', () => {
    expect(
      app.tallyDimensions(['a', 'b'], [
        { a: 'one', b: 'two' },
        { a: 'three', b: 'two' },
        { a: 'one', b: 'two' },
        { a: 'one', b: 'three' },
        { c: 'one', b: 'two' },
        { a: 'three', b: 'four' },
        { a: 'three', b: 'four' },
      ])
    ).toEqual(
      [
        {
          one: {
            two: 2,
            three: 1,
          },
          three: {
            two: 1,
            four: 2,
          },
        }
      ]
    )
  })

  it('should tally by 3 dimensions', () => {
    expect(
      app.tallyDimensions(['a', 'b', 'c'], [
        { a: 'one', b: 'two', c: 'three' },
        { a: 'one', b: 'two', c: 'three' },
        { a: 'one', b: 'two', c: 'four', },
        { a: 'one', b: 'three', c: 'three', },
        { a: 'one', b: 'three', c: 'four', },
        { a: 'two', b: 'two', c: 'three', },
        { a: 'two', b: 'two', c: 'four', },
      ])
    ).toEqual(
      [
        {
          one: {
            two: {
              three: 2,
              four: 1,
            },
            three: {
              three: 1,
              four: 1,
            },
          },
          two: {
            two: {
              three: 1,
              four: 1,
            },
          },
        }
      ]
    )
  })

  it('should group multiple lists by multiple dimensions', () => {
    expect(
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
    ).toEqual(
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

describe('dupes', () => {
  it('should find field value dupes in a single list', () => {
    expect(
      app.dupes('color', [
        { color: 'red' },
        { color: 'orange' },
        { color: 'yellow' },
        { color: 'green' },
        { color: 'red' },
        { color: 'green' },
      ])
    ).toEqual(
      [
        'green',
        'red',
      ]
    )
  })

  describe('given a tally', () => {
    it('should find duplicates', () => {
      expect(
        app.dupesFromTally({
          foo: 1,
          boo: 2,
          blarg: 1,
          forst: 5,
        })
      ).toEqual(
        {
          boo: 2,
          forst: 5,
        }
      )
    })

    it('should find duplicates in multi-dimensional tallies', () => {
      expect(
        app.dupesFromTally({
          one: { two: 2, three: 1, },
          three: { two: 1, four: 2, },
          green: { goose: 1, chicken: 3, },
        })
      ).toEqual(
        {
          one: { two: 2, },
          three: { four: 2, },
          green: { chicken: 3, },
        }
      )
    })
  })
})
