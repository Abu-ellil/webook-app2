import { Seat } from './seat-store';

export interface SeatPosition {
    id: string;
    x: number;
    y: number;
    section: string;
    category: string;
    rotation?: number;
}

export interface OctagonLayer {
    name: string;
    category: string;
    radius: number;
    rows: number;
    seatsPerRow: number;
    color: string;
}

export interface SectionLayout {
    id: string;
    name: string;
    type: "straight" | "angled" | "curved";
    bounds: { x: number; y: number; width: number; height: number };
    rotation: number;
    rows: number;
    seatsPerRow: number;
    categories: string[];
    colors: string[];
}

// Base venue dimensions (will be scaled for different screen sizes)
export const BASE_VENUE_CONFIG = {
    width: 600,
    height: 400,
    centerX: 300,
    centerY: 200,
    ellipseRadiusX: 320, // Reduced from 350 and made elliptical
    ellipseRadiusY: 280, // Smaller vertical radius for better fit
};

// Base stage position (will be scaled for different screen sizes)
export const BASE_STAGE_CONFIG = {
    x: 750,
    y: 350,
    width: 200,
    height: 100,
    label: "STAGE",
};

// Get scaled venue config based on canvas dimensions
export function getScaledVenueConfig(canvasWidth: number, canvasHeight: number) {
    const scaleX = canvasWidth / BASE_VENUE_CONFIG.width;
    const scaleY = canvasHeight / BASE_VENUE_CONFIG.height;
    const scale = Math.min(scaleX, scaleY) * 0.9; // 90% to leave some padding

    return {
        width: canvasWidth,
        height: canvasHeight,
        centerX: canvasWidth / 2,
        centerY: canvasHeight / 2,
        ellipseRadiusX: BASE_VENUE_CONFIG.ellipseRadiusX * scale,
        ellipseRadiusY: BASE_VENUE_CONFIG.ellipseRadiusY * scale,
        scale,
    };
}

// Get scaled stage config based on canvas dimensions
export function getScaledStageConfig(canvasWidth: number, canvasHeight: number) {
    const venueConfig = getScaledVenueConfig(canvasWidth, canvasHeight);
    const scale = venueConfig.scale;

    return {
        x: venueConfig.centerX + (BASE_STAGE_CONFIG.x - BASE_VENUE_CONFIG.centerX) * scale,
        y: venueConfig.centerY + (BASE_STAGE_CONFIG.y - BASE_VENUE_CONFIG.centerY) * scale,
        width: BASE_STAGE_CONFIG.width * scale,
        height: BASE_STAGE_CONFIG.height * scale,
        label: "STAGE",
    };
}

// Legacy exports for backward compatibility
export const VENUE_CONFIG = BASE_VENUE_CONFIG;
export const STAGE_CONFIG = BASE_STAGE_CONFIG;

