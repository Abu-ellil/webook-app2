# Design Document

## Overview

The octagonal seat map will be implemented using HTML5 Canvas with React for optimal performance and precise positioning control. The system will render a complex venue layout with multiple seating sections arranged in an octagonal pattern, supporting interactive seat selection, zoom/pan functionality, and real-time updates.

## Architecture

### Component Structure

```
OctagonalSeatMap (Main Canvas Component)
├── CanvasRenderer (Core rendering logic)
├── SeatInteractionHandler (Mouse/touch events)
├── ViewportController (Zoom/pan management)
└── SeatDataManager (Seat positioning and state)
```

### Data Flow

1. Seat data with precise coordinates flows from seat store
2. Canvas renderer processes visible seats based on viewport
3. Interaction handler manages user input and seat selection
4. State updates trigger selective re-rendering for performance

## Components and Interfaces

### OctagonalSeatMap Component

```typescript
interface OctagonalSeatMapProps {
  width?: number;
  height?: number;
  className?: string;
}

interface CanvasState {
  zoom: number;
  panX: number;
  panY: number;
  hoveredSeat: string | null;
  isDragging: boolean;
}
```

### Seat Positioning System

```typescript
interface SeatPosition {
  id: string;
  x: number;
  y: number;
  section: SectionType;
  category: SeatCategory;
  rotation?: number; // For angled sections
}

interface SectionLayout {
  id: string;
  type: "straight" | "angled" | "curved";
  seats: SeatPosition[];
  bounds: Rectangle;
  rotation: number;
  color: string;
}
```

### Rendering Engine

```typescript
interface RenderContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  viewport: Viewport;
  seatSize: number;
  levelOfDetail: number;
}
```

## Data Models

### Enhanced Seat Model

```typescript
interface OctagonalSeat extends Seat {
  x: number; // Precise canvas coordinates
  y: number;
  rotation?: number; // For angled sections
  sectionId: string;
  renderPriority: number; // For LOD rendering
}
```

### Section Definitions

Based on the image analysis, the venue has these sections:

1. **Corner Angled Sections (4 sections)**

   - Top-left, top-right, bottom-left, bottom-right
   - Rotated seat arrangements
   - Mixed categories (Bronze, Silver, Gold)

2. **Straight Side Sections (4 sections)**

   - Top, right, bottom, left sides
   - Regular grid arrangements
   - Various categories

3. **Central Floor Sections (6 sections)**
   - Premium seating closest to stage
   - VIP, VVIP, Diamond categories
   - Colorful arrangement as shown in image

### Coordinate System

```typescript
// Canvas coordinate system (0,0 at top-left)
const VENUE_BOUNDS = {
  width: 1200,
  height: 800,
  centerX: 600,
  centerY: 400,
};

// Stage position (center-right as shown in image)
const STAGE_POSITION = {
  x: 750,
  y: 400,
  width: 200,
  height: 100,
};
```

## Seat Section Layouts

### Section Positioning Strategy

```typescript
const SECTION_LAYOUTS: SectionLayout[] = [
  // Top angled sections
  {
    id: "top-left-angled",
    type: "angled",
    rotation: -45,
    bounds: { x: 100, y: 50, width: 200, height: 150 },
    categories: ["Bronze", "Silver"],
  },
  {
    id: "top-right-angled",
    type: "angled",
    rotation: 45,
    bounds: { x: 900, y: 50, width: 200, height: 150 },
    categories: ["Bronze", "Silver"],
  },

  // Central premium sections
  {
    id: "center-vip-left",
    type: "straight",
    rotation: 0,
    bounds: { x: 300, y: 250, width: 100, height: 200 },
    categories: ["VIP", "Diamond"],
  },
  {
    id: "center-premium",
    type: "straight",
    rotation: 0,
    bounds: { x: 420, y: 250, width: 200, height: 200 },
    categories: ["VVIP", "Royal", "Diamond"],
  },

  // Additional sections following the image pattern...
];
```

## Rendering Strategy

### Level of Detail (LOD) System

```typescript
interface LODLevel {
  minZoom: number;
  maxZoom: number;
  seatSize: number;
  renderIndividualSeats: boolean;
  groupSeats: boolean;
}

const LOD_LEVELS: LODLevel[] = [
  {
    minZoom: 0.1,
    maxZoom: 0.5,
    seatSize: 2,
    renderIndividualSeats: false,
    groupSeats: true,
  },
  {
    minZoom: 0.5,
    maxZoom: 1.0,
    seatSize: 4,
    renderIndividualSeats: true,
    groupSeats: false,
  },
  {
    minZoom: 1.0,
    maxZoom: 3.0,
    seatSize: 8,
    renderIndividualSeats: true,
    groupSeats: false,
  },
];
```

### Rendering Pipeline

1. **Viewport Culling**: Only render seats within visible area
2. **LOD Selection**: Choose appropriate detail level based on zoom
3. **Batch Rendering**: Group similar seats for efficient drawing
4. **Interactive Layer**: Handle hover/selection states
5. **UI Overlay**: Stage, labels, and controls

### Performance Optimizations

- **Spatial Indexing**: Quad-tree for fast seat lookup
- **Dirty Region Tracking**: Only redraw changed areas
- **Canvas Layering**: Separate static and dynamic content
- **Request Animation Frame**: Smooth 60fps rendering

## Error Handling

### Canvas Rendering Errors

- Fallback to simplified rendering if WebGL unavailable
- Graceful degradation for older browsers
- Error boundaries for React components

### Interaction Errors

- Validate seat coordinates before selection
- Handle touch events for mobile devices
- Prevent selection of invalid seats

### Performance Monitoring

- FPS tracking and automatic LOD adjustment
- Memory usage monitoring
- Render time optimization

## Testing Strategy

### Unit Tests

- Seat coordinate calculations
- Section layout positioning
- Viewport transformations
- Seat selection logic

### Integration Tests

- Canvas rendering pipeline
- User interaction flows
- Zoom/pan functionality
- Performance benchmarks

### Visual Tests

- Screenshot comparison with reference image
- Cross-browser rendering consistency
- Mobile responsiveness
- Accessibility compliance

### Performance Tests

- Render 10,000+ seats smoothly
- Zoom/pan responsiveness
- Memory leak detection
- Mobile device performance
