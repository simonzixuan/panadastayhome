export type ListingType = "rent" | "sale"
export type PropertyType = "apartment" | "house" | "condo" | "townhouse" | "studio" | "office"

export interface Listing {
  id: string
  title: string
  description: string
  price: number
  type: ListingType
  property_type: PropertyType
  area: number | null
  bedrooms: number
  bathrooms: number
  address: string | null
  city: string | null
  district: string | null
  country: string
  state: string | null
  zip_code: string | null
  latitude?: number
  longitude?: number
  images: string[]
  contact_name: string
  contact_phone: string
  contact_email?: string
  is_available: boolean
  featured: boolean
  publisher_type?: string | null
  listing_source?: string | null
  review_notes?: string | null
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
