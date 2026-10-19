import { CubicBezierLine } from "@react-three/drei"
import { ControlPoints } from "../types"
import { COLORS } from "../theme"

export const BezierLineSegment = ({
  segmentName,
  segment,
}: {
  segmentName: number
  segment: ControlPoints
}) => (
  <CubicBezierLine
    name={segmentName.toString()}
    start={segment.startPoint}
    midA={segment.midPointA}
    midB={segment.midPointB}
    end={segment.endPoint}
    segments={50}
    lineWidth={2}
    color={COLORS.curve}
  />
)
