"use client";

import useCountries from "@/hook/useCountries";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo } from "react";
import Button from "../Button";
import HeartButton from "../HeartButton";

function ListingCard({
  data,
  reservation,
  onAction,
  confirmAction,
  disabled,
  actionLabel,
  confirmLabel = "Confirm",
  actionId = "",
  currentUser,
  showConfirmation,
}) {
  const router = useRouter();
  const { getByValue } = useCountries();

  const location = getByValue(data.locationValue);

  const handleCancel = useCallback(
    (e) => {
      e.stopPropagation();
      if (!disabled) onAction?.(actionId);
    },
    [onAction, actionId, disabled]
  );

  const handleConfirm = useCallback(
    (e) => {
      e.stopPropagation();
      if (!disabled) confirmAction?.(actionId);
    },
    [confirmAction, actionId, disabled]
  );

  const price = useMemo(
    () => (reservation ? reservation.totalPrice : data.price),
    [reservation, data.price]
  );

  const reservationDate = useMemo(() => {
    if (!reservation) return null;
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);
    return `${format(start, "PP")} - ${format(end, "PP")}`;
  }, [reservation]);

  return (
    <div
      onClick={() => router.push(`/listings/${data._id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          <Image
            fill
            className="object-cover h-full w-full group-hover:scale-110 transition"
            src={data.imageSrc}
            alt="listing"
          />
          <div className="absolute top-3 right-3">
            <HeartButton listingId={data.id} currentUser={currentUser} />
          </div>
          {/* Show confirmation icon if the reservation is confirmed */}
          {showConfirmation && (
                        <div className="absolute top-3 left-3 bg-green-500 text-white p-2 rounded-full">
                            ✔️
                        </div>
                    )}
        </div>
        <div className="font-semibold text-lg">
          {location?.region}, {location?.label}
        </div>
        <div className="font-light text-neutral-500">
          {reservationDate || data.category}
        </div>
        <div className="flex flex-row items-center gap-1 font-semibold">
          ${price} {!reservation && <span className="font-light">Night</span>}
        </div>
        <div className="flex gap-2">
          {onAction && actionLabel && (
            <Button
              disabled={disabled}
              small
              label={actionLabel}
              onClick={handleCancel}
            />
          )}
          {confirmAction && confirmLabel && (
            <Button
              disabled={disabled}
              small
              label={confirmLabel}
              className="border-green-500 bg-green-500 text-white hover:bg-green-600"
              onClick={handleConfirm}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ListingCard;
