# use-async-flow

> 선언적으로 오버레이를 그리고, 명령형으로 컨트롤하세요.

```tsx
import { useAsyncFlow } from 'use-async-flow'

function Example() {
  const overlay = useAsyncFlow<boolean, 'esc' | 'backdrop'>()

  return (
    <>
      <button
        onClick={async (e) => {
          const result = await overlay.open(e)

          if (result.status === 'resolved' && result.value === true) {
            alert('confirmed!')
          } else if (result.status === 'resolved' && result.value === false) {
            alert('rejected!')
          } else if (result.status === 'dismissed' && result.reason === 'esc') {
            alert('esc pressed!')
          } else if (result.status === 'dismissed' && result.reason === 'backdrop') {
            alert('backdrop clicked!')
          } else if (result.status === 'dismissed' && result.reason === 'unmount') {
            alert('unmounted!')
          }
        }}
      >
        Open
      </button>
      <Modal
        isOpen={overlay.isOpen}
        onConfirm={() => overlay.resolve(true)}
        onReject={() => overlay.resolve(false)}
        onESCPress={() => overlay.dismiss('esc')}
        onBackdropClick={() => overlay.dismiss('backdrop')}
      />
    </>
  )
}
```

## Install

```bash
npm install use-async-flow
```

## 자세한 내용은 문서를 참고해주세요.

[DOCS](https://use-async-flow.shiwoo.dev/)
