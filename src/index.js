const byUnique = (x, i, all) =>
  all.indexOf(x) === i

export const all = (field, list) =>
  list.map(x => x[field])
    .sort()

export const unique = (...args) =>
  all(...args)
    .filter(byUnique)

export default {
  all,
  unique,
}
