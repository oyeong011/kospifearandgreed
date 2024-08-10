"use client";

import React, { useState } from "react";

const DateRangePicker = ({
  onDateRangeChange,
  mockStartDate,
  mockEndDate,
}: {
  onDateRangeChange: (start: string, end: string) => void;
  mockStartDate: string;
  mockEndDate: string;
}) => {
  const [startDate, setStartDate] = useState(mockStartDate);
  const [endDate, setEndDate] = useState(mockEndDate);

  const handleSubmit = (e) => {
    e.preventDefault();
    onDateRangeChange(startDate, endDate);
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border p-1 rounded"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="border p-1 rounded"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-2 py-1 rounded"
      >
        Apply
      </button>
    </form>
  );
};

export default DateRangePicker;
