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

type RestoreFocusObjectType = {
  selector: string
}

export type RestoreFocusOptions = {
  /**
   * The element to restore focus to after the `open()` is resolved or dismissed.
   *
   * @default 'previous'
   */
  restoreFocus?: 'previous' | (() => HTMLElement | null) | HTMLElement | RestoreFocusObjectType
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
}

export type useAsyncFlowOptions = RestoreFocusOptions & {
  /**
   * @default true
   */
  dismissOnUnmount?: boolean
}

export function useAsyncFlow<ResolvedValue, DismissedReason>(options: useAsyncFlowOptions = {}) {
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
      event?: {
        currentTarget: EventTarget
      },
      options?: RestoreFocusOptions
    ): Promise<OverlayOutcome<ResolvedValue, DismissedReason>> => {
      if (promiseRef.current) {
        return promiseRef.current
      }

      const ct = event?.currentTarget
      triggerElRef.current = ct instanceof HTMLElement ? ct : null
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
              outcome.status === 'resolved'
                ? (options?.restoreFocusOnResolved ?? restoreFocusOnResolved)
                : (options?.restoreFocusOnDismissed ?? restoreFocusOnDismissed)
            if (shouldRestoreFocus) {
              const resolvedRestoreFocus = options?.restoreFocus ?? preservedRestoreFocus

              const target = getRestoreFocusTarget({
                restoreFocus: resolvedRestoreFocus,
                triggerElement: triggerElRef.current,
              })

              target?.focus?.()
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
    [restoreFocusOnResolved, restoreFocusOnDismissed, preservedRestoreFocus]
  )

  const resolve = useCallback((value: ResolvedValue) => {
    resolverRef.current?.({ status: 'resolved', value })
  }, [])

  const dismiss = useCallback((reason: DismissedReason) => {
    resolverRef.current?.({ status: 'dismissed', reason })
  }, [])

  return { open, resolve, dismiss, isOpen }
}

const isRestoreFocusObjectType = (
  restoreFocus: RestoreFocusOptions['restoreFocus']
): restoreFocus is RestoreFocusObjectType => {
  return typeof restoreFocus === 'object' && 'selector' in restoreFocus
}

const getRestoreFocusTarget = ({
  restoreFocus,
  triggerElement,
}: {
  restoreFocus: RestoreFocusOptions['restoreFocus']
  triggerElement: HTMLElement | null
}): HTMLElement | null => {
  if (restoreFocus === 'previous') {
    return triggerElement
  } else if (typeof restoreFocus === 'function') {
    return restoreFocus()
  } else if (isRestoreFocusObjectType(restoreFocus)) {
    return document.querySelector(restoreFocus.selector)
  } else if (restoreFocus instanceof HTMLElement) {
    return restoreFocus
  }
  return null
}
