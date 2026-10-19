import { useState, useRef, useCallback, Fragment, useEffect } from "react"
import { TransformControls } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { Mesh, Object3D } from "three"
import { updateCurve } from "../utils/helpers"
import { BezierLineSegment } from "./BezierLineSegment"
import { ControlPoint } from "./ControlPoint"
import { ControlPointName, ControlPoints } from "../types"
import { useStore } from "../store"
import { useAnimation } from "./useAnimation"
import { COLORS } from "../theme"

export const BezierCurveEditor = () => {
  const scene = useThree((state) => state.scene)
  const segments = useStore((state) => state.segments)
  const updateSegment = useStore((state) => state.updateSegment)
  const [selectedControlPoint, setSelectedControlPoint] =
    useState<ControlPointName | null>(null)
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null)
  const selectedCurve = useRef<Object3D | null>(null)
  const prevSegmentCurve = useRef<Object3D | null>(null)
  const selectedControlPointRef = useRef<Object3D | null>(null)
  const newControlPoints = useRef<ControlPoints | null>(null)
  const prevSegmentControlPoints = useRef<ControlPoints | null>(null)
  const traveler = useRef<Mesh>(null)

  useAnimation(traveler)

  const onControlPointSelect = useCallback(
    (name: ControlPointName, segmentIndex: number, idName: string) => {
      setSelectedSegment(segmentIndex)
      setSelectedControlPoint(name)
      selectedControlPointRef.current = scene.getObjectByName(idName) ?? null
      selectedCurve.current =
        scene.getObjectByName(segmentIndex.toString()) ?? null
      prevSegmentCurve.current =
        name === "startPoint"
          ? scene.getObjectByName((segmentIndex - 1).toString()) ?? null
          : null
    },
    [scene]
  )

  const onTransformChange = useCallback(() => {
    if (
      selectedControlPoint &&
      selectedSegment !== null &&
      selectedControlPointRef.current
    ) {
      const position = selectedControlPointRef.current.position.toArray() as [
        number,
        number,
        number,
      ]
      newControlPoints.current = {
        ...segments[selectedSegment],
        [selectedControlPoint]: position,
      }
      if (selectedCurve.current) {
        updateCurve(newControlPoints.current, selectedCurve)
      }
      // A segment's start point is shared with the previous segment's end point.
      if (prevSegmentCurve.current && segments[selectedSegment - 1]) {
        prevSegmentControlPoints.current = {
          ...segments[selectedSegment - 1],
          endPoint: position,
        }
        updateCurve(prevSegmentControlPoints.current, prevSegmentCurve)
      }
    }
  }, [segments, selectedControlPoint, selectedSegment])

  const onTransformEnd = useCallback(() => {
    if (newControlPoints.current && selectedSegment !== null) {
      updateSegment(selectedSegment, newControlPoints.current)
      newControlPoints.current = null
      if (prevSegmentControlPoints.current) {
        updateSegment(selectedSegment - 1, prevSegmentControlPoints.current)
        prevSegmentControlPoints.current = null
      }
    }
    if (traveler.current) traveler.current.visible = true
  }, [selectedSegment, updateSegment])

  const deselect = useCallback(() => {
    setSelectedSegment(null)
    setSelectedControlPoint(null)
    selectedCurve.current = null
    prevSegmentCurve.current = null
    selectedControlPointRef.current = null
  }, [])

  useEffect(() => {
    if (segments.length < 1) deselect()
  }, [segments, deselect])

  const selectedObject =
    selectedControlPoint && selectedSegment !== null
      ? scene.getObjectByName(`${selectedSegment}-${selectedControlPoint}`)
      : undefined

  return (
    <>
      {segments.map((segment, segmentIndex) => (
        <group key={segmentIndex}>
          <BezierLineSegment segmentName={segmentIndex} segment={segment} />
          {(Object.keys(segment) as ControlPointName[]).map((controlPoint) => {
            const identificationName = `${segmentIndex}-${controlPoint}`
            // Shared joints are drawn once: only the last segment shows its end point.
            const visible =
              segmentIndex + 1 === segments.length || controlPoint !== "endPoint"
            return (
              <Fragment key={identificationName}>
                {visible && (
                  <ControlPoint
                    idName={identificationName}
                    position={segment[controlPoint]}
                    name={controlPoint}
                    segmentIndex={segmentIndex}
                    selectedSegment={selectedSegment}
                    selectedControlPoint={selectedControlPoint}
                    deselect={deselect}
                    onControlPointSelect={onControlPointSelect}
                  />
                )}
              </Fragment>
            )
          })}
        </group>
      ))}
      {selectedObject && segments.length > 0 && (
        <TransformControls
          object={selectedObject}
          mode="translate"
          size={0.8}
          onObjectChange={onTransformChange}
          onMouseUp={onTransformEnd}
          onMouseDown={() => {
            if (traveler.current) traveler.current.visible = false
          }}
        />
      )}
      <mesh
        ref={traveler}
        visible={segments.length > 0}
        position={segments[0]?.startPoint ?? [0, 0, 0]}
      >
        <sphereGeometry args={[0.2, 32, 16]} />
        <meshBasicMaterial color={COLORS.traveler} />
      </mesh>
    </>
  )
}