// Define all sections - جمع كل المقاعد في منطقة صغيرة حول المركز
export const SECTION_LAYOUTS: SectionLayout[] = [
    // Top sections - قريبة جداً من المركز
    {
        id: "top-left-straight",
        name: "Section A",
        type: "straight",
        bounds: { x: 450, y: 200, width: 50, height: 60 },
        rotation: 0,
        rows: 6,
        seatsPerRow: 10,
        categories: ["Silver", "Gold"],
        colors: ["#C0C0C0", "#FFD700"],
    },
    {
        id: "top-center-straight",
        name: "Section B",
        type: "straight",
        bounds: { x: 520, y: 200, width: 60, height: 60 },
        rotation: 0,
        rows: 6,
        seatsPerRow: 12,
        categories: ["Silver", "Gold"],
        colors: ["#C0C0C0", "#FFD700"],
    },
    {
        id: "top-right-straight",
        name: "Section C",
        type: "straight",
        bounds: { x: 600, y: 200, width: 50, height: 60 },
        rotation: 0,
        rows: 6,
        seatsPerRow: 10,
        categories: ["Silver", "Gold"],
        colors: ["#C0C0C0", "#FFD700"],
    },

    // Left sections - قريبة من المركز
    {
        id: "left-upper",
        name: "Section D",
        type: "straight",
        bounds: { x: 350, y: 280, width: 80, height: 50 },
        rotation: 0,
        rows: 8,
        seatsPerRow: 8,
        categories: ["Bronze", "Silver"],
        colors: ["#CD7F32", "#C0C0C0"],
    },
    {
        id: "left-lower",
        name: "Section E",
        type: "straight",
        bounds: { x: 350, y: 350, width: 80, height: 50 },
        rotation: 0,
        rows: 8,
        seatsPerRow: 8,
        categories: ["Bronze", "Silver"],
        colors: ["#CD7F32", "#C0C0C0"],
    },

    // Central premium sections - في المركز تماماً
    {
        id: "center-left-vip",
        name: "VIP Left",
        type: "straight",
        bounds: { x: 450, y: 280, width: 50, height: 80 },
        rotation: 0,
        rows: 10,
        seatsPerRow: 6,
        categories: ["VIP"],
        colors: ["#FF1493"],
    },
    {
        id: "center-main-vvip",
        name: "VVIP Center",
        type: "straight",
        bounds: { x: 520, y: 280, width: 60, height: 80 },
        rotation: 0,
        rows: 10,
        seatsPerRow: 8,
        categories: ["VVIP"],
        colors: ["#9932CC"],
    },
    {
        id: "center-right-vip",
        name: "VIP Right",
        type: "straight",
        bounds: { x: 600, y: 280, width: 50, height: 80 },
        rotation: 0,
        rows: 10,
        seatsPerRow: 6,
        categories: ["VIP"],
        colors: ["#FF69B4"],
    },

    // Right sections - قريبة من المركز
    {
        id: "right-upper",
        name: "Section F",
        type: "straight",
        bounds: { x: 670, y: 280, width: 80, height: 50 },
        rotation: 0,
        rows: 8,
        seatsPerRow: 8,
        categories: ["Bronze", "Silver"],
        colors: ["#CD7F32", "#C0C0C0"],
    },
    {
        id: "right-lower",
        name: "Section G",
        type: "straight",
        bounds: { x: 670, y: 350, width: 80, height: 50 },
        rotation: 0,
        rows: 8,
        seatsPerRow: 8,
        categories: ["Bronze", "Silver"],
        colors: ["#CD7F32", "#C0C0C0"],
    },

    // Bottom sections - قريبة من المركز
    {
        id: "bottom-left-straight",
        name: "Section H",
        type: "straight",
        bounds: { x: 450, y: 420, width: 50, height: 60 },
        rotation: 0,
        rows: 6,
        seatsPerRow: 10,
        categories: ["Silver", "Gold"],
        colors: ["#C0C0C0", "#FFD700"],
    },
    {
        id: "bottom-center-straight",
        name: "Section I",
        type: "straight",
        bounds: { x: 520, y: 420, width: 60, height: 60 },
        rotation: 0,
        rows: 6,
        seatsPerRow: 12,
        categories: ["Silver", "Gold"],
        colors: ["#C0C0C0", "#FFD700"],
    },
    {
        id: "bottom-right-straight",
        name: "Section J",
        type: "straight",
        bounds: { x: 600, y: 420, width: 50, height: 60 },
        rotation: 0,
        rows: 6,
        seatsPerRow: 10,
        categories: ["Silver", "Gold"],
        colors: ["#C0C0C0", "#FFD700"],
    },

    // Corner sections - في الزوايا لكن قريبة
    {
        id: "corner-top-left",
        name: "Section K",
        type: "angled",
        bounds: { x: 380, y: 220, width: 60, height: 50 },
        rotation: -15,
        rows: 5,
        seatsPerRow: 8,
        categories: ["Bronze"],
        colors: ["#CD7F32"],
    },
    {
        id: "corner-top-right",
        name: "Section L",
        type: "angled",
        bounds: { x: 660, y: 220, width: 60, height: 50 },
        rotation: 15,
        rows: 5,
        seatsPerRow: 8,
        categories: ["Bronze"],
        colors: ["#CD7F32"],
    },
    {
        id: "corner-bottom-left",
        name: "Section M",
        type: "angled",
        bounds: { x: 380, y: 400, width: 60, height: 50 },
        rotation: 15,
        rows: 5,
        seatsPerRow: 8,
        categories: ["Bronze"],
        colors: ["#CD7F32"],
    },
    {
        id: "corner-bottom-right",
        name: "Section N",
        type: "angled",
        bounds: { x: 660, y: 400, width: 60, height: 50 },
        rotation: -15,
        rows: 5,
        seatsPerRow: 8,
        categories: ["Bronze"],
        colors: ["#CD7F32"],
    },
];

