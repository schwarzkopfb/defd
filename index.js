'use strict'

const assert = require('assert')

class Deferred extends Promise {
    constructor(executor) {
        let _resolve, _reject

        super((resolve, reject) => {
            _resolve = resolve
            _reject  = reject

            if (executor) {
                assert.equal(typeof executor, 'function', 'executor must be a function')
                executor(resolve, reject)
            }
        })

        Object.defineProperties(this, {
            resolve: { value: _resolve },
            reject:  { value: _reject }
        })
    }

    done(callback) {
        assert.equal(typeof callback, 'function', 'callback must be a function')

        return this.then(
            value => callback(null, value),
            reason => callback(reason)
        )
    }

    callback() {
        const self = this

        return function (err, result) {
            if (err)
                self.reject(err)
            else
                self.resolve(result)
        }
    }
}

module.exports = Deferred
