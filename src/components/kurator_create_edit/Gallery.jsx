"use client";
import Filter from "../global/Filter.client";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

const Gallery = ({
  smkdata,
  selectedImages,
  handleImageSelect,
  maxImages,
  locationSelected,
  // Til Filter
}) => {
  //Filter start: //
  const handleArtistChange = (value) => {
    setSelectedArtist(value);
  };

  const handleLocationChange = (value) => {
    setSelectedLocation(value);
  };

  const handleDateChange = (value) => {
    setSelectedDate(value);
  };

  const handleTechniqueChange = (value) => {
    setSelectedTechnique(value);
  };

  //Filter End: //
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (smkdata && smkdata.smk && smkdata.smk.length > 0) {
      setLoading(false);
      setError(false);
    } else if (smkdata && smkdata.smk && smkdata.smk.length === 0) {
      setLoading(false);
      setError(true);
    } else {
      setLoading(true);
    }
  }, [smkdata]);

  const images = smkdata.smk || [];

  const getImageUrl = useCallback(
    (imageId) => {
      const foundImage = images.find(
        (img) => String(img.id) === String(imageId)
      );
      return foundImage ? foundImage.image_thumbnail : "/placeholder.png";
    },
    [images]
  );
  if (!locationSelected) {
    return (
      <p className="text-black my-4">
        Vælg venligst en lokation for at vælge billeder.
      </p>
    );
  }

  const currentlySelectedArtworks = selectedImages
    .map((id) => {
      return images.find((artwork) => String(artwork.id) === String(id));
    })
    .filter(Boolean);

  return (
    <div>
      <aside>
        <Filter
          // data
          dates={eventsDates}
          eventsLocations={eventsLocations}
          dataTechniques={dataTechniques}
          dataArtists={dataArtists}
          // To try
          selectedTechnique={selectedTechnique}
          setSelectedTechnique={setSelectedTechnique}
          selectedArtist={selectedArtist}
          setSelectedArtist={setSelectedArtist}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          handleArtistChange={handleArtistChange}
          handleLocationChange={handleLocationChange}
          handleDateChange={handleDateChange}
          handleTechniqueChange={handleTechniqueChange}
        ></Filter>
      </aside>
      {maxImages === 0 && (
        <p className="text-black my-4">
          Denne lokation har ingen billedkapacitet.
        </p>
      )}

      {currentlySelectedArtworks.length === 0 && maxImages > 0 && (
        <p className="text-black my-4">
          Ingen billeder valgt endnu. Vælg op til {maxImages} billeder.
        </p>
      )}

      <h2 className="text-xl font-semibold my-6">
        Vælg billeder fra galleriet
      </h2>

      {loading && <p>Indlæser SMK billeder...</p>}
      {error && !loading && (
        <p className="text-red-500">
          Fejl ved indlæsning af billeder eller ingen billeder fundet.
        </p>
      )}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {images.length > 0 ? (
            images.map((dataSmk) => {
              const isSelected = selectedImages.some(
                (selectedId) => String(selectedId) === String(dataSmk.id)
              );
              const isDisabled =
                !isSelected && selectedImages.length >= maxImages;

              return (
                <div
                  key={dataSmk.id}
                  className={`
                    relative cursor-pointer border-2 p-2
                    ${isSelected ? " ring-4 ring-[#A89C9E]" : "border-gray-300"}
                    ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                  onClick={() => {
                    if (isSelected || selectedImages.length < maxImages) {
                      handleImageSelect(dataSmk.id);
                    } else {
                      alert(
                        `Du kan kun vælge op til ${maxImages} billeder for denne lokation`
                      );
                    }
                  }}
                >
                  <Image
                    src={dataSmk.image_thumbnail}
                    width={200}
                    height={200}
                    alt={dataSmk.title || "SMK billede"}
                    className="w-full h-auto object-cover"
                  />
                  {isSelected && <div className=" bg-[#A89C9E]"></div>}
                  <p className="text-sm mt-2">{dataSmk.title}</p>
                </div>
              );
            })
          ) : (
            <p>Ingen billeder at vise fra SMK.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Gallery;
