import "./styles.css"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { BezierCurveEditor } from "./components/BezierCurveEditor"
import { UI } from "./components/UI/UI"
import { COLORS } from "./theme"

export default function App() {
  return (
    <div className="App" id="container">
      <div className="ui-container">
        <UI />
      </div>
      <Canvas
        id="canvas"
        dpr={[1, 2]}
        camera={{
          position: [0, 5, 15],
          near: 0.01,
          far: 100,
          fov: 45,
        }}
      >
        <color attach="background" args={[COLORS.background]} />
        <BezierCurveEditor />
        <ambientLight intensity={2} />
        <gridHelper args={[20, 20, COLORS.gridCenter, COLORS.grid]} />
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  )
}
