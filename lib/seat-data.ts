import { Seat } from './seat-store';


// Interface for skewed section configuration
interface SkewConfig {
    angle: number;      // Rotation angle in degrees
    rowOffset: number;  // Horizontal offset per row for skewing effect
}

// Interface for section configuration
interface SectionConfig {
    startX: number;
    startY: number;
    rows: number;
    seatsPerRow: number | number[];
    category: string;
    section: string;
    blockId: string;
    skew?: SkewConfig;  // Optional skew configuration
}

export function generateStadiumSeats(eventId?: string, categoryPrices?: Record<string, number>): Seat[] {
    // Generate grid-based stadium layout like the image
    return generateGridStadiumSeats(eventId, categoryPrices);
}

// Generate grid-based stadium layout matching the provided image
export function generateGridStadiumSeats(eventId?: string, categoryPrices?: Record<string, number>, bookedPercentage: number = 76): Seat[] {
    const seats: Seat[] = [];
    let seatId = 1;

    // Define seat spacing and size
    const seatSpacing = 6;  // Reduced from 10 to 6
    const rowSpacing = 7;   // Reduced from 12 to 8

    // Define sections with their positions and categories
    // Octagonal stadium layout matching the reference image with centered seats
    const sections: SectionConfig[] = [
        // Top Sections
        {
            startX: 45, startY: 130, rows: 4, seatsPerRow: 30,
            category: 'Bronze', section: 'Bottom Section 1', blockId: 'BS1',

            skew: { angle: -45, rowOffset: 3.5 }
        },
        {
            startX: 115, startY: 150, rows: 10, seatsPerRow: 25,
            category: 'Bronze', section: 'Bottom Section 1', blockId: 'BS1',

            skew: { angle: -45, rowOffset: -3.5 }
        },
        {
            startX: 300, startY: 100, rows: 21, seatsPerRow: 15,
            category: 'Silver', section: 'Top Section 1', blockId: 'TS1'
        },
        {
            startX: 410, startY: 50, rows: 4, seatsPerRow: 15,
            category: 'Gold', section: 'Top Section 2', blockId: 'TS2'
        },
        {
            startX: 410, startY: 100, rows: 10, seatsPerRow: 15,
            category: 'Gold', section: 'Top Section 3', blockId: 'TS3'
        },
        {
            startX: 410, startY: 180, rows: 10, seatsPerRow: 9,
            category: 'Gold', section: 'Top Section 4', blockId: 'TS4'
        },
        {
            startX: 515, startY: 50, rows: 4, seatsPerRow: 14,
            category: 'Diamond', section: 'Top Section 5', blockId: 'TS5'
        },
        {
            startX: 515, startY: 100, rows: 10, seatsPerRow: 14,
            category: 'Diamond', section: 'Top Section 6', blockId: 'TS6'
        },
        {
            startX: 545, startY: 180, rows: 10, seatsPerRow: 9,
            category: 'Diamond', section: 'Top Section 7', blockId: 'TS7'
        },
        {
            startX: 630, startY: 60, rows: 4, seatsPerRow: 13,
            category: 'Platinum', section: 'Top Section 8', blockId: 'TS8'
        },
        {
            startX: 630, startY: 100, rows: 20, seatsPerRow: 13,
            category: 'Platinum', section: 'Top Section 9', blockId: 'TS9'
        },
        {
            startX: 730, startY: 45, rows: 5, seatsPerRow: 9,
            category: 'Platinum', section: 'Top Section 10', blockId: 'TS10'
        },
        {
            startX: 750, startY: 100, rows: 11, seatsPerRow: 6,
            category: 'Platinum', section: 'Top Section 11', blockId: 'TS11',
            skew: { angle: 5, rowOffset: -3 }
        },
        // Middle Sections
        {
            startX: 70, startY: 250, rows: 43, seatsPerRow: 3,
            category: 'Bronze', section: 'Middle Section 1', blockId: 'MS1'
        },
        {
            startX: 110, startY: 305, rows: 12, seatsPerRow: 21,
            category: 'Silver', section: 'Middle Section 1', blockId: 'MS1'
        },
        {
            startX: 110, startY: 410, rows: 12, seatsPerRow: 21,
            category: 'Silver', section: 'Middle Section 2', blockId: 'MS2'
        },
        {
            startX: 290, startY: 280, rows: 10, seatsPerRow: 21,
            category: 'Silver', section: 'Middle Section 1', blockId: 'MS1'
        },
        {
            startX: 340, startY: 360, rows: 10, seatsPerRow: 13,
            category: 'Silver', section: 'Middle Section 3', blockId: 'MS3'
        },
        {
            startX: 290, startY: 450, rows: 10, seatsPerRow: 21,
            category: 'Silver', section: 'Middle Section 2', blockId: 'MS2'
        },

        {
            startX: 430, startY: 280, rows: 10, seatsPerRow: 10,
            category: 'Gold', section: 'Middle Section 5', blockId: 'MS5'
        },
        {
            startX: 430, startY: 360, rows: 10, seatsPerRow: 10,
            category: 'Gold', section: 'Middle Section 5', blockId: 'MS5'
        },
        {
            startX: 430, startY: 450, rows: 10, seatsPerRow: 10,
            category: 'Gold', section: 'Middle Section 6', blockId: 'MS6'
        },
        {
            startX: 500, startY: 280, rows: 10, seatsPerRow: 11,
            category: 'Diamond', section: 'Middle Section 5', blockId: 'MS5'
        },
        {
            startX: 500, startY: 360, rows: 10, seatsPerRow: 11,
            category: 'Diamond', section: 'Middle Section 5', blockId: 'MS5'
        },
        {
            startX: 500, startY: 450, rows: 10, seatsPerRow: 11,
            category: 'Diamond', section: 'Middle Section 6', blockId: 'MS6'
        },
        {
            startX: 580, startY: 280, rows: 10, seatsPerRow: 9,
            category: 'Royal', section: 'Middle Section 7', blockId: 'MS7'
        },
        {
            startX: 580, startY: 360, rows: 10, seatsPerRow: 9,
            category: 'Royal', section: 'Middle Section 8', blockId: 'MS8'
        },
        {
            startX: 580, startY: 450, rows: 10, seatsPerRow: 9,
            category: 'Royal', section: 'Middle Section 9', blockId: 'MS9'
        },
        {
            startX: 640, startY: 280, rows: 10, seatsPerRow: 6,
            category: 'VIP', section: 'Middle Section 7', blockId: 'MS7'
        },
        {
            startX: 640, startY: 360, rows: 10, seatsPerRow: 6,
            category: 'VIP', section: 'Middle Section 8', blockId: 'MS8'
        },
        {
            startX: 640, startY: 450, rows: 10, seatsPerRow: 6,
            category: 'VIP', section: 'Middle Section 9', blockId: 'MS9'
        },
        {
            startX: 680, startY: 280, rows: 10, seatsPerRow: 8,
            category: 'VVIP', section: 'Middle Section 10', blockId: 'MS10'
        },
        {
            startX: 680, startY: 360, rows: 10, seatsPerRow: 8,
            category: 'VVIP', section: 'Middle Section 11', blockId: 'MS11'
        },
        {
            startX: 680, startY: 450, rows: 10, seatsPerRow: 8,
            category: 'VVIP', section: 'Middle Section 12', blockId: 'MS12'
        },
        // Bottom Sections


        {
            startX: 45, startY: 640, rows: 4, seatsPerRow: 30,
            category: 'Bronze', section: 'Bottom Section 1', blockId: 'BS1',
            skew: { angle: 45, rowOffset: -3.5 }
        },
        {
            startX: 80, startY: 550, rows: 10, seatsPerRow: 25,
            category: 'Bronze', section: 'Bottom Section 1', blockId: 'BS1',
            skew: { angle: 45, rowOffset: 3.5 }
        },

        
        {
            startX: 300, startY: 550, rows: 21, seatsPerRow: 15,
            category: 'Silver', section: 'Bottom Section 1', blockId: 'BS1'
        },
        {
            startX: 410, startY: 550, rows: 10, seatsPerRow: 9,
            category: 'Gold', section: 'Bottom Section 2', blockId: 'BS2'
        },
        {
            startX: 410, startY: 630, rows: 10, seatsPerRow: 13,
            category: 'Gold', section: 'Bottom Section 3', blockId: 'BS3'
        },
        {
            startX: 410, startY: 720, rows: 4, seatsPerRow: 13,
            category: 'Gold', section: 'Bottom Section 4', blockId: 'BS4'
        },
        {
            startX: 520, startY: 630, rows: 10, seatsPerRow: 13,
            category: 'Diamond', section: 'Bottom Section 5', blockId: 'BS5'
        },
        {
            startX: 520, startY: 720, rows: 4, seatsPerRow: 13,
            category: 'Diamond', section: 'Bottom Section 6', blockId: 'BS6'
        },
        {
            startX: 545, startY: 550, rows: 10, seatsPerRow: 9,
            category: 'Diamond', section: 'Bottom Section 7', blockId: 'BS7'
        },
        {
            startX: 630, startY: 550, rows: 21, seatsPerRow: 12,
            category: 'Platinum', section: 'Bottom Section 8', blockId: 'BS8'
        },
        {
            startX: 720, startY: 620, rows: 11, seatsPerRow: 6,
            category: 'VIP', section: 'Bottom Section 9', blockId: 'BS9',
            skew: { angle: -10, rowOffset: 1.5 }
        },
        {
            startX: 735, startY: 710, rows: 5, seatsPerRow: 8,
            category: 'Platinum', section: 'Bottom Section 10', blockId: 'BS10'
        },
    ];

    // Use only dynamic prices - no fallback defaults
    const finalPrices = categoryPrices || {};

    // First, generate all seats without booking status
    const allSeats: Seat[] = [];
    sections.forEach(section => {
        for (let row = 0; row < section.rows; row++) {
            const seatsInRow = Array.isArray(section.seatsPerRow)
                ? (section.seatsPerRow[row] ?? section.seatsPerRow[section.seatsPerRow.length - 1] ?? 0)
                : section.seatsPerRow;
            for (let seatNum = 0; seatNum < seatsInRow; seatNum++) {
                let x = section.startX + (seatNum * seatSpacing);
                let y = section.startY + (row * rowSpacing);

                // Apply skewing if section has skew properties
                if ('skew' in section && section.skew) {
                    const { angle, rowOffset } = section.skew;

                    // Apply row offset for skewing effect
                    x += row * rowOffset;

                    // Apply rotation if angle is specified
                    if (angle !== 0) {
                        const centerX = section.startX + (Math.max(...(Array.isArray(section.seatsPerRow) ? section.seatsPerRow : [section.seatsPerRow])) * seatSpacing) / 2;
                        const centerY = section.startY + (section.rows * rowSpacing) / 2;

                        // Translate to origin
                        const translatedX = x - centerX;
                        const translatedY = y - centerY;

                        // Apply rotation
                        const angleRad = (angle * Math.PI) / 180;
                        const rotatedX = translatedX * Math.cos(angleRad) - translatedY * Math.sin(angleRad);
                        const rotatedY = translatedX * Math.sin(angleRad) + translatedY * Math.cos(angleRad);

                        // Translate back
                        x = rotatedX + centerX;
                        y = rotatedY + centerY;
                    }
                }

                const seat: Seat = {
                    id: `seat-${seatId}`,
                    row: String.fromCharCode(65 + row), // A, B, C, etc.
                    number: seatNum + 1,
                    section: section.section,
                    category: section.category as any,
                    price: finalPrices[section.category] || 0,
                    status: 'available', // Will be set below
                    x: x,
                    y: y,
                };
                allSeats.push(seat);
                seatId++;
            }
        }
    });

    // Group seats by category and apply 80% booking per category
    const seatsByCategory = allSeats.reduce((acc, seat) => {
        if (!acc[seat.category]) acc[seat.category] = [];
        acc[seat.category].push(seat);
        return acc;
    }, {} as Record<string, Seat[]>);

    // Apply configurable percentage booking with random selection for each category
    Object.keys(seatsByCategory).forEach(category => {
        const categorySeats = seatsByCategory[category];
        const totalSeats = categorySeats.length;
        const seatsToBook = Math.floor(totalSeats * (bookedPercentage / 100));

        // Shuffle the seats for random selection (using Fisher-Yates shuffle)
        for (let i = totalSeats - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [categorySeats[i], categorySeats[j]] = [categorySeats[j], categorySeats[i]];
        }

        // Book the first seatsToBook seats
        categorySeats.slice(0, seatsToBook).forEach(seat => {
            seat.status = 'booked';
        });

        // The rest remain available
        categorySeats.slice(seatsToBook).forEach(seat => {
            seat.status = 'available';
        });
    });

    return allSeats;
}

