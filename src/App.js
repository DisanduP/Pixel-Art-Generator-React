import React, { useState, useRef, useEffect } from 'react'
import Pixel from './Pixel'
import './App.sass'

export default function App() {
  const [width, setWidth] = useState(16)
  const [height, setHeight] = useState(16)
  const [color, setColor] = useState('#000000')
  const [erase, setErase] = useState(false)
  const containerRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const drawRef = useRef(false)
  const deviceTypeRef = useRef('mouse')
  const colorRef = useRef(color)
  const eraseRef = useRef(erase)

  const events = {
    mouse: { down: 'mousedown', move: 'mousemove', up: 'mouseup' },
    touch: { down: 'touchstart', move: 'touchmove', up: 'touchend' },
  }

  const isTouchDevice = () => {
    try {
      document.createEvent('TouchEvent')
      deviceTypeRef.current = 'touch'
      return true
    } catch (e) {
      deviceTypeRef.current = 'mouse'
      return false
    }
  }

  useEffect(() => {
    isTouchDevice()
  }, [])

  // keep refs in sync so event listeners use latest values
  useEffect(() => {
    colorRef.current = color
  }, [color])

  useEffect(() => {
    eraseRef.current = erase
  }, [erase])

  useEffect(() => {
    // keep initial width/height from state (defaults set to 16)
  }, [])

  function createGrid() {
    const container = containerRef.current
  console.log('createGrid clicked — width, height:', width, height)
    container.innerHTML = ''
    let count = 0
    for (let i = 0; i < height; i++) {
      count += 2
      const row = document.createElement('div')
      row.className = 'gridRow'
      for (let j = 0; j < width; j++) {
        count += 2
        const el = document.createElement('div')
        el.className = 'gridCol'
        el.id = `gridCol${count}`
        // attach per-cell listeners similar to original script
        const dt = deviceTypeRef.current
        el.addEventListener(events[dt].down, () => {
          drawRef.current = true
          setIsDrawing(true)
          if (eraseRef.current) {
            el.style.backgroundColor = 'transparent'
          } else {
            el.style.backgroundColor = colorRef.current
          }
        })

        el.addEventListener(events[dt].move, (e) => {
          const x = dt === 'touch' ? e.touches[0].clientX : e.clientX
          const y = dt === 'touch' ? e.touches[0].clientY : e.clientY
          const elementId = document.elementFromPoint(x, y)?.id
          checker(elementId)
        })

        el.addEventListener(events[dt].up, () => {
          drawRef.current = false
          setIsDrawing(false)
        })

        row.appendChild(el)
      }
      container.appendChild(row)
    }
  }

  function checker(elementId) {
    const gridColumns = containerRef.current.querySelectorAll('.gridCol')
    gridColumns.forEach((element) => {
      if (elementId == element.id) {
        if (drawRef.current && !eraseRef.current) {
          element.style.backgroundColor = colorRef.current
        } else if (drawRef.current && eraseRef.current) {
          element.style.backgroundColor = 'transparent'
        }
      }
    })
  }

  function clearGrid() {
    const container = containerRef.current
  console.log('clearGrid clicked')
    container.innerHTML = ''
  }

  // Note: per-cell listeners attached in createGrid handle drawing/touch events.

  return (
    <div className="wrapper">
      <div className="options">
        <div className="opt-wrapper">
          <div className="slider">
            <label htmlFor="width-range">Grid Width</label>
            <input
              id="width-range"
              type="range"
              min="1"
              max="35"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
            />
            <span id="width-value">{width < 10 ? `0${width}` : width}</span>
          </div>
          <div className="slider">
            <label htmlFor="height-range">Grid Height</label>
            <input
              id="height-range"
              type="range"
              min="1"
              max="35"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
            <span id="height-value">{height < 10 ? `0${height}` : height}</span>
          </div>
        </div>

        <div className="opt-wrapper">
          <button id="submit-grid" onClick={createGrid}>
            Create Grid
          </button>
          <button id="clear-grid" onClick={clearGrid}>
            Clear Grid
          </button>
          <input
            type="color"
            id="color-input"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          <button id="erase-btn" onClick={() => setErase(true)}>
            Erase
          </button>
          <button id="paint-btn" onClick={() => setErase(false)}>
            Paint
          </button>
        </div>
      </div>

      <div className="container" ref={containerRef}></div>
    </div>
  )
}
