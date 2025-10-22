import React, { useRef } from 'react'
import './Pixel.sass'

export default function Pixel({ id, onPaint, color, erase }) {
  const ref = useRef(null)

  function paint() {
    if (!ref.current) return
    ref.current.style.backgroundColor = erase ? 'transparent' : color
    if (typeof onPaint === 'function') onPaint(id)
  }

  return (
    <div
      id={id}
      ref={ref}
      className="gridCol"
      onPointerDown={paint}
      onPointerEnter={(e) => { if (e.buttons === 1) paint() }}
    />
  )
}
