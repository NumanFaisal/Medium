import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCard"
import { useBlogs } from "../hooks"
import { BlogSkeleton } from "../components/BlogSkeleton"

export const Blogs = () => {

    const { loading, blogs } = useBlogs();
    if (loading) {
        return <div>
            <Appbar /> 
            <div  className="flex justify-center">
                <div>
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                </div>
            </div>
        </div>
    }

    return <div>
    <Appbar />
    <div  className="flex justify-center ml-24">
        <div>
            {blogs.map(allPost => <BlogCard
                id={allPost.id}
                authorName={allPost.author.name || "Anonymous"}
                title={allPost.title}
                content={allPost.content}
                publishedDate={"2nd Feb 2024"}
            />)}
        </div>
    </div>
</div>
}