import BlogPosts from "./_components/Blog"

const BlogPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 mt-24">
      <div className="flex items-center justify-between  mb-10">
        <h1 className="text-4xl font-bold text-secondary">Out Latest Update</h1>
        <p className="text-sm tex-secondary max-w-sm">Practical advice, expert tips, and patient guidance to help you care for your smile with confidence.</p>
      </div>
       
            <BlogPosts />

    </div>
  )
}

export default BlogPage