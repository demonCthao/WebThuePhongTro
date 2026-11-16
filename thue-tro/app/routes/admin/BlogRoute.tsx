import BlogsList from "app/views/admin/blogs/BlogsList";

export function meta() {
    return [{ title: "Danh sách phòng trọ" }];
}

export default function BlogRoute() {
    return <BlogsList />;
}
