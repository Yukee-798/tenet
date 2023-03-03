export type UniqueKeyUnion = "id" | "key";
export type ObjectWithUniqueKey = { id: string } | { key: string };

export type MapWithObjectUniqueKey<T extends ObjectWithUniqueKey> = { id: T } | { key: T };

export const arrayToMap = <T extends ObjectWithUniqueKey>(
  array: T[],
  uniqueKey: UniqueKeyUnion
): MapWithObjectUniqueKey<T> => {
  const map = {} as MapWithObjectUniqueKey<T>;
  array.forEach((item) => {
    map[item[uniqueKey]] = item;
  });
  return map;
};

export const recovery = <T extends ObjectWithUniqueKey>(map: MapWithObjectUniqueKey<T>) => {
  return Object.values(map);
};
