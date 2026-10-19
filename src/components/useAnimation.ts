import gsap from "gsap"
import { RefObject, useEffect, useRef } from "react"
import { CubicBezierCurve3, Object3D, Vector3 } from "three"
import { useStore } from "../store"
import { getCubicBezierPoint } from "../utils/interpolation"

const SPEED = 4 // world units per second when "constant speed" is on
const SEGMENT_SECONDS = 3 // original timing: every segment takes 3 s

type Timeline = ReturnType<typeof gsap.timeline>

export const useAnimation = (object: RefObject<Object3D>) => {
  const segments = useStore((state) => state.segments)
  const playAnimation = useStore((state) => state.playAnimation)
  const constantSpeed = useStore((state) => state.constantSpeed)
  const timelineRef = useRef<Timeline | null>(null)

  // Build a fresh looping timeline whenever the path changes, and kill the old
  // one. Each tween drives a plain progress value and the position comes from
  // the Bézier formula (the original tweened x/y/z and then overwrote them).
  useEffect(() => {
    const target = object.current
    if (!target || segments.length === 0) return

    const timeline = gsap.timeline({
      repeat: -1,
      paused: !useStore.getState().playAnimation,
    })

    segments.forEach((cp) => {
      const curve = new CubicBezierCurve3(
        new Vector3(...cp.startPoint),
        new Vector3(...cp.midPointA),
        new Vector3(...cp.midPointB),
        new Vector3(...cp.endPoint)
      )
      const progress = { u: 0 }
      timeline.to(progress, {
        u: 1,
        ease: "none",
        duration: constantSpeed
          ? Math.max(0.5, curve.getLength() / SPEED)
          : SEGMENT_SECONDS,
        onUpdate: () => {
          // Arc-length mapping turns equal steps in u into equal distances.
          const t = constantSpeed ? curve.getUtoTmapping(progress.u) : progress.u
          target.position.copy(
            getCubicBezierPoint(
              cp.startPoint,
              cp.midPointA,
              cp.midPointB,
              cp.endPoint,
              t
            )
          )
        },
      })
    })

    target.position.fromArray(segments[0].startPoint)
    timelineRef.current = timeline
    return () => {
      timeline.kill()
      if (timelineRef.current === timeline) timelineRef.current = null
    }
  }, [object, segments, constantSpeed])

  useEffect(() => {
    const timeline = timelineRef.current
    if (!timeline) return
    if (playAnimation) timeline.play()
    else timeline.pause()
  }, [playAnimation, segments, constantSpeed])
}
