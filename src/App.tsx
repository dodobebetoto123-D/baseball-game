import { useEffect, useMemo, useState } from 'react'
import {
  Activity, ArrowRight, Award, BarChart3, ChevronRight, CircleDollarSign,
  ClipboardList, Flame, Gift, Home, LayoutGrid, Menu, PackageOpen, Play,
  RotateCcw, Settings, Shield, Sparkles, Swords, Trophy, Users, X, Zap,
} from 'lucide-react'

type View = 'dashboard' | 'roster' | 'packs' | 'match'
type Player = { id: number; name: string; pos: string; role: string; ovr: number; form: string; color: string }

const players: Player[] = [
  { id: 1, name: '마일로 레이스', pos: 'CF', role: '리드오프 스파크', ovr: 86, form: '뜨거움', color: '#ff9b6a' },
  { id: 2, name: '주노 박', pos: 'SS', role: '공수 핵심', ovr: 91, form: '집중', color: '#d9b3ff' },
  { id: 3, name: '올리 녹스', pos: '1B', role: '파워 히터', ovr: 88, form: '안정적', color: '#84dbca' },
  { id: 4, name: '테스 모건', pos: 'RF', role: '갭 타격', ovr: 83, form: '상승세', color: '#f4d06f' },
  { id: 5, name: '캠 엘리스', pos: '2B', role: '컨택 장인', ovr: 80, form: '안정적', color: '#9db7ff' },
  { id: 6, name: '니아 발데즈', pos: 'C', role: '수비 사령관', ovr: 84, form: '뜨거움', color: '#ffb3c6' },
  { id: 7, name: '라피 콜', pos: 'LF', role: '수비 에이스', ovr: 78, form: '하락세', color: '#b9e4a0' },
  { id: 8, name: '벡 할로우', pos: '3B', role: '후반 해결사', ovr: 76, form: '상승세', color: '#ffc48a' },
]

const navItems: { id: View; label: string; icon: typeof Home }[] = [
  { id: 'dashboard', label: '구단 홈', icon: Home },
  { id: 'roster', label: '선수단·라인업', icon: Users },
  { id: 'packs', label: '카드 마켓', icon: PackageOpen },
  { id: 'match', label: '경기 센터', icon: Swords },
]

