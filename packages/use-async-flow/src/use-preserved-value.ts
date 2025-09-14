import { useEffect, useRef } from 'react'

export const usePreservedValue = <T>(value: T) => {
  const valueRef = useRef(value)
  useEffect(() => {
    valueRef.current = value
  }, [value])
  return valueRef.current
}
