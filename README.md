
# level-shared-batch

Share batches and commit collectively.

## Example

```js
var db = level('db')

// Create a shared batch object

var fork = shared(db.batch())

// Those two modules will now add their operations to a fork of the original
// batch, and batch.write(...) will mark their work as done. Once both
// modules called batch.write(), all the operations will be executed in one
// atomic go.

moduleA.doSomething({ batch: fork() })

moduleB.doAnotherThing({ batch: fork() })
```

## Installation

```bash
$ npm install level-shared-batch
```

## API

### fork = shared(batch)

  Create a new fork for `batch`.

### fork#put(key, value)
### fork#del(key)
### fork#clear()
### fork#write(cb)

## License

  MIT
