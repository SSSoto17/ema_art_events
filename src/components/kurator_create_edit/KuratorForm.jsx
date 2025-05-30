"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createEvent, updateEvent } from "@/lib/api";

import Gallery from "./Gallery";
import CustomButton from "@/components/global/CustomButton";
import Step from "./Step";
import Filter from "../global/FilterOld";
import NewFilter from "../global/Filter";

const KuratorForm = ({
  initialEventData,
  smk,
  eventsDates,
  eventsLocations,
  fetchedLocations,
  // Til Filter
  dataArtists,
  dataTechniques,
  filterCategories,
}) => {
  const router = useRouter();
  // const EventsDates = await getEventDates();
  const [dates, setDates] = useState([]);
  const [locations, setLocations] = useState([]);

  //logik for valg af billeder

  const [maxImages, setMaxImages] = useState(0);

  const {
    register,
    handleSubmit,

    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: initialEventData || {
      title: "",
      locationId: "",
      date: "",

      description: "",
      artworksId: [],
    },
  });

  const selectedLocationId = watch("locationId");
  const artworksIdFromForm = watch("artworksId");

  const [selectedImages, setSelectedImages] = useState(
    initialEventData?.artworksId || []
  );

  const [currentMaxImages, setCurrentMaxImages] = useState(
    Number(maxImages) || 0
  );

  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    console.log("KURATORFORM DEBUG: Initial maxImages prop:", maxImages);
    console.log("KURATORFORM DEBUG: currentMaxImages state:", currentMaxImages);
    console.log(
      "KURATORFORM DEBUG: selectedLocationId (watch):",
      selectedLocationId
    );
    console.log("KURATORFORM DEBUG: locations prop:", fetchedLocations);
  }, [maxImages, currentMaxImages, selectedLocationId, fetchedLocations]);

  useEffect(() => {
    if (initialEventData) {
      for (const [key, value] of Object.entries(initialEventData)) {
        if (key !== "time") {
          setValue(key, value);
        }
      }
      setSelectedImages(initialEventData.artworksId || []);
    }
  }, [initialEventData, setValue]);

  useEffect(() => {
    if (!Array.isArray(locations)) {
      console.warn("KuratorForm: 'locations' prop is not an array.", locations);
      setSelectedLocation(null);
      setCurrentMaxImages(0);
      return;
    }

    const foundLocation = locations.find(
      (loc) => String(loc.id) === String(selectedLocationId)
    );

    setSelectedLocation(foundLocation || null);

    const newMaxImages = Number(foundLocation?.maxArtworks) || 0;
    setCurrentMaxImages(newMaxImages);
    console.log(
      "KURATORFORM DEBUG: Updated currentMaxImages to:",
      newMaxImages,
      "for location:",
      foundLocation?.name
    );

    if (foundLocation && selectedImages.length > newMaxImages) {
      const trimmedImages = selectedImages.slice(0, newMaxImages);
      setSelectedImages(trimmedImages);
      setValue("artworksId", trimmedImages);
    } else if (foundLocation && newMaxImages === 0) {
      setSelectedImages([]);
      setValue("artworksId", []);
    }
  }, [selectedLocationId, setValue, selectedImages, locations]);

  useEffect(() => {
    if (JSON.stringify(selectedImages) !== JSON.stringify(artworksIdFromForm)) {
      setValue("artworksId", selectedImages);
    }
  }, [selectedImages, artworksIdFromForm, setValue]);

  const handleImageSelect = useCallback(
    (imageId) => {
      console.log("handleImageSelect called for imageId:", imageId);
      console.log("handleImageSelect: currentMaxImages =", currentMaxImages);
      console.log(
        "handleImageSelect: selectedImages.length =",
        selectedImages.length
      );
      console.log("handleImageSelect: selectedLocation =", selectedLocation);

      if (!selectedLocation || currentMaxImages === 0) {
        alert(
          "Vælg venligst en lokation med billedkapacitet for at vælge billeder."
        );
        return;
      }

      const isSelected = selectedImages.includes(imageId);

      let updatedSelectedImages;
      if (isSelected) {
        updatedSelectedImages = selectedImages.filter((id) => id !== imageId);
      } else {
        if (selectedImages.length < currentMaxImages) {
          updatedSelectedImages = [...selectedImages, imageId];
        } else {
          alert(
            `Du kan kun vælge op til ${currentMaxImages} billeder for denne lokation.`
          );
          return;
        }
      }
      setSelectedImages(updatedSelectedImages);
    },
    [selectedImages, currentMaxImages, selectedLocation]
  );

  const onSubmit = async (data) => {
    const { time, ...dataToSubmit } = data;

    dataToSubmit.artworksId = dataToSubmit.artworksId.filter(
      (id) => id !== null && id !== undefined && id !== ""
    );

    if (dataToSubmit.locationId) {
      dataToSubmit.locationId = Number(dataToSubmit.locationId);
    }

    try {
      if (initialEventData && initialEventData.id) {
        await updateEvent(initialEventData.id, dataToSubmit);
        console.log("Event updated successfully!");
      } else {
        await createEvent(dataToSubmit);
        console.log("Event created successfully!");
      }
      router.push("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Der opstod en fejl ved gemning af eventet.");
    }
  };

  return (
    <>
      <Step number="1" text="Dato og tid for event" />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
        <h1 className="text-2xl font-bold mb-4">
          {initialEventData ? "Rediger event" : "Opret nyt event"}
        </h1>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Titel:
          </label>
          <input
            type="text"
            id="title"
            {...register("title", { required: "Titel er påkrævet" })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="locationId"
            className="block text-sm font-medium text-gray-700"
          >
            Lokation:
          </label>
          <select
            id="locationId"
            {...register("locationId", {
              required: "Lokation er påkrævet",
              valueAsNumber: true,
            })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="">Vælg en lokation</option>
            {Array.isArray(locations) && locations.length > 0 ? (
              locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} (Max billeder: {loc.maxArtworks})
                </option>
              ))
            ) : (
              <option disabled>
                Indlæser lokationer eller ingen fundet...
              </option>
            )}
          </select>
          {errors.locationId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.locationId.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Dato:
          </label>
          <input
            type="date"
            id="date"
            {...register("date", { required: "Dato er påkrævet" })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Beskrivelse:
          </label>
          <textarea
            id="description"
            {...register("description")}
            rows="4"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
        </div>
        <NewFilter data={filterCategories} />

        <div className="border p-4 rounded-md">
          <Gallery
            smkdata={smk}
            selectedImages={selectedImages}
            handleImageSelect={handleImageSelect}
            maxImages={currentMaxImages}
            locationSelected={!!selectedLocation}
            showSelectedImagesSection={false}
          />
          <input type="hidden" {...register("artworksId")} />
        </div>

        <CustomButton
          type="submit"
          text={initialEventData ? "Gem ændringer" : "Opret event"}
          className="mt-6 w-fit"
          variant="default"
          size="lg"
        />
      </form>
      {/* <aside>
        <Filter
          // data
          dataDates={eventsDates}
          dataLocations={eventsLocations}
          dataTechniques={dataTechniques}
          dataArtists={dataArtists}
        ></Filter>
        <NewFilter data={filterCategories} />
      </aside> */}
    </>
  );
};

export default KuratorForm;
