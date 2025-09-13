# use-async-overlay

> 선언적으로 오버레이를 그리고, 명령형으로 컨트롤하세요.

```tsx
import { useAsyncOverlay } from 'use-async-overlay'

function Example() {
  const overlay = useAsyncOverlay<boolean, 'esc' | 'backdrop'>()

  return (
    <>
      <button
        onClick={async (e) => {
          const result = await overlay.open(e)

          if (result.status === 'resolved' && result.value === true) {
            alert('confirmed!')
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

## 자세한 내용은 문서를 참고해주세요.

[DOCS](https://use-async-overlay.shiwoo.dev/)
