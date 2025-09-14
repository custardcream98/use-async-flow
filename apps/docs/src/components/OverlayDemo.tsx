'use client'

import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { useAsyncOverlay } from 'use-async-overlay'

type Outcome<T, R> = { status: 'dismissed'; reason?: R } | { status: 'resolved'; value?: T }
type LabeledOutcome<T, R> = { source: 'modal1' | 'modal2'; outcome: Outcome<T, R> }

const TRANSITION_MS = 200

function Modal({
  isOpen,
  onResolve,
  onDismiss,
  title = '확인하시겠습니까?',
}: {
  isOpen: boolean
  onResolve: (value: boolean) => void
  onDismiss: (reason: string) => void
  title?: string
}) {
  const [mounted, setMounted] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      // next frame to enable transition
      const id = requestAnimationFrame(() => setShow(true))
      return () => cancelAnimationFrame(id)
    }
    if (mounted) {
      setShow(false)
      const t = setTimeout(() => setMounted(false), TRANSITION_MS)
      return () => clearTimeout(t)
    }
  }, [isOpen, mounted])

  if (!mounted) return null

  return (
    <div
      aria-hidden
      className={clsx(
        'fixed inset-0 z-40 grid place-items-center bg-black/45 transition-opacity',
        show ? 'opacity-100' : 'opacity-0'
      )}
      onClick={() => onDismiss('backdrop')}
    >
      <div
        aria-modal
        className={clsx(
          'min-w-[300px] max-w-[480px] rounded-xl bg-white p-4 text-black shadow-2xl transition',
          'dark:bg-neutral-900 dark:text-white',
          show ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-1.5 scale-95 opacity-95'
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <h3 className="m-0 mb-3 text-base font-semibold">{title}</h3>
        <p className="mb-4 mt-0 text-sm opacity-80">이 동작을 진행하시겠습니까?</p>
        <div className="flex justify-end gap-2">
          <button
            className="rounded-md px-3 py-1.5 text-sm hover:underline"
            onClick={() => onDismiss('close')}
          >
            취소
          </button>
          <button
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:brightness-105"
            onClick={() => onResolve(true)}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  )
}

function Badge({ kind, children }: { kind: 'dismissed' | 'resolved'; children: React.ReactNode }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold',
        kind === 'resolved'
          ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-200/70 dark:text-emerald-950'
          : 'bg-rose-100 text-rose-900 dark:bg-rose-200/70 dark:text-rose-950'
      )}
    >
      {children}
    </span>
  )
}

function DemoButton({
  children,
  onClick,
  variant = 'primary',
  style,
}: {
  children: React.ReactNode
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void
  variant?: 'primary' | 'secondary'
  style?: React.CSSProperties
}) {
  const classes = clsx(
    'rounded-[10px] px-[14px] py-[10px] font-bold cursor-pointer border transition duration-[120ms] ease-out',
    'hover:brightness-[1.03] active:translate-y-px active:brightness-[0.98]',
    variant === 'primary'
      ? 'bg-blue-600 text-white shadow-[0_8px_24px_rgba(37,99,235,0.35)] border-transparent'
      : 'bg-gray-900 text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)] border-[rgba(255,255,255,0.08)]'
  )
  return (
    <button className={classes} onClick={onClick} style={style}>
      {children}
    </button>
  )
}

export function OverlayDemo() {
  const overlay1 = useAsyncOverlay<boolean, string>()
  const overlay2 = useAsyncOverlay<boolean, string>()
  const [outcomes, setOutcomes] = useState<Array<LabeledOutcome<boolean, string>>>([])
  // Tailwind handles theming via 'dark:' variants

  return (
    <div
      aria-label="Interactive live demo"
      className={clsx(
        'overflow-hidden rounded-xl border bg-black/[0.02]',
        'border-black/10 dark:border-white/10 dark:bg-white/[0.03]'
      )}
      role="region"
    >
      <div
        className={clsx(
          'flex items-center justify-between border-b px-3 py-3',
          'bg-gradient-to-tr from-blue-500/10 to-emerald-500/10',
          'border-black/10 dark:border-white/10 dark:from-blue-500/20 dark:to-emerald-500/20'
        )}
      >
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(34,197,94,0.25)]"
          />
          <span>아래 버튼을 눌러 실제로 실행해보세요</span>
        </div>
      </div>

      <div className="grid gap-4 p-4">
        <div className="grid gap-2">
          <div className="flex flex-wrap gap-2">
            <DemoButton
              onClick={async (e) => {
                setOutcomes([])
                const r1 = await overlay1.open(e)
                const r2 = await overlay2.open(e)
                setOutcomes([
                  { source: 'modal1', outcome: r1 },
                  { source: 'modal2', outcome: r2 },
                ])
              }}
              variant="primary"
            >
              모달 2개 순차 실행
            </DemoButton>
            <DemoButton
              onClick={async (e) => {
                setOutcomes([])
                const r = await overlay1.open(e)
                setOutcomes([{ source: 'modal1', outcome: r }])
              }}
              style={{ padding: '8px 12px' }}
              variant="secondary"
            >
              모달 1 실행
            </DemoButton>
            <DemoButton
              onClick={async (e) => {
                setOutcomes([])
                const r = await overlay2.open(e)
                setOutcomes([{ source: 'modal2', outcome: r }])
              }}
              style={{ padding: '8px 12px' }}
              variant="secondary"
            >
              모달 2 실행
            </DemoButton>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-black/70 dark:text-white/70">상태</span>
            <Badge kind={overlay1.isOpen ? 'resolved' : 'dismissed'}>
              모달1 {overlay1.isOpen ? 'open' : 'closed'}
            </Badge>
            <Badge kind={overlay2.isOpen ? 'resolved' : 'dismissed'}>
              모달2 {overlay2.isOpen ? 'open' : 'closed'}
            </Badge>
          </div>
        </div>

        <div
          className={clsx(
            'rounded-lg border p-3',
            'border-black/10 bg-black/5 dark:border-white/20 dark:bg-white/[0.06]'
          )}
        >
          <div className="mb-2 text-xs text-black/70 dark:text-white/70">최근 결과</div>
          <div className="flex flex-wrap gap-2">
            {outcomes.length === 0 ? (
              <span className="text-xs text-black/70 dark:text-white/70">
                아직 결과가 없습니다.
              </span>
            ) : (
              outcomes.map(({ source, outcome }, i) => (
                <Badge key={i} kind={outcome.status}>
                  {source} ·{' '}
                  {outcome.status === 'resolved'
                    ? `resolved${'value' in outcome ? ` (${String(outcome.value)})` : ''}`
                    : `dismissed${'reason' in outcome && outcome.reason ? ` (${outcome.reason})` : ''}`}
                </Badge>
              ))
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={overlay1.isOpen}
        onDismiss={(r) => overlay1.dismiss(r)}
        onResolve={(v) => overlay1.resolve(v)}
        title="모달 1"
      />
      <Modal
        isOpen={overlay2.isOpen}
        onDismiss={(r) => overlay2.dismiss(r)}
        onResolve={(v) => overlay2.resolve(v)}
        title="모달 2"
      />
    </div>
  )
}
