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
import Form from "next/form";
import { startTransition, useActionState } from "react";
import { filterData } from "./actions";

export default function NewFilter({ data }) {
  const [state, action, isPending] = useActionState(filterData, { active: [] });

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
    <div className="flex flex-col gap-4 mb-8">
      {/* <Select
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
      </Select> */}
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
      <ul className="grid grid-cols-3 gap-6">
        {state?.data.length > 0 ? (
          state?.data?.map(({ artist, titles, techniques }, id) => {
            console.log(techniques);
            return (
              <li key={id} className="contents">
                <article className="border p-6 row-span-3 grid grid-rows-subgrid">
                  <h3>{titles[0].title}</h3>
                  <p>{artist[0]}</p>
                  <p>{techniques[0]}</p>
                </article>
              </li>
            );
          })
        ) : (
          <p className="col-span-full">No results matched your search.</p>
        )}
      </ul>
    </div>
  );
}