function App() {
  const [view, setView] = useState<View>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [selectedPack, setSelectedPack] = useState<string | null>(null)
  const [lineup, setLineup] = useState(players)
  const [inning, setInning] = useState(1)
  const [score, setScore] = useState({ home: 0, away: 0 })
  const [feed, setFeed] = useState(['경기일입니다. 선수단이 출격을 준비했습니다.'])
  const [pitching, setPitching] = useState(false)
  const [pitchProgress, setPitchProgress] = useState(0)
  const [atBatResult, setAtBatResult] = useState('투수가 공을 준비하고 있습니다.')

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }
  const teamOvr = useMemo(() => Math.round(lineup.reduce((sum, p) => sum + p.ovr, 0) / lineup.length), [lineup])

  const playAtBat = () => {
    if (pitching) return
    setPitching(true)
    setPitchProgress(0)
    setAtBatResult('공이 날아옵니다! 타이밍을 맞춰 스윙하세요.')
  }

  const swing = () => {
    if (!pitching) return
    const distance = Math.abs(pitchProgress - 58)
    const outcome = distance < 9 ? '마일로가 가운데로 받아쳤습니다 — 홈런!' : distance < 20 ? '마일로가 우전 안타를 만들어냅니다!' : distance < 34 ? '마일로가 파울을 걷어냅니다.' : '헛스윙 삼진! 타이밍이 늦었습니다.'
    const runs = outcome.includes('홈런') ? 2 : outcome.includes('안타') ? 1 : 0
    if (runs) setScore((s) => ({ ...s, home: s.home + runs }))
    setFeed((items) => [`${inning}.0 · ${outcome}`, ...items].slice(0, 5))
    setAtBatResult(outcome)
    setPitching(false)
    setPitchProgress(0)
    setInning((value) => value >= 9 ? 1 : value + 1)
  }

  useEffect(() => {
    if (!pitching) return
    const timer = window.setInterval(() => {
      setPitchProgress((value) => {
        if (value >= 100) {
          setPitching(false)
          setAtBatResult('스트라이크! 공을 놓쳤습니다.')
          setFeed((items) => [`${inning}.0 · 스트라이크! 공을 놓쳤습니다.`, ...items].slice(0, 5))
          return 0
        }
        return value + 4
      })
    }, 90)
    return () => window.clearInterval(timer)
  }, [pitching, inning])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault()
        swing()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="brand"><span className="brand-mark">✦</span><span>DIAMOND<br /><b>DYNASTY</b></span><button className="close-menu" onClick={() => setSidebarOpen(false)}><X size={18} /></button></div>
        <div className="manager-card"><div className="avatar">AR</div><div><strong>Avery Rivera</strong><small>신입 감독</small></div><span className="online-dot" /></div>
        <nav>{navItems.map(({ id, label, icon: Icon }) => <button key={id} className={view === id ? 'nav-link active' : 'nav-link'} onClick={() => { setView(id); setSidebarOpen(false) }}><Icon size={18} /><span>{label}</span>{view === id && <ChevronRight size={15} className="nav-arrow" />}</button>)}</nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-tip"><Sparkles size={17} /><p><b>오늘의 도전</b><br />Score 3 runs to earn 250 coins.</p><ChevronRight size={15} /></div>
        <button className="nav-link muted"><Settings size={18} /><span>설정</span></button>
        <div className="season"><span>SEASON 04</span><b>떠오르는 파도</b><div className="progress"><i style={{ width: '68%' }} /></div><small>68% to next reward</small></div>
      </aside>
      <main className="main">
        <header className="topbar"><button className="menu-button" onClick={() => setSidebarOpen(true)}><Menu size={22} /></button><div className="crumb">SEASON 04 <span>/</span> {navItems.find((n) => n.id === view)?.label.toUpperCase()}</div><div className="top-actions"><div className="currency"><CircleDollarSign size={18} /> 2,480</div><div className="currency gems"><span>◆</span> 94</div><button className="icon-button"><Gift size={19} /></button><div className="mini-avatar">AR</div></div></header>
        <div className="content">
          {view === 'dashboard' && <Dashboard onNavigate={setView} onNotify={notify} teamOvr={teamOvr} />}
          {view === 'roster' && <Roster lineup={lineup} setLineup={setLineup} onNotify={notify} />}
          {view === 'packs' && <Packs selectedPack={selectedPack} setSelectedPack={setSelectedPack} onNotify={notify} />}
          {view === 'match' && <Match inning={inning} score={score} feed={feed} playAtBat={playAtBat} swing={swing} pitching={pitching} pitchProgress={pitchProgress} atBatResult={atBatResult} onNotify={notify} />}
        </div>
      </main>
      {toast && <div className="toast"><Zap size={17} />{toast}</div>}
    </div>
  )
}

