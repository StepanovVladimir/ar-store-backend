export const AVAILABLE_LANGS = ['en', 'ru', 'es']

export const PRODUCTS_MANAGING_PERMISSION = 'products_managing'

export const ROLE_PERMISSIONS: Record<string, string[]> = {
    'user': [],
    'admin': [PRODUCTS_MANAGING_PERMISSION]
}