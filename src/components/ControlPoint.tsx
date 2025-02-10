import { Vector3Tuple } from "three"
import { ControlPointName } from "../types"
import { useState } from "react"

interface ControlPointProps {
  idName: string
  position: Vector3Tuple
  name: ControlPointName
  segmentIndex: number
  selectedSegment: number | null
  selectedControlPoint: ControlPointName | null
  onControlPointSelect: (
    name: ControlPointName,
    segmentIndex: number,
    idName: string
  ) => void
  deselect: () => void
}

export const ControlPoint = ({
  idName,
  position,
  name,
  segmentIndex,
  selectedSegment,
  selectedControlPoint,
  deselect,
  onControlPointSelect,
}: ControlPointProps) => {
  const [hovered, setHovered] = useState(false)
  return (
    <mesh
      name={idName}
      position={position}
      onClick={() => onControlPointSelect(name, segmentIndex, idName)}
      onPointerMissed={deselect}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {name === "midPointA" || name === "midPointB" ? (
        <sphereBufferGeometry args={[0.1, 32]} />
      ) : (
        <boxBufferGeometry args={[0.2, 0.2, 0.2]} />
      )}
      <meshBasicMaterial
        color={
          `${selectedSegment}-${selectedControlPoint}` === idName || hovered
            ? "blue"
            : "red"
        }
      />
    </mesh>
  )
}