// Generate seat positions for a section
export function generateSectionSeats(
    section: SectionLayout,
    startId: number
): SeatPosition[] {
    const seats: SeatPosition[] = [];
    let seatId = startId;

    const seatSpacing = 1; // pixels between seats (absolute minimum)
    const rowSpacing = 1; // pixels between rows (absolute minimum)

    for (let row = 0; row < section.rows; row++) {
        for (let seatNum = 0; seatNum < section.seatsPerRow; seatNum++) {
            // Calculate base position within section
            let x = section.bounds.x + (seatNum * seatSpacing) + seatSpacing;
            let y = section.bounds.y + (row * rowSpacing) + rowSpacing;

            // Apply rotation for angled sections
            if (section.type === "angled" && section.rotation !== 0) {
                const centerX = section.bounds.x + section.bounds.width / 2;
                const centerY = section.bounds.y + section.bounds.height / 2;

                const angle = (section.rotation * Math.PI) / 180;
                const cos = Math.cos(angle);
                const sin = Math.sin(angle);

                const dx = x - centerX;
                const dy = y - centerY;

                x = centerX + dx * cos - dy * sin;
                y = centerY + dx * sin + dy * cos;
            }

            // Determine category based on row (front rows get better categories)
            const categoryIndex = Math.floor(row / (section.rows / section.categories.length));
            const category = section.categories[Math.min(categoryIndex, section.categories.length - 1)];

            seats.push({
                id: `seat-${seatId}`,
                x: Math.round(x),
                y: Math.round(y),
                section: section.name,
                category,
                rotation: section.rotation,
            });

            seatId++;
        }
    }

    return seats;
}

// Generate all seats for the octagonal venue
export function generateOctagonalSeats(): SeatPosition[] {
    const allSeats: SeatPosition[] = [];
    let currentId = 1;

    SECTION_LAYOUTS.forEach((section) => {
        const sectionSeats = generateSectionSeats(section, currentId);
        allSeats.push(...sectionSeats);
        currentId += sectionSeats.length;
    });

    return allSeats;
}

// Convert SeatPosition to Seat interface
export function convertToSeatData(positions: SeatPosition[]): Seat[] {
    const categoryPrices: Record<string, number> = {
        VVIP: 800,
        VIP: 400,
        Royal: 500,
        Diamond: 600,
        Platinum: 700,
        Gold: 300,
        Silver: 200,
        Bronze: 150,
    };

    return positions.map((pos, index) => ({
        id: pos.id,
        row: String.fromCharCode(65 + Math.floor(index / 15)), // A, B, C, etc.
        number: (index % 15) + 1,
        section: pos.section,
        category: pos.category as any,
        price: categoryPrices[pos.category] || 150,
        status: Math.random() < 0.1 ? 'booked' : 'available' as any,
        x: pos.x,
        y: pos.y,
    }));
}

