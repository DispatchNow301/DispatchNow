import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { requireTier3 } from "@/lib/auth/requireTier3";
import {
  ReservationStatus,
  type ReservationStatus as ReservationStatusT,
  canTransition,
  isValidStatus,
} from "@/utils/requests-status";

type ReservationRow = {
  id: string;
  user_id: string;
  resource_id: string;
  qty: number;
  status: string | null;
  created_at: string;
};

export async function PATCH(
  req: Request,
  { params }: { params: { reservationId: string } }
) {
  const supabase = await createSupabaseServerClient();

  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userRes?.user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const actorUserId = userRes.user.id;

  const body = await req.json().catch(() => null);
  const nextStatusRaw = body?.status;

  if (!isValidStatus(nextStatusRaw)) {
    return NextResponse.json(
      { error: "BAD_REQUEST", message: "Invalid status value" },
      { status: 400 }
    );
  }
  const nextStatus: ReservationStatusT = nextStatusRaw;

  const { data: reservation, error: resErr } = await supabase
    .from("resource_reservations")
    .select("id, user_id, resource_id, qty, status, created_at")
    .eq("id", params.reservationId)
    .single();

  if (resErr || !reservation) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const r = reservation as ReservationRow;
  const currentStatus = (r.status ?? ReservationStatus.SUBMITTED) as ReservationStatusT;

  // Permission:
  // - requester can only CANCEL (and only from SUBMITTED/ACCEPTED)
  // - tier3 can do operational transitions
  const isRequester = r.user_id === actorUserId;
  const tierGate = await requireTier3(supabase, actorUserId);
  const isTier3 = tierGate.ok;

  if (!isTier3) {
    // not tier3 -> must be requester cancelling
    const requesterAllowed =
      isRequester &&
      nextStatus === ReservationStatus.CANCELLED &&
      (currentStatus === ReservationStatus.SUBMITTED || currentStatus === ReservationStatus.ACCEPTED);

    if (!requesterAllowed) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }
  }

  // Transition validation (applies to everyone)
  if (!canTransition(currentStatus, nextStatus)) {
    return NextResponse.json(
      {
        error: "INVALID_TRANSITION",
        message: `Cannot transition from ${currentStatus} to ${nextStatus}`,
      },
      { status: 409 }
    );
  }

  const { data: updated, error: updErr } = await supabase
    .from("resource_reservations")
    .update({ status: nextStatus })
    .eq("id", r.id)
    .select("id, user_id, resource_id, qty, status, created_at")
    .single();

  if (updErr) {
    return NextResponse.json(
      { error: "DB_ERROR", message: updErr.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ reservation: updated }, { status: 200 });
}