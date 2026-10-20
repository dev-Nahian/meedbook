import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import BlogDetail from "./_components/BlogDetails";
import BlogSidebar from "./_components/BlogSidebar";
import { getBlogDetails } from "../../lib/blogApi";


const BlogDetails = () => {

    const { slug, id } = useParams();
    const blogId = id ?? slug;
    const { data, isLoading, isError } = useQuery({
      queryKey: ["blog-details", blogId],
      queryFn: () => getBlogDetails(blogId ?? ""),
      enabled: Boolean(blogId),
    });

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 mt-28">
      <div className="flex flex-col lg:flex-row items-start gap-10">

        {/* LEFT: Blog Content */}
        <div className="flex-1 w-full">
          <BlogDetail blog={data} isLoading={isLoading} isError={isError} />
        </div>

        {/* RIGHT: Sidebar (TOP ALIGNED) */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <BlogSidebar />
        </div>

      </div>
    </section>
  );
};

export default BlogDetails;