function Dashboard({ onNavigate, onNotify, teamOvr }: { onNavigate: (v: View) => void; onNotify: (s: string) => void; teamOvr: number }) {
  return <div className="page"><div className="page-heading"><div><p className="eyebrow">WEDNESDAY, JUNE 12 · DAY 42</p><h1>좋은 저녁이에요, 에이버리 <span>✦</span></h1><p className="subhead">The clubhouse is humming. Ready to set the tone?</p></div><button className="primary-button" onClick={() => onNavigate('match')}><Play size={16} fill="currentColor" /> 다음 경기 시작</button></div>
    <div className="hero-grid"><section className="hero-card"><div className="hero-copy"><span className="tag warm">NEXT UP · ?</span><h2>승리를 쟁취하세요<br /><em>against the 코메츠.</em></h2><p>Tonight, your 파이어플라이 look to extend their streak to four.</p><button className="ghost-button light" onClick={() => onNavigate('match')}>경기장 입장 <ArrowRight size={16} /></button></div><div className="hero-orbit"><div className="orbit-ball">⚾</div><span className="orbit-star s1">✦</span><span className="orbit-star s2">✧</span></div></section>
      <section className="streak-card"><div className="card-top"><span className="tag">컨디션</span><Flame size={18} className="flame" /></div><div className="streak-number">W<span>3</span></div><p>3연승</p><div className="streak-dots"><i /><i /><i /><i className="empty" /><i className="empty" /></div><small>Best streak this season: 6</small></section></div>
    <div className="section-row"><h3>선수단 현황</h3><button className="text-button" onClick={() => onNavigate('roster')}>전체 선수단 보기 <ArrowRight size={14} /></button></div>
    <div className="stat-grid"><Stat icon={<Shield />} label="팀 전력" value={teamOvr.toString()} delta="+2 this week" color="lavender" /><Stat icon={<Activity />} label="타격 컨디션" value="82%" delta="↑ 8% from last" color="mint" /><Stat icon={<Trophy />} label="리그 순위" value="#04" delta="top 10%" color="peach" /><Stat icon={<CircleDollarSign />} label="구단 자금" value="2,480" delta="+350 this week" color="yellow" /></div>
    <div className="lower-grid"><section className="panel"><div className="panel-heading"><div><span className="eyebrow">예정 경기</span><h3>경기 일정</h3></div><button className="icon-button"><LayoutGrid size={17} /></button></div><MatchRow opponent="코메츠" time="오늘 · 오후 7:30" badge="홈" accent="purple" onClick={() => onNavigate('match')} /><MatchRow opponent="하버 호크스" time="내일 · 오후 6:00" badge="원정" accent="blue" onClick={() => onNotify('스카우팅 리포트를 받았습니다')} /><MatchRow opponent="레드우드 폭스스" time="금 · 오후 7:30" badge="홈" accent="orange" onClick={() => onNotify('경기 프리뷰가 열렸습니다')} /></section><section className="panel activity-panel"><div className="panel-heading"><div><span className="eyebrow">최근 소식</span><h3>클럽하우스 소식</h3></div><button className="text-button">전체 보기 <ArrowRight size={14} /></button></div><FeedItem icon="✦" title="주노 박이 뜨겁습니다" text="최근 2경기 4안타" color="lavender" /><FeedItem icon="✚" title="새로운 목표 달성" text="홈 3승 달성 · 코인 +150" color="mint" /><FeedItem icon="↗" title="마켓 갱신" text="희귀 카드가 새로 입고됨" color="peach" /></section></div>
  </div>
}

function Stat({ icon, label, value, delta, color }: { icon: React.ReactNode; label: string; value: string; delta: string; color: string }) { return <div className="stat-card"><div className={`stat-icon ${color}`}>{icon}</div><span>{label}</span><strong>{value}</strong><small>{delta}</small></div> }
function MatchRow({ opponent, time, badge, accent, onClick }: { opponent: string; time: string; badge: string; accent: string; onClick: () => void }) { return <button className="match-row" onClick={onClick}><div className={`opponent-mark ${accent}`}>✦</div><div className="match-info"><strong>파이어플라이 <span>vs</span> {opponent}</strong><small>{time}</small></div><span className="home-badge">{badge}</span><ChevronRight size={17} /></button> }
function FeedItem({ icon, title, text, color }: { icon: string; title: string; text: string; color: string }) { return <div className="feed-item"><span className={`feed-icon ${color}`}>{icon}</span><div><strong>{title}</strong><small>{text}</small></div><span className="feed-time">2h</span></div> }

function Roster({ lineup, setLineup, onNotify }: { lineup: Player[]; setLineup: (p: Player[]) => void; onNotify: (s: string) => void }) {
  const [tab, setTab] = useState<'lineup' | 'all'>('lineup')
  const swap = (index: number) => { if (index === 0) return; const copy = [...lineup]; [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]]; setLineup(copy); onNotify(`${copy[index - 1].name} moved up in the order`) }
  return <div className="page"><div className="page-heading"><div><p className="eyebrow">CLUBHOUSE · 26 PLAYERS</p><h1>선수단·라인업</h1><p className="subhead">그라운드에 설 선수단을 구성하세요.</p></div><button className="primary-button" onClick={() => onNotify('Lineup saved and ready for game day')}><ClipboardList size={16} /> 라인업 저장</button></div><div className="roster-banner"><div><span className="tag warm">현재 라인업</span><h2>파이어플라이 starting nine</h2><p>??? ???, ?? ???? ?? ?? ??????.</p></div><div className="rating-ring"><strong>84</strong><span>OVR</span></div></div><div className="tabs"><button className={tab === 'lineup' ? 'tab active' : 'tab'} onClick={() => setTab('lineup')}>선발 라인업</button><button className={tab === 'all' ? 'tab active' : 'tab'} onClick={() => setTab('all')}>전체 선수 <span>26</span></button></div><div className="roster-layout"><section className="panel player-list">{(tab === 'lineup' ? lineup : [...lineup, { id: 20, name: '파커 쇼', pos: 'RP', role: 'Relief arm', ovr: 74, form: '안정적', color: '#b8c8ff' }]).map((p, i) => <div className="player-row" key={p.id}><span className="order">{tab === 'lineup' ? `0${i + 1}` : '—'}</span><div className="player-face" style={{ background: p.color }}>{p.name.split(' ').map((n) => n[0]).join('')}</div><div className="player-details"><strong>{p.name}</strong><small>{p.pos} · {p.role}</small></div>  <span className={`form ${p.form === '뜨거움' || p.form === '상승세' ? 'positive' : p.form === '하락세' ? 'negative' : ''}`}>{p.form}</span><strong className="ovr">{p.ovr}</strong>{tab === 'lineup' && <button className="move-button" onClick={() => swap(i)} disabled={i === 0}><RotateCcw size={15} /></button>}</div>)}</section><aside className="panel lineup-insight"><span className="eyebrow">??? ??</span><h3>?? ??, ? ???.</h3><p>Your top four combine for an <b>89 OVR</b> and 31 stolen-base potential. Keep the pressure on early.</p><div className="insight-line"><BarChart3 size={16} /><span>??? ???</span><b>92%</b></div><div className="progress"><i style={{ width: '92%' }} /></div><button className="ghost-button" onClick={() => onNotify('Suggested lineup applied')}>추천 라인업 <Sparkles size={15} /></button></aside></div></div>
}

function Packs({ selectedPack, setSelectedPack, onNotify }: { selectedPack: string | null; setSelectedPack: (s: string | null) => void; onNotify: (s: string) => void }) {
  const packs = [{ name: '???', price: '500', icon: '↗', desc: '???? ??? ?? ???', color: 'peach', cards: '3?' }, { name: '?????', price: '1,200', icon: '✦', desc: '?? ??? ??? ??', color: 'purple', cards: '5 cards · 1 guaranteed rare' }, { name: '?????', price: 'Free', icon: '✚', desc: '??? ?? ??? ??', color: 'mint', cards: '2 cards · daily' }]
  return <div className="page"><div className="page-heading"><div><p className="eyebrow">THE MARKET · 12 AVAILABLE</p><h1>카드 마켓</h1><p className="subhead">Build a deeper club with a little patience and a lot of luck.</p></div><div className="wallet"><CircleDollarSign size={17} /> 2,480 <span>◆</span> 94</div></div><div className="market-note"><Sparkles size={18} /><div><strong>??? ??? ???????</strong><span>?? ?? 6?? ??????. ?? ???? 18:42:09???.</span></div><button className="text-button">?? ?? <ArrowRight size={14} /></button></div><div className="pack-grid">{packs.map((p) => <button className={`pack-card ${selectedPack === p.name ? 'selected' : ''}`} key={p.name} onClick={() => setSelectedPack(p.name)}><div className={`pack-art ${p.color}`}><span>{p.icon}</span><i>DD</i></div><div className="pack-copy"><div className="pack-title"><h3>{p.name}</h3><span className="pack-cards">{p.cards}</span></div><p>{p.desc}</p><div className="pack-buy"><b>{p.price === 'Free' ? p.price : `◉ ${p.price}`}</b><span>{selectedPack === p.name ? 'Selected' : 'ud329 열기'} <ArrowRight size={14} /></span></div></div></button>)}</div>{selectedPack && <div className="opening-panel"><div><span className="eyebrow">?? ?? ??</span><h2>{selectedPack} ? ???</h2><p>?? ??? ??? ???? ?? ????.</p></div><button className="primary-button" onClick={() => { onNotify('Pack opened — 마일로 레이스 joined your collection!'); setSelectedPack(null) }}>ud329 열기 <PackageOpen size={16} /></button></div>}<div className="section-row"><h3>최근 획득 카드</h3><button className="text-button" onClick={() => onNotify('Collection view coming soon')}>컬렉션 보기 <ArrowRight size={14} /></button></div><div className="pulls"><div className="pull-card"><span className="rare">RARE</span><strong>Vera Bloom</strong><small>SP · 79 OVR</small><i>♢</i></div><div className="pull-card gold"><span className="rare">EPIC</span><strong>Hugo Finch</strong><small>CL · 87 OVR</small><i>✦</i></div><div className="pull-card mint-card"><span className="rare">UNCOMMON</span><strong>Team spark</strong><small>????? boost</small><i>✚</i></div></div></div>
}

function Match({ inning, score, feed, playAtBat, swing, pitching, pitchProgress, atBatResult, onNotify }: { inning: number; score: { home: number; away: number }; feed: string[]; playAtBat: () => void; swing: () => void; pitching: boolean; pitchProgress: number; atBatResult: string; onNotify: (s: string) => void }) {
  return <div className="page match-page"><div className="page-heading"><div><p className="eyebrow">MATCH ROOM · REGULAR SEASON</p><h1>파이어플라이 <span className="versus">vs</span> 코메츠</h1><p className="subhead">????? Park · Clear skies · 72°F</p></div><span className="live-pill"><i /> 실시간 시뮬레이션</span></div><div className="scoreboard"><div className="team-score"><span className="team-badge firefly">✦</span><div><small>?</small><strong>파이어플라이</strong></div><b>{score.home}</b></div><div className="inning"><span>?</span><strong>{inning}</strong><small>??</small></div><div className="team-score away"><b>{score.away}</b><div><small>??</small><strong>코메츠</strong></div><span className="team-badge comet">☄</span></div></div><div className="match-columns"><section className="panel field-panel"><div className="panel-heading"><div><span className="eyebrow">현재 타석</span><h3>마일로 레이스 · 0–1</h3></div><span className="count"><i /><i className="dim" /><i className="dim" /> 1??</span></div>  <div className="diamond"><div className="base b2" /><div className="base b1" /><div className="base b3" /><div className="base home" /><div className="pitch-dot" style={{ left: `${18 + pitchProgress * 0.65}%` }}>⚾</div></div><p className="at-bat-result">{atBatResult}</p><div className="timing-meter"><i className="perfect-zone" /><i className="timing-cursor" style={{ left: `${pitchProgress}%` }} /></div><div className="field-controls"><button className="primary-button" onClick={pitching ? swing : playAtBat}><Play size={16} fill="currentColor" /> {pitching ? '스윙! (Space)' : '투구 시작'}</button><button className="ghost-button" onClick={() => onNotify('작전 보드를 열었습니다')}>작전 설정 <ClipboardList size={15} /></button></div></section><section className="panel play-feed"><div className="panel-heading"><div><span className="eyebrow">플레이 로그</span><h3>경기 로그</h3></div><Activity size={17} /></div>{feed.map((item, i) => <div className={`play-item ${i === 0 ? 'latest' : ''}`} key={`${item}-${i}`}><span className="play-dot" /> <span>{item}</span></div>)}</section></div><div className="match-bottom"><div><span className="eyebrow">승리 확률</span><div className="probability"><strong>64%</strong><span>파이어플라이</span><div className="progress"><i style={{ width: '64%' }} /></div></div></div><div className="match-stats"><span>안타 <b>5</b></span><span>실책 <b>0</b></span><span>투구 수 <b>42</b></span></div></div></div>
}

export default App
