import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Search,
  Menu,
  House,
  Compass,
  Clapperboard,
  Clock3,
  ThumbsUp,
  Plus,
  Bell,
  Play,
  ArrowLeft,
  UploadCloud,
  X,
  LogIn,
  Coffee,
  LoaderCircle,
  Film,
} from 'lucide-react';
import './style.css';


const API = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");


const DEMO_VIDEOS = [
  {
    _id: 'demo1',
    title: 'Build a Full Stack App in 2026 — Start Here',
    description: 'A practical roadmap for building and shipping your first full-stack application.',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=85',
    videoFile: '',
    views: 18400,
    duration: 642,
    owner: { fullName: 'Code with Aman', username: 'codewithaman', avatar: '' },
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'demo2',
    title: 'The Art of a Slow Morning ☕',
    description: 'A quiet morning routine, coffee and a little creative reset.',
    thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=85',
    views: 92700,
    duration: 511,
    owner: { fullName: 'The Daily Edit', username: 'dailyedit' },
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'demo3',
    title: 'Designing a Minimal Workspace That Works',
    description: 'Small changes that make your desk a place you want to sit down at.',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=85',
    views: 53200,
    duration: 784,
    owner: { fullName: 'Studio North', username: 'studionorth' },
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'demo4',
    title: 'What I Learned Building My First Startup',
    description: 'Lessons about focus, customers and learning by doing.',
    thumbnail: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85',
    views: 24100,
    duration: 905,
    owner: { fullName: 'Build Notes', username: 'buildnotes' },
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'demo5',
    title: 'A Weekend in the Mountains | Cinematic Film',
    description: 'A few days away from the noise.',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85',
    views: 126000,
    duration: 438,
    owner: { fullName: 'Frame by Frame', username: 'framebyframe' },
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'demo6',
    title: 'JavaScript Concepts I Wish I Knew Earlier',
    description: 'Understand the fundamentals that make everything else easier.',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=85',
    views: 68100,
    duration: 1120,
    owner: { fullName: 'Dev Simplified', username: 'devsimplified' },
    createdAt: new Date().toISOString(),
  },
];

function formatViews(value) {
  const views = Number(value || 0);
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return String(views);
}

function formatDuration(value) {
  const seconds = Math.max(0, Math.floor(Number(value) || 0));
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
}

function formatDate(date) {
  const days = Math.max(0, (Date.now() - new Date(date || Date.now()).getTime()) / 86_400_000);
  if (days < 1) return 'today';
  if (days < 30) return `${Math.floor(days)}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function Avatar({ name = 'C', image, className = '' }) {
  if (image) {
    return <img className={className || 'channel-avatar'} src={image} alt={`${name}'s avatar`} />;
  }

  return <span className={`avatar ${className}`}>{String(name).trim().charAt(0).toUpperCase() || 'C'}</span>;
}

function App() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [page, setPage] = useState('home');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [modal, setModal] = useState('');
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('chai-user') || 'null');
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('chai-token') || '');
  const [toast, setToast] = useState('');

  const requestHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(''), 3200);
  }

  async function loadVideos(search = '') {
    setLoading(true);
    setError('');

    try {
      const searchParam = search ? `&query=${encodeURIComponent(search)}` : '';
      const response = await fetch(`${API}/api/v1/videos?limit=30${searchParam}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Could not load videos.');
      }

      const videoList = result.data?.videos || [];
      setVideos(videoList.length ? videoList : DEMO_VIDEOS);
    } catch {
      setVideos(DEMO_VIDEOS);
      setError('Preview mode · connect your API to load your own videos.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVideos();
  }, []);

  

  async function handleAuthSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const isRegister = modal === 'register';

    try {
      const options = {
        method: 'POST',
      };

      if (isRegister) {
        const avatarInput = form.querySelector('input[name="avatar"]');
        const avatarFile = avatarInput?.files?.[0];

        if (!avatarFile) {
          throw new Error('Please select a profile photo before signing up.');
        }

        formData.set('avatar', avatarFile);
        options.body = formData;
      } else {
        options.headers = {
          'Content-Type': 'application/json',
        };

        options.body = JSON.stringify({
          email: formData.get('email'),
          username: formData.get('email'),
          password: formData.get('password'),
        });
      }

      const response = await fetch(
        `${API}/api/v1/users/${isRegister ? 'register' : 'login'}`,
        options
      );

      const contentType = response.headers.get('content-type') || '';
      let result;

      if (contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const responseText = await response.text();
        const message = responseText
          .replace(/<[^>]*>/g, ' ')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/\s+/g, ' ')
          .trim();

        result = {
          message:
            message ||
            `Unexpected server response (HTTP ${response.status}).`,
        };
      }

      if (!response.ok) {
        throw new Error(result.message || 'Authentication failed.');
      }

      if (isRegister) {
        setModal('login');
        notify('Account created — sign in to continue.');
        return;
      }

      const loggedInUser = result.data?.user || result.data;
      const accessToken = result.data?.accessToken;

      if (accessToken) {
        localStorage.setItem('chai-token', accessToken);
        setToken(accessToken);
      }

      localStorage.setItem('chai-user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      setModal('');
      notify('Welcome back!');
    } catch (authError) {
      notify(authError.message || 'Authentication failed.');
    }
  }



  async function handleUploadSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(`${API}/api/v1/videos`, {
        method: 'POST',
        headers: requestHeaders,
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Video upload failed.');
      }

      setModal('');
      notify('Your video has been published.');
      await loadVideos();
    } catch (uploadError) {
      notify(uploadError.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem('chai-token');
    localStorage.removeItem('chai-user');
    setToken('');
    setUser(null);
    notify('Signed out.');
  }

  function handleSearch(event) {
    event.preventDefault();
    setActiveQuery(query.trim());
    setPage('home');
    setSelectedVideo(null);
  }

  function openVideo(video) {
    setSelectedVideo(video);
    setPage('watch');

    if (String(video._id).startsWith('demo')) return;

    fetch(`${API}/api/v1/videos/${video._id}`)
      .then((response) => response.json())
      .then((result) => setSelectedVideo(result.data || video))
      .catch(() => setSelectedVideo(video));
  }

  function goHome() {
    setPage('home');
    setSelectedVideo(null);
  }

  const visibleVideos = useMemo(() => {
    const searchText = activeQuery.toLowerCase();
    return videos.filter((video) => {
      const searchableText = `${video.title} ${video.description || ''} ${video.owner?.fullName || video.owner?.username || ''}`;
      return searchableText.toLowerCase().includes(searchText);
    });
  }, [videos, activeQuery]);

  const currentUserName = user?.fullName || user?.username || 'Creator';

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="icon-btn mobile-menu" aria-label="Open menu" type="button">
          <Menu />
        </button>

        <button className="brand" onClick={goHome} type="button">
          <span className="brand-mark"><Coffee size={21} /></span>
          <span>chai<span className="brand-light">tube</span></span>
        </button>

        <form className="searchbar" onSubmit={handleSearch}>
          <Search size={19} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search videos, creators..."
            aria-label="Search videos and creators"
          />
          <button type="submit">Search</button>
        </form>

        <div className="top-actions">
          {user ? (
            <>
              <button className="icon-btn" onClick={() => setModal('upload')} title="Upload video" type="button">
                <Plus />
              </button>
              <button className="icon-btn" title="Notifications" type="button">
                <Bell />
              </button>
              <button className="user-pill" onClick={() => notify(`Signed in as @${user.username || 'creator'}`)} type="button">
                <Avatar name={currentUserName} image={user.avatar} />
              </button>
              <button className="text-btn" onClick={handleLogout} type="button">Sign out</button>
            </>
          ) : (
            <button className="signin-btn" onClick={() => setModal('login')} type="button">
              <LogIn size={16} /> Sign in
            </button>
          )}
        </div>
      </header>

      <aside className="sidebar">
        <button className={`nav-item ${page === 'home' ? 'active' : ''}`} onClick={goHome} type="button">
          <House /><span>Home</span>
        </button>
        <button className="nav-item" onClick={() => { setActiveQuery(''); setQuery(''); loadVideos(); goHome(); }} type="button">
          <Compass /><span>Explore</span>
        </button>
        <button className="nav-item" onClick={() => user ? notify('Your channel is ready as you add videos.') : setModal('login')} type="button">
          <Clapperboard /><span>Your channel</span>
        </button>
        <button className="nav-item" onClick={() => user ? notify('Watch history will appear here.') : setModal('login')} type="button">
          <Clock3 /><span>History</span>
        </button>

        <div className="side-rule" />
        <p className="side-label">YOUR SPACE</p>
        <button className="nav-item" onClick={() => user ? setModal('upload') : setModal('login')} type="button">
          <UploadCloud /><span>Upload video</span>
        </button>

        <div className="sidebar-bottom">
          <div className="side-coffee">☕</div>
          <strong>Good videos.<br />Better conversations.</strong>
          <p>Your next favourite creator is one click away.</p>
          <span>MADE FOR THE CURIOUS</span>
        </div>
      </aside>

      <main className="main-content">
        {page === 'watch' && selectedVideo ? (
          <>
            <button className="back-link" onClick={goHome} type="button">
              <ArrowLeft size={17} /> Back to explore
            </button>

            <div className="player-frame">
              {selectedVideo.videoFile ? (
                <video src={selectedVideo.videoFile} controls autoPlay />
              ) : (
                <div
                  className="preview-player"
                  style={{ backgroundImage: `linear-gradient(0deg, rgba(0,0,0,.55), transparent), url(${selectedVideo.thumbnail})` }}
                >
                  <span className="play-large"><Play fill="currentColor" /></span>
                  <p>Video preview</p>
                </div>
              )}
            </div>

            <h1 className="watch-title">{selectedVideo.title}</h1>
            <div className="watch-meta">
              <div className="creator-info">
                <Avatar name={selectedVideo.owner?.fullName || selectedVideo.owner?.username || 'Creator'} image={selectedVideo.owner?.avatar} />
                <div>
                  <strong>{selectedVideo.owner?.fullName || selectedVideo.owner?.username || 'ChaiTube creator'}</strong>
                  <span>@{selectedVideo.owner?.username || 'creator'}</span>
                </div>
              </div>
              <div className="watch-stats">{formatViews(selectedVideo.views)} views · {formatDate(selectedVideo.createdAt)}</div>
              <button className="action-chip" onClick={() => user ? notify('Like feature needs a configured likes API.') : setModal('login')} type="button">
                <ThumbsUp size={17} /> Like
              </button>
            </div>

            <div className="description-box">{selectedVideo.description || 'No description provided.'}</div>
            <div className="coming-soon">
              <strong>Comments</strong>
              <p>Commenting will be available once the comments API is configured.</p>
            </div>
          </>
        ) : (
          <>
            <section className="hero">
              <div className="hero-copy">
                <span className="eyebrow"><span className="live-dot" /> YOUR DAILY DOSE OF DISCOVERY</span>
                <h1>Find your next<br /><em>favourite watch.</em></h1>
                <p>Ideas, creators and stories worth your time. Pull up a chair — there’s always something good on.</p>
                <div className="hero-buttons">
                  <button className="primary-btn" onClick={() => document.getElementById('video-grid')?.scrollIntoView({ behavior: 'smooth' })} type="button">
                    <Play size={16} fill="currentColor" /> Explore videos
                  </button>
                  <button className="secondary-btn" onClick={() => user ? setModal('upload') : setModal('register')} type="button">
                    {user ? 'Upload a video' : 'Become a creator'} <ArrowLeft className="arrow-up" size={16} />
                  </button>
                </div>
                <div className="hero-note">
                  <span className="tiny-avatars"><Avatar name="A" /><Avatar name="M" /><Avatar name="J" /></span>
                  <span>Made for curious minds</span><span className="note-divider">·</span><span>Always something new</span>
                </div>
              </div>

              <div className="hero-art">
                <div className="art-glow" />
                <div className="art-card art-card-back">
                  <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=700&q=85" alt="Mountain landscape" />
                  <span className="art-caption">TAKE THE SCENIC ROUTE</span>
                </div>
                <div className="art-card art-card-front">
                  <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=700&q=85" alt="A cup of coffee" />
                  <span className="art-tag">✦ EDITOR'S PICK</span>
                  <div className="art-bottom"><span>Slow mornings, good coffee</span><span className="art-play"><Play fill="currentColor" size={15} /></span></div>
                </div>
                <div className="floating-note"><span className="floating-icon"><Film size={17} /></span><span><strong>Something good</strong><small>is always playing</small></span></div>
                <span className="spark spark-one">✳</span><span className="spark spark-two">✦</span>
              </div>
              <div className="hero-number">01 <span>— DISCOVER</span></div>
            </section>

            <div className="section-head" id="video-grid">
              <div>
                <span className="section-kicker">THE GOOD STUFF</span>
                <h2>{activeQuery ? `Results for “${activeQuery}”` : 'Videos worth your time'} <span className="heading-dot">.</span></h2>
                <p>A little inspiration for wherever you are today.</p>
              </div>
              <div className="filter-pills">
                <button className="filter-active" onClick={() => { setActiveQuery(''); setQuery(''); }} type="button">For you</button>
                <button onClick={() => { setActiveQuery(''); setQuery(''); loadVideos(); }} type="button">Latest ↗</button>
              </div>
            </div>

            {error && <div className="preview-notice">{error}</div>}

            {loading ? (
              <div className="loading"><LoaderCircle className="spin" /> Finding something good...</div>
            ) : visibleVideos.length ? (
              <div className="video-grid">
                {visibleVideos.map((video, index) => (
                  <article className="video-card" key={video._id} style={{ '--delay': `${index * 45}ms` }}>
                    <button className="thumb-wrap" onClick={() => openVideo(video)} aria-label={`Watch ${video.title}`} type="button">
                      <img className="thumbnail" src={video.thumbnail} alt={video.title} loading="lazy" />
                      <span className="duration">{formatDuration(video.duration)}</span>
                      <span className="thumb-play"><Play fill="currentColor" size={18} /></span>
                    </button>
                    <div className="video-info">
                      <Avatar name={video.owner?.fullName || video.owner?.username || 'Creator'} image={video.owner?.avatar} />
                      <div className="video-copy">
                        <button className="video-title" onClick={() => openVideo(video)} type="button">{video.title}</button>
                        <p className="channel-name">{video.owner?.fullName || video.owner?.username || 'ChaiTube creator'}</p>
                        <p className="video-metadata">{formatViews(video.views)} views <span>·</span> {formatDate(video.createdAt)}</p>
                      </div>
                      <button className="more-btn" onClick={() => notify('More options coming soon.')} aria-label="More options" type="button">···</button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Search size={28} />
                <h3>No videos found</h3>
                <p>Try another search — the good stuff is out there.</p>
                <button className="secondary-btn" onClick={() => { setQuery(''); setActiveQuery(''); }} type="button">Clear search</button>
              </div>
            )}

            <section className="creator-banner">
              <div className="banner-icon"><Coffee size={24} /></div>
              <div><span className="section-kicker">YOUR TURN</span><h3>Got something worth sharing?</h3><p>Every great channel starts with one upload.</p></div>
              <button onClick={() => user ? setModal('upload') : setModal('register')} type="button">Start creating <ArrowLeft size={16} className="arrow-up" /></button>
            </section>
            <footer><span>© 2026 ChaiTube</span><span>Made with a little ☕ and a lot of curiosity.</span><span>BUILT FOR THE NEXT PLAY</span></footer>
          </>
        )}
      </main>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal('')}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal('')} type="button" aria-label="Close dialog"><X size={19} /></button>
            <div className="modal-brand"><Coffee size={20} /></div>

            {modal === 'upload' ? (
              <>
                <span className="section-kicker">SHARE SOMETHING GOOD</span>
                <h2>Upload a video</h2>
                <p className="modal-sub">Give your video a title and let people in.</p>
                <form className="modal-form" onSubmit={handleUploadSubmit}>
                  <label>Video title<input name="title" required placeholder="Give it a good title" /></label>
                  <label>Description<textarea name="description" required placeholder="What's this video about?" rows="3" /></label>
                  <label>Video file<input name="videoFile" type="file" accept="video/*" required /></label>
                  <label>Thumbnail image<input name="thumbnail" type="file" accept="image/*" required /></label>
                  <button className="primary-btn form-submit" type="submit"><UploadCloud size={17} /> Publish video</button>
                </form>
              </>
            ) : (
              <>
                <span className="section-kicker">{modal === 'register' ? 'JOIN THE COMMUNITY' : 'WELCOME BACK'}</span>
                <h2>{modal === 'register' ? 'Make yourself at home.' : 'Good to have you back.'}</h2>
                <p className="modal-sub">{modal === 'register' ? 'Create an account and share what you love.' : 'Sign in and find something worth watching.'}</p>
                <form className="modal-form" onSubmit={handleAuthSubmit}>
                  {modal === 'register' && (
                    <>
                      <label>Full name<input name="fullName" required placeholder="Your name" /></label>
                      <label>Username<input name="username" required placeholder="Choose a username" /></label>
                      <label>Profile photo<input name="avatar" type="file" accept="image/*" required /></label>
                    </>
                  )}
                  <label>Email address<input name="email" type="email" required placeholder="you@example.com" /></label>
                  <label>Password<input name="password" type="password" minLength="6" required placeholder="At least 6 characters" /></label>
                  <button className="primary-btn form-submit" type="submit">{modal === 'register' ? 'Create account' : 'Sign in'} <ArrowLeft className="arrow-up" size={16} /></button>
                </form>
                <p className="modal-switch">
                  {modal === 'register' ? 'Already have an account?' : 'New around here?'}{' '}
                  <button onClick={() => setModal(modal === 'register' ? 'login' : 'register')} type="button">
                    {modal === 'register' ? 'Sign in' : 'Create an account'}
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
