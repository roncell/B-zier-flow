import { useCallback, useState } from "react"
import { useStore } from "../../store"

export const UI = () => {
  const segments = useStore((state) => state.segments)
  const playAnimation = useStore((state) => state.playAnimation)
  const constantSpeed = useStore((state) => state.constantSpeed)
  const addRandomSegment = useStore((state) => state.addRandomSegment)
  const removeSegments = useStore((state) => state.removeSegments)
  const setPlayAnimation = useStore((state) => state.setPlayAnimation)
  const setConstantSpeed = useStore((state) => state.setConstantSpeed)
  const [exported, setExported] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const onCurveExport = useCallback(() => {
    let str = ""
    segments.forEach((controlPoints) => {
      str += `B(t) = (1-t)³(${controlPoints.startPoint}) + 3(1 - t)²t(${controlPoints.midPointA}) + 3(1 - t)t²(${controlPoints.midPointB}) + t³(${controlPoints.endPoint}); \n`
    })
    setCopied(false)
    setExported(str || "No segments yet. Add a point first.")
  }, [segments])

  const copy = useCallback(async () => {
    if (!exported) return
    try {
      await navigator.clipboard.writeText(exported)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }, [exported])

  return (
    <>
      <div className="ui-content">
        <div className="ui-head">
          <a className="back" href="/">
            ← Portfolio
          </a>
          <h1>Bézier Flow</h1>
          <p>
            Click a point, then drag the arrows to move it. Drag empty space to
            orbit, scroll to zoom.
          </p>
        </div>
        <div className="ui-buttons">
          <button className="button" onClick={addRandomSegment}>
            Add Random Point
          </button>
          <button className="button" onClick={removeSegments}>
            Clear All
          </button>
          <button className="button" onClick={onCurveExport}>
            Export Curve
          </button>
          <button
            className="button"
            aria-pressed={playAnimation}
            onClick={() => setPlayAnimation(true)}
          >
            Play
          </button>
          <button
            className="button"
            aria-pressed={!playAnimation}
            onClick={() => setPlayAnimation(false)}
          >
            Pause
          </button>
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={constantSpeed}
            onChange={(e) => setConstantSpeed(e.target.checked)}
          />
          Constant speed (arc-length)
        </label>
        <div className="legend">
          <span><i className="dot endpoint" /> anchor</span>
          <span><i className="dot handle" /> handle</span>
          <span className="count">
            {segments.length} segment{segments.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {exported !== null && (
        <div className="export" role="dialog" aria-label="Exported curve">
          <div className="export-head">
            <strong>Exported curve</strong>
            <div className="export-actions">
              <button className="button" onClick={copy}>
                {copied ? "Copied" : "Copy"}
              </button>
              <button className="button" onClick={() => setExported(null)}>
                Close
              </button>
            </div>
          </div>
          <pre>{exported}</pre>
        </div>
      )}
    </>
  )
}
