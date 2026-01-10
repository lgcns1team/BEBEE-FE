export const toDateSet = (activeDates: string[] | undefined | null) => {
  return new Set<string>(activeDates ?? []);
};
