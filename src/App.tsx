import { useMemo, useState } from 'react'
import {
  Activity, ArrowRight, Award, BarChart3, ChevronRight, CircleDollarSign,
  ClipboardList, Flame, Gift, Home, LayoutGrid, Menu, PackageOpen, Play,
  RotateCcw, Settings, Shield, Sparkles, Swords, Trophy, Users, X, Zap,
} from 'lucide-react'

type View = 'dashboard' | 'roster' | 'packs' | 'match'
type Player = { id: number; name: string; pos: string; role: string; ovr: number; form: string; color: string }

const players: Player[] = [
  { id: 1, name: 'Milo Reyes', pos: 'CF', role: 'Leadoff spark', ovr: 86, form: 'Hot', color: '#ff9b6a' },
  { id: 2, name: 'Juno Park', pos: 'SS', role: 'Two-way anchor', ovr: 91, form: 'Locked in', color: '#d9b3ff' },
  { id: 3, name: 'Ollie Knox', pos: '1B', role: 'Power bat', ovr: 88, form: 'Steady', color: '#84dbca' },
  { id: 4, name: 'Tess Morgan', pos: 'RF', role: 'Gap hunter', ovr: 83, form: 'Rising', color: '#f4d06f' },
  { id: 5, name: 'Cam Ellis', pos: '2B', role: 'Contact artist', ovr: 80, form: 'Steady', color: '#9db7ff' },
  { id: 6, name: 'Nia Valdez', pos: 'C', role: 'Field general', ovr: 84, form: 'Hot', color: '#ffb3c6' },
  { id: 7, name: 'Rafi Cole', pos: 'LF', role: 'Defensive ace', ovr: 78, form: 'Cooling', color: '#b9e4a0' },
  { id: 8, name: 'Beck Harlow', pos: '3B', role: 'Late-inning bat', ovr: 76, form: 'Rising', color: '#ffc48a' },
]

const navItems: { id: View; label: string; icon: typeof Home }[] = [
  { id: 'dashboard', label: 'Command center', icon: Home },
  { id: 'roster', label: 'Roster & lineup', icon: Users },
  { id: 'packs', label: 'Card market', icon: PackageOpen },
  { id: 'match', label: 'Play a match', icon: Swords },
]

function App() {
  const [view, setView] = useState<View>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [selectedPack, setSelectedPack] = useState<string | null>(null)
  const [lineup, setLineup] = useState(players)
  const [inning, setInning] = useState(1)
  const [score, setScore] = useState({ home: 0, away: 0 })
  const [feed, setFeed] = useState(['Game day is here. Your squad is ready to make some noise.'])

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }
  const teamOvr = useMemo(() => Math.round(lineup.reduce((sum, p) => sum + p.ovr, 0) / lineup.length), [lineup])

  const playAtBat = () => {
    const outcomes = ['Milo rips a double into the gap!', 'Juno turns on a fastball — gone!', 'A sharp slider freezes the batter.', 'Ollie draws a patient walk.', 'Tess flashes leather at the wall.']
    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)]
    const scores = outcome.includes('gone') || outcome.includes('double')
    if (scores) setScore((s) => ({ ...s, home: s.home + (outcome.includes('gone') ? 2 : 1) }))
    setFeed((items) => [`${inning}.0 · ${outcome}`, ...items].slice(0, 5))
    setInning((value) => value >= 9 ? 1 : value + 1)
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="brand"><span className="brand-mark">✦</span><span>DIAMOND<br /><b>DYNASTY</b></span><button className="close-menu" onClick={() => setSidebarOpen(false)}><X size={18} /></button></div>
        <div className="manager-card"><div className="avatar">AR</div><div><strong>Avery Rivera</strong><small>Rookie manager</small></div><span className="online-dot" /></div>
        <nav>{navItems.map(({ id, label, icon: Icon }) => <button key={id} className={view === id ? 'nav-link active' : 'nav-link'} onClick={() => { setView(id); setSidebarOpen(false) }}><Icon size={18} /><span>{label}</span>{view === id && <ChevronRight size={15} className="nav-arrow" />}</button>)}</nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-tip"><Sparkles size={17} /><p><b>Daily challenge</b><br />Score 3 runs to earn 250 coins.</p><ChevronRight size={15} /></div>
        <button className="nav-link muted"><Settings size={18} /><span>Settings</span></button>
        <div className="season"><span>SEASON 04</span><b>Rising tide</b><div className="progress"><i style={{ width: '68%' }} /></div><small>68% to next reward</small></div>
      </aside>
      <main className="main">
        <header className="topbar"><button className="menu-button" onClick={() => setSidebarOpen(true)}><Menu size={22} /></button><div className="crumb">SEASON 04 <span>/</span> {navItems.find((n) => n.id === view)?.label.toUpperCase()}</div><div className="top-actions"><div className="currency"><CircleDollarSign size={18} /> 2,480</div><div className="currency gems"><span>◆</span> 94</div><button className="icon-button"><Gift size={19} /></button><div className="mini-avatar">AR</div></div></header>
        <div className="content">
          {view === 'dashboard' && <Dashboard onNavigate={setView} onNotify={notify} teamOvr={teamOvr} />}
          {view === 'roster' && <Roster lineup={lineup} setLineup={setLineup} onNotify={notify} />}
          {view === 'packs' && <Packs selectedPack={selectedPack} setSelectedPack={setSelectedPack} onNotify={notify} />}
          {view === 'match' && <Match inning={inning} score={score} feed={feed} playAtBat={playAtBat} onNotify={notify} />}
        </div>
      </main>
      {toast && <div className="toast"><Zap size={17} />{toast}</div>}
    </div>
  )
}

function Dashboard({ onNavigate, onNotify, teamOvr }: { onNavigate: (v: View) => void; onNotify: (s: string) => void; teamOvr: number }) {
  return <div className="page"><div className="page-heading"><div><p className="eyebrow">WEDNESDAY, JUNE 12 · DAY 42</p><h1>Good evening, Avery <span>✦</span></h1><p className="subhead">The clubhouse is humming. Ready to set the tone?</p></div><button className="primary-button" onClick={() => onNavigate('match')}><Play size={16} fill="currentColor" /> Play next match</button></div>
    <div className="hero-grid"><section className="hero-card"><div className="hero-copy"><span className="tag warm">NEXT UP · HOME</span><h2>Make it count<br /><em>against the Comets.</em></h2><p>Tonight, your Fireflies look to extend their streak to four.</p><button className="ghost-button light" onClick={() => onNavigate('match')}>Enter match room <ArrowRight size={16} /></button></div><div className="hero-orbit"><div className="orbit-ball">⚾</div><span className="orbit-star s1">✦</span><span className="orbit-star s2">✧</span></div></section>
      <section className="streak-card"><div className="card-top"><span className="tag">FORM</span><Flame size={18} className="flame" /></div><div className="streak-number">W<span>3</span></div><p>three in a row</p><div className="streak-dots"><i /><i /><i /><i className="empty" /><i className="empty" /></div><small>Best streak this season: 6</small></section></div>
    <div className="section-row"><h3>Squad pulse</h3><button className="text-button" onClick={() => onNavigate('roster')}>View full roster <ArrowRight size={14} /></button></div>
    <div className="stat-grid"><Stat icon={<Shield />} label="Team rating" value={teamOvr.toString()} delta="+2 this week" color="lavender" /><Stat icon={<Activity />} label="Batting form" value="82%" delta="↑ 8% from last" color="mint" /><Stat icon={<Trophy />} label="League rank" value="#04" delta="top 10%" color="peach" /><Stat icon={<CircleDollarSign />} label="Clubhouse funds" value="2,480" delta="+350 this week" color="yellow" /></div>
    <div className="lower-grid"><section className="panel"><div className="panel-heading"><div><span className="eyebrow">UPCOMING</span><h3>Match calendar</h3></div><button className="icon-button"><LayoutGrid size={17} /></button></div><MatchRow opponent="Comets" time="Tonight · 7:30 PM" badge="HOME" accent="purple" onClick={() => onNavigate('match')} /><MatchRow opponent="Harbor Hawks" time="Tomorrow · 6:00 PM" badge="AWAY" accent="blue" onClick={() => onNotify('Scouting report added to your inbox')} /><MatchRow opponent="Redwood Foxes" time="Fri · 7:30 PM" badge="HOME" accent="orange" onClick={() => onNotify('Match preview unlocked')} /></section><section className="panel activity-panel"><div className="panel-heading"><div><span className="eyebrow">LATEST</span><h3>Clubhouse feed</h3></div><button className="text-button">See all <ArrowRight size={14} /></button></div><FeedItem icon="✦" title="Juno Park is on fire" text="4 hits in the last 2 games" color="lavender" /><FeedItem icon="✚" title="New objective complete" text="Win 3 home games · +150 coins" color="mint" /><FeedItem icon="↗" title="Market refresh" text="Rare cards have rotated in" color="peach" /></section></div>
  </div>
}

function Stat({ icon, label, value, delta, color }: { icon: React.ReactNode; label: string; value: string; delta: string; color: string }) { return <div className="stat-card"><div className={`stat-icon ${color}`}>{icon}</div><span>{label}</span><strong>{value}</strong><small>{delta}</small></div> }
function MatchRow({ opponent, time, badge, accent, onClick }: { opponent: string; time: string; badge: string; accent: string; onClick: () => void }) { return <button className="match-row" onClick={onClick}><div className={`opponent-mark ${accent}`}>✦</div><div className="match-info"><strong>Fireflies <span>vs</span> {opponent}</strong><small>{time}</small></div><span className="home-badge">{badge}</span><ChevronRight size={17} /></button> }
function FeedItem({ icon, title, text, color }: { icon: string; title: string; text: string; color: string }) { return <div className="feed-item"><span className={`feed-icon ${color}`}>{icon}</span><div><strong>{title}</strong><small>{text}</small></div><span className="feed-time">2h</span></div> }

function Roster({ lineup, setLineup, onNotify }: { lineup: Player[]; setLineup: (p: Player[]) => void; onNotify: (s: string) => void }) {
  const [tab, setTab] = useState<'lineup' | 'all'>('lineup')
  const swap = (index: number) => { if (index === 0) return; const copy = [...lineup]; [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]]; setLineup(copy); onNotify(`${copy[index - 1].name} moved up in the order`) }
  return <div className="page"><div className="page-heading"><div><p className="eyebrow">CLUBHOUSE · 26 PLAYERS</p><h1>Roster & lineup</h1><p className="subhead">Shape the squad that takes the field.</p></div><button className="primary-button" onClick={() => onNotify('Lineup saved and ready for game day')}><ClipboardList size={16} /> Save lineup</button></div><div className="roster-banner"><div><span className="tag warm">ACTIVE LINEUP</span><h2>Fireflies starting nine</h2><p>Balanced for contact, speed, and a little late-inning magic.</p></div><div className="rating-ring"><strong>84</strong><span>OVR</span></div></div><div className="tabs"><button className={tab === 'lineup' ? 'tab active' : 'tab'} onClick={() => setTab('lineup')}>Starting lineup</button><button className={tab === 'all' ? 'tab active' : 'tab'} onClick={() => setTab('all')}>All players <span>26</span></button></div><div className="roster-layout"><section className="panel player-list">{(tab === 'lineup' ? lineup : [...lineup, { id: 20, name: 'Parker Shaw', pos: 'RP', role: 'Relief arm', ovr: 74, form: 'Steady', color: '#b8c8ff' }]).map((p, i) => <div className="player-row" key={p.id}><span className="order">{tab === 'lineup' ? `0${i + 1}` : '—'}</span><div className="player-face" style={{ background: p.color }}>{p.name.split(' ').map((n) => n[0]).join('')}</div><div className="player-details"><strong>{p.name}</strong><small>{p.pos} · {p.role}</small></div><span className={`form ${p.form === 'Hot' || p.form === 'Rising' ? 'positive' : p.form === 'Cooling' ? 'negative' : ''}`}>{p.form}</span><strong className="ovr">{p.ovr}</strong>{tab === 'lineup' && <button className="move-button" onClick={() => swap(i)} disabled={i === 0}><RotateCcw size={15} /></button>}</div>)}</section><aside className="panel lineup-insight"><span className="eyebrow">MANAGER'S NOTE</span><h3>Small ball, big energy.</h3><p>Your top four combine for an <b>89 OVR</b> and 31 stolen-base potential. Keep the pressure on early.</p><div className="insight-line"><BarChart3 size={16} /><span>Lineup chemistry</span><b>92%</b></div><div className="progress"><i style={{ width: '92%' }} /></div><button className="ghost-button" onClick={() => onNotify('Suggested lineup applied')}>Suggest lineup <Sparkles size={15} /></button></aside></div></div>
}

function Packs({ selectedPack, setSelectedPack, onNotify }: { selectedPack: string | null; setSelectedPack: (s: string | null) => void; onNotify: (s: string) => void }) {
  const packs = [{ name: 'Momentum', price: '500', icon: '↗', desc: 'A boost for clubs on the rise.', color: 'peach', cards: '3 cards' }, { name: 'Starlight', price: '1,200', icon: '✦', desc: 'Chase a rare player under pressure.', color: 'purple', cards: '5 cards · 1 guaranteed rare' }, { name: 'Clubhouse', price: 'Free', icon: '✚', desc: 'A daily thank-you from the league.', color: 'mint', cards: '2 cards · daily' }]
  return <div className="page"><div className="page-heading"><div><p className="eyebrow">THE MARKET · 12 AVAILABLE</p><h1>Card market</h1><p className="subhead">Build a deeper club with a little patience and a lot of luck.</p></div><div className="wallet"><CircleDollarSign size={17} /> 2,480 <span>◆</span> 94</div></div><div className="market-note"><Sparkles size={18} /><div><strong>Fresh rotation is live</strong><span>Six new cards just landed. Market refreshes in 18:42:09.</span></div><button className="text-button">View odds <ArrowRight size={14} /></button></div><div className="pack-grid">{packs.map((p) => <button className={`pack-card ${selectedPack === p.name ? 'selected' : ''}`} key={p.name} onClick={() => setSelectedPack(p.name)}><div className={`pack-art ${p.color}`}><span>{p.icon}</span><i>DD</i></div><div className="pack-copy"><div className="pack-title"><h3>{p.name}</h3><span className="pack-cards">{p.cards}</span></div><p>{p.desc}</p><div className="pack-buy"><b>{p.price === 'Free' ? p.price : `◉ ${p.price}`}</b><span>{selectedPack === p.name ? 'Selected' : 'Open pack'} <ArrowRight size={14} /></span></div></div></button>)}</div>{selectedPack && <div className="opening-panel"><div><span className="eyebrow">READY TO OPEN</span><h2>{selectedPack} pack selected</h2><p>Every pack is a new story for your clubhouse.</p></div><button className="primary-button" onClick={() => { onNotify('Pack opened — Milo Reyes joined your collection!'); setSelectedPack(null) }}>Open pack <PackageOpen size={16} /></button></div>}<div className="section-row"><h3>Recent pulls</h3><button className="text-button" onClick={() => onNotify('Collection view coming soon')}>View collection <ArrowRight size={14} /></button></div><div className="pulls"><div className="pull-card"><span className="rare">RARE</span><strong>Vera Bloom</strong><small>SP · 79 OVR</small><i>♢</i></div><div className="pull-card gold"><span className="rare">EPIC</span><strong>Hugo Finch</strong><small>CL · 87 OVR</small><i>✦</i></div><div className="pull-card mint-card"><span className="rare">UNCOMMON</span><strong>Team spark</strong><small>Clubhouse boost</small><i>✚</i></div></div></div>
}

function Match({ inning, score, feed, playAtBat, onNotify }: { inning: number; score: { home: number; away: number }; feed: string[]; playAtBat: () => void; onNotify: (s: string) => void }) {
  return <div className="page match-page"><div className="page-heading"><div><p className="eyebrow">MATCH ROOM · REGULAR SEASON</p><h1>Fireflies <span className="versus">vs</span> Comets</h1><p className="subhead">Starlight Park · Clear skies · 72°F</p></div><span className="live-pill"><i /> LIVE SIMULATION</span></div><div className="scoreboard"><div className="team-score"><span className="team-badge firefly">✦</span><div><small>HOME</small><strong>Fireflies</strong></div><b>{score.home}</b></div><div className="inning"><span>TOP</span><strong>{inning}</strong><small>INNING</small></div><div className="team-score away"><b>{score.away}</b><div><small>AWAY</small><strong>Comets</strong></div><span className="team-badge comet">☄</span></div></div><div className="match-columns"><section className="panel field-panel"><div className="panel-heading"><div><span className="eyebrow">LIVE AT-BAT</span><h3>Milo Reyes · 0–1</h3></div><span className="count"><i /><i className="dim" /><i className="dim" /> 1 out</span></div><div className="diamond"><div className="base b2" /><div className="base b1" /><div className="base b3" /><div className="base home" /><div className="pitch-dot">⚾</div></div><div className="field-controls"><button className="primary-button" onClick={playAtBat}><Play size={16} fill="currentColor" /> Simulate at-bat</button><button className="ghost-button" onClick={() => onNotify('Strategy board opened')}>Set strategy <ClipboardList size={15} /></button></div></section><section className="panel play-feed"><div className="panel-heading"><div><span className="eyebrow">PLAY-BY-PLAY</span><h3>Game feed</h3></div><Activity size={17} /></div>{feed.map((item, i) => <div className={`play-item ${i === 0 ? 'latest' : ''}`} key={`${item}-${i}`}><span className="play-dot" /> <span>{item}</span></div>)}</section></div><div className="match-bottom"><div><span className="eyebrow">WIN PROBABILITY</span><div className="probability"><strong>64%</strong><span>Fireflies</span><div className="progress"><i style={{ width: '64%' }} /></div></div></div><div className="match-stats"><span>Hits <b>5</b></span><span>Errors <b>0</b></span><span>Pitch count <b>42</b></span></div></div></div>
}

export default App
