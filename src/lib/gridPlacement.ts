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
  const insertIndex = freeSpaces.findIndex(space => 
    (space.width * space.height) < newArea
  );
  
  if (insertIndex === -1) {
    freeSpaces.push(newSpace);
  } else {
    freeSpaces.splice(insertIndex, 0, newSpace);
  }
}

function splitSpace(freeSpaces: Space[], space: Space, gridWidth: number, gridHeight: number) {
  // Remove the used space
  const index = freeSpaces.indexOf(space);
  if (index > -1) {
    freeSpaces.splice(index, 1);
  }

  // Create right space
  if (space.width - gridWidth > 0) {
    insertSpace(freeSpaces, {
      x: space.x + gridWidth,
      y: space.y,
      width: space.width - gridWidth,
      height: space.height
    });
  }

  // Create bottom space
  if (space.height - gridHeight > 0) {
    insertSpace(freeSpaces, {
      x: space.x,
      y: space.y + gridHeight,
      width: gridWidth,
      height: space.height - gridHeight
    });
  }
}

export function calculateGridPlacements(
  width: number,
  height: number,
  maxGridX: number,
  maxGridY: number
): PlacedGrid[] {
  // Convert dimensions to Gridfinity units (42mm)
  const totalGridsX = Math.floor(width / 42);
  const totalGridsY = Math.floor(height / 42);
  
  // Initialize the free spaces list with the entire area
  const freeSpaces: Space[] = [{
    x: 0,
    y: 0,
    width: totalGridsX,
    height: totalGridsY
  }];
  
  const placedGrids: PlacedGrid[] = [];
  
  while (freeSpaces.length > 0) {
    const space = freeSpaces[0];
    
    // Find the largest grid that fits in this space
    let bestFit = null;
    let maxArea = 0;
    if (!space) {
      break;
    }
    
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
      freeSpaces.shift();
      continue;
    }
    
    // Add the grid with its position
    placedGrids.push({
      x: bestFit.gridWidth,
      y: bestFit.gridHeight,
      position: {
        x: space.x,
        y: space.y
      }
    });
    
    // Split remaining space
    splitSpace(freeSpaces, space, bestFit.gridWidth, bestFit.gridHeight);
  }

  return placedGrids;
}
