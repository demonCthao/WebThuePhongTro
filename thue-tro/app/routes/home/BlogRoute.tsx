import BlogListView from "app/views/home/blog";

export function meta() {
    return [{ title: "Danh sách phòng trọ" }];
}

export default function BlogRoute() {
    return <BlogListView />;
}
