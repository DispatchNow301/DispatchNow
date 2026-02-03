export const ReservationStatus = {
    SUBMITTED: "SUBMITTED",
    ACCEPTED: "ACCEPTED",
    DISPATCHED: "DISPATCHED",
    DELIVERED: "DELIVERED",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED",
    REJECTED: "REJECTED",
  } as const;
  
  export type ReservationStatus =
    (typeof ReservationStatus)[keyof typeof ReservationStatus];
  
  const allowedNext: Record<ReservationStatus, ReservationStatus[]> = {
    SUBMITTED: [ReservationStatus.ACCEPTED, ReservationStatus.REJECTED, ReservationStatus.CANCELLED],
    ACCEPTED: [ReservationStatus.DISPATCHED, ReservationStatus.CANCELLED],
    DISPATCHED: [ReservationStatus.DELIVERED],
    DELIVERED: [ReservationStatus.COMPLETED],
    COMPLETED: [],
    CANCELLED: [],
    REJECTED: [],
  };
  
  export function isValidStatus(s: unknown): s is ReservationStatus {
    return typeof s === "string" && Object.values(ReservationStatus).includes(s as any);
  }
  
  export function canTransition(from: ReservationStatus, to: ReservationStatus): boolean {
    return allowedNext[from]?.includes(to) ?? false;
  }