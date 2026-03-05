import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback } from "react";

export default function SpaceBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        background: { color: { value: "#050510" } },
        fpsLimit: 60,
        particles: {
          number: { value: 160, density: { enable: true, area: 800 } },
          color: { value: ["#ffffff", "#b9c7ff", "#ffd6ff"] },
          opacity: { value: { min: 0.2, max: 0.9 }, animation: { enable: true, speed: 0.6 } },
          size: { value: { min: 0.6, max: 2.2 } },
          move: { enable: true, speed: 0.25, direction: "none", outModes: { default: "out" } },
        },
      }}
    />
  );
}
