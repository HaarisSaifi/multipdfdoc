import Link from "next/link";

export default function NotFound() {
  return <div className="max-w-3xl mx-auto px-4 py-20 text-center">
    <div className="bubble-card p-8 sm:p-12 space-y-5">
      <p className="text-violet-700 font-semibold">404 · Page unavailable</p>
      <h1 className="text-3xl font-display font-bold text-slate-900">Find your next document tool</h1>
      <p className="text-slate-600">This address may be incorrect or the page may have moved. Browse the tools or read a practical guide.</p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link className="btn-bubble btn-bubble-violet px-6 py-3" href="/">Browse all tools</Link>
        <Link className="px-6 py-3 rounded-full border border-slate-200" href="/blog">Read the guides</Link>
      </div>
    </div>
  </div>;
}