// Octagonal layers configuration
export const OCTAGON_LAYERS: OctagonLayer[] = [
    {
        name: "VVIP",
        category: "VVIP",
        radius: 80,
        rows: 3,
        seatsPerRow: 24,
        color: "#FFD700" // Golden
    },
    {
        name: "VIP",
        category: "VIP",
        radius: 120,
        rows: 4,
        seatsPerRow: 32,
        color: "#FF8C00" // Orange
    },
    {
        name: "Royal",
        category: "Royal",
        radius: 160,
        rows: 5,
        seatsPerRow: 40,
        color: "#DC143C" // Red
    },
    {
        name: "Diamond",
        category: "Diamond",
        radius: 200,
        rows: 6,
        seatsPerRow: 48,
        color: "#4169E1" // Blue
    },
    {
        name: "Platinum",
        category: "Platinum",
        radius: 240,
        rows: 7,
        seatsPerRow: 56,
        color: "#32CD32" // Green
    },
    {
        name: "Gold",
        category: "Gold",
        radius: 280,
        rows: 8,
        seatsPerRow: 64,
        color: "#FFD700" // Yellow
    },
    {
        name: "Silver",
        category: "Silver",
        radius: 320,
        rows: 9,
        seatsPerRow: 72,
        color: "#C0C0C0" // Gray
    }
];

// Generate octagonal seat layout
export function generateOctagonalLayout(centerX: number = 500, centerY: number = 400): SeatPosition[] {
    const seats: SeatPosition[] = [];
    let seatId = 1;

    OCTAGON_LAYERS.forEach((layer) => {
        for (let row = 0; row < layer.rows; row++) {
            const currentRadius = layer.radius + (row * 15); // 15px spacing between rows
            const seatsInThisRow = layer.seatsPerRow + (row * 4); // More seats in outer rows

            for (let seatIndex = 0; seatIndex < seatsInThisRow; seatIndex++) {
                // Calculate angle for this seat (distribute evenly around octagon)
                const angle = (seatIndex / seatsInThisRow) * 2 * Math.PI;

                // Create octagonal shape by modifying radius based on angle
                const octagonRadius = getOctagonRadius(currentRadius, angle);

                const x = centerX + octagonRadius * Math.cos(angle);
                const y = centerY + octagonRadius * Math.sin(angle);

                // Only add seat if it's within reasonable bounds and not too close to stage
                if (x > 50 && x < 950 && y > 50 && y < 750 && y < centerY + 200) {
                    seats.push({
                        id: `octagon-seat-${seatId}`,
                        x: Math.round(x),
                        y: Math.round(y),
                        section: `${layer.name} Layer`,
                        category: layer.category,
                    });
                    seatId++;
                }
            }
        }
    });

    return seats;
}

// Calculate octagonal radius based on angle
function getOctagonRadius(baseRadius: number, angle: number): number {
    // Normalize angle to 0-2π
    const normalizedAngle = ((angle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);

    // Divide circle into 8 segments for octagon
    const segmentAngle = Math.PI / 4; // 45 degrees
    const segmentIndex = Math.floor(normalizedAngle / segmentAngle);
    const angleInSegment = normalizedAngle % segmentAngle;

    // Make top and bottom sides longer by adjusting radius
    const radiusMultiplier = (segmentIndex === 1 || segmentIndex === 2 || segmentIndex === 5 || segmentIndex === 6)
        ? 1.2 // Top and bottom sides are longer
        : 1.0; // Other sides normal length

    // Create flat sides by reducing variation within each segment
    const flatnessFactor = Math.cos(angleInSegment - segmentAngle / 2);

    return baseRadius * radiusMultiplier * (0.9 + 0.1 * flatnessFactor);
}

// Generate seats using the new octagonal layout
export function generateNewOctagonalSeats(): SeatPosition[] {
    return generateOctagonalLayout(500, 400);
}

// Get category color
export function getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
        VVIP: "#FFD700",    // Golden
        VIP: "#FF8C00",     // Orange
        Royal: "#DC143C",   // Red
        Diamond: "#4169E1", // Blue
        Platinum: "#32CD32", // Green
        Gold: "#FFD700",    // Yellow
        Silver: "#C0C0C0",  // Gray
        Bronze: "#CD7F32",  // Bronze
    };

    return colors[category] || "#808080";
}