

import {
  FaInstagram,
  FaXTwitter,
  FaTiktok,
  FaLinkedinIn,
  FaLink,
} from "react-icons/fa6";
import { CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBlogs } from "../../../lib/blogApi";

interface RelatedBlog {
  id: number;
  date: string;
  title: string;
  image: string;
}

const defaultRelatedBlogs: RelatedBlog[] = [
  {
    id: 1,
    date: "18 Jul 2023",
    title: "What to Expect During Your First Dental Visit",
    image: "/Images/blog_sidebarimg1.png",
  },
  {
    id: 2,
    date: "18 Jul 2023",
    title: "When to See a Dentist About Tooth Pain",
    image: "/Images/blog_sidebarimg2.png",
  },
  {
    id: 3,
    date: "18 Jul 2023",
    title: "How Often Should You Get a Dental Cleaning?",
    image: "/Images/blog_sidebarimg2.png",
  },
];

const socialLinks = [
  { icon: <FaInstagram size={14} />, href: "#" },
  { icon: <FaXTwitter size={14} />, href: "#" },
  { icon: <FaTiktok size={14} />, href: "#" },
  { icon: <FaLinkedinIn size={14} />, href: "#" },
  { icon: <FaLink size={14} />, href: "#" },
];

const BlogSidebar = () => {
  const { data: blogResponse } = useQuery({
    queryKey: ["blogs"],
    queryFn: getBlogs,
  });

  const relatedBlogs: RelatedBlog[] =
    blogResponse?.data && blogResponse.data.length > 0
      ? blogResponse.data.slice(0, 5).map((b) => ({
          id: b.id,
          date: b.published_date
            ? new Date(b.published_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Recent",
          title: b.title,
          image: b.image_url || "/Images/blog_sidebarimg1.png",
        }))
      : defaultRelatedBlogs;

  return (
    <aside className="w-full bg-slate-100 p-3 lg:w-56 rounded-lg shrink-0">
      {/* Social */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-700 mb-3">
          Share on Social Media
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          {socialLinks.map((s, i) => (
            <a
              key={i}
              href={s.href}
              className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-500 hover:border-blue-300 transition-colors"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Related Blogs */}
      <div>
        <p className="text-xs font-semibold text-gray-700 mb-3">
          Related Blogs
        </p>

        <div className="flex flex-col gap-4">
          {relatedBlogs.map((blog) => (
            <Link
              key={blog.id}
              to={`/blog/${blog.id}`}
              className="flex gap-3 items-start group hover:opacity-80 transition-opacity"
            >
              <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-gray-400">
                  <CalendarDays size={11} />
                  <span className="text-[10px]">{blog.date}</span>
                </div>

                <p className="text-xs font-medium text-gray-800 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {blog.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default BlogSidebar;