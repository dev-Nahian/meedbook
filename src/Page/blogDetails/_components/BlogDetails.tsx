import bigimg1 from "../../../../public/Images/blog_details1.png";
import bigimg2 from "../../../../public/Images/blog_details2.png";
import type { BlogDetailItem } from "../../../lib/blogApi";

type BlogDetailProps = {
  blog?: BlogDetailItem;
  isLoading?: boolean;
  isError?: boolean;
};

const formatDate = (date?: string) => {
  if (!date) return "";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
};

const BlogDetail = ({ blog, isLoading, isError }: BlogDetailProps) => {
  const image = blog?.image_url ?? bigimg1;

  if (isLoading) {
    return (
      <section className="max-w-5xl mx-auto px-4 py-10">
        <p className="text-sm text-gray-500">Loading blog...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="max-w-5xl mx-auto px-4 py-10">
        <p className="text-sm text-red-500">Unable to load this blog.</p>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* LEFT CONTENT */}
        <article className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-5 leading-snug">
            {blog?.title ?? "Healthy Smile Habits: Simple Tips For Everyday Care"}
          </h1>

          {blog?.published_date && (
            <p className="text-xs text-gray-400 mb-4">
              {formatDate(blog.published_date)}
            </p>
          )}

          {/* Hero */}
          <div className="relative w-full h-56 rounded-lg overflow-hidden mb-6">
            <img
              src={image}
              alt={blog?.title ?? "Dental care hero"}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Sections */}
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            {blog?.short_description ? "Overview" : "Healthy Smile Habits"}
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed mb-6">
            {blog?.short_description ??
              "Maintaining a healthy smile doesn't require complicated routines or expensive products. Small, consistent habits can make a big difference in keeping your teeth and gums healthy for years to come."}
          </p>

          {blog?.content ? (
            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line mb-6">
              {blog.content}
            </p>
          ) : (
            <>
              <h2 className="text-base font-bold text-gray-900 mb-1">
                Brush Properly, Twice a Day
              </h2>
              <p className="text-xs text-gray-600 mb-3">
                Brushing twice a day is essential, but technique matters just as much.
              </p>

              <ul className="list-disc list-inside space-y-1 text-xs text-gray-600 mb-6 pl-1">
                <li>Use a soft-bristled toothbrush</li>
                <li>Brush for at least two minutes</li>
                <li>Clean all surfaces of your teeth</li>
                <li>Replace your toothbrush every 3-4 months</li>
              </ul>

              <h2 className="text-base font-bold text-gray-900 mb-1">
                Don't Skip Flossing
              </h2>
              <p className="text-xs text-gray-600 mb-3">
                Flossing reaches areas your toothbrush can't.
              </p>

              <ul className="list-disc list-inside space-y-1 text-xs text-gray-600 mb-2 pl-1">
                <li>Floss once a day</li>
                <li>Be gentle</li>
                <li>Use alternatives if needed</li>
              </ul>
            </>
          )}

          {/* Mid Image */}
          <div className="relative w-full h-48 rounded-lg overflow-hidden my-6">
            <img src={bigimg2} alt="Smile" className="w-full h-full object-cover" />
          </div>

          <h2 className="text-base font-bold text-gray-900 mb-1">
            Final Thoughts
          </h2>
          <p className="text-xs text-gray-600">
            {blog?.content
              ? blog.short_description
              : "Healthy smiles are built on daily habits, not perfection."}
          </p>
        </article>
      </div>
    </section>
  );
};

export default BlogDetail;
