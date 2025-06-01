import Image from "next/image";
import { useState, useActionState, startTransition } from "react";
import NewFilter from "../global/Filter";
import { filterData } from "../global/Filter/actions";

const Gallery = ({ selectedImages, maxImages, categories, children }) => {
  const [state, action, isPending] = useActionState(filterData, {
    active: [],
    data: [],
  });

  function handleFilter(value, category) {
    const replaceFilter = state?.active?.filter(
      (item) => !item.includes(category)
    );
    const data =
      value === "all"
        ? replaceFilter
        : [...replaceFilter, `[${category}:${value}]`];

    startTransition(action.bind(state, data));
  }

  return (
    <section className="border p-4 rounded-md">
      <p className="text-black my-4">
        {(maxImages === 0 && "Denne lokation har ingen billedkapacitet.") ||
          (currentlySelectedArtworks.length === 0 &&
            maxImages > 0 &&
            `Ingen billeder valgt endnu. Vælg op til ${maxImages} billeder.`)}
      </p>
      <article className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <NewFilter data={categories} fn={handleFilter} />

        <ul className="-col-end-1 sm:col-start-2 grid grid-cols-subgrid gap-4">
          {isPending ? (
            <p>Indlæser SMK billeder...</p>
          ) : state?.data?.length === 0 ? (
            <p className="text-red-500">Ingen billeder fundet.</p>
          ) : (
            state?.data?.map((item, id) => {
              return (
                <GalleryCard
                  key={id}
                  {...item}
                  isDisabled={selectedImages.length === maxImages}
                />
              );
            })
          )}
        </ul>
      </article>
      {children}
    </section>
  );
};

export default Gallery;

function GalleryCard({
  object_number,
  image_thumbnail,
  image_native,
  image_width,
  image_height,
  isDisabled,
}) {
  const [isSelected, setIsSelected] = useState();

  return (
    <li
      onClick={() =>
        setIsSelected(isSelected === object_number ? undefined : object_number)
      }
      className={`${
        isSelected
          ? "ring-4 ring-[#A89C9E] cursor-pointer"
          : isDisabled
          ? "opacity-50 cursor-not-allowed"
          : "border-gray-300 cursor-pointer"
      } relative border-2 aspect-square
                    `}
    >
      {image_thumbnail === "https://api.smk.dk/api/v1/thumbnail/PD" ? (
        <div className="bg-btn-bg/50 text-white grid place-content-center p-2 w-full aspect-square">
          Image not found.
        </div>
      ) : (
        <Image
          src={image_thumbnail || image_native}
          width={image_width || 400}
          height={image_height || 400}
          alt={title || "SMK billede"}
          className="object-cover w-full h-full"
        />
      )}
    </li>
  );
}
