import { useState } from "react"
import { ThreeEvent } from "@react-three/fiber"
import { ControlPointName } from "../types"
import { COLORS } from "../theme"

interface ControlPointProps {
  idName: string
  position: [number, number, number]
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
  const isHandle = name === "midPointA" || name === "midPointB"
  const active =
    `${selectedSegment}-${selectedControlPoint}` === idName || hovered

  return (
    <mesh
      name={idName}
      position={position}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        onControlPointSelect(name, segmentIndex, idName)
      }}
      onPointerMissed={deselect}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = ""
      }}
    >
      {isHandle ? (
        <sphereGeometry args={[0.14, 24, 12]} />
      ) : (
        <boxGeometry args={[0.26, 0.26, 0.26]} />
      )}
      <meshBasicMaterial
        color={active ? COLORS.active : isHandle ? COLORS.handle : COLORS.endpoint}
      />
    </mesh>
  )
}
