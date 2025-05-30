"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname } from "next/navigation";

const Filter = ({
  //data
  dataArtists = [],
  dataTechniques = [],
  dataLocations = [],
  dataDates = [],

  //UseState
  selectedTechniques,
  selectedArtist,
}) => {
  // console.log("Filter: artists: ", dataArtists, "techniques", dataTechniques);
  const pathname = usePathname();
  const isEventsPage = pathname?.startsWith("/events");

  const uniqueTechniques = [
    ...new Set(dataTechniques.map((t) => t.trim()).filter(Boolean)),
  ];
  const uniqueArtists = [
    ...new Set(dataArtists.map((t) => t.trim()).filter(Boolean)),
  ];

  const handleLocationChange = (value) => {
    setSelectedLocation(value === "all" ? "" : value);
  };

  const handleDateChange = (value) => {
    setSelectedDate(value === "all" ? "" : value);
  };
  const handleTechniquesChange = (value) => {
    setSelectedTechniques(value === "all" ? "" : value);
  };
  const handleArtistChange = (value) => {
    setSelectedArtist(value === "all" ? "" : value);
  };

  return isEventsPage ? (
    <div className="flex flex-col gap-4 mb-8">
      <Select
        onValueChange={handleLocationChange}
        value={selectedLocation || "all"}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Vælg lokation" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Lokationer</SelectLabel>
            <SelectItem value="all">Alle lokationer</SelectItem>
            {locations.map((location) => {
              const id = location?.id?.trim();
              if (!id) return null;
              return (
                <SelectItem key={id} value={id}>
                  {location.name || "Ukendt lokation"}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select onValueChange={handleDateChange} value={selectedDate || "all"}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Vælg dato" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Datoer</SelectLabel>
            <SelectItem value="all">Alle datoer</SelectItem>
            {dates.map((date) => {
              const trimmed = date?.trim();
              if (!trimmed) return null;
              return (
                <SelectItem key={trimmed} value={trimmed}>
                  {trimmed}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ) : (
    <div className="flex flex-col gap-4 mb-8">
      {/* SMK Mulighederne */}
      <Select
        onValueChange={handleTechniquesChange}
        value={selectedTechniques || "all"}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Vælg dato" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Techniques</SelectLabel>
            <SelectItem value="all">Alle Techniques</SelectItem>
            {uniqueTechniques.map((techniques) => {
              const trimmed = techniques?.trim();
              if (!trimmed) return null;

              return (
                <SelectItem key={trimmed} value={trimmed}>
                  {trimmed}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        onValueChange={handleArtistChange}
        value={selectedArtist || "all"}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Vælg dato" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Artists</SelectLabel>
            <SelectItem value="all">Alle Artists</SelectItem>
            {uniqueArtists.map((artist) => {
              const trimmed = artist?.trim();
              if (!trimmed) return null;

              return (
                <SelectItem key={trimmed} value={trimmed}>
                  {trimmed}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
