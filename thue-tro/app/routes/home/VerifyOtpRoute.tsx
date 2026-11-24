import VerifyOtp from "app/views/home/auth/VerifyOtp";
import ServicedApartment from "app/views/home/serviced-apartment/ServicedApartment";

export function meta() {
    return [{ title: "Cho thuê nhà nguyên căn - Danh sách tin" }];
}

export default function VerifyOtpRoute() {
    return <VerifyOtp />;
}
