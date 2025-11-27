export default function BlogPage() {
  return (
    <div className="prose prose-neutral prose-headings:font-medium prose-headings:text-foreground/85 prose-p:text-foreground/70 mx-auto max-w-4xl px-4 py-12">
      <h1>Blogs & News</h1>
      <p>Latest updates, styling tips, and brand news.</p>
      <ul>
        <li><a href="/blog/trending">Trending: Winter Lawn Looks You’ll Love</a></li>
        <li><a href="/blog/news">News: Winter Collection Launch & Shipping Update</a></li>
      </ul>
    </div>
  )
}
