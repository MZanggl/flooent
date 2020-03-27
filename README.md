# flooent

Fluent interface to provide an expressive syntax for common manipulations.

## Arrays

### Initiate

Since we are just subclassing JavaScript's Array, you can instantiate the array the same way

```javascript
import { Arr } from 'flooent'

Arr.from([1, 2, 3])
// or
Arr.of(1, 2, 3)
```

## Strings

### Initiate

```javascript
import { Str } from 'flooent'

Str.of('hello')
// or
Str.from('hello')
// or
new Str('hello')
```