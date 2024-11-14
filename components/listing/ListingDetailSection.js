"use client";

import TimerIcon from "@/components/icons/timer-icon";
import UserGroupIcon from "../icons/user-group-icon";
import AreaIcon from "../icons/area-icon";

function ListingDetailSection({ minimumBookingLength, crewCount, area }) {
  return (
    <div className="border-t border-gray-300 py-6 mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
        {/* Minimum Booking Length */}
        <div className="flex flex-col items-center">
          <TimerIcon className="text-gray-700 mb-2" />
          <span className="text-neutral-500">Min booking length</span>
          <span className="font-semibold text-lg">{minimumBookingLength}hr minimum</span>
        </div>
        {/* Cast & Crew */}
        <div className="flex flex-col items-center">
          <UserGroupIcon className="text-gray-700 mb-2" />
          <span className="text-neutral-500">Cast & Crew</span>
          <span className="font-semibold text-lg">{crewCount} people</span>
        </div>
        {/* Area */}
        <div className="flex flex-col items-center">
          <AreaIcon className="text-gray-700 mb-2" />
          <span className="text-neutral-500">Square footage</span>
          <span className="font-semibold text-lg">{area} sq/ft</span>
        </div>
      </div>
    </div>
  );
}

export default ListingDetailSection;
