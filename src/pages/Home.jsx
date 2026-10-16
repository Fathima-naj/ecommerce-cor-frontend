import { Link } from 'react-router-dom'

function Home() {
  return (
    <main className="page-section">
      <section className="hero-panel lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative z-10 flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 lg:py-16">
          <p className="feature-pill mb-6 w-fit">A little more you</p>
          <h1 className="max-w-xl text-4xl font-semibold leading-[1.04] tracking-[-0.06em] text-[#1d2a23] sm:text-5xl lg:text-6xl">
            Good finds for everyday living.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#58655d] sm:text-lg">
            Discover thoughtful pieces for your home, your routine, and the small rituals that make a place feel like yours.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link to="/products" className="premium-button px-6">
              Shop now <span aria-hidden="true" className="ml-2">→</span>
            </Link>
            <Link to="/products" className="secondary-button px-5">
              View collection
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-left">
            <span className="feature-pill">Natural textures</span>
            <span className="feature-pill">Designed daily</span>
            <span className="feature-pill">Free shipping</span>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=85"
            alt="Warm, thoughtfully arranged independent shop"
          />
          <div className="hero-overlay" />

          <div className="hero-card">
            <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#dce8db]">
              Curated for real life
            </p>
            <p className="text-2xl font-semibold tracking-[-0.05em] text-white">Soft living, beautifully made.</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
