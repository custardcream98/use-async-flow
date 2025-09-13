# use-async-overlay

Promise-based overlay control hook for React.

## Install

```bash
npm install use-async-overlay
```

## Quick Start

```tsx
import { useAsyncOverlay } from 'use-async-overlay'

function Example() {
  const overlay = useAsyncOverlay<boolean, 'esc' | 'backdrop'>()

  return (
    <>
      <button onClick={(e) => overlay.open(e)}>Open</button>
      {/* Your modal here */}
      <Modal
        isOpen={overlay.isOpen}
        onConfirm={() => overlay.resolve(true)}
        onClose={() => overlay.dismiss('esc')}
      />
    </>
  )
}
```

## Outcome

`open()` returns a Promise of a discriminated union:

```ts
{ status: 'resolved'; value?: T } | { status: 'dismissed'; reason?: R }
```

## Options

- restoreFocus (default: 'previous')
- dismissOnUnmount (default: true)

See full docs and demo in the docs app.
