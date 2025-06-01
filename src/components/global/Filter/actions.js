"use server";

import { getSMKFilter } from "@/lib/api";

export async function filterData(prev, filter) {
  const items = await getSMKFilter(filter.join("&filters="), true);

  return { active: filter, data: items };

  // console.log(items);

  // const items = await getSMKFilter(filter.join("&filters="));

  // return { active: filter, data: items };
}
