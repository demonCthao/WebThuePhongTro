import SavedPosts from "app/views/home/saved-post/SavedPosts";

export function meta() {
    return [{ title: "Cho thuê nhà nguyên căn - Danh sách tin" }];
}

export default function SavedPostsRoute() {
    return <SavedPosts />;
}
