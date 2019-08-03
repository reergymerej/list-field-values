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

export const missing = (field, ...lists) => {
  const t = tallyUnique(field, ...lists)
  const half = Math.ceil(lists.length / 2)
  const commonFields = Object.keys(t)
    .filter(value => t[value] >= half)

  // for each list, return missing common fields
  return lists.map((list) => {
    return commonFields.filter(fieldName => {
      return !list.some(row => row[field] === fieldName)
    })
  })
}

export default {
  all,
  missing,
  tally,
  tallyUnique,
  unique,
}
