/**
 * Vị trí người dùng đã chọn, lưu trong useLocationStore.
 * `location = null` nghĩa là "Toàn quốc".
 */
export interface LocationModel {
    /** provinces.code, dùng để lọc/gọi API */
    provinceCode: string;
    /** provinces.full_name, ví dụ "Thành phố Hà Nội" */
    provinceFullName: string;
    /** wards.code; null nếu chọn "Tất cả" xã/phường của tỉnh */
    wardCode: string | null;
    /** wards.full_name, ví dụ "Phường Ba Đình"; null nếu chọn "Tất cả" */
    wardFullName: string | null;
}

/** "Phường Ba Đình, Thành phố Hà Nội" | "Thành phố Hà Nội" | "Toàn quốc" */
export function formatLocation(location: LocationModel | null): string {
    if (!location) return "Toàn quốc";
    return location.wardFullName
        ? `${location.wardFullName}, ${location.provinceFullName}`
        : location.provinceFullName;
}
