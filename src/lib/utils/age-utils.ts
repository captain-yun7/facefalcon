/**
 * Utility functions for age-related operations
 */

/**
 * Convert age number to localized age category key
 * @param age Age in years
 * @returns Translation key for age category
 */
export function getAgeCategoryKey(age: number): string {
  if (age <= 2) return 'age.categories.infant';
  if (age <= 5) return 'age.categories.toddler';
  if (age <= 12) return 'age.categories.child';
  if (age <= 19) return 'age.categories.teenager';
  if (age <= 29) return 'age.categories.youngAdult';
  if (age <= 39) return 'age.categories.adult';
  if (age <= 49) return 'age.categories.middleAged';
  if (age <= 59) return 'age.categories.mature';
  if (age <= 69) return 'age.categories.senior';
  return 'age.categories.elderly';
}