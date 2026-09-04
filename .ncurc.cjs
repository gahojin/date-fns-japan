/** @type {import('npm-check-updates').RcOptions } */
module.exports = {
  target: (name) => {
    if (name === '@types/node' || name === 'pnpm') {
      return 'minor'
    }
    return 'newest'
  },
  cooldown: 7,
}
