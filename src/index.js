const byUnique = (x, i, all) =>
  all.indexOf(x) === i

const applyOperations = (operations, list) =>
  operations.reduce((acc, operation) =>
    operation(acc), list)

const flatten = (listOperations, field, lists) =>
  lists.reduce((acc, list) => ([
    ...acc,
    ...applyOperations(listOperations, list),
  ]), [])

const _tally = (list) => list.reduce((acc, value) => ({
  ...acc,
  [value]: (acc[value] || 0) + 1,
}), {})

const fieldMapper = (field) =>
  (list) => list.map(x => x[field])

export const all = (field, ...lists) => {
  const operations = [
    fieldMapper(field),
  ]
  return flatten(operations, field, lists)
    .sort()
}

export const unique = (...args) =>
  all(...args)
    .filter(byUnique)

export const tally = (field, ...lists) => {
  const operations = [
    fieldMapper(field),
  ]
  return _tally(
    flatten(operations, field, lists)
  )
}

export const tallyUnique = (field, ...lists) => {
  const operations = [
    fieldMapper(field),
    (list) => list.filter(byUnique),
  ]
  return _tally(
    flatten(operations, field, lists)
  )
}

const getCommonality = (field, ...lists) => {
  const t = tallyUnique(field, ...lists)
  const half = Math.ceil(lists.length / 2)
  return Object.keys(t)
    .reduce((acc, value) => {
      const prop = t[value] >= half
        ? 'common'
        : 'uncommon'
      return {
        ...acc,
        [prop]: [
          ...acc[prop],
          value,
        ],
      }
    }, {
      common: [],
      uncommon: [],
    })
}

const fieldWithValue = (field, value) =>
  row => row[field] === value

export const missing = (field, ...lists) => {
  const { common } = getCommonality(field, ...lists)
  // for each list, return missing common fields
  return lists.map((list) => {
    return common.filter(fieldName => {
      return !list.some(fieldWithValue(field, fieldName))
    })
  })
}

export const extra = (field, ...lists) => {
  const { uncommon } = getCommonality(field, ...lists)
  // for each list, return uncommon fields
  return lists.map((list) => {
    return uncommon.filter(fieldName => {
      return list.some(fieldWithValue(field, fieldName))
    })
  })
}

export const dupes = (field, ...lists) => {
  const t = tally(field, ...lists)
  return Object.keys(t)
    .filter(fieldName => t[fieldName] > 1)
    .sort()
}

export default {
  all,
  dupes,
  extra,
  missing,
  tally,
  tallyUnique,
  unique,
}
