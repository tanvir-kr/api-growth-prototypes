/* ============================================================
   IDEA 2 — GitHub-based onboarding for platform.claude.com
   Flow: signed out → sign in (w/ optional GitHub OAuth) →
         connect GitHub → authorize scopes → pick repo →
         Claude analyzes & opens PR → dashboard w/ PR card
   ============================================================ */

const {useState: useState2, useEffect: useEffect2, useRef: useRef2} = React;

/* ---------- Icons specific to this flow ---------- */
const GitHubMark = ({size=18, color='currentColor'}) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color}><path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
);
const ChevronRight2 = ({size=14}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const ArrowRight2 = ({size=14}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const CheckCircle2 = ({size=16,color='#4ade80'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const LockIcon2 = ({size=14}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
const RepoIcon2 = ({size=15}) => <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"><path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/></svg>;
const StarIcon2 = ({size=12}) => <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/></svg>;
const CircleDot2 = ({size=14,color='#3fb950'}) => <svg width={size} height={size} viewBox="0 0 16 16" fill={color}><circle cx="8" cy="8" r="3.5"/><path fillRule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/></svg>;
const BranchIcon2 = ({size=14}) => <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M9.5 3.25a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zm8.25-.75a.75.75 0 100 1.5.75.75 0 000-1.5z"/></svg>;
const PullRequestIcon2 = ({size=15,color='#3fb950'}) => <svg width={size} height={size} viewBox="0 0 16 16" fill={color}><path fillRule="evenodd" d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z"/></svg>;
const FileIcon2 = ({size=14}) => <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"><path d="M2 1.75C2 .784 2.784 0 3.75 0h5.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0112.25 16h-8.5A1.75 1.75 0 012 14.25V1.75zm1.75-.25a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h8.5a.25.25 0 00.25-.25V6H9.75A1.75 1.75 0 018 4.25V1.5H3.75zm5.75.56v2.19c0 .138.112.25.25.25h2.19L9.5 2.06z"/></svg>;
const PlusIcon2 = ({size=14}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const Sparkle2 = ({size=14,color='#D97757'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/></svg>;
const SettingsIcon2 = ({size=15}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;
const HomeIcon2 = ({size=15}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const KeyIcon2 = ({size=15}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>;
const UsageIcon2 = ({size=15}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>;
const BookIcon2 = ({size=15}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>;
const CreditIcon2 = ({size=15}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
const SpinnerIcon2 = ({size=16}) => <svg width={size} height={size} viewBox="0 0 24 24" style={{animation:'idea2spin 0.8s linear infinite'}}><circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" fill="none"/><path d="M12 3a9 9 0 019 9" stroke="#D97757" strokeWidth="2.5" strokeLinecap="round" fill="none"/></svg>;

/* ---------- CTA copy variants ---------- */
const CTA_COPY = {
  A: {
    eyebrow: 'Get started',
    title: 'Build with Claude in minutes',
    sub: 'Connect a GitHub repo and Claude will open a pull request wiring up the API—no boilerplate to write.',
    primary: 'Connect GitHub',
    secondary: 'I just want an API key'
  },
  B: {
    eyebrow: 'Welcome to the Claude platform',
    title: 'Your first API call,\nfrom your own codebase',
    sub: 'Point Claude at any repo. We’ll detect what you’re building and open a PR that ships the integration.',
    primary: 'Start with a GitHub repo',
    secondary: 'Skip — set up manually'
  },
  C: {
    eyebrow: 'One step to your first API call',
    title: 'Skip the setup. Ship the integration.',
    sub: 'Connect GitHub, pick a repo, review the PR. Claude handles the SDK install, the API call, and the env wiring.',
    primary: 'Connect GitHub to begin',
    secondary: 'Generate a key manually'
  }
};

/* ---------- Fake repo data ---------- */
const FAKE_REPOS = [
  {name:'support-bot', owner:'tanvir-k', desc:'Next.js customer support chat for our Shopify store', lang:'TypeScript', langColor:'#3178c6', stars:12, updated:'2 hours ago', visibility:'Private', match:true, detected:{framework:'Next.js 14', manifest:'package.json', useCase:'Basic support chat'}},
  {name:'internal-wiki', owner:'tanvir-k', desc:'Notion-style knowledge base for our ops team', lang:'TypeScript', langColor:'#3178c6', stars:3, updated:'yesterday', visibility:'Private'},
  {name:'next-dashboard', owner:'tanvir-k', desc:'Analytics dashboard — Next.js + Recharts', lang:'TypeScript', langColor:'#3178c6', stars:48, updated:'3 days ago', visibility:'Public'},
  {name:'scrape-runner', owner:'tanvir-k', desc:'Nightly job scraper, writes to Postgres', lang:'Python', langColor:'#3572A5', stars:0, updated:'last week', visibility:'Private'},
  {name:'portfolio-site', owner:'tanvir-k', desc:'Personal site — Astro + Tailwind', lang:'Astro', langColor:'#ff5d01', stars:2, updated:'2 weeks ago', visibility:'Public'},
  {name:'claude-experiments', owner:'tanvir-k', desc:'Weekend hacks with the Claude API', lang:'Python', langColor:'#3572A5', stars:7, updated:'last month', visibility:'Public'},
  {name:'ml-notebooks', owner:'tanvir-k', desc:'Jupyter notebooks for model evals', lang:'Jupyter Notebook', langColor:'#DA5B0B', stars:1, updated:'3 months ago', visibility:'Private'},
];

/* ---------- STEP 1: Post-login CTA (replaces "Buy credits") ---------- */
function Idea2Welcome({copyVariant, onConnectGithub, onSkip}){
  const copy = CTA_COPY[copyVariant] || CTA_COPY.A;
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',padding:'48px 48px 80px',background:'radial-gradient(ellipse at top, rgba(217,119,87,0.04), transparent 60%), #191919',overflow:'auto'}}>
      <div style={{width:'100%',maxWidth:720,textAlign:'center'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'5px 12px',borderRadius:999,background:'rgba(217,119,87,0.1)',border:'1px solid rgba(217,119,87,0.2)',color:'#D97757',fontSize:11,fontWeight:500,letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:24}}>
          <Sparkle2 size={11}/> {copy.eyebrow}
        </div>
        <h1 style={{fontFamily:'var(--font-serif)',fontSize:48,fontWeight:500,letterSpacing:'-1.2px',color:'#fff',margin:'0 0 16px',lineHeight:1.05,whiteSpace:'pre-line'}}>{copy.title}</h1>
        <p style={{fontSize:17,color:'rgba(255,255,255,0.6)',margin:'0 auto 40px',lineHeight:1.5,maxWidth:540}}>{copy.sub}</p>

        {/* Primary dual-CTA */}
        <div style={{display:'flex',gap:12,justifyContent:'center',alignItems:'center',flexWrap:'wrap'}}>
          <button onClick={onConnectGithub} style={{display:'inline-flex',alignItems:'center',gap:10,padding:'14px 22px',borderRadius:12,background:'#D97757',color:'#fff',fontSize:15,fontWeight:500,border:'none',cursor:'pointer',fontFamily:'var(--font-sans)',boxShadow:'0 6px 20px rgba(217,119,87,0.3)'}}>
            <GitHubMark size={16} color="#fff"/> {copy.primary} <ArrowRight2 size={14}/>
          </button>
          <button onClick={onSkip} style={{padding:'14px 20px',borderRadius:12,background:'transparent',color:'rgba(255,255,255,0.6)',fontSize:14,fontWeight:500,border:'1px solid rgba(255,255,255,0.1)',cursor:'pointer',fontFamily:'var(--font-sans)'}}>{copy.secondary}</button>
        </div>

        {/* How it works visual */}
        <div style={{marginTop:64,padding:'28px 32px',borderRadius:16,background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)',display:'grid',gridTemplateColumns:'1fr auto 1fr auto 1fr',gap:20,alignItems:'center',textAlign:'left'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:8,fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:8,letterSpacing:'0.05em',textTransform:'uppercase',fontWeight:500}}>Step 1</div>
            <div style={{fontSize:14,color:'#fff',fontWeight:500,marginBottom:4}}>Authorize GitHub</div>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',lineHeight:1.5}}>Read repo, create branch, open PR.</div>
          </div>
          <ArrowRight2 size={14}/>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:8,fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:8,letterSpacing:'0.05em',textTransform:'uppercase',fontWeight:500}}>Step 2</div>
            <div style={{fontSize:14,color:'#fff',fontWeight:500,marginBottom:4}}>Pick a repo</div>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',lineHeight:1.5}}>Claude detects framework + use case.</div>
          </div>
          <ArrowRight2 size={14}/>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:8,fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:8,letterSpacing:'0.05em',textTransform:'uppercase',fontWeight:500}}>Step 3</div>
            <div style={{fontSize:14,color:'#fff',fontWeight:500,marginBottom:4}}>Review the PR</div>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',lineHeight:1.5}}>Merge when it looks right.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- STEP 3: GitHub authorization screen (GitHub-styled) ---------- */
function Idea2GithubAuth({onAuthorize, onCancel}){
  return (
    <div style={{height:'100%',background:'#010409',overflowY:'auto',fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'}}>
      {/* GH topbar */}
      <div style={{height:62,background:'#010409',borderBottom:'1px solid #30363d',display:'flex',alignItems:'center',padding:'0 32px',gap:16}}>
        <GitHubMark size={28} color="#fff"/>
        <span style={{color:'#7d8590',fontSize:13,marginLeft:'auto'}}>Signed in as <span style={{color:'#fff',fontWeight:500}}>tanvir-k</span></span>
      </div>

      <div style={{maxWidth:540,margin:'48px auto',padding:'0 24px'}}>
        {/* Header w/ avatars */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:20,marginBottom:24}}>
          <div style={{width:56,height:56,borderRadius:8,background:'#D97757',display:'grid',placeItems:'center'}}>
            <AnthropicSymbol size={26} color="#fff"/>
          </div>
          <div style={{display:'flex',gap:4,alignItems:'center',color:'#7d8590'}}>
            <div style={{width:8,height:8,borderRadius:'50%',background:'#7d8590'}}/>
            <div style={{width:24,height:1,background:'#7d8590'}}/>
            <div style={{width:8,height:8,borderRadius:'50%',background:'#7d8590'}}/>
          </div>
          <div style={{width:56,height:56,borderRadius:8,background:'#24292f',display:'grid',placeItems:'center'}}>
            <GitHubMark size={30} color="#fff"/>
          </div>
        </div>

        <h1 style={{fontSize:24,fontWeight:400,color:'#f0f6fc',textAlign:'center',margin:'0 0 8px'}}>Authorize <strong style={{fontWeight:600}}>Anthropic</strong></h1>
        <p style={{fontSize:14,color:'#7d8590',textAlign:'center',margin:'0 0 28px'}}>Anthropic (Claude Platform) by <span style={{color:'#4493f8'}}>anthropics</span> wants to access your <span style={{color:'#f0f6fc',fontWeight:500}}>tanvir-k</span> account.</p>

        <div style={{border:'1px solid #30363d',borderRadius:6,background:'#0d1117',overflow:'hidden'}}>
          {[
            ['Repository contents','Read code, metadata, and file contents in selected repositories.','Read'],
            ['Pull requests','Create branches, commit files, and open pull requests.','Write'],
            ['Metadata','Read repository metadata (language, topics, visibility).','Read'],
            ['Account email','See your primary verified email address.','Read']
          ].map(([t,d,scope],i)=>(
            <div key={t} style={{padding:'16px 20px',borderBottom:i<3?'1px solid #30363d':'none',display:'flex',alignItems:'flex-start',gap:14}}>
              <CheckCircle2 size={16} color="#3fb950"/>
              <div style={{flex:1}}>
                <div style={{fontSize:14,color:'#f0f6fc',fontWeight:500,marginBottom:2}}>{t} <span style={{fontSize:11,fontWeight:400,color:scope==='Write'?'#d29922':'#7d8590',background:scope==='Write'?'rgba(210,153,34,0.15)':'rgba(125,133,144,0.15)',padding:'1px 6px',borderRadius:10,marginLeft:4}}>{scope}</span></div>
                <div style={{fontSize:13,color:'#7d8590',lineHeight:1.5}}>{d}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{marginTop:16,padding:'12px 16px',background:'rgba(65,132,243,0.1)',border:'1px solid rgba(65,132,243,0.3)',borderRadius:6,fontSize:13,color:'#7d8590',display:'flex',gap:10,alignItems:'flex-start'}}>
          <LockIcon2 size={14}/>
          <div>You’ll pick which repositories Anthropic can access on the next step. You can change or revoke this anytime in <span style={{color:'#4493f8'}}>GitHub Settings</span>.</div>
        </div>

        <div style={{marginTop:24,display:'flex',gap:10}}>
          <button onClick={onCancel} style={{flex:1,padding:'10px 16px',borderRadius:6,background:'#21262d',color:'#f0f6fc',fontSize:14,fontWeight:500,border:'1px solid #30363d',cursor:'pointer'}}>Cancel</button>
          <button onClick={onAuthorize} style={{flex:2,padding:'10px 16px',borderRadius:6,background:'#238636',color:'#fff',fontSize:14,fontWeight:500,border:'1px solid rgba(240,246,252,0.1)',cursor:'pointer'}}>Authorize Anthropic</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Shared console chrome ---------- */
function ConsoleChrome({stepLabel, children, tweaks}){
  const navItems=[{icon:HomeIcon2,label:'Home',active:true},{icon:BookIcon2,label:'Workbench'},{icon:KeyIcon2,label:'API keys'},{icon:UsageIcon2,label:'Usage'},{icon:CreditIcon2,label:'Billing'},{icon:SettingsIcon2,label:'Settings'}];
  return (
    <div style={{display:'grid',gridTemplateColumns:'240px 1fr',gridTemplateRows:'52px 1fr',height:'100%',background:'#191919',fontFamily:'var(--font-sans)',color:'#fff'}}>
      <header style={{gridColumn:'1/-1',display:'flex',alignItems:'center',padding:'0 20px',borderBottom:'1px solid rgba(255,255,255,0.06)',background:'#1e1e1c',gap:14}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <AnthropicSymbol size={16} color="#D97757"/>
          <span style={{fontSize:14,fontWeight:600,letterSpacing:'-0.2px'}}>Claude Platform</span>
          <span style={{fontSize:13,color:'rgba(255,255,255,0.3)',margin:'0 2px'}}>/</span>
          <span style={{fontSize:13,color:'rgba(255,255,255,0.7)'}}>Tanvir’s workspace</span>
          <ChevronDown size={12}/>
        </div>
        <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:14}}>
          <button style={{padding:'5px 10px',fontSize:12,color:'rgba(255,255,255,0.6)',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:6,cursor:'pointer',fontFamily:'var(--font-sans)',display:'flex',alignItems:'center',gap:6}}><BookIcon2 size={12}/> Docs</button>
          <div style={{width:28,height:28,borderRadius:'50%',background:'#D97757',display:'grid',placeItems:'center',fontSize:12,fontWeight:600}}>T</div>
        </div>
      </header>

      <aside style={{background:'#1a1a18',borderRight:'1px solid rgba(255,255,255,0.06)',padding:'16px 10px',display:'flex',flexDirection:'column',gap:2}}>
        {navItems.map(({icon:Icon,label,active})=>(
          <button key={label} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',fontSize:13,color:active?'#fff':'rgba(255,255,255,0.55)',background:active?'rgba(255,255,255,0.06)':'transparent',border:'none',borderRadius:7,cursor:'pointer',fontFamily:'var(--font-sans)',textAlign:'left'}}>
            <Icon size={15}/> {label}
          </button>
        ))}
        <div style={{marginTop:'auto',padding:'12px 12px',borderRadius:8,background:'rgba(217,119,87,0.06)',border:'1px solid rgba(217,119,87,0.15)',fontSize:12,color:'rgba(255,255,255,0.7)',lineHeight:1.5}}>
          <div style={{fontSize:11,color:'#D97757',fontWeight:600,letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:6}}>Credit balance</div>
          <div style={{fontSize:18,color:'#fff',fontWeight:500,fontFamily:'var(--font-serif)'}}>$0.00</div>
          <button style={{marginTop:8,width:'100%',padding:'6px 10px',borderRadius:6,background:'rgba(255,255,255,0.06)',color:'#fff',fontSize:12,border:'1px solid rgba(255,255,255,0.1)',cursor:'pointer',fontFamily:'var(--font-sans)'}}>Add credits</button>
        </div>
      </aside>

      <main style={{overflow:'hidden',position:'relative'}}>
        {children}
      </main>
    </div>
  );
}

/* ---------- STEP 4: Pick a repo ---------- */
function Idea2PickRepo({onPick, onBack}){
  const [search,setSearch] = useState2('');
  const [hovered,setHovered] = useState2(null);
  const filtered = FAKE_REPOS.filter(r=>r.name.toLowerCase().includes(search.toLowerCase())||r.desc.toLowerCase().includes(search.toLowerCase()));
  const suggested = FAKE_REPOS.find(r=>r.match);

  return (
    <div style={{height:'100%',overflowY:'auto',padding:'40px 56px'}}>
      <div style={{maxWidth:760,margin:'0 auto'}}>
        <button onClick={onBack} style={{display:'inline-flex',alignItems:'center',gap:6,padding:'4px 8px',marginLeft:-8,marginBottom:20,background:'transparent',border:'none',color:'rgba(255,255,255,0.5)',fontSize:12,cursor:'pointer',fontFamily:'var(--font-sans)'}}>← Back</button>

        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6,fontSize:12,color:'#D97757',fontWeight:500,letterSpacing:'0.05em',textTransform:'uppercase'}}>
          <CheckCircle2 size={14} color="#D97757"/> GitHub connected · tanvir-k
        </div>
        <h1 style={{fontFamily:'var(--font-serif)',fontSize:36,fontWeight:500,letterSpacing:'-0.8px',color:'#fff',margin:'0 0 10px',lineHeight:1.1}}>Which repo should Claude work in?</h1>
        <p style={{fontSize:15,color:'rgba(255,255,255,0.55)',margin:'0 0 28px',lineHeight:1.5}}>Claude will create a new branch, add the integration, and open a PR for you to review. Nothing merges automatically.</p>

        {/* Suggested */}
        {suggested && (
          <div style={{marginBottom:28,padding:20,borderRadius:12,background:'linear-gradient(135deg, rgba(217,119,87,0.08), rgba(217,119,87,0.02))',border:'1px solid rgba(217,119,87,0.25)',position:'relative'}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
              <Sparkle2 size={14}/>
              <span style={{fontSize:11,color:'#D97757',fontWeight:600,letterSpacing:'0.05em',textTransform:'uppercase'}}>Suggested · looks like a good match</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:16}}>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                  <RepoIcon2 size={16}/>
                  <span style={{fontSize:16,fontWeight:600,color:'#fff'}}>{suggested.owner}/<span style={{color:'#D97757'}}>{suggested.name}</span></span>
                  <span style={{fontSize:10,padding:'2px 7px',borderRadius:10,border:'1px solid rgba(255,255,255,0.15)',color:'rgba(255,255,255,0.5)',fontWeight:500}}>{suggested.visibility}</span>
                </div>
                <p style={{fontSize:13,color:'rgba(255,255,255,0.6)',margin:'0 0 12px',lineHeight:1.5}}>{suggested.desc}</p>
                <div style={{display:'flex',gap:16,fontSize:12,color:'rgba(255,255,255,0.45)'}}>
                  <span style={{display:'flex',alignItems:'center',gap:5}}><span style={{width:10,height:10,borderRadius:'50%',background:suggested.langColor}}/>{suggested.lang}</span>
                  <span style={{display:'flex',alignItems:'center',gap:4}}><StarIcon2 size={11}/>{suggested.stars}</span>
                  <span>Updated {suggested.updated}</span>
                </div>
                <div style={{marginTop:14,padding:'10px 12px',background:'rgba(0,0,0,0.25)',borderRadius:8,fontSize:12,color:'rgba(255,255,255,0.6)',display:'grid',gridTemplateColumns:'auto 1fr',gap:'6px 14px'}}>
                  <span style={{color:'rgba(255,255,255,0.4)'}}>Detected</span><span style={{color:'#fff'}}>{suggested.detected.framework}</span>
                  <span style={{color:'rgba(255,255,255,0.4)'}}>Manifest</span><span style={{fontFamily:'var(--font-mono)',fontSize:11}}>{suggested.detected.manifest}</span>
                  <span style={{color:'rgba(255,255,255,0.4)'}}>Use case</span><span style={{color:'#fff'}}>{suggested.detected.useCase}</span>
                </div>
              </div>
              <button onClick={()=>onPick(suggested)} style={{padding:'10px 16px',borderRadius:10,background:'#D97757',color:'#fff',fontSize:14,fontWeight:500,border:'none',cursor:'pointer',fontFamily:'var(--font-sans)',display:'flex',alignItems:'center',gap:8,whiteSpace:'nowrap',flexShrink:0,marginTop:4}}>
                Use this repo <ArrowRight2 size={14}/>
              </button>
            </div>
          </div>
        )}

        {/* Search */}
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderRadius:10,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',marginBottom:12}}>
          <SearchIcon size={14}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search your repositories..." style={{flex:1,background:'transparent',border:'none',color:'#fff',fontSize:14,fontFamily:'var(--font-sans)',outline:'none'}}/>
          <span style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>{filtered.length} of {FAKE_REPOS.length}</span>
        </div>

        {/* Repo list */}
        <div style={{borderRadius:10,border:'1px solid rgba(255,255,255,0.06)',overflow:'hidden'}}>
          {filtered.map((r,i)=>(
            <div key={r.name} onClick={()=>onPick(r)} onMouseEnter={()=>setHovered(r.name)} onMouseLeave={()=>setHovered(null)}
              style={{display:'flex',alignItems:'center',gap:14,padding:'14px 16px',borderBottom:i<filtered.length-1?'1px solid rgba(255,255,255,0.04)':'none',background:hovered===r.name?'rgba(255,255,255,0.03)':'transparent',cursor:'pointer',transition:'background 120ms'}}>
              <RepoIcon2 size={15}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:2}}>
                  <span style={{fontSize:14,fontWeight:500,color:'#fff'}}>{r.owner}/<span>{r.name}</span></span>
                  <span style={{fontSize:10,padding:'1px 7px',borderRadius:10,border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.45)'}}>{r.visibility}</span>
                </div>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.45)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{r.desc}</div>
              </div>
              <div style={{display:'flex',gap:14,fontSize:11,color:'rgba(255,255,255,0.4)',flexShrink:0}}>
                <span style={{display:'flex',alignItems:'center',gap:4}}><span style={{width:8,height:8,borderRadius:'50%',background:r.langColor}}/>{r.lang}</span>
                <span>{r.updated}</span>
              </div>
              <ChevronRight2 size={14}/>
            </div>
          ))}
        </div>

        <div style={{marginTop:16,display:'flex',alignItems:'center',gap:8,fontSize:12,color:'rgba(255,255,255,0.4)'}}>
          <PlusIcon2 size={12}/>
          <span>Don’t see your repo? <span style={{color:'#61AAF2',cursor:'pointer'}}>Configure GitHub access →</span></span>
        </div>
      </div>
    </div>
  );
}

/* ---------- STEP 5: Analyzing / Generating ---------- */
function Idea2Analyzing({repo, prStretch, onDone}){
  const steps = prStretch ? [
    'Cloning ' + repo.owner + '/' + repo.name,
    'Reading package.json and scanning imports',
    'Detected Next.js 14 · TypeScript',
    'Matching to quickstart: basic support chat',
    'Creating branch claude/add-support-chat',
    'Writing app/api/chat/route.ts',
    'Writing components/SupportChat.tsx',
    'Installing @anthropic-ai/sdk',
    'Adding ANTHROPIC_API_KEY to .env.example',
    'Opening pull request'
  ] : [
    'Cloning ' + repo.owner + '/' + repo.name,
    'Reading package.json and scanning imports',
    'Detected Next.js 14 · TypeScript',
    'Generating setup instructions',
    'Preparing your workspace'
  ];
  const [done,setDone] = useState2(0);
  useEffect2(()=>{
    if(done>=steps.length){ const t = setTimeout(onDone, 600); return ()=>clearTimeout(t); }
    const t = setTimeout(()=>setDone(d=>d+1), done===0?400:420 + Math.random()*200);
    return ()=>clearTimeout(t);
  },[done]);

  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',padding:48}}>
      <div style={{width:'100%',maxWidth:520}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
          <div style={{width:40,height:40,borderRadius:10,background:'rgba(217,119,87,0.12)',border:'1px solid rgba(217,119,87,0.3)',display:'grid',placeItems:'center'}}>
            <SpinnerIcon2 size={18}/>
          </div>
          <div>
            <div style={{fontSize:12,color:'#D97757',fontWeight:500,letterSpacing:'0.05em',textTransform:'uppercase'}}>Working</div>
            <div style={{fontSize:15,color:'#fff',fontWeight:500}}>Claude is {prStretch?'building your integration':'analyzing your repo'}</div>
          </div>
        </div>

        <div style={{padding:'20px 24px',borderRadius:12,background:'rgba(0,0,0,0.3)',border:'1px solid rgba(255,255,255,0.06)',fontFamily:'var(--font-mono)',fontSize:13}}>
          {steps.map((s,i)=>{
            const state = i < done ? 'done' : i === done ? 'active' : 'pending';
            return (
              <div key={s} style={{display:'flex',alignItems:'center',gap:10,opacity:state==='pending'?0.3:1,transition:'opacity 200ms',minHeight:26,lineHeight:1.4}}>
                <span style={{width:14,height:14,display:'inline-flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  {state==='done' && <CheckCircle2 size={12} color="#4ade80"/>}
                  {state==='active' && <SpinnerIcon2 size={12}/>}
                  {state==='pending' && <span style={{width:8,height:8,borderRadius:'50%',border:'1px solid rgba(255,255,255,0.2)'}}/>}
                </span>
                <span style={{color:state==='done'?'rgba(255,255,255,0.7)':state==='active'?'#fff':'rgba(255,255,255,0.4)'}}>{s}</span>
              </div>
            );
          })}
        </div>

        <p style={{fontSize:12,color:'rgba(255,255,255,0.4)',textAlign:'center',marginTop:20,lineHeight:1.5}}>This usually takes about 30 seconds. You can step away — we’ll email you when it’s ready.</p>
      </div>
    </div>
  );
}

/* ---------- STEP 6: Dashboard w/ PR card ---------- */
function Idea2Dashboard({repo, prStretch, apiKey, onViewPR}){
  return (
    <div style={{height:'100%',overflowY:'auto',padding:'32px 40px'}}>
      <div style={{maxWidth:920,margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',marginBottom:28}}>
          <div>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:4,letterSpacing:'0.05em',textTransform:'uppercase',fontWeight:500}}>Home</div>
            <h1 style={{fontFamily:'var(--font-serif)',fontSize:34,fontWeight:500,letterSpacing:'-0.7px',color:'#fff',margin:0}}>Welcome, Tanvir</h1>
          </div>
          <button style={{padding:'9px 14px',borderRadius:8,background:'rgba(255,255,255,0.06)',color:'#fff',fontSize:13,fontWeight:500,border:'1px solid rgba(255,255,255,0.1)',cursor:'pointer',fontFamily:'var(--font-sans)',display:'flex',alignItems:'center',gap:7}}>
            <PlusIcon2 size={13}/> New project
          </button>
        </div>

        {prStretch && (
          <div style={{marginBottom:24,borderRadius:14,background:'linear-gradient(135deg, rgba(217,119,87,0.08), rgba(217,119,87,0.02))',border:'1px solid rgba(217,119,87,0.25)',overflow:'hidden'}}>
            <div style={{padding:'18px 22px',borderBottom:'1px solid rgba(217,119,87,0.15)',display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:34,height:34,borderRadius:8,background:'rgba(63,185,80,0.12)',display:'grid',placeItems:'center',border:'1px solid rgba(63,185,80,0.3)'}}>
                <PullRequestIcon2 size={17}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,color:'#D97757',fontWeight:600,letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:2}}>Claude opened a pull request</div>
                <div style={{fontSize:15,color:'#fff',fontWeight:500}}>Add Claude-powered support chat</div>
              </div>
              <button onClick={onViewPR} style={{padding:'8px 14px',borderRadius:8,background:'#D97757',color:'#fff',fontSize:13,fontWeight:500,border:'none',cursor:'pointer',fontFamily:'var(--font-sans)',display:'flex',alignItems:'center',gap:7}}>
                <GitHubMark size={13} color="#fff"/> View PR on GitHub
              </button>
            </div>
            <div style={{padding:'18px 22px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px 32px'}}>
              <div>
                <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',fontWeight:500,letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:8}}>Repository</div>
                <div style={{display:'flex',alignItems:'center',gap:8,fontSize:14,color:'#fff'}}>
                  <RepoIcon2 size={14}/>{repo.owner}/<span style={{color:'#D97757',fontWeight:500}}>{repo.name}</span>
                </div>
              </div>
              <div>
                <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',fontWeight:500,letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:8}}>Branch</div>
                <div style={{display:'flex',alignItems:'center',gap:8,fontSize:14,color:'#fff',fontFamily:'var(--font-mono)'}}>
                  <BranchIcon2 size={14}/>claude/add-support-chat
                </div>
              </div>
              <div style={{gridColumn:'1/-1'}}>
                <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',fontWeight:500,letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:8}}>What’s in this PR</div>
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  {[
                    ['app/api/chat/route.ts','new','+42'],
                    ['components/SupportChat.tsx','new','+128'],
                    ['package.json','modified','+3 −1'],
                    ['.env.example','modified','+2']
                  ].map(([f,tag,diff])=>(
                    <div key={f} style={{display:'flex',alignItems:'center',gap:10,padding:'6px 10px',borderRadius:6,background:'rgba(0,0,0,0.2)',fontSize:13}}>
                      <FileIcon2 size={13}/>
                      <span style={{fontFamily:'var(--font-mono)',color:'#fff',flex:1}}>{f}</span>
                      <span style={{fontSize:10,padding:'2px 7px',borderRadius:4,background:tag==='new'?'rgba(63,185,80,0.15)':'rgba(210,153,34,0.15)',color:tag==='new'?'#4ade80':'#facc15',fontWeight:500,letterSpacing:'0.02em',textTransform:'uppercase'}}>{tag}</span>
                      <span style={{color:'#4ade80',fontFamily:'var(--font-mono)',fontSize:12,minWidth:60,textAlign:'right'}}>{diff}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Getting started grid */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:28}}>
          {/* API key */}
          <div style={{padding:'20px 22px',borderRadius:12,background:'#1e1e1c',border:'1px solid rgba(255,255,255,0.06)'}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
              <CheckCircle2 size={14}/>
              <span style={{fontSize:11,color:'#4ade80',fontWeight:600,letterSpacing:'0.05em',textTransform:'uppercase'}}>Ready</span>
            </div>
            <h3 style={{fontSize:15,fontWeight:500,color:'#fff',margin:'0 0 6px'}}>API key generated</h3>
            <p style={{fontSize:13,color:'rgba(255,255,255,0.5)',margin:'0 0 14px',lineHeight:1.5}}>Already added to your {repo.name} environment as <code style={{fontFamily:'var(--font-mono)',fontSize:12,color:'#D97757'}}>ANTHROPIC_API_KEY</code>.</p>
            <div style={{display:'flex',alignItems:'center',gap:8,padding:'8px 12px',background:'rgba(0,0,0,0.3)',borderRadius:8,fontFamily:'var(--font-mono)',fontSize:12,color:'rgba(255,255,255,0.7)'}}>
              <KeyIcon2 size={12}/> <span style={{flex:1}}>sk-ant-••••••••••••{apiKey.slice(-4)}</span>
              <CopyIcon size={12}/>
            </div>
          </div>

          {/* Credits */}
          <div style={{padding:'20px 22px',borderRadius:12,background:'#1e1e1c',border:'1px solid rgba(255,255,255,0.06)'}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:'#facc15'}}/>
              <span style={{fontSize:11,color:'#facc15',fontWeight:600,letterSpacing:'0.05em',textTransform:'uppercase'}}>Next step</span>
            </div>
            <h3 style={{fontSize:15,fontWeight:500,color:'#fff',margin:'0 0 6px'}}>Add credits to go live</h3>
            <p style={{fontSize:13,color:'rgba(255,255,255,0.5)',margin:'0 0 14px',lineHeight:1.5}}>Your PR runs once you fund your workspace. Start with $5 in free trial credits.</p>
            <button style={{padding:'9px 14px',borderRadius:8,background:'rgba(255,255,255,0.08)',color:'#fff',fontSize:13,fontWeight:500,border:'1px solid rgba(255,255,255,0.1)',cursor:'pointer',fontFamily:'var(--font-sans)',display:'inline-flex',alignItems:'center',gap:7}}>
              <CreditIcon2 size={13}/> Add credits
            </button>
          </div>
        </div>

        {/* Next steps */}
        <div style={{padding:'22px 24px',borderRadius:12,background:'#1e1e1c',border:'1px solid rgba(255,255,255,0.06)'}}>
          <h3 style={{fontSize:14,fontWeight:500,color:'rgba(255,255,255,0.9)',margin:'0 0 16px'}}>Explore Claude</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
            {[
              ['Workbench','Try prompts against the models in a playground.',BookIcon2],
              ['Usage dashboard','See requests and token usage in real time.',UsageIcon2],
              ['API reference','Full docs for Messages, Tools, Files, and more.',KeyIcon2]
            ].map(([t,d,Icon])=>(
              <div key={t} style={{padding:'14px 16px',borderRadius:10,background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.04)',cursor:'pointer'}}>
                <Icon size={15}/>
                <div style={{fontSize:13,fontWeight:500,color:'#fff',margin:'8px 0 3px'}}>{t}</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',lineHeight:1.5}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Main Idea 2 App w/ stepper ---------- */
const IDEA2_TWEAK_DEFAULTS = /*IDEA2MODE-BEGIN*/{
  "prStretch": true,
  "copyVariant": "A"
}/*IDEA2MODE-END*/;

function Idea2App({tweaks, setTweak, showTweaks}){
  const [step,setStep] = useState2(()=>{
    const s = localStorage.getItem('idea2_step');
    return (s && s!=='signin') ? s : 'welcome';
  });
  const [repo,setRepo] = useState2(null);
  useEffect2(()=>{localStorage.setItem('idea2_step',step);},[step]);

  const apiKey = 'sk-ant-api03-xR9a7';

  return (
    <div style={{height:'100%',position:'relative'}}>
      <style>{`@keyframes idea2spin{to{transform:rotate(360deg)}}`}</style>

      {step==='welcome' && <ConsoleChrome><Idea2Welcome copyVariant={tweaks.copyVariant} onConnectGithub={()=>setStep('ghauth')} onSkip={()=>{}}/></ConsoleChrome>}
      {step==='ghauth' && <Idea2GithubAuth onAuthorize={()=>setStep('pickrepo')} onCancel={()=>setStep('welcome')}/>}
      {step==='pickrepo' && <ConsoleChrome><Idea2PickRepo onPick={(r)=>{setRepo(r);setStep('analyzing');}} onBack={()=>setStep('welcome')}/></ConsoleChrome>}
      {step==='analyzing' && repo && <ConsoleChrome><Idea2Analyzing repo={repo} prStretch={tweaks.prStretch} onDone={()=>setStep('dashboard')}/></ConsoleChrome>}
      {step==='dashboard' && repo && <ConsoleChrome><Idea2Dashboard repo={repo} prStretch={tweaks.prStretch} apiKey={apiKey} onViewPR={()=>{}}/></ConsoleChrome>}

      {/* Step jumper (always visible, small pill bottom-left) */}
      <div style={{position:'absolute',bottom:16,left:16,display:'flex',alignItems:'center',gap:6,padding:'6px 10px',borderRadius:999,background:'rgba(30,30,28,0.9)',border:'1px solid rgba(255,255,255,0.06)',backdropFilter:'blur(8px)',fontFamily:'var(--font-sans)',zIndex:50}}>
        <span style={{fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:'0.05em',textTransform:'uppercase',fontWeight:500,marginRight:4}}>Jump to</span>
        {[['welcome','1'],['ghauth','2'],['pickrepo','3'],['analyzing','4'],['dashboard','5']].map(([s,n])=>(
          <button key={s} onClick={()=>{if(s==='analyzing'||s==='dashboard')setRepo(FAKE_REPOS[0]);setStep(s);}} style={{width:22,height:22,borderRadius:'50%',background:step===s?'#D97757':'rgba(255,255,255,0.05)',color:step===s?'#fff':'rgba(255,255,255,0.5)',fontSize:11,fontWeight:500,border:'none',cursor:'pointer',fontFamily:'var(--font-sans)'}}>{n}</button>
        ))}
        <button onClick={()=>{localStorage.removeItem('idea2_step');setStep('welcome');setRepo(null);}} style={{marginLeft:4,padding:'4px 8px',borderRadius:12,background:'transparent',color:'rgba(255,255,255,0.4)',fontSize:10,border:'1px solid rgba(255,255,255,0.08)',cursor:'pointer',fontFamily:'var(--font-sans)'}}>Restart</button>
      </div>

      {showTweaks && (
        <div className="tweaks-panel">
          <h3>Tweaks · Idea 2</h3>
          <div className="divider"/>
          <div className="toggle-row"><span>Stretch: Claude opens a PR</span><button className={'toggle'+(tweaks.prStretch?' on':'')} onClick={()=>setTweak('prStretch',!tweaks.prStretch)}/></div>
          <div className="divider"/>
          <div style={{fontSize:11,color:'rgba(255,255,255,0.35)',fontWeight:500,textTransform:'uppercase',letterSpacing:'0.05em',padding:'0 8px'}}>CTA Copy</div>
          {[['A','Direct — "Build with Claude in minutes"'],['B','Developer — "Your first API call, from your own codebase"'],['C','Action — "Skip the setup. Ship the integration."']].map(([v,label])=>(
            <label key={v} className={tweaks.copyVariant===v?'active':''}>
              <input type="radio" name="idea2copy" checked={tweaks.copyVariant===v} onChange={()=>setTweak('copyVariant',v)}/><span><strong>{v}.</strong> {label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

Object.assign(window, {Idea2App, IDEA2_TWEAK_DEFAULTS, ConsoleChrome, Idea2Icons:{GitHubMark, ArrowRight2, ChevronRight2, CheckCircle2, LockIcon2, RepoIcon2, StarIcon2, BranchIcon2, PullRequestIcon2, FileIcon2, PlusIcon2, Sparkle2, SpinnerIcon2, KeyIcon2, CreditIcon2, BookIcon2, UsageIcon2}});
