// Cloud Configuration

import { useMemo } from "react";
import SpinnerCat from "./SpinnerCat";

// Simply change the number of clouds or their properties here
const CLOUD_CONFIG = {
  count: 50, // Number of clouds to render
  randomize: true, // If true, positions will be randomized
  // If randomize is false, you can specify exact positions
  positions: [
    // Example positions (only used if randomize: false)
    // { top: "20%", left: "0%" },
    // { top: "40%", right: "0%" },
  ],
  // Minimum distance between clouds (in pixels)
  minDistance: 10,
  // Maximum attempts to find a valid position before giving up
  maxPlacementAttempts: 100,
  // Size range for clouds
  sizeRange: {
    min: 100,
    max: 300,
  },
  // Opacity range
  opacityRange: {
    min: 0.5,
    max: 1,
  },
  // Animation timing ranges
  driftDuration: {
    min: 2,
    max: 5,
  },
  floatDuration: {
    min: 3,
    max: 6,
  },
  // Animation delay range (in seconds)
  delayRange: {
    min: -10,
    max: 0,
  },
};

// Helper function to generate random number in range
const randomInRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;

// Helper function to generate random percentage
const randomPercent = () => Math.random() * 100;

// Convert position object to pixel coordinates
const positionToPixels = (
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  },
  width: number = 1920,
  height: number = 1080
): { x: number; y: number } => {
  let x = 0;
  let y = 0;

  if (position.left !== undefined) {
    x = (parseFloat(position.left) / 100) * width;
  } else if (position.right !== undefined) {
    x = width - (parseFloat(position.right) / 100) * width;
  }

  if (position.top !== undefined) {
    y = (parseFloat(position.top) / 100) * height;
  } else if (position.bottom !== undefined) {
    y = height - (parseFloat(position.bottom) / 100) * height;
  }

  return { x, y };
};

// Check if a position is valid using AABB (Axis-Aligned Bounding Box) collision detection
const isPositionValid = (
  newPos: { x: number; y: number },
  newWidth: number,
  newHeight: number,
  existingClouds: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>,
  buffer: number
): boolean => {
  const newLeft = newPos.x;
  const newRight = newPos.x + newWidth;
  const newTop = newPos.y;
  const newBottom = newPos.y + newHeight;

  for (const cloud of existingClouds) {
    const existingLeft = cloud.x;
    const existingRight = cloud.x + cloud.width;
    const existingTop = cloud.y;
    const existingBottom = cloud.y + cloud.height;

    // Check for overlap with buffer
    // Expand the existing cloud's box by 'buffer' on all sides
    if (
      newLeft < existingRight + buffer &&
      newRight > existingLeft - buffer &&
      newTop < existingBottom + buffer &&
      newBottom > existingTop - buffer
    ) {
      return false; // Overlap detected
    }
  }
  return true;
};

// Generate cloud data based on config
const generateClouds = () => {
  const clouds: Array<{
    id: number;
    width: number;
    height: number;
    opacity: number;
    driftDuration: number;
    floatDuration: number;
    delay: number;
    floatX: number;
    floatY: number;
    position: any;
    x: number;
    y: number;
  }> = [];

  // Pre-calculate cloud sizes to sort by size (place larger clouds first for better packing)
  const cloudsToPlace = Array.from({ length: CLOUD_CONFIG.count }, (_, i) => {
    const width = Math.floor(
      randomInRange(CLOUD_CONFIG.sizeRange.min, CLOUD_CONFIG.sizeRange.max)
    );
    const height = Math.floor(width * 0.5);
    return { index: i, width, height };
  }).sort((a, b) => b.width - a.width); // Descending size

  for (const cloudInfo of cloudsToPlace) {
    const { width, height } = cloudInfo;
    const opacity = randomInRange(
      CLOUD_CONFIG.opacityRange.min,
      CLOUD_CONFIG.opacityRange.max
    );
    const driftDuration = Math.floor(
      randomInRange(
        CLOUD_CONFIG.driftDuration.min,
        CLOUD_CONFIG.driftDuration.max
      )
    );
    const floatDuration = randomInRange(
      CLOUD_CONFIG.floatDuration.min,
      CLOUD_CONFIG.floatDuration.max
    );
    const delay = Math.floor(
      randomInRange(CLOUD_CONFIG.delayRange.min, CLOUD_CONFIG.delayRange.max)
    );

    const floatX = randomInRange(-100, 500);
    const floatY = randomInRange(-100, 100);

    let position: {
      top?: string;
      bottom?: string;
      left?: string;
      right?: string;
    } = {};

    let pixelPos = { x: 0, y: 0 };
    let positionFound = false;

    // Retry strategy with relaxing buffer
    const buffers = [CLOUD_CONFIG.minDistance, CLOUD_CONFIG.minDistance / 2, 0];

    for (const buffer of buffers) {
      if (positionFound) break;

      let attempts = 0;
      const maxAttempts =
        CLOUD_CONFIG.maxPlacementAttempts * (buffer === 0 ? 2 : 1);

      while (!positionFound && attempts < maxAttempts) {
        if (CLOUD_CONFIG.randomize) {
          // Random position
          const useTop = Math.random() > 0.5;
          const useLeft = Math.random() > 0.5;

          position = {};
          if (useTop) {
            position.top = `${randomPercent()}%`;
          } else {
            position.bottom = `${randomPercent()}%`;
          }
          if (useLeft) {
            position.left = `${randomPercent()}%`;
          } else {
            position.right = `${randomPercent()}%`;
          }
        } else {
          // Use specified position
          position = CLOUD_CONFIG.positions[cloudInfo.index] || {
            top: `${randomPercent()}%`,
            left: `${randomPercent()}%`,
          };
        }

        pixelPos = positionToPixels(position);

        if (isPositionValid(pixelPos, width, height, clouds, buffer)) {
          positionFound = true;
        } else {
          attempts++;
          if (
            !CLOUD_CONFIG.randomize &&
            CLOUD_CONFIG.positions[cloudInfo.index]
          ) {
            positionFound = true;
          }
        }
      }
    }

    // Fallback
    if (!positionFound) {
      position = { top: `${randomPercent()}%`, left: `${randomPercent()}%` };
      pixelPos = positionToPixels(position);
    }

    clouds.push({
      id: cloudInfo.index + 1,
      width,
      height,
      opacity,
      driftDuration,
      floatDuration,
      delay,
      floatX,
      floatY,
      position,
      x: pixelPos.x,
      y: pixelPos.y,
    });
  }
  return clouds;
};

