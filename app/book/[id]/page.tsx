import SeatSelection from "./seat-selection";

interface BookingPageProps {
  params: {
    id: string;
  };
}

export default function BookingPage({ params }: BookingPageProps) {
  return <SeatSelection eventId={params.id} />;
}
