/**
 * Constants for tile size, grid settings, and colors.
 */
const TILE_SIZE = 32;
const GRID_COLUMNS = 256;
const GRID_ROWS = 256;
const LAYER_COLORS = {
  0: 'red',
  1: 'blue',
  2: 'green',
};

/**
 * Canvas and context setup.
 */
const canvas = document.getElementById('grid-canvas');
const ctx = canvas.getContext('2d');

/**
 * Variables for panning.
 */
let isPanning = false;
let panStartX, panStartY;
let offsetX = 0;
let offsetY = 0;

/**
 * Tool buttons and layer selector.
 */
const panTool = document.getElementById('pan-tool');
const drawTool = document.getElementById('draw');
const eraseTool = document.getElementById('erase');
const rectangleTool = document.getElementById('rectangle');
const selectTool = document.getElementById('select');
const layerSelector = document.getElementById('layer-selector');

/**
 * Metadata form elements.
 */
const npcMetadataSection = document.getElementById('npc-metadata');
const npcNameInput = document.getElementById('npc-name');
const npcClassInput = document.getElementById('npc-class');
const npcHealthInput = document.getElementById('npc-health');
const saveNpcMetadataButton = document.getElementById('save-npc-metadata');

/**
 * Tile and NPC data storage.
 */
const npcData = {};
const layers = {
  0: {}, // Layer 0
  1: {}, // Layer 1
  2: {}, // Layer 2
};

let selectedTile = null;
let activeTool = null;
let activeLayer = 0;

/**
 * Rectangle drawing state.
 */
let isDrawingRectangle = false;
let rectangleStart = { x: 0, y: 0 };
let rectangleEnd = { x: 0, y: 0 };

/**
 * Sets the active tool and updates the cursor style.
 * @param {string} tool - The selected tool.
 */
function setActiveTool(tool) {
  activeTool = tool;
  canvas.style.cursor = {
    pan: 'grab',
    draw: 'crosshair',
    erase: 'not-allowed',
    rectangle: 'crosshair',
    select: 'pointer',
  }[tool] || 'default';
}

// Tool button event listeners.
panTool.addEventListener('click', () => setActiveTool('pan'));
drawTool.addEventListener('click', () => setActiveTool('draw'));
eraseTool.addEventListener('click', () => setActiveTool('erase'));
rectangleTool.addEventListener('click', () => setActiveTool('rectangle'));
selectTool.addEventListener('click', () => setActiveTool('select'));

/**
 * Handles layer selection changes.
 */
layerSelector.addEventListener('change', (event) => {
  activeLayer = parseInt(event.target.value, 10);
});

/**
 * Handles NPC metadata saving.
 */
saveNpcMetadataButton.addEventListener('click', () => {
  if (!selectedTile) return;

  npcData[selectedTile] = {
    name: npcNameInput.value,
    class: npcClassInput.value,
    health: parseInt(npcHealthInput.value, 10) || 100,
  };

  alert(`Metadata for NPC at ${selectedTile} saved.`);
});

/**
 * Handles canvas clicks for tile selection or drawing/erasing.
 */
canvas.addEventListener('click', (event) => {
  if (activeTool === 'select') {
    handleTileSelection(event);
  } else if (['draw', 'erase'].includes(activeTool)) {
    handleTileModification(event);
  }
});

/**
 * Handles tile selection on canvas click.
 */
function handleTileSelection(event) {
  const { x, y } = getTileCoordinates(event);

  const key = `${x},${y}`;
  if (activeLayer === 2 && layers[2][key]) {
    selectedTile = key;

    const npc = npcData[key] || {};
    npcMetadataSection.style.display = 'block';
    npcNameInput.value = npc.name || '';
    npcClassInput.value = npc.class || 'warrior';
    npcHealthInput.value = npc.health || 100;
  } else {
    selectedTile = null;
    npcMetadataSection.style.display = 'none';
  }
}

/**
 * Handles tile drawing or erasing.
 */
function handleTileModification(event) {
  const { x, y } = getTileCoordinates(event);
  const key = `${x},${y}`;

  if (activeTool === 'draw') {
    layers[activeLayer][key] = true;
  } else if (activeTool === 'erase') {
    delete layers[activeLayer][key];
  }

  drawGrid();
}

/**
 * Starts panning or rectangle drawing on mousedown.
 */
canvas.addEventListener('mousedown', (event) => {
  const { x, y } = getTileCoordinates(event);

  if (activeTool === 'pan') {
    isPanning = true;
    panStartX = event.clientX - offsetX;
    panStartY = event.clientY - offsetY;
    canvas.style.cursor = 'grabbing';
  } else if (activeTool === 'rectangle') {
    isDrawingRectangle = true;
    rectangleStart = { x, y };
    rectangleEnd = { x, y };
  }
});

// Other handlers for mousemove, mouseup, drawing grid, etc.
// Each function should follow the same pattern for clarity and modularity.

/**
 * Gets tile coordinates based on the mouse event.
 * @param {MouseEvent} event - The mouse event.
 * @returns {{x: number, y: number}} The tile coordinates.
 */
function getTileCoordinates(event) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left - offsetX) / TILE_SIZE);
  const y = Math.floor((event.clientY - rect.top - offsetY) / TILE_SIZE);
  return { x, y };
}

/**
 * Draws the entire grid, tiles, and number lines.
 */
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw grid lines and tiles.
  for (let x = offsetX % TILE_SIZE; x < canvas.width; x += TILE_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.strokeStyle = '#ccc';
    ctx.stroke();
  }
  for (let y = offsetY % TILE_SIZE; y < canvas.height; y += TILE_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.strokeStyle = '#ccc';
    ctx.stroke();
  }

  // Draw tiles for each layer.
  for (const [layer, tiles] of Object.entries(layers)) {
    ctx.fillStyle = LAYER_COLORS[layer];
    for (const key in tiles) {
      const [tileX, tileY] = key.split(',').map(Number);
      const screenX = tileX * TILE_SIZE + offsetX;
      const screenY = tileY * TILE_SIZE + offsetY;

      if (
        screenX + TILE_SIZE >= 0 &&
        screenX < canvas.width &&
        screenY + TILE_SIZE >= 0 &&
        screenY < canvas.height
      ) {
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}

// Initialize the grid.
drawGrid();
