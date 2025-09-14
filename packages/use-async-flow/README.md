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

### Focus control

```tsx
// 기본: 트리거 버튼으로 포커스 복귀
const overlay = useAsyncFlow()

// 특정 요소로 복귀
useAsyncFlow({ restoreFocus: { selector: '#search' } })

// 결과별 제어
useAsyncFlow({ restoreFocusOnResolved: true, restoreFocusOnDismissed: false })
```

### Unmount-safe

```tsx
// 언마운트 시 자동으로 { status: 'dismissed', reason: 'unmount' }
const overlay = useAsyncFlow({ dismissOnUnmount: true })
```

## 자세한 내용은 문서를 참고해주세요.

[DOCS](https://use-async-flow.shiwoo.dev/)
