export const AVAILABLE_LANGS = ['en', 'ru', 'es']

export const PROCESSING_STATUS_ID = 1
export const DELIVERING_STATUS_ID = 2
export const DELIVERED_STATUS_ID = 3
export const RETURN_STATUS_ID = 4
export const COMPLETED_STATUS_ID = 5

export const PRODUCTS_MANAGING_PERMISSION = 'products_managing'

export const ROLE_PERMISSIONS: Record<string, string[]> = {
    'user': [],
    'admin': [PRODUCTS_MANAGING_PERMISSION]
}