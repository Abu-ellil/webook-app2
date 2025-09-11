import { Seat } from './seat-store';

// Legacy function for backward compatibility
export function generateGridSeats(): Seat[] {
    const seats: Seat[] = [];
    let seatId = 1;

    // Define categories with 150 seats each
    const categories = [
        { name: 'VVIP', price: 800 },
        { name: 'VIP', price: 400 },
        { name: 'Royal', price: 500 },
        { name: 'Diamond', price: 600 },
        { name: 'Gold', price: 300 },
        { name: 'Silver', price: 200 },
        { name: 'Bronze', price: 150 }
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
                    price: category.price,
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