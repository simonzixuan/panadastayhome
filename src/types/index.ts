export type ListingType = "rent" | "sale"
export type PropertyType = "apartment" | "house" | "condo" | "townhouse" | "studio" | "office"

export interface Listing {
  id: string
  title: string
  description: string
  price: number
  type: ListingType
  property_type: PropertyType
  area: number
  bedrooms: number
  bathrooms: number
  address: string
  city: string
  district: string
  country: string
  state: string
  zip_code: string
  latitude?: number
  longitude?: number
  images: string[]
  contact_name: string
  contact_phone: string
  contact_email?: string
  is_available: boolean
  featured: boolean
  created_at: string
  updated_at: string
  user_id?: string
}

export interface SearchFilters {
  state?: string
  city?: string
  type?: ListingType
  property_type?: PropertyType
  min_price?: number
  max_price?: number
  min_area?: number
  max_area?: number
  bedrooms?: number
}
