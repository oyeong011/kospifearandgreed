"use client";

import React, { useState } from "react";

const SingleDatePicker = ({ onDateChange }) => {
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onDateChange(date);
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
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

export default SingleDatePicker;
