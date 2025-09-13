import type { MouseEvent, PointerEvent } from 'react'

import { useCallback, useEffect, useRef, useState } from 'react'

export type OverlayResolved<T> = { status: 'resolved'; value?: T }
export type OverlayDismissed<R = unknown> = { status: 'dismissed'; reason?: R }
export type OverlayOutcome<T, R = unknown> = OverlayDismissed<R> | OverlayResolved<T>

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

export function useAsyncOverlay<T = unknown, R = unknown>(options: UseAsyncOverlayOptions = {}) {
  const { restoreFocus = 'previous', dismissOnUnmount = true } = options

  const resolverRef = useRef<((outcome: OverlayOutcome<T, R>) => void) | null>(null)
  const settledRef = useRef(false)
  const promiseRef = useRef<null | Promise<OverlayOutcome<T, R>>>(null)
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
        resolverRef.current({ status: 'dismissed' })
        settledRef.current = true
      }
    }
  }, [dismissOnUnmount])

  const open = useCallback(
    async (
      event?: MouseEvent<HTMLElement> | PointerEvent<HTMLElement>
    ): Promise<OverlayOutcome<T, R>> => {
      if (promiseRef.current) {
        return promiseRef.current
      }

      triggerElRef.current = event?.currentTarget ?? null
      setIsOpen(true)
      settledRef.current = false

      promiseRef.current = new Promise<OverlayOutcome<T, R>>((resolve) => {
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
      })

      return promiseRef.current
    },
    [restoreFocusIfNeeded]
  )

  const resolve = useCallback((value?: T) => {
    resolverRef.current?.({ status: 'resolved', value })
  }, [])

  const dismiss = useCallback((reason?: R) => {
    resolverRef.current?.({ status: 'dismissed', reason })
  }, [])

  return { open, resolve, dismiss, isOpen }
}
