"use client";
import CustomButton from "./CustomButton";
import React, { useState } from "react";
import EventItem from "@/components/global/EventItem";
import Filter from "@/components/global/Filter.client";
import { usePathname } from "next/navigation";

const EventListWithFilter = ({
  initialEvents,
  availableDates,
  availableLocations,
}) => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredEvents, setFilteredEvents] = useState(initialEvents);

  const pathname = usePathname();

  React.useEffect(() => {
    setFilteredEvents(initialEvents);
    setSelectedLocation("");
    setSelectedDate("");
  }, [initialEvents]);

  const applyFilters = (location, date) => {
    let currentFilteredEvents = initialEvents;

    if (location) {
      currentFilteredEvents = currentFilteredEvents.filter(
        (event) => event.location?.id === location
      );
    }

    if (date) {
      currentFilteredEvents = currentFilteredEvents.filter(
        (event) => event.date === date
      );
    }

    setFilteredEvents(currentFilteredEvents);
  };

  const handleLocationChange = (value) => {
    const newLocation = String(value || "").trim();
    setSelectedLocation(newLocation);
    applyFilters(newLocation, selectedDate);
  };

  const handleDateChange = (value) => {
    const newDate = String(value || "").trim();
    setSelectedDate(newDate);
    applyFilters(selectedLocation, newDate);
  };

  return (
    <>
      <div className="@container">
        <section className="grid grid-cols-1 grid-rows-auto @min-[775px]:grid-cols-2 gap-(--space-4rem)">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((dataevent) => (
              <EventItem
                key={dataevent.id}
                {...dataevent}
                showTicketCounter={true}
              />
            ))
          ) : (
            <p>Ingen events matcher dine filtre.</p>
          )}
        </section>
      </div>
      <aside className="row-1 flex flex-row items-center justify-between px-(--space-2rem) py-(--space-1rem)">
        <Filter
          dates={availableDates}
          locations={availableLocations}
          setSelectedLocation={handleLocationChange}
          setSelectedDate={handleDateChange}
          selectedLocation={selectedLocation}
          selectedDate={selectedDate}
        />
      </aside>
    </>
  );
};

export default EventListWithFilter;
