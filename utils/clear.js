const clearcache = (req, res, next) => {
    res.set('Cache-Control', 'no-store')
    return next()
}

module.exports = clearcache