import { create } from 'zustand';

export interface Seat {
    id: string;
    row: string;
    number: number;
    section: string;
    category: 'VVIP' | 'VIP' | 'Royal' | 'Diamond' | 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
    price: number;
    status: 'available' | 'selected' | 'booked';
    x: number;
    y: number;
}

interface SeatStore {
    seats: Seat[];
    selectedSeats: Seat[];
    zoom: number;
    panX: number;
    panY: number;
    eventId?: string;
    currentInfoSeat: string | null;

    // Actions
    setSeats: (seats: Seat[]) => void;
    loadSeatsForEvent: (eventId: string) => Promise<void>;
    toggleSeat: (seatId: string) => void;
    clearSelection: () => void;
    setZoom: (zoom: number) => void;
    setPan: (x: number, y: number) => void;
    resetView: () => void;
    setCurrentInfoSeat: (id: string | null) => void;

    // Computed
    getTotalPrice: () => number;
    getSelectedCount: () => number;
    getSeatsByCategory: (category: string) => Seat[];
}

export const useSeatStore = create<SeatStore>((set, get) => ({
    seats: [],
    selectedSeats: [],
    zoom: 0.3,
    panX: 0,
    panY: 0,
    currentInfoSeat: null,

    setSeats: (seats) => set({ seats }),

    loadSeatsForEvent: async (eventId: string) => {
        try {
            // Fetch category prices from the API
            const response = await fetch(`/api/events/${eventId}/pricing`);
            const data = await response.json();

            let categoryPrices = {};
            if (data.success && data.categoryPrices) {
                categoryPrices = data.categoryPrices;
            }

            // Import the seat generation function dynamically to avoid circular imports
            const { generateStadiumSeats } = await import('./seat-data');

            // Generate seats with dynamic pricing
            const seats = generateStadiumSeats(eventId, categoryPrices);

            set({
                seats,
                eventId,
                selectedSeats: [] // Clear any previous selections
            });
        } catch (error) {
            console.error('Error loading seats for event:', error);

            // Fallback: load seats with no pricing (prices will be 0)
            const { generateStadiumSeats } = await import('./seat-data');
            const seats = generateStadiumSeats(eventId, {});

            set({
                seats,
                eventId,
                selectedSeats: []
            });
        }
    },

    toggleSeat: (seatId) => set((state) => {
        const seat = state.seats.find(s => s.id === seatId);
        if (!seat || seat.status === 'booked') return state;

        const isSelected = state.selectedSeats.some(s => s.id === seatId);

        if (isSelected) {
            return {
                selectedSeats: state.selectedSeats.filter(s => s.id !== seatId),
                seats: state.seats.map(s =>
                    s.id === seatId ? { ...s, status: 'available' as const } : s
                )
            };
        } else {
            return {
                selectedSeats: [...state.selectedSeats, { ...seat, status: 'selected' as const }],
                seats: state.seats.map(s =>
                    s.id === seatId ? { ...s, status: 'selected' as const } : s
                )
            };
        }
    }),

    clearSelection: () => set((state) => ({
        selectedSeats: [],
        seats: state.seats.map(s =>
            s.status === 'selected' ? { ...s, status: 'available' as const } : s
        )
    })),

    setZoom: (zoom) => set({ zoom: Math.max(0.3, Math.min(3, zoom)) }),

    setPan: (x, y) => set({ panX: x, panY: y }),

    resetView: () => set({ zoom: 0.3, panX: 0, panY: 0 }),
    setCurrentInfoSeat: (id) => set({ currentInfoSeat: id }),

    getTotalPrice: () => {
        const { selectedSeats } = get();
        return selectedSeats.reduce((total, seat) => total + seat.price, 0);
    },

    getSelectedCount: () => get().selectedSeats.length,

    getSeatsByCategory: (category) => {
        const { seats } = get();
        return seats.filter(seat => seat.category === category);
    }
}));