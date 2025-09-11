import { Seat } from './seat-store';

export function generateStadiumSeats(eventId?: string, categoryPrices?: Record<string, number>): Seat[] {
    // Generate grid-based stadium layout like the image
    return generateGridStadiumSeats(eventId, categoryPrices);
}

// Generate grid-based stadium layout matching the provided image
export function generateGridStadiumSeats(eventId?: string, categoryPrices?: Record<string, number>): Seat[] {
    const seats: Seat[] = [];
    let seatId = 1;

    // Define seat spacing and size
    const seatSize = 8;
    const seatSpacing = 10;
    const rowSpacing = 12;

    // Define sections with their positions and categories
    // Octagonal stadium layout matching the reference image with centered seats
    const sections = [
        // RTL Organization: All seats positioned within dark gray area boundaries
        // Dark gray area boundaries: X: 80-650, Y: 120-550

        // Far Right Premium Sections (VVIP) - Pink area in image
        {
            startX: 710, startY: 120, rows: 6, seatsPerRow: 8,
            category: 'VIP', section: 'Top Far Right', blockId: 'TFR'
        },

        {
            startX: 710, startY: 480, rows: 6, seatsPerRow: 8,
            category: 'VIP', section: 'Bottom Far Right', blockId: 'BFR'
        }, {
            startX: 700, startY: 195, rows: 24, seatsPerRow: 8,
            category: 'VVIP', section: 'Center Far Right', blockId: 'CFR'
        },

        // Right Premium Sections (VIP & Royal) - Red/Orange area
        {
            startX: 620, startY: 220, rows: 22, seatsPerRow: 8,
            category: 'VIP', section: 'Center Right', blockId: 'CR'
        },
        {
            startX: 540, startY: 210, rows: 22, seatsPerRow: 8,
            category: 'Royal', section: 'Center Right Mid', blockId: 'CRM'
        },
        {
            startX: 540, startY: 140, rows: 6, seatsPerRow: 17,
            category: 'Royal', section: 'Upper Right', blockId: 'UR'
        },
        {
            startX: 540, startY: 480, rows: 6, seatsPerRow: 17,
            category: 'Royal', section: 'Lower Right', blockId: 'LR'
        },

        // Center Sections (Diamond & Gold) - Green/Blue area
        {
            startX: 430, startY: 100, rows: 40, seatsPerRow: 11,
            category: 'Diamond', section: 'Center Mid', blockId: 'CM'
        },

        {
            startX: 310, startY: 100, rows: 40, seatsPerRow: 12,
            category: 'Gold', section: 'Center Left Mid', blockId: 'CLM'
        },

        // Left Standard Sections (Silver) - Yellow/Gray area
        {
            startX: 160, startY: 100, rows: 6, seatsPerRow: 15,
            category: 'Silver', section: 'Upper Left', blockId: 'UL'
        },
        {
            startX: 100, startY: 170, rows: 30, seatsPerRow: 22,
            category: 'Silver', section: 'Center Left', blockId: 'CL'
        },
        {
            startX: 160, startY: 530, rows: 6, seatsPerRow: 15,
            category: 'Silver', section: 'Lower Left', blockId: 'LL'
        },
    ];

    // Use only dynamic prices - no fallback defaults
    const finalPrices = categoryPrices || {};

    // First, generate all seats without booking status
    const allSeats: Seat[] = [];
    sections.forEach(section => {
        for (let row = 0; row < section.rows; row++) {
            for (let seatNum = 0; seatNum < section.seatsPerRow; seatNum++) {
                const x = section.startX + (seatNum * seatSpacing);
                const y = section.startY + (row * rowSpacing);

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

    // Apply 80% booking with custom random pattern for each category
    Object.keys(seatsByCategory).forEach(category => {
        const categorySeats = seatsByCategory[category];
        const totalSeats = categorySeats.length;
        const seatsToBook = Math.floor(totalSeats * 0.8); // 80% of category seats

        // Sort seats by ID for consistent ordering
        categorySeats.sort((a, b) => a.id.localeCompare(b.id));

        // Custom hand-picked random pattern - different for each category
        const customPatterns: Record<string, number[]> = {
            'VVIP': [0, 2, 3, 5, 7, 8, 9, 11, 13, 14, 16, 18, 19, 21, 22, 24, 26, 27, 29, 30, 32, 34, 35, 37, 38, 40, 42, 43, 45, 46, 48, 50, 51, 53, 54, 56, 58, 59, 61, 62, 64, 66, 67, 69, 70, 72, 74, 75, 77, 78],
            'VIP': [1, 3, 4, 6, 8, 9, 10, 12, 14, 15, 17, 19, 20, 22, 23, 25, 27, 28, 30, 31, 33, 35, 36, 38, 39, 41, 43, 44, 46, 47, 49, 51, 52, 54, 55, 57, 59, 60, 62, 63, 65, 67, 68, 70, 71, 73, 75, 76],
            'Royal': [0, 1, 4, 6, 7, 9, 11, 12, 14, 16, 17, 19, 21, 22, 24, 26, 27, 29, 31, 32, 34, 36, 37, 39, 41, 42, 44, 46, 47, 49, 51, 52, 54, 56, 57, 59, 61, 62, 64, 66, 67, 69, 71, 72, 74, 76, 77, 79],
            'Diamond': [2, 4, 5, 7, 9, 10, 11, 13, 15, 16, 18, 20, 21, 23, 24, 26, 28, 29, 31, 32, 34, 36, 37, 39, 40, 42, 44, 45, 47, 48, 50, 52, 53, 55, 56, 58, 60, 61, 63, 64, 66, 68, 69, 71, 72, 74, 76, 77],
            'Platinum': [1, 2, 5, 7, 8, 10, 12, 13, 15, 17, 18, 20, 22, 23, 25, 27, 28, 30, 32, 33, 35, 37, 38, 40, 42, 43, 45, 47, 48, 50, 52, 53, 55, 57, 58, 60, 62, 63, 65, 67, 68, 70, 72, 73, 75, 77, 78, 80],
            'Gold': [0, 3, 5, 6, 8, 10, 11, 13, 15, 16, 18, 20, 21, 23, 25, 26, 28, 30, 31, 33, 35, 36, 38, 40, 41, 43, 45, 46, 48, 50, 51, 53, 55, 56, 58, 60, 61, 63, 65, 66, 68, 70, 71, 73, 75, 76, 78, 80],
            'Silver': [1, 4, 6, 7, 9, 11, 12, 14, 16, 17, 19, 21, 22, 24, 26, 27, 29, 31, 32, 34, 36, 37, 39, 41, 42, 44, 46, 47, 49, 51, 52, 54, 56, 57, 59, 61, 62, 64, 66, 67, 69, 71, 72, 74, 76, 77, 79, 81],
            'Bronze': [2, 3, 6, 8, 9, 11, 13, 14, 16, 18, 19, 21, 23, 24, 26, 28, 29, 31, 33, 34, 36, 38, 39, 41, 43, 44, 46, 48, 49, 51, 53, 54, 56, 58, 59, 61, 63, 64, 66, 68, 69, 71, 73, 74, 76, 78, 79, 81]
        };

        // Get the custom pattern for this category, or create a fallback
        const pattern = customPatterns[category] || [];

        // Apply the custom booking pattern
        categorySeats.forEach((seat, index) => {
            // Use modulo to handle cases where we have more seats than pattern indices
            const patternIndex = index % Math.max(pattern.length, 1);
            const shouldBook = pattern.includes(patternIndex) && pattern.length > 0;

            // If no custom pattern or not enough pattern, fall back to every 5th seat being available
            if (pattern.length === 0) {
                seat.status = (index % 5 !== 0) ? 'booked' : 'available';
            } else {
                seat.status = shouldBook ? 'booked' : 'available';
            }
        });
    });

    return allSeats;
}