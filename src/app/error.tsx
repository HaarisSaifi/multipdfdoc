"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return <div className="max-w-3xl mx-auto px-4 py-20 text-center">
    <div className="bubble-card p-8 space-y-5" role="alert">
      <h1 className="text-2xl font-display font-bold">This page could not finish loading</h1>
      <p className="text-slate-600">Try loading it again. Keep your original documents; unsaved tool settings may need to be entered again.</p>
      <button onClick={reset} className="btn-bubble btn-bubble-violet px-6 py-3">Try again</button>
      <p><a href="/" className="text-violet-700 underline">Return to the tools</a></p>
    </div>
  </div>;
}