// Cloud SVG Component
const CloudSVG = ({
  width,
  height,
  opacity,
  index,
}: {
  width: number;
  height: number;
  opacity: number;
  index: number;
}) => {
  // Calculate ellipse positions based on size
  const centerX = width / 2;
  const centerY = height * 0.65;
  const baseRadiusX = width * 0.2;
  const baseRadiusY = height * 0.3;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ opacity }}
    >
      {/* Bottom ellipses */}
      <ellipse
        cx={centerX - width * 0.25}
        cy={centerY}
        rx={baseRadiusX}
        ry={baseRadiusY * 0.8}
        fill="white"
      />
      <ellipse
        cx={centerX}
        cy={centerY - height * 0.1}
        rx={baseRadiusX * 1.2}
        ry={baseRadiusY}
        fill="white"
      />
      <ellipse
        cx={centerX + width * 0.25}
        cy={centerY}
        rx={baseRadiusX}
        ry={baseRadiusY * 0.8}
        fill="white"
      />
      {/* Top ellipse */}
      {index % 2 === 0 && (
        <ellipse
          cx={centerX}
          cy={centerY - height * 0.4}
          rx={baseRadiusX * 0.7}
          ry={baseRadiusY * 0.6}
          fill="white"
        />
      )}
      {index % 3 === 0 && (
        <ellipse
          cx={centerX + width * 0.25}
          cy={centerY - height * 0.25}
          rx={baseRadiusX * 0.9}
          ry={baseRadiusY * 0.8}
          fill="white"
        />
      )}
    </svg>
  );
};

const Loading = () => {
  const clouds = useMemo(() => generateClouds(), []);

  // Generate dynamic CSS for animations
  const generateAnimationCSS = useMemo(
    () => () => {
      let css = "";

      // Generate float animations for each cloud
      clouds.forEach((cloud) => {
        css += `
        @keyframes float${cloud.id} {
          0%, 100% {
            transform: translateX(0) translateY(0);
          }
          50% {
            transform: translateX(${cloud.floatX}px) translateY(${cloud.floatY}px);
          }
        }
      `;
      });

      // Drift animation
      css += `
      @keyframes drift {
        0% {
          transform: translateX(-100px);
        }
        100% {
          transform: translateX(calc(100vw + 500px));
        }
      }
    `;

      // Base cloud animation
      css += `
      .cloud {
        animation: drift 10s linear infinite;
      }
    `;

      // Individual cloud animations
      clouds.forEach((cloud) => {
        css += `
        .cloud-${cloud.id} {
          animation: drift ${cloud.driftDuration}s linear infinite, float${
          cloud.id
        } ${cloud.floatDuration.toFixed(1)}s ease-in-out infinite;
          animation-delay: ${cloud.delay}s;
        }
      `;
      });

      return css;
    },
    [clouds]
  );

  return (
    <div
      className="relative h-dvh w-dvw overflow-hidden "
      style={{
        background: "linear-gradient(to bottom,#F5E1B8, #F8E8C4)",
      }}
    >
      {/* Animated Clouds */}
      <div className="absolute inset-0">
        {clouds.map((cloud, index) => (
          <div
            key={cloud.id}
            className={`absolute cloud cloud-${cloud.id}`}
            style={cloud.position}
          >
            <CloudSVG
              width={cloud.width}
              height={cloud.height}
              opacity={cloud.opacity}
              index={index}
            />
          </div>
        ))}
      </div>

      {/* Loading Text */}
      {/* <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center">
          <div className="inline-block animate-pulse">
            <h2
              className="text-2xl md:text-3xl font-semibold drop-shadow-lg"
              style={{ color: "#8B6F47" }}
            >
              Loading...
            </h2>
          </div>
        </div>
      </div> */}

      <div className="flex items-center justify-center h-full">
        <SpinnerCat />
      </div>

      <style>{generateAnimationCSS()}</style>
    </div>
  );
};

export default Loading;
