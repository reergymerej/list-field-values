import app from '.'

const list = [
  { key: 'a', val: 'asdf' },
  { key: 'z', val: 'zxcv' },
  { key: 'a', val: 'asdf' },
  { key: 'a', val: 'aaaa' },
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
})
