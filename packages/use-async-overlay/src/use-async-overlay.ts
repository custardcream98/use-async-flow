import type { MouseEvent, PointerEvent } from 'react'

import { useCallback, useEffect, useRef, useState } from 'react'

import { usePreservedValue } from '@/use-preserved-value'

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
   * Whether to restore focus to the element that triggered the `open()` when the `open()` is resolved by `resolve()`.
   *
   * @default true
   */
  restoreFocusOnResolved?: boolean
  /**
   * Whether to restore focus to the element that triggered the `open()` when the `open()` is dismissed by `dismiss()`.
   *
   * @default true
   */
  restoreFocusOnDismissed?: boolean
  /**
   * @default true
   */
  dismissOnUnmount?: boolean
}

export function useAsyncOverlay<ResolvedValue = unknown, DismissedReason = unknown>(
  options: UseAsyncOverlayOptions = {}
) {
  const {
    restoreFocus = 'previous',
    dismissOnUnmount = true,
    restoreFocusOnResolved = true,
    restoreFocusOnDismissed = true,
  } = options

  const preservedRestoreFocus = usePreservedValue(restoreFocus)

  const resolverRef = useRef<
    ((outcome: OverlayOutcome<ResolvedValue, DismissedReason>) => void) | null
  >(null)
  const settledRef = useRef(false)
  const promiseRef = useRef<null | Promise<OverlayOutcome<ResolvedValue, DismissedReason>>>(null)
  const triggerElRef = useRef<HTMLElement | null>(null)

  const [isOpen, setIsOpen] = useState(false)

  const restoreFocusIfNeeded = useCallback(() => {
    if (!preservedRestoreFocus) {
      return
    }

    let target: HTMLElement | null = null

    if (preservedRestoreFocus === 'previous') {
      target = triggerElRef.current
    } else if (typeof preservedRestoreFocus === 'function') {
      target = preservedRestoreFocus()
    } else if (
      preservedRestoreFocus &&
      typeof preservedRestoreFocus === 'object' &&
      'selector' in preservedRestoreFocus
    ) {
      const sel = (preservedRestoreFocus as { selector: string }).selector
      const el = document.querySelector(sel)

      if (el instanceof HTMLElement) {
        target = el
      }
    } else if (preservedRestoreFocus instanceof HTMLElement) {
      target = preservedRestoreFocus
    }

    target?.focus?.()
  }, [preservedRestoreFocus])

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
            const shouldRestoreFocus =
              outcome.status === 'resolved' ? restoreFocusOnResolved : restoreFocusOnDismissed
            if (shouldRestoreFocus) {
              restoreFocusIfNeeded()
            }

            resolve(outcome)
            setIsOpen(false)
            resolverRef.current = null
            promiseRef.current = null
          }
        }
      )

      return promiseRef.current
    },
    [restoreFocusIfNeeded, restoreFocusOnResolved, restoreFocusOnDismissed]
  )

  const resolve = useCallback((value: ResolvedValue) => {
    resolverRef.current?.({ status: 'resolved', value })
  }, [])

  const dismiss = useCallback((reason: DismissedReason) => {
    resolverRef.current?.({ status: 'dismissed', reason })
  }, [])

  return { open, resolve, dismiss, isOpen }
}
