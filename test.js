'use strict'

const test     = require('tap'),
      Deferred = require('.')

test.test('basic', test => {
    test.test('instantiation', test => {
        test.type(new Deferred, Promise)
        test.type(new Deferred, Deferred)
        test.end()
    })

    test.test('resolve', test => {
        test.test('without executor', test => {
            const d = new Deferred

            d.then(value => {
                test.equals(value, 'test')
                test.end()
            })

            setImmediate(() => d.resolve('test'))
        })

        test.test('with executor - resolve from outside', test => {
            const d = new Deferred(resolve => {
                setTimeout(() => resolve(1), 25)
            })

            d.then(value => {
                test.equals(value, 2)
                test.end()
            })

            setImmediate(() => d.resolve(2))
        })

        test.test('with executor - resolve from inside', test => {
            const d = new Deferred(resolve => {
                setImmediate(() => resolve(1))
            })

            d.then(value => {
                test.equals(value, 1)
                test.end()
            })

            setTimeout(() => d.resolve(2), 25)
        })

        test.end()
    })

    test.test('reject', test => {
        test.test('without executor', test => {
            const d = new Deferred

            d.catch(reason => {
                test.equals(reason, 'test')
                test.end()
            })

            setImmediate(() => d.reject('test'))
        })

        test.test('with executor - resolve from outside', test => {
            const d = new Deferred((resolve, reject) => {
                setTimeout(() => reject(1), 25)
            })

            d.catch(reason => {
                test.equals(reason, 2)
                test.end()
            })

            setImmediate(() => d.reject(2))
        })

        test.test('with executor - resolve from inside', test => {
            const d = new Deferred((resolve, reject) => {
                setImmediate(() => reject(1))
            })

            d.catch(reason => {
                test.equals(reason, 1)
                test.end()
            })

            setTimeout(() => d.reject(2), 25)
        })

        test.end()
    })

    test.end()
})

test.test('done', test => {
    test.test('resolve', test => {
        const d = new Deferred

        d.done((error, result) => {
            test.equals(error, null)
            test.equals(result, 'test')
            test.end()
        })

        setImmediate(() => d.resolve('test'))
    })

    test.test('reject', test => {
        const d = new Deferred

        d.done(error => {
            test.equals(error, 'test')
            test.end()
        })

        setImmediate(() => d.reject('test'))
    })

    test.end()
})

test.test('callback', test => {
    const fs = require('fs')

    test.test('success', test => {
        const d = new Deferred

        fs.readFile(__filename, 'utf8', d.callback())

        d.then(value => {
            test.ok(value.startsWith("'use strict'"))
            test.end()
        })
    })

    test.test('error', test => {
        const d = new Deferred

        fs.readFile('/path/to/not/existing/file', 'utf8', d.callback())

        d.catch(error => {
            test.type(error, Error)
            test.end()
        })
    })

    test.end()
})

test.test('all', test => {
    test.test('resolve', test => {
        const d = Deferred.all([
            Promise.resolve(1),
            2,
            Promise.resolve(3)
        ])

        test.type(d, Deferred)

        d.done((err, result) => {
            test.equals(err, null)
            test.same(result, [ 1, 2, 3 ])
            test.end()
        })
    })

    test.test('reject', test => {
        const d = Deferred.all([
            Promise.reject(1),
            2,
            Promise.resolve(3)
        ])

        test.type(d, Deferred)

        d.done(err => {
            test.equals(err, 1)
            test.end()
        })
    })

    test.end()
})

test.test('race', test => {
    test.test('resolve', test => {
        const d = Deferred.race([
            Deferred.resolve(1),
            2,
            Promise.reject(3)
        ])

        test.type(d, Deferred)

        d.done((err, value) => {
            test.equals(value, 1)
            test.end()
        })
    })

    test.test('reject', test => {
        const d = Deferred.race([
            Deferred.reject(1),
            2,
            Promise.resolve(3)
        ])

        test.type(d, Deferred)

        d.done(err => {
            test.equals(err, 1)
            test.end()
        })
    })

    test.end()
})

test.test('chain', test => {
    const arr = []
    let d

    Promise
        .resolve()
        .then(() => {
            arr.push(2)
            return d = new Deferred
        })
        .then(value => arr.push(value))
        .then(value => {
            test.equals(value, 4)
            test.same(arr, [ 1, 2, 3, 4 ])
            test.end()
        })

    arr.push(1)
    setImmediate(() => {
        arr.push(3)
        d.resolve(4)
    })
})
