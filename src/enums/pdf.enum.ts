// page sizes
export const PDF_PAGE_SIZES = {
  A2: "A2",
  A3: "A3",
  A4: "A4",
  A5: "A5",
  A6: "A6",
  LETTER: "LETTER",
} as const;

export type PdfPageSize = (typeof PDF_PAGE_SIZES)[keyof typeof PDF_PAGE_SIZES];

// orientation
export const PDF_ORIENTATIONS = {
  PORTRAIT: "portrait",
  LANDSCAPE: "landscape",
} as const;

export type PdfOrientation =
  (typeof PDF_ORIENTATIONS)[keyof typeof PDF_ORIENTATIONS];

// design
export const PDF_DESIGNS = {
  INVOICE: "invoice",
  USER_LIST: "user-list",
} as const;

export type PdfDesign = (typeof PDF_DESIGNS)[keyof typeof PDF_DESIGNS];

// pdf number
export const PDF_PAGE_NUMBER = {
  TRUE: "true",
  FALSE: "false",
} as const;

export type PdfPageNumber =
  (typeof PDF_PAGE_NUMBER)[keyof typeof PDF_PAGE_NUMBER];
