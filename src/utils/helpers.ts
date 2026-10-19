import { RefObject } from "react"
import { CubicBezierCurve3, Object3D, Vector3 } from "three"
import { ControlPoints } from "../types"

const curve = new CubicBezierCurve3(
  new Vector3(),
  new Vector3(),
  new Vector3(),
  new Vector3()
)

// Live-updates a drei <CubicBezierLine> (a Line2) while a control point is
// being dragged, without waiting for a React re-render.
export const updateCurve = (
  newPoints: ControlPoints,
  curveRef: RefObject<Object3D | null | undefined>
) => {
  curve.v0.fromArray(newPoints.startPoint)
  curve.v1.fromArray(newPoints.midPointA)
  curve.v2.fromArray(newPoints.midPointB)
  curve.v3.fromArray(newPoints.endPoint)
  const points = curve.getPoints(50)
  const line = curveRef.current as
    | (Object3D & { geometry?: { setPositions?: (p: number[]) => void } })
    | null
    | undefined
  line?.geometry?.setPositions?.(points.flatMap((p) => p.toArray()))
}

export const getRandomPoint = (): [number, number, number] => [
  Math.random() * 20 - 10,
  Math.random() * 20 - 10,
  Math.random() * 20 - 10,
]
