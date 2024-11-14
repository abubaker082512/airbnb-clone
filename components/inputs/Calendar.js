"use client";

import React, { useState } from "react";
import { DateRange, Calendar as SingleCalendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

function Calendar({ mode, value, onChange, disabledDates }) {
    const [selectedDate, setSelectedDate] = useState(null);

    // Handle single date selection
    const handleSingleDateChange = (date) => {
        setSelectedDate(date);
        onChange(date);
    };

    // Handle multiple date selection
    const handleRangeChange = (ranges) => {
        const selectedRange = ranges["selection"]; // Access the range with 'selection' key
        onChange(selectedRange); // selectedRange will now be of type 'Range'
    };

    return (
        <>
            {mode === "multiple" ? (
                // Multi-date selection (Range)
                <DateRange
                    rangeColors={["#262626"]}
                    ranges={[value]}
                    onChange={handleRangeChange}
                    direction="vertical"
                    showDateDisplay={false}
                    minDate={new Date()}
                    disabledDates={disabledDates}
                />
            ) : (
                // Single date selection
                <SingleCalendar
                    date={selectedDate || value}
                    onChange={(date) => handleSingleDateChange(date)}
                    minDate={new Date()}
                    disabledDates={disabledDates}
                />
            )}
        </>
    );
}

export default Calendar;
