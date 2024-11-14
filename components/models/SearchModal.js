"use client";

import useSearchModal from "@/hook/useSearchModal";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useCallback, useMemo, useRef, useState, useEffect } from "react";

import Heading from "../Heading";
import Calendar from "../inputs/Calendar";
import CountrySelect from "../inputs/CountrySelect";
import Modal from "./Modal";

const STEPS = {
  COUNTRY: 0,
  DATE: 1,
};

function useClickOutside(ref, callback) {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}

function SearchModal() {
  const router = useRouter();
  const params = useSearchParams();
  const searchModel = useSearchModal();

  const [location, setLocation] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [step, setStep] = useState(STEPS.COUNTRY);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => {
    setShowDropdown(false);
  });

  const onSubmit = useCallback(() => {
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery = {
      ...currentQuery,
      locationValue: location?.value,
    };

    if (dateRange.startDate) {
      updatedQuery.startDate = dateRange.startDate.toISOString();
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = dateRange.endDate.toISOString();
    }

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    searchModel.onClose();
    router.push(url);
  }, [location, dateRange, searchModel, router, params]);

  const handleNext = () => {
    if (step === STEPS.COUNTRY && location) {
      setStep(STEPS.DATE);
    }
  };

  const bodyContent = useMemo(() => {
    if (step === STEPS.COUNTRY) {
      return (
        <div className="flex flex-col gap-8">
          <Heading title="Where are you going?" subtitle="Select your destination" />
          <div className="relative" ref={dropdownRef}>
            <input
              type="text"
              placeholder="Search for a country"
              className="w-full border rounded-lg p-3"
              value={location ? location.label : ""}
              onClick={() => setShowDropdown(true)}
              readOnly
            />
            {showDropdown && (
              <div className="absolute w-full mt-2 bg-white border rounded-lg shadow-lg z-10">
                <CountrySelect
                  value={location || undefined}
                  onChange={(value) => {
                    setLocation(value);
                    setShowDropdown(false);
                  }}
                />
              </div>
            )}
          </div>
          <button
            onClick={handleNext}
            disabled={!location}
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Next
          </button>
        </div>
      );
    }

    if (step === STEPS.DATE) {
      return (
        <div className="flex flex-col gap-8">
          <Heading title="Choose your dates" subtitle="Plan your trip" />
          <Calendar
            mode="multiple"
            onChange={(ranges) => setDateRange(ranges)}
            value={dateRange}
          />
          <button onClick={onSubmit} className="mt-4 p-2 bg-blue-500 text-white rounded">
            Search
          </button>
        </div>
      );
    }

    return null;
  }, [step, location, dateRange, onSubmit, handleNext, showDropdown]);

  return (
    <Modal
      isOpen={searchModel.isOpen}
      onClose={searchModel.onClose}
      title="Filters"
      body={bodyContent}
      actionLabel="Search"
      onSubmit={onSubmit}
    />
  );
}

export default SearchModal;
