export interface Space {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PlacedGrid {
  x: number;
  y: number;
  position: {
    x: number;
    y: number;
  };
}

function insertSpace(freeSpaces: Space[], newSpace: Space) {
  // Insert space sorted by area (largest first)
  const newArea = newSpace.width * newSpace.height;
  const insertIndex = freeSpaces.findIndex(
    (space) => space.width * space.height < newArea,
  );

  if (insertIndex === -1) {
    freeSpaces.push(newSpace);
  } else {
    freeSpaces.splice(insertIndex, 0, newSpace);
  }
}

// git 

export function calculateGridPlacements(
  width: number,
  height: number,
  maxGridX: number,
  maxGridY: number,
): { placedGrids: PlacedGrid[]; freeSpaces: Space[] } {
  // Calculate total whole units and remainders
  const totalGridsX = Math.floor(width / 42);
  const totalGridsY = Math.floor(height / 42);
  const remainderX = width % 42;
  const remainderY = height % 42;

  const MIN_USEFUL_SIZE = 1; // Minimum size to be considered useful

  const workingSpaces: Space[] = [
    {
      x: 0,
      y: 0,
      width: totalGridsX,
      height: totalGridsY,
    },
  ];

  const placedGrids: PlacedGrid[] = [];
  const unusableSpaces: Space[] = [];

  // Process main grid area
  while (workingSpaces.length > 0) {
    const space = workingSpaces[0];
    if (!space) break;

    // Check if space is too small to be useful
    if (space.width < MIN_USEFUL_SIZE || space.height < MIN_USEFUL_SIZE) {
      unusableSpaces.push(workingSpaces.shift()!);
      continue;
    }

    // Find the largest grid that fits
    let bestFit = null;
    let maxArea = 0;

    for (let x = 1; x <= Math.min(space.width, maxGridX); x++) {
      for (let y = 1; y <= Math.min(space.height, maxGridY); y++) {
        const area = x * y;
        if (area > maxArea) {
          maxArea = area;
          bestFit = { gridWidth: x, gridHeight: y };
        }
      }
    }

    if (!bestFit) {
      unusableSpaces.push(workingSpaces.shift()!);
      continue;
    }

    placedGrids.push({
      x: bestFit.gridWidth,
      y: bestFit.gridHeight,
      position: {
        x: space.x,
        y: space.y,
      },
    });

    workingSpaces.shift();

    // Create right space if large enough
    if (space.width - bestFit.gridWidth >= MIN_USEFUL_SIZE) {
      workingSpaces.push({
        x: space.x + bestFit.gridWidth,
        y: space.y,
        width: space.width - bestFit.gridWidth,
        height: space.height,
      });
    } else if (space.width - bestFit.gridWidth > 0) {
      // Add to unusable if too small
      unusableSpaces.push({
        x: space.x + bestFit.gridWidth,
        y: space.y,
        width: space.width - bestFit.gridWidth,
        height: space.height,
      });
    }

    // Create bottom space if large enough
    if (space.height - bestFit.gridHeight >= MIN_USEFUL_SIZE) {
      workingSpaces.push({
        x: space.x,
        y: space.y + bestFit.gridHeight,
        width: bestFit.gridWidth,
        height: space.height - bestFit.gridHeight,
      });
    } else if (space.height - bestFit.gridHeight > 0) {
      // Add to unusable if too small
      unusableSpaces.push({
        x: space.x,
        y: space.y + bestFit.gridHeight,
        width: bestFit.gridWidth,
        height: space.height - bestFit.gridHeight,
      });
    }
  }

  // Add remainder spaces if they exist
  if (remainderX > 0) {
    unusableSpaces.push({
      x: totalGridsX,
      y: 0,
      width: remainderX / 42, // Convert to grid units
      height: totalGridsY,
    });
  }

  if (remainderY > 0) {
    unusableSpaces.push({
      x: 0,
      y: totalGridsY,
      width: totalGridsX,
      height: remainderY / 42, // Convert to grid units
    });
  }

  // Add corner piece if both remainders exist
  if (remainderX > 0 && remainderY > 0) {
    unusableSpaces.push({
      x: totalGridsX,
      y: totalGridsY,
      width: remainderX / 42,
      height: remainderY / 42,
    });
  }

  return { 
    placedGrids, 
    freeSpaces: unusableSpaces 
  };
}
