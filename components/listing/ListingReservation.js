"use client";

import React, { useState, useEffect } from "react";
import { Range } from "react-date-range";
import Calendar from "../inputs/Calendar"; // Assuming Calendar component exists for date selection
import Button from "../Button";

function ListingReservation({
  price,
  minimumBookingLength,
  totalPrice,
  onChangeDate,
  onSubmit,
  onChangeTime,
  disabled,
  disabledDates,
  crewCount,
}) {
  // State management
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showCalendar, setShowCalendar] = useState(false); // To toggle calendar display
  const [selectedCrew, setSelectedCrew] = useState(crewCount);
  const [hours, setHours] = useState(0);
  const [dateRange, setDateRange] = useState(new Date()); // Handle both single and range
  const [selectedDate, setSelectedDate] = useState(""); // New state for the selected date

  // Handle time input changes
  const handleTimeChange = (event, type) => {
    const value = event.target.value;
    if (type === "start") {
      setStartTime(value);
      onChangeTime(value, endTime); // Pass to parent
    } else {
      setEndTime(value);
      onChangeTime(startTime, value); // Pass to parent
    }
  };

  // Handle crew selection
  const handleCrewChange = (event) => {
    setSelectedCrew(Number(event.target.value));
  };

  // Handle date change from the Calendar component
  const handleDateChange = (value) => {
    setDateRange(value); // Update state with the new date or range
  
    // Handle single date or range
    const formattedDate = value instanceof Date
      ? value.toLocaleDateString() // If it's a single Date, format it
      : `${value.startDate?.toLocaleDateString()} - ${value.endDate?.toLocaleDateString()}`; // If it's a range, format the start and end dates
  
    setSelectedDate(formattedDate); // Set the formatted date
    onChangeDate(value); // Pass the selected date or range to the parent component
    setShowCalendar(false); // Close calendar after selection
  };
  
  // Calculate total hours based on start and end times
  useEffect(() => {
    if (startTime && endTime) {
      const start = new Date(`1970-01-01T${startTime}:00`);
      const end = new Date(`1970-01-01T${endTime}:00`);
      const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Difference in hours
      setHours(diff > 0 ? diff : 0);
    }
  }, [startTime, endTime]);

  const calculatedPrice = hours > 0 ? Math.max(hours) * price : 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-300">
      {/* Rate and minimum booking length */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl font-bold">${price}<span className="text-xl font-semi-bold">/hr</span></p>
        <p className="text-sm text-neutral-500">{minimumBookingLength} hr. minimum</p>
      </div>

      {/* Date and time inputs */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center">
        <div className="md:flex-1">
          <label className="block text-sm font-medium text-neutral-600">Pick a date</label>
          <input
            type="text"
            value={selectedDate || "Select a date"} // Show selected date
            onClick={() => setShowCalendar((prev) => !prev)}
            readOnly
            className="w-full border-none bg-transparent text-lg underline cursor-pointer"
          />
          {showCalendar && (
            <div className="mt-2 z-10">
              <Calendar
                mode="single" // Set to "single" or "multiple" based on the desired functionality
                value={dateRange} // Pass current date or range
                onChange={handleDateChange} // Handle date change
                disabledDates={disabledDates} // Disabled dates from props
              />
            </div>
          )}
        </div>
        <div className="md:flex md:space-x-4 md:ml-4 mt-2 md:mt-0">
          <div className="flex-1">
            <label className="block text-sm text-neutral-600">Start time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => handleTimeChange(e, "start")}
              className="w-full border-none bg-transparent text-lg underline"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-neutral-600">End time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => handleTimeChange(e, "end")}
              className="w-full border-none bg-transparent text-lg underline"
            />
          </div>
        </div>
      </div>

      {/* Total hours and price */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg">Total hours: {hours}</p>
        <p className="text-lg">Total: ${calculatedPrice}</p>
      </div>

      {/* Add a day option */}
      <p className="text-green-500 cursor-pointer text-md font-bold mb-4">Add a day</p>

      {/* Cast & Crew selection */}
      <div className="mb-4">
        <select
          value={selectedCrew}
          onChange={handleCrewChange}
          className="w-full border-none bg-transparent text-lg font-bold underline text-rose-500"
        >
          <option value={crewCount}>{`Cast & Crew: ${crewCount} people`}</option>
        </select>
      </div>

      {/* Reserve button */}
      <div className="mb-4">
        <Button disabled={disabled} label="Reserve" onClick={onSubmit} />
      </div>

      {/* Cancellation notice */}
      <p className="text-sm text-neutral-500 text-center">Cancel for free within 24 hours</p>
    </div>
  );
}

export default ListingReservation;
