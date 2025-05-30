"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { startTransition, useActionState } from "react";
import { filterData } from "./actions";

export default function NewFilter({ data }) {
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

  console.log(state?.data);

  return (
    <section>
      <div className="flex gap-4 mb-8">
        {data.map(({ name, label, items }, id) => {
          return (
            <Select key={id} onValueChange={(e) => handleFilter(e, name)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={`Vælg ${label.singular.toLowerCase()}`}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{label.plural}</SelectLabel>
                  <SelectItem value="all">
                    Alle {label.plural.toLowerCase()}
                  </SelectItem>
                  {items.map((item, id) => {
                    if (isNaN(item))
                      return (
                        <SelectItem key={id} value={item}>
                          {item}
                        </SelectItem>
                      );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          );
        })}
      </div>
      <ul className="grid grid-cols-3 gap-x-8 border px-4 rounded-md">
        {isPending ? (
          <h3 className="col-span-full py-8">Searching...</h3>
        ) : state?.data.length > 0 ? (
          state?.data?.map(
            (
              {
                artist,
                titles,
                techniques,
                image_thumbnail,
                image_width,
                image_height,
              },
              id
            ) => {
              return (
                <li key={id} className="contents">
                  <article className="grid grid-rows-subgrid gap-y-6 row-span-3 py-8">
                    {image_thumbnail && image_width && image_height ? (
                      <Image
                        src={image_thumbnail}
                        alt={titles?.[0].title}
                        width={image_width}
                        height={image_height}
                        className="object-cover self-stretch max-h-60"
                      />
                    ) : (
                      <p className="self-stretch bg-btn-bg/50 text-btn-textClr p-6 grid place-content-center font-bold">
                        No image found.
                      </p>
                    )}
                    <h3>{titles?.[0].title}</h3>
                    <div className="*:not-last:mb-2">
                      <p className="font-bold">{artist?.[0]}</p>
                      <p>{techniques?.[0]}</p>
                    </div>
                  </article>
                </li>
              );
            }
          )
        ) : (
          <p className="col-span-full py-8">No results matched your search.</p>
        )}
      </ul>
    </section>
  );
}
