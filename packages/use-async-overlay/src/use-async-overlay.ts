import type { MouseEvent, PointerEvent } from 'react'

import { useCallback, useEffect, useRef, useState } from 'react'

export type OverlayResolved<ResolvedValue> = {
  status: 'resolved'
  value: ResolvedValue
}
export type OverlayDismissed<DismissedReason> = {
  status: 'dismissed'
  reason?: 'unmount' | DismissedReason
}
export type OverlayOutcome<ResolvedValue, DismissedReason> =
  | OverlayDismissed<DismissedReason>
  | OverlayResolved<ResolvedValue>

export type UseAsyncOverlayOptions = {
  /**
   * The element to restore focus to after the `open()` is resolved or dismissed.
   *
   * @default 'previous'
   */
  restoreFocus?: 'previous' | (() => HTMLElement | null) | HTMLElement | { selector: string }
  /**
   * @default true
   */
  dismissOnUnmount?: boolean
}

export function useAsyncOverlay<ResolvedValue = unknown, DismissedReason = unknown>(
  options: UseAsyncOverlayOptions = {}
) {
  const { restoreFocus = 'previous', dismissOnUnmount = true } = options

  const resolverRef = useRef<
    ((outcome: OverlayOutcome<ResolvedValue, DismissedReason>) => void) | null
  >(null)
  const settledRef = useRef(false)
  const promiseRef = useRef<null | Promise<OverlayOutcome<ResolvedValue, DismissedReason>>>(null)
  const triggerElRef = useRef<HTMLElement | null>(null)

  const [isOpen, setIsOpen] = useState(false)

  const restoreFocusIfNeeded = useCallback(() => {
    if (!restoreFocus) {
      return
    }

    let target: HTMLElement | null = null

    if (restoreFocus === 'previous') {
      target = triggerElRef.current
    } else if (typeof restoreFocus === 'function') {
      target = restoreFocus()
    } else if (restoreFocus && typeof restoreFocus === 'object' && 'selector' in restoreFocus) {
      const sel = (restoreFocus as { selector: string }).selector
      const el = document.querySelector(sel)

      if (el instanceof HTMLElement) {
        target = el
      }
    } else if (restoreFocus instanceof HTMLElement) {
      target = restoreFocus
    }

    target?.focus?.()
  }, [restoreFocus])

  useEffect(() => {
    return () => {
      if (dismissOnUnmount && resolverRef.current && !settledRef.current) {
        resolverRef.current({ status: 'dismissed', reason: 'unmount' })
        settledRef.current = true
      }
    }
  }, [dismissOnUnmount])

  const open = useCallback(
    async (
      event?: MouseEvent<HTMLElement> | PointerEvent<HTMLElement>
    ): Promise<OverlayOutcome<ResolvedValue, DismissedReason>> => {
      if (promiseRef.current) {
        return promiseRef.current
      }

      triggerElRef.current = event?.currentTarget ?? null
      setIsOpen(true)
      settledRef.current = false

      promiseRef.current = new Promise<OverlayOutcome<ResolvedValue, DismissedReason>>(
        (resolve) => {
          resolverRef.current = (outcome) => {
            if (settledRef.current) {
              return
            }

            settledRef.current = true
            resolve(outcome)
            setIsOpen(false)
            restoreFocusIfNeeded()

            resolverRef.current = null
            promiseRef.current = null
          }
        }
      )

      return promiseRef.current
    },
    [restoreFocusIfNeeded]
  )

  const resolve = useCallback((value: ResolvedValue) => {
    resolverRef.current?.({ status: 'resolved', value })
  }, [])

  const dismiss = useCallback((reason: DismissedReason) => {
    resolverRef.current?.({ status: 'dismissed', reason })
  }, [])

  return { open, resolve, dismiss, isOpen }
}