// Legacy function for backward compatibility
export function generateGridSeats(): Seat[] {
    const seats: Seat[] = [];
    let seatId = 1;

    // Define categories - prices will come from API only
    const categories = [
        { name: 'VVIP' },
        { name: 'VIP' },
        { name: 'Royal' },
        { name: 'Diamond' },
        { name: 'Gold' },
        { name: 'Silver' },
        { name: 'Bronze' }
    ];

    categories.forEach(category => {
        const categorySeats: Seat[] = [];

        // Create 150 seats per category (10 rows x 15 seats)
        for (let row = 0; row < 10; row++) {
            for (let seatNum = 1; seatNum <= 15; seatNum++) {
                const seat: Seat = {
                    id: `seat-${seatId}`,
                    row: String.fromCharCode(65 + row), // A, B, C, etc.
                    number: seatNum,
                    section: category.name,
                    category: category.name as any,
                    price: 0, // Price will be set from API
                    status: 'available', // Will be set below
                    x: 0, // Not needed for simple grid
                    y: 0, // Not needed for simple grid
                };
                categorySeats.push(seat);
                seatId++;
            }
        }

        // Apply 80% booking deterministically for this category
        const totalSeats = categorySeats.length;
        const seatsToBook = Math.floor(totalSeats * 0.8); // 80% of category seats

        categorySeats.forEach((seat, index) => {
            const seatIdHash = seat.id.split('').reduce((a, b) => {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a;
            }, 0);
            const shouldBook = (Math.abs(seatIdHash) % totalSeats) < seatsToBook;
            seat.status = shouldBook ? 'booked' : 'available';
        });

        seats.push(...categorySeats);
    });

    return seats;
}

import { formatCurrency } from "./currency";

export function formatPrice(price: number, currencyCode?: string): string {
    return formatCurrency(price, currencyCode);
}