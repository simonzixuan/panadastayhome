type ListingNumbers = {
  price: number
  area: number | null
  bedrooms: number
  bathrooms: number
}

export function validateListingNumbers({ price, area, bedrooms, bathrooms }: ListingNumbers) {
  if (!Number.isFinite(price) || price <= 0 || price > 1_000_000_000) {
    return "价格必须大于0且不能超过10亿美元"
  }
  if (area !== null && (!Number.isFinite(area) || area <= 0 || area > 1_000_000)) {
    return "面积必须大于0且不能超过100万平方英尺"
  }
  if (!Number.isInteger(bedrooms) || bedrooms < 0 || bedrooms > 20) {
    return "卧室数必须是0到20之间的整数"
  }
  if (!Number.isFinite(bathrooms) || bathrooms < 0 || bathrooms > 20) {
    return "卫生间数量必须在0到20之间"
  }
  return null
}
