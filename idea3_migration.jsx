/* ============================================================
   IDEA 3 — OpenAI → Claude migration wizard
   Flow: Welcome → Pick repo → Scanning → Review PR + recs → Done
   ============================================================ */

const {useState: useState3, useEffect: useEffect3} = React;

/* OpenAI repos — different dataset than Idea 2 */
const OAI_REPOS = [
  {name:'support-copilot', owner:'acme-eng', desc:'Customer support agent built on OpenAI function calling', lang:'TypeScript', langColor:'#3178c6', updated:'4 hours ago', visibility:'Private', match:true, detected:{sdk:'openai@4.52.0', calls:47, tools:8, models:'gpt-4o, gpt-4o-mini', framework:'Next.js 14'}},
  {name:'rag-pipeline', owner:'acme-eng', desc:'Document Q&A with embeddings + RAG', lang:'Python', langColor:'#3572A5', updated:'yesterday', visibility:'Private'},
  {name:'prompt-gateway', owner:'acme-eng', desc:'Internal LLM proxy with logging and rate limits', lang:'TypeScript', langColor:'#3178c6', updated:'3 days ago', visibility:'Private'},
  {name:'content-writer', owner:'acme-eng', desc:'Marketing content generation w/ GPT-4o', lang:'Python', langColor:'#3572A5', updated:'last week', visibility:'Private'},
  {name:'ops-bot', owner:'acme-eng', desc:'Slack bot for on-call triage', lang:'TypeScript', langColor:'#3178c6', updated:'2 weeks ago', visibility:'Private'},
];

/* ---------- Other-provider interest-signal form ---------- */
function Idea3OtherProviderCTA(){
  const I = window.Idea2Icons;
  const [expanded,setExpanded] = useState3(false);
  const [provider,setProvider] = useState3('');
  const [email,setEmail] = useState3('');
  const [submitted,setSubmitted] = useState3(false);

  if(submitted){
    return (
      <div style={{padding:'20px 24px',borderRadius:12,background:'rgba(63,185,80,0.06)',border:'1px solid rgba(63,185,80,0.22)',display:'flex',alignItems:'center',gap:14,marginBottom:36}}>
        <div style={{width:36,height:36,borderRadius:9,background:'rgba(63,185,80,0.15)',display:'grid',placeItems:'center',flexShrink:0}}>
          <I.CheckCircle2 size={18} color="#4ade80"/>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:500,color:'#fff',marginBottom:2}}>Thanks — we&rsquo;ll email you when {provider.trim()||'that provider'} is supported</div>
          <div style={{fontSize:12,color:'rgba(255,255,255,0.55)',lineHeight:1.5}}>Your input helps us prioritize which providers to add next.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{padding:'18px 22px',borderRadius:12,background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)',marginBottom:36}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,flexWrap:'wrap'}}>
        <div style={{flex:1,minWidth:240}}>
          <div style={{fontSize:14,fontWeight:500,color:'#fff',marginBottom:3}}>Migrating from another provider?</div>
          <div style={{fontSize:12,color:'rgba(255,255,255,0.55)',lineHeight:1.5}}>Let us know and we&rsquo;ll email you when it&rsquo;s supported.</div>
        </div>
        {!expanded && (
          <button onClick={()=>setExpanded(true)} style={{padding:'8px 14px',borderRadius:8,background:'rgba(217,119,87,0.1)',color:'#D97757',fontSize:13,fontWeight:500,border:'1px solid rgba(217,119,87,0.22)',cursor:'pointer',fontFamily:'var(--font-sans)',whiteSpace:'nowrap'}}>
            Register interest
          </button>
        )}
      </div>
      {expanded && (
        <div style={{marginTop:16,display:'flex',flexDirection:'column',gap:10}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <div>
              <label style={{fontSize:11,color:'rgba(255,255,255,0.5)',fontWeight:500,textTransform:'uppercase',letterSpacing:'0.05em',display:'block',marginBottom:6}}>Provider</label>
              <input value={provider} onChange={e=>setProvider(e.target.value)} placeholder="e.g. Gemini, Cohere, Mistral" style={{width:'100%',padding:'9px 12px',borderRadius:8,background:'rgba(0,0,0,0.25)',border:'1px solid rgba(255,255,255,0.08)',color:'#fff',fontSize:13,fontFamily:'var(--font-sans)',outline:'none'}}/>
            </div>
            <div>
              <label style={{fontSize:11,color:'rgba(255,255,255,0.5)',fontWeight:500,textTransform:'uppercase',letterSpacing:'0.05em',display:'block',marginBottom:6}}>Email <span style={{textTransform:'none',letterSpacing:0,color:'rgba(255,255,255,0.3)',fontWeight:400}}>(optional)</span></label>
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" style={{width:'100%',padding:'9px 12px',borderRadius:8,background:'rgba(0,0,0,0.25)',border:'1px solid rgba(255,255,255,0.08)',color:'#fff',fontSize:13,fontFamily:'var(--font-sans)',outline:'none'}}/>
            </div>
          </div>
          <div style={{display:'flex',gap:8,marginTop:4}}>
            <button onClick={()=>provider.trim()&&setSubmitted(true)} disabled={!provider.trim()} style={{padding:'9px 16px',borderRadius:8,background:provider.trim()?'#D97757':'rgba(255,255,255,0.06)',color:provider.trim()?'#fff':'rgba(255,255,255,0.3)',fontSize:13,fontWeight:500,border:'none',cursor:provider.trim()?'pointer':'not-allowed',fontFamily:'var(--font-sans)'}}>Submit</button>
            <button onClick={()=>setExpanded(false)} style={{padding:'9px 14px',borderRadius:8,background:'transparent',color:'rgba(255,255,255,0.5)',fontSize:13,fontWeight:500,border:'1px solid rgba(255,255,255,0.08)',cursor:'pointer',fontFamily:'var(--font-sans)'}}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- STEP 1: Welcome / CTA ---------- */
function Idea3Welcome({onStart, showCredit, creditAmount}){
  const I = window.Idea2Icons;
  return (
    <div style={{height:'100%',overflowY:'auto',padding:'48px 32px 80px'}}>
      <div style={{maxWidth:880,margin:'0 auto'}}>
        <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:8,letterSpacing:'0.05em',textTransform:'uppercase',fontWeight:500}}>Migration</div>
        <h1 style={{fontFamily:'var(--font-serif)',fontSize:44,fontWeight:500,letterSpacing:'-1px',color:'#fff',margin:'0 0 14px',lineHeight:1.05}}>Move from OpenAI to Claude in one PR</h1>
        <p style={{fontSize:16,color:'rgba(255,255,255,0.6)',margin:'0 0 36px',lineHeight:1.55,maxWidth:640}}>Point us at a repo that uses the OpenAI SDK. We&rsquo;ll open a pull request that swaps in the Claude API and optimizes your project for the Claude platform.</p>

        {/* Big primary card */}
        <div style={{position:'relative',background:'linear-gradient(180deg, #242422, #1c1c1a)',border:'1px solid rgba(217,119,87,0.22)',borderRadius:16,padding:32,overflow:'hidden',marginBottom:20}}>
          <div aria-hidden style={{position:'absolute',top:-80,right:-80,width:300,height:300,borderRadius:'50%',background:'radial-gradient(circle,rgba(217,119,87,0.18),transparent 70%)',pointerEvents:'none'}}/>
          <div style={{position:'relative',display:'flex',gap:28,alignItems:'flex-start',flexWrap:'wrap'}}>
            <div style={{flex:1,minWidth:280}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                <span style={{fontSize:10,background:'rgba(217,119,87,0.18)',color:'#D97757',padding:'3px 8px',borderRadius:4,fontWeight:600,letterSpacing:'0.05em'}}>BETA</span>
                <span style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>~3 min average</span>
              </div>
              <h2 style={{fontFamily:'var(--font-serif)',fontSize:24,fontWeight:500,margin:'0 0 8px',color:'#fff',letterSpacing:'-0.3px'}}>Automated OpenAI migration</h2>
              <p style={{fontSize:14,color:'rgba(255,255,255,0.6)',margin:'0 0 20px',lineHeight:1.5}}>We support chat completions, tool calling, streaming, and structured outputs. Embeddings and audio are coming soon.</p>
              <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
                <button onClick={onStart} style={{display:'inline-flex',alignItems:'center',gap:8,padding:'11px 18px',borderRadius:10,background:'#D97757',color:'#fff',fontSize:14,fontWeight:500,border:'none',cursor:'pointer',fontFamily:'var(--font-sans)',boxShadow:'0 1px 0 rgba(255,255,255,0.1) inset'}}>
                  <I.GitHubMark size={15} color="#fff"/> Start with a GitHub repo <I.ArrowRight2 size={13}/>
                </button>
                {showCredit && (
                  <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'8px 12px',borderRadius:10,background:'rgba(63,185,80,0.08)',border:'1px solid rgba(63,185,80,0.25)',fontSize:12,color:'#4ade80'}}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.39 7.36H22l-6.2 4.51 2.39 7.36L12 16.72l-6.19 4.51 2.39-7.36L2 9.36h7.61z"/></svg>
                    <span><strong style={{color:'#fff'}}>${creditAmount}</strong> in free credits after merge</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Other-provider interest signal */}
        <Idea3OtherProviderCTA/>

        {/* Quiet secondary */}
        <div style={{display:'flex',gap:8,alignItems:'center',fontSize:12,color:'rgba(255,255,255,0.5)'}}>
          <span>Prefer to do it yourself?</span>
          <a style={{color:'#61AAF2',textDecoration:'none'}}>Read the migration guide →</a>
          <span style={{color:'rgba(255,255,255,0.2)'}}>·</span>
          <a style={{color:'#61AAF2',textDecoration:'none'}}>Cookbook examples</a>
        </div>
      </div>
    </div>
  );
}

/* ---------- STEP 2: Repo picker (OpenAI variant) ---------- */
function Idea3PickRepo({onPick, onBack}){
  const I = window.Idea2Icons;
  const [search,setSearch]=useState3('');
  const [hovered,setHovered]=useState3(null);
  const filtered = OAI_REPOS.filter(r=>r.name.toLowerCase().includes(search.toLowerCase())||r.desc.toLowerCase().includes(search.toLowerCase()));
  const suggested = OAI_REPOS.find(r=>r.match);
  return (
    <div style={{height:'100%',overflowY:'auto',padding:'40px 56px'}}>
      <div style={{maxWidth:760,margin:'0 auto'}}>
        <button onClick={onBack} style={{display:'inline-flex',alignItems:'center',gap:6,padding:'4px 8px',marginLeft:-8,marginBottom:20,background:'transparent',border:'none',color:'rgba(255,255,255,0.5)',fontSize:12,cursor:'pointer',fontFamily:'var(--font-sans)'}}>← Back</button>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6,fontSize:12,color:'#D97757',fontWeight:500,letterSpacing:'0.05em',textTransform:'uppercase'}}>
          <I.CheckCircle2 size={14} color="#D97757"/> GitHub connected · acme-eng
        </div>
        <h1 style={{fontFamily:'var(--font-serif)',fontSize:34,fontWeight:500,letterSpacing:'-0.7px',color:'#fff',margin:'0 0 10px',lineHeight:1.1}}>Which repo should we migrate?</h1>
        <p style={{fontSize:15,color:'rgba(255,255,255,0.55)',margin:'0 0 28px',lineHeight:1.5}}>We&rsquo;ll scan it for OpenAI SDK usage, propose the equivalent Claude code, and open a PR for your review.</p>

        {suggested && (
          <div style={{marginBottom:28,padding:20,borderRadius:12,background:'linear-gradient(135deg, rgba(217,119,87,0.08), rgba(217,119,87,0.02))',border:'1px solid rgba(217,119,87,0.25)'}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
              <I.Sparkle2 size={14}/>
              <span style={{fontSize:11,color:'#D97757',fontWeight:600,letterSpacing:'0.05em',textTransform:'uppercase'}}>Suggested · heavy OpenAI usage detected</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:16}}>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                  <I.RepoIcon2 size={16}/>
                  <span style={{fontSize:16,fontWeight:600,color:'#fff'}}>{suggested.owner}/<span style={{color:'#D97757'}}>{suggested.name}</span></span>
                  <span style={{fontSize:10,padding:'2px 7px',borderRadius:10,border:'1px solid rgba(255,255,255,0.15)',color:'rgba(255,255,255,0.5)',fontWeight:500}}>{suggested.visibility}</span>
                </div>
                <p style={{fontSize:13,color:'rgba(255,255,255,0.6)',margin:'0 0 14px',lineHeight:1.5}}>{suggested.desc}</p>
                <div style={{padding:'12px 14px',background:'rgba(0,0,0,0.25)',borderRadius:8,fontSize:12,color:'rgba(255,255,255,0.6)',display:'grid',gridTemplateColumns:'auto 1fr auto 1fr',gap:'6px 16px'}}>
                  <span style={{color:'rgba(255,255,255,0.4)'}}>SDK</span><span style={{fontFamily:'var(--font-mono)',fontSize:11,color:'#fff'}}>{suggested.detected.sdk}</span>
                  <span style={{color:'rgba(255,255,255,0.4)'}}>Framework</span><span style={{color:'#fff'}}>{suggested.detected.framework}</span>
                  <span style={{color:'rgba(255,255,255,0.4)'}}>API calls</span><span style={{color:'#fff'}}>{suggested.detected.calls}</span>
                  <span style={{color:'rgba(255,255,255,0.4)'}}>Tool defs</span><span style={{color:'#fff'}}>{suggested.detected.tools}</span>
                  <span style={{color:'rgba(255,255,255,0.4)',gridColumn:'1'}}>Models</span><span style={{fontFamily:'var(--font-mono)',fontSize:11,gridColumn:'2 / -1'}}>{suggested.detected.models}</span>
                </div>
              </div>
              <button onClick={()=>onPick(suggested)} style={{padding:'10px 16px',borderRadius:10,background:'#D97757',color:'#fff',fontSize:14,fontWeight:500,border:'none',cursor:'pointer',fontFamily:'var(--font-sans)',display:'flex',alignItems:'center',gap:8,whiteSpace:'nowrap',flexShrink:0,marginTop:4}}>
                Migrate this repo <I.ArrowRight2 size={14}/>
              </button>
            </div>
          </div>
        )}

        <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderRadius:10,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',marginBottom:12}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color:'rgba(255,255,255,0.5)'}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search your repositories..." style={{flex:1,background:'transparent',border:'none',color:'#fff',fontSize:14,fontFamily:'var(--font-sans)',outline:'none'}}/>
          <span style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>{filtered.length} of {OAI_REPOS.length}</span>
        </div>

        <div style={{borderRadius:10,border:'1px solid rgba(255,255,255,0.06)',overflow:'hidden'}}>
          {filtered.map((r,i)=>(
            <div key={r.name} onClick={()=>onPick(r)} onMouseEnter={()=>setHovered(r.name)} onMouseLeave={()=>setHovered(null)}
              style={{display:'flex',alignItems:'center',gap:14,padding:'14px 16px',borderBottom:i<filtered.length-1?'1px solid rgba(255,255,255,0.04)':'none',background:hovered===r.name?'rgba(255,255,255,0.03)':'transparent',cursor:'pointer',transition:'background 120ms'}}>
              <I.RepoIcon2 size={15}/>
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
              <I.ChevronRight2 size={14}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- STEP 3: Scanning / transforming ---------- */
function Idea3Scanning({repo, showRecs, onDone}){
  const I = window.Idea2Icons;
  const steps = [
    'Cloning ' + repo.owner + '/' + repo.name,
    'Parsing OpenAI SDK imports (47 call sites)',
    'Classifying API patterns: chat, tools, streaming',
    'Mapping 8 tool definitions to Anthropic tool use',
    'Generating Claude-equivalent code',
    'Validating against migration test suite (92/100)',
    ...(showRecs ? [
      'Scanning for prompt caching opportunities',
      'Identifying model right-sizing opportunities',
    ] : []),
    'Creating branch claude/migrate-from-openai',
    'Opening pull request'
  ];
  const [done,setDone]=useState3(0);
  useEffect3(()=>{
    if(done>=steps.length){const t=setTimeout(onDone,600);return()=>clearTimeout(t);}
    const t=setTimeout(()=>setDone(d=>d+1), done===0?400:500+Math.random()*250);
    return()=>clearTimeout(t);
  },[done]);
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',padding:48}}>
      <div style={{width:'100%',maxWidth:560}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
          <div style={{width:40,height:40,borderRadius:10,background:'rgba(217,119,87,0.12)',border:'1px solid rgba(217,119,87,0.3)',display:'grid',placeItems:'center'}}>
            <I.SpinnerIcon2 size={18}/>
          </div>
          <div>
            <div style={{fontSize:12,color:'#D97757',fontWeight:500,letterSpacing:'0.05em',textTransform:'uppercase'}}>Migrating</div>
            <div style={{fontSize:15,color:'#fff',fontWeight:500}}>Translating OpenAI → Claude</div>
          </div>
        </div>
        <div style={{padding:'20px 24px',borderRadius:12,background:'rgba(0,0,0,0.3)',border:'1px solid rgba(255,255,255,0.06)',fontFamily:'var(--font-mono)',fontSize:13}}>
          {steps.map((s,i)=>{
            const state=i<done?'done':i===done?'active':'pending';
            return (
              <div key={s} style={{display:'flex',alignItems:'center',gap:10,opacity:state==='pending'?0.3:1,transition:'opacity 200ms',minHeight:26,lineHeight:1.4}}>
                <span style={{width:14,height:14,display:'inline-flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  {state==='done' && <I.CheckCircle2 size={12} color="#4ade80"/>}
                  {state==='active' && <I.SpinnerIcon2 size={12}/>}
                  {state==='pending' && <span style={{width:8,height:8,borderRadius:'50%',border:'1px solid rgba(255,255,255,0.2)'}}/>}
                </span>
                <span style={{color:state==='done'?'rgba(255,255,255,0.7)':state==='active'?'#fff':'rgba(255,255,255,0.4)'}}>{s}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------- STEP 4: Review (diff + recommendations) ---------- */
function Idea3Review({repo, showRecs, onFinish}){
  const I = window.Idea2Icons;
  const [tab,setTab]=useState3('diff');
  const DIFF_LINES = [
    {type:'ctx', n:[1,1], text:"// app/api/chat/route.ts"},
    {type:'rem', n:[2,null], text:"import OpenAI from 'openai';"},
    {type:'add', n:[null,2], text:"import Anthropic from '@anthropic-ai/sdk';"},
    {type:'ctx', n:[3,3], text:""},
    {type:'rem', n:[4,null], text:"const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });"},
    {type:'add', n:[null,4], text:"const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });"},
    {type:'ctx', n:[5,5], text:""},
    {type:'ctx', n:[6,6], text:"export async function POST(req: Request) {"},
    {type:'ctx', n:[7,7], text:"  const { messages, tools } = await req.json();"},
    {type:'rem', n:[8,null], text:"  const completion = await openai.chat.completions.create({"},
    {type:'rem', n:[9,null], text:"    model: 'gpt-4o',"},
    {type:'rem', n:[10,null], text:"    messages,"},
    {type:'rem', n:[11,null], text:"    tools: tools.map(t => ({ type: 'function', function: t })),"},
    {type:'rem', n:[12,null], text:"    stream: true,"},
    {type:'rem', n:[13,null], text:"  });"},
    {type:'add', n:[null,8], text:"  const response = await anthropic.messages.create({"},
    {type:'add', n:[null,9], text:"    model: 'claude-sonnet-4-5',"},
    {type:'add', n:[null,10], text:"    max_tokens: 4096,"},
    {type:'add', n:[null,11], text:"    system: extractSystem(messages),"},
    {type:'add', n:[null,12], text:"    messages: toAnthropicMessages(messages),"},
    {type:'add', n:[null,13], text:"    tools: toAnthropicTools(tools),"},
    {type:'add', n:[null,14], text:"    stream: true,"},
    {type:'add', n:[null,15], text:"  });"},
  ];
  const FILES = [
    ['app/api/chat/route.ts','modified','+18 −14'],
    ['lib/llm-adapters.ts','new','+62'],
    ['lib/tools.ts','modified','+9 −11'],
    ['package.json','modified','+1 −1'],
    ['.env.example','modified','+1 −1'],
  ];

  return (
    <div style={{height:'100%',overflowY:'auto'}}>
      {/* PR header */}
      <div style={{padding:'24px 40px 20px',borderBottom:'1px solid rgba(255,255,255,0.06)',background:'linear-gradient(180deg, rgba(217,119,87,0.05), transparent)'}}>
        <div style={{maxWidth:1120,margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8,fontSize:11,color:'#D97757',fontWeight:600,letterSpacing:'0.05em',textTransform:'uppercase'}}>
            <I.PullRequestIcon2 size={14}/> Pull request ready · {repo.owner}/{repo.name}
          </div>
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:20,flexWrap:'wrap'}}>
            <div>
              <h1 style={{fontFamily:'var(--font-serif)',fontSize:28,fontWeight:500,letterSpacing:'-0.5px',color:'#fff',margin:'0 0 6px',lineHeight:1.15}}>Migrate from OpenAI to Claude</h1>
              <div style={{display:'flex',alignItems:'center',gap:14,fontSize:13,color:'rgba(255,255,255,0.5)'}}>
                <span style={{display:'flex',alignItems:'center',gap:5}}><I.BranchIcon2 size={13}/><span style={{fontFamily:'var(--font-mono)',fontSize:12}}>claude/migrate-from-openai</span></span>
                <span>·</span>
                <span>5 files changed</span>
                <span>·</span>
                <span style={{color:'#4ade80'}}>+91</span> <span style={{color:'#f87171',marginLeft:-10}}>−27</span>
              </div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button style={{padding:'9px 14px',borderRadius:8,background:'rgba(255,255,255,0.06)',color:'#fff',fontSize:13,fontWeight:500,border:'1px solid rgba(255,255,255,0.1)',cursor:'pointer',fontFamily:'var(--font-sans)'}}>Download patch</button>
              <button onClick={onFinish} style={{padding:'9px 16px',borderRadius:8,background:'#238636',color:'#fff',fontSize:13,fontWeight:500,border:'none',cursor:'pointer',fontFamily:'var(--font-sans)',display:'flex',alignItems:'center',gap:7}}>
                <I.GitHubMark size={13} color="#fff"/> Open on GitHub
              </button>
            </div>
          </div>
          <div style={{display:'flex',gap:4,marginTop:20,borderBottom:'1px solid rgba(255,255,255,0.06)',marginBottom:-21}}>
            {[['diff','Files changed',5],['recs','Recommendations',showRecs?4:null],['summary','Summary',null]].map(([id,label,count])=>(
              <button key={id} onClick={()=>setTab(id)} disabled={id==='recs'&&!showRecs} style={{padding:'10px 16px',fontSize:13,fontWeight:500,color:tab===id?'#fff':'rgba(255,255,255,0.5)',background:'transparent',border:'none',borderBottom:'2px solid '+(tab===id?'#D97757':'transparent'),cursor:id==='recs'&&!showRecs?'not-allowed':'pointer',fontFamily:'var(--font-sans)',opacity:id==='recs'&&!showRecs?0.3:1,display:'flex',alignItems:'center',gap:6}}>
                {label} {count!==null && <span style={{padding:'1px 7px',borderRadius:10,background:'rgba(255,255,255,0.06)',fontSize:11,color:'rgba(255,255,255,0.6)'}}>{count}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:1120,margin:'0 auto',padding:'24px 40px 60px'}}>
        {tab==='diff' && (
          <div style={{display:'grid',gridTemplateColumns:'260px 1fr',gap:20}}>
            {/* File sidebar */}
            <div style={{alignSelf:'start',position:'sticky',top:20}}>
              <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',fontWeight:500,letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:10,padding:'0 10px'}}>Changed files</div>
              {FILES.map((f,i)=>(
                <div key={f[0]} style={{padding:'8px 10px',borderRadius:6,background:i===0?'rgba(217,119,87,0.08)':'transparent',display:'flex',alignItems:'center',gap:8,cursor:'pointer',marginBottom:2}}>
                  <I.FileIcon2 size={12}/>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:12,color:i===0?'#fff':'rgba(255,255,255,0.7)',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{f[0]}</span>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:10,color:f[1]==='new'?'#4ade80':'#facc15'}}>{f[2]}</span>
                </div>
              ))}
            </div>
            {/* Diff */}
            <div style={{borderRadius:10,border:'1px solid rgba(255,255,255,0.08)',overflow:'hidden',background:'#0d1117'}}>
              <div style={{padding:'10px 14px',borderBottom:'1px solid rgba(255,255,255,0.08)',background:'rgba(255,255,255,0.02)',display:'flex',alignItems:'center',gap:8,fontFamily:'var(--font-mono)',fontSize:12,color:'rgba(255,255,255,0.7)'}}>
                <I.FileIcon2 size={12}/> app/api/chat/route.ts
                <span style={{marginLeft:'auto',color:'#4ade80'}}>+18</span>
                <span style={{color:'#f87171'}}>−14</span>
              </div>
              <div style={{fontFamily:'var(--font-mono)',fontSize:12,lineHeight:1.65}}>
                {DIFF_LINES.map((l,i)=>(
                  <div key={i} style={{display:'flex',background:l.type==='add'?'rgba(63,185,80,0.1)':l.type==='rem'?'rgba(248,113,113,0.1)':'transparent'}}>
                    <span style={{width:40,textAlign:'right',padding:'0 8px',color:'rgba(255,255,255,0.3)',flexShrink:0,userSelect:'none'}}>{l.n[0]||''}</span>
                    <span style={{width:40,textAlign:'right',padding:'0 8px',color:'rgba(255,255,255,0.3)',flexShrink:0,userSelect:'none'}}>{l.n[1]||''}</span>
                    <span style={{width:18,color:l.type==='add'?'#4ade80':l.type==='rem'?'#f87171':'rgba(255,255,255,0.3)',flexShrink:0,userSelect:'none'}}>{l.type==='add'?'+':l.type==='rem'?'−':' '}</span>
                    <span style={{color:l.type==='add'?'#e6edf3':l.type==='rem'?'rgba(230,237,243,0.6)':'rgba(255,255,255,0.7)',whiteSpace:'pre',overflowX:'auto'}}>{l.text}</span>
                  </div>
                ))}
                <div style={{padding:'10px 14px',textAlign:'center',fontSize:11,color:'rgba(255,255,255,0.35)',borderTop:'1px solid rgba(255,255,255,0.06)'}}>... 9 more hunks in this file</div>
              </div>
            </div>
          </div>
        )}

        {tab==='recs' && showRecs && (
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <p style={{fontSize:14,color:'rgba(255,255,255,0.55)',margin:'0 0 6px',maxWidth:720,lineHeight:1.5}}>After a clean migration, we looked for Claude-specific patterns that could cut cost or latency. Apply each independently — none are required for the PR to merge.</p>
            {[
              {title:'Enable prompt caching on your system prompt',saves:'Saves ~$240/mo at current volume',impact:'High',body:'Your 4.2k-token system prompt is static across requests. Add `cache_control: { type: "ephemeral" }` to the last system block to cache it for 5 minutes. With your current request pattern (~18k/day), this cuts input token cost by ~88% on cached hits.',code:`system: [{
  type: "text",
  text: SYSTEM_PROMPT,
  cache_control: { type: "ephemeral" }
}]`, file:'lib/llm-adapters.ts'},
              {title:'Right-size for classification calls',saves:'Saves ~$95/mo + 40% faster',impact:'High',body:'Three call sites use the full model for short classification prompts (<200 tokens in/out). Claude Haiku handles these equally well and is ~5× cheaper.',code:`model: "claude-haiku-4-5" // was claude-sonnet-4-5`, file:'app/api/classify/route.ts'},
              {title:'Use Claude\u2019s native tool use instead of the compat shim',impact:'Medium',body:'Your tool definitions are currently passed through a translation layer. Rewriting them in Claude\u2019s native format removes one abstraction and enables parallel tool use.',file:'lib/tools.ts'},
              {title:'Consider extended thinking for the triage agent',impact:'Low',body:'The triage agent makes multi-step decisions that benefit from visible reasoning. Toggling `thinking: { type: "enabled" }` can improve accuracy on complex tickets without client changes.',file:'lib/agents/triage.ts'},
            ].map((r,i)=>(
              <div key={i} style={{padding:'18px 22px',borderRadius:12,background:'#1e1e1c',border:'1px solid rgba(255,255,255,0.06)'}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:16,marginBottom:10}}>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4,flexWrap:'wrap'}}>
                      <span style={{fontSize:10,padding:'2px 7px',borderRadius:4,background:r.impact==='High'?'rgba(63,185,80,0.15)':r.impact==='Medium'?'rgba(210,153,34,0.15)':'rgba(255,255,255,0.06)',color:r.impact==='High'?'#4ade80':r.impact==='Medium'?'#facc15':'rgba(255,255,255,0.5)',fontWeight:600,letterSpacing:'0.05em'}}>{r.impact} IMPACT</span>
                      {r.saves && <span style={{fontSize:11,color:'#4ade80',fontWeight:500}}>{r.saves}</span>}
                      <span style={{fontSize:11,color:'rgba(255,255,255,0.4)',fontFamily:'var(--font-mono)'}}>{r.file}</span>
                    </div>
                    <h3 style={{fontSize:15,fontWeight:500,color:'#fff',margin:'0 0 8px'}}>{r.title}</h3>
                    <p style={{fontSize:13,color:'rgba(255,255,255,0.6)',margin:0,lineHeight:1.5}}>{r.body}</p>
                  </div>
                  <button style={{padding:'6px 12px',borderRadius:8,background:'rgba(217,119,87,0.12)',color:'#D97757',fontSize:12,fontWeight:500,border:'1px solid rgba(217,119,87,0.25)',cursor:'pointer',fontFamily:'var(--font-sans)',whiteSpace:'nowrap',flexShrink:0}}>Apply to PR</button>
                </div>
                {r.code && (
                  <pre style={{margin:'12px 0 0',padding:'12px 14px',borderRadius:8,background:'#0d1117',border:'1px solid rgba(255,255,255,0.06)',fontFamily:'var(--font-mono)',fontSize:12,color:'#e6edf3',overflow:'auto',whiteSpace:'pre'}}>{r.code}</pre>
                )}
              </div>
            ))}
          </div>
        )}

        {tab==='summary' && (
          <div style={{maxWidth:720}}>
            <h3 style={{fontSize:16,fontWeight:500,color:'#fff',margin:'0 0 14px'}}>What changed</h3>
            <ul style={{margin:'0 0 24px',paddingLeft:18,fontSize:14,color:'rgba(255,255,255,0.7)',lineHeight:1.8}}>
              <li>Replaced <code style={{fontFamily:'var(--font-mono)',fontSize:13,color:'#D97757'}}>openai</code> with <code style={{fontFamily:'var(--font-mono)',fontSize:13,color:'#D97757'}}>@anthropic-ai/sdk</code> across 3 files.</li>
              <li>Converted 8 tool definitions to Claude&rsquo;s <code style={{fontFamily:'var(--font-mono)',fontSize:13,color:'#D97757'}}>input_schema</code> format.</li>
              <li>Mapped <code style={{fontFamily:'var(--font-mono)',fontSize:13,color:'#D97757'}}>gpt-4o</code> → <code style={{fontFamily:'var(--font-mono)',fontSize:13,color:'#D97757'}}>claude-sonnet-4-5</code> and <code style={{fontFamily:'var(--font-mono)',fontSize:13,color:'#D97757'}}>gpt-4o-mini</code> → <code style={{fontFamily:'var(--font-mono)',fontSize:13,color:'#D97757'}}>claude-haiku-4-5</code>.</li>
              <li>Preserved streaming semantics via a small adapter in <code style={{fontFamily:'var(--font-mono)',fontSize:13,color:'#D97757'}}>lib/llm-adapters.ts</code>.</li>
              <li>Added <code style={{fontFamily:'var(--font-mono)',fontSize:13,color:'#D97757'}}>ANTHROPIC_API_KEY</code> to <code style={{fontFamily:'var(--font-mono)',fontSize:13,color:'#D97757'}}>.env.example</code>.</li>
            </ul>
            <h3 style={{fontSize:16,fontWeight:500,color:'#fff',margin:'0 0 14px'}}>Test coverage</h3>
            <div style={{padding:'14px 18px',borderRadius:10,background:'#1e1e1c',border:'1px solid rgba(255,255,255,0.06)',marginBottom:24}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:13,color:'rgba(255,255,255,0.7)',marginBottom:8}}><span>Migration test suite</span><span style={{color:'#4ade80',fontWeight:500}}>92 / 100 passing</span></div>
              <div style={{height:6,background:'rgba(255,255,255,0.06)',borderRadius:3,overflow:'hidden'}}><div style={{width:'92%',height:'100%',background:'#4ade80'}}/></div>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.45)',marginTop:10,lineHeight:1.5}}>8 tests need human review. These cover JSON mode edge cases and image inputs in tool responses. Links are annotated inline in the PR.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- STEP 5: Done / celebrate ---------- */
function Idea3Done({repo, showCredit, creditAmount}){
  const I = window.Idea2Icons;
  return (
    <div style={{height:'100%',overflowY:'auto',padding:'40px 32px'}}>
      <div style={{maxWidth:760,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{display:'inline-flex',width:64,height:64,borderRadius:16,background:'rgba(63,185,80,0.12)',border:'1px solid rgba(63,185,80,0.3)',alignItems:'center',justifyContent:'center',marginBottom:20}}>
            <I.CheckCircle2 size={28} color="#4ade80"/>
          </div>
          <h1 style={{fontFamily:'var(--font-serif)',fontSize:34,fontWeight:500,letterSpacing:'-0.7px',color:'#fff',margin:'0 0 10px',lineHeight:1.1}}>You&rsquo;re on Claude</h1>
          <p style={{fontSize:15,color:'rgba(255,255,255,0.6)',margin:'0 auto',lineHeight:1.5,maxWidth:520}}>Your migration PR is live on GitHub. Merge when it looks right, and your app will be serving Claude responses on the next deploy.</p>
        </div>

        {showCredit && (
          <div style={{padding:'20px 24px',borderRadius:14,background:'linear-gradient(135deg, rgba(63,185,80,0.1), rgba(63,185,80,0.02))',border:'1px solid rgba(63,185,80,0.25)',marginBottom:16,display:'flex',alignItems:'center',gap:16}}>
            <div style={{width:44,height:44,borderRadius:10,background:'rgba(63,185,80,0.15)',display:'grid',placeItems:'center',flexShrink:0,color:'#4ade80'}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.39 7.36H22l-6.2 4.51 2.39 7.36L12 16.72l-6.19 4.51 2.39-7.36L2 9.36h7.61z"/></svg>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:11,color:'#4ade80',fontWeight:600,letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:2}}>Migration bonus credited</div>
              <div style={{fontSize:15,color:'#fff',fontWeight:500}}>${creditAmount} in free API credits added to your workspace</div>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',marginTop:4}}>Credits appear once your PR is merged. Valid for 90 days.</div>
            </div>
          </div>
        )}

        <div style={{padding:'22px 24px',borderRadius:12,background:'#1e1e1c',border:'1px solid rgba(255,255,255,0.06)',marginBottom:16}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
            <I.PullRequestIcon2 size={17}/>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:500,color:'#fff'}}>Migrate from OpenAI to Claude</div>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.5)'}}>{repo.owner}/{repo.name} · #{42}</div>
            </div>
            <button style={{padding:'7px 12px',borderRadius:8,background:'#238636',color:'#fff',fontSize:12,fontWeight:500,border:'none',cursor:'pointer',fontFamily:'var(--font-sans)',display:'flex',alignItems:'center',gap:6}}>
              <I.GitHubMark size={12} color="#fff"/> Open PR on GitHub
            </button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:14,fontSize:13}}>
            {[['Files changed','5'],['Additions','+91'],['Deletions','−27'],['Tests passing','92/100']].map(([k,v])=>(
              <div key={k}>
                <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',letterSpacing:'0.05em',textTransform:'uppercase',fontWeight:500,marginBottom:4}}>{k}</div>
                <div style={{fontSize:15,color:'#fff',fontFamily:'var(--font-mono)',fontWeight:500}}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        <h3 style={{fontSize:13,color:'rgba(255,255,255,0.7)',margin:'28px 0 12px',fontWeight:500,letterSpacing:'0.05em',textTransform:'uppercase'}}>Next</h3>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          {[
            ['View live usage','Watch the first requests hit Claude once you merge.','Usage dashboard'],
            ['Tune with evals','Confirm behavior matches with a test harness against your real traffic.','Set up evals'],
            ['Read the migration guide','For deeper patterns \u2014 batch inference, vision, long context.','Read docs'],
            ['Talk to us','Our DevRel team helps high-volume teams fine-tune the migration.','Book a call']
          ].map(([t,d,cta])=>(
            <div key={t} style={{padding:'16px 18px',borderRadius:10,background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)'}}>
              <div style={{fontSize:14,fontWeight:500,color:'#fff',marginBottom:4}}>{t}</div>
              <div style={{fontSize:12,color:'rgba(255,255,255,0.5)',lineHeight:1.5,marginBottom:10}}>{d}</div>
              <a style={{fontSize:12,color:'#D97757',textDecoration:'none',fontWeight:500}}>{cta} →</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Main Idea 3 App w/ stepper ---------- */
const IDEA3_TWEAK_DEFAULTS = /*IDEA3MODE-BEGIN*/{
  "showRecs": true,
  "showCredit": true,
  "creditAmount": 20
}/*IDEA3MODE-END*/;

function Idea3App({tweaks, setTweak, showTweaks}){
  const [step,setStep]=useState3(()=>localStorage.getItem('idea3_step')||'welcome');
  const [repo,setRepo]=useState3(null);
  useEffect3(()=>{localStorage.setItem('idea3_step',step);},[step]);

  const ConsoleChrome = window.ConsoleChrome;
  if(!ConsoleChrome) return <div style={{padding:40,color:'#fff'}}>Loading...</div>;

  return (
    <div style={{height:'100%',position:'relative'}}>
      <style>{`@keyframes idea3spin{to{transform:rotate(360deg)}}`}</style>
      <ConsoleChrome>
        {step==='welcome' && <Idea3Welcome onStart={()=>setStep('pickrepo')} showCredit={tweaks.showCredit} creditAmount={tweaks.creditAmount}/>}
        {step==='pickrepo' && <Idea3PickRepo onPick={r=>{setRepo(r);setStep('scanning');}} onBack={()=>setStep('welcome')}/>}
        {step==='scanning' && repo && <Idea3Scanning repo={repo} showRecs={tweaks.showRecs} onDone={()=>setStep('review')}/>}
        {step==='review' && repo && <Idea3Review repo={repo} showRecs={tweaks.showRecs} onFinish={()=>setStep('done')}/>}
        {step==='done' && repo && <Idea3Done repo={repo} showCredit={tweaks.showCredit} creditAmount={tweaks.creditAmount}/>}
      </ConsoleChrome>

      {/* Step jumper */}
      <div style={{position:'absolute',bottom:16,left:16,display:'flex',alignItems:'center',gap:6,padding:'6px 10px',borderRadius:999,background:'rgba(30,30,28,0.9)',border:'1px solid rgba(255,255,255,0.06)',backdropFilter:'blur(8px)',fontFamily:'var(--font-sans)',zIndex:50}}>
        <span style={{fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:'0.05em',textTransform:'uppercase',fontWeight:500,marginRight:4}}>Jump to</span>
        {[['welcome','1'],['pickrepo','2'],['scanning','3'],['review','4'],['done','5']].map(([s,n])=>(
          <button key={s} onClick={()=>{if(s!=='welcome'&&s!=='pickrepo')setRepo(OAI_REPOS[0]);setStep(s);}} style={{width:22,height:22,borderRadius:'50%',background:step===s?'#D97757':'rgba(255,255,255,0.05)',color:step===s?'#fff':'rgba(255,255,255,0.5)',fontSize:11,fontWeight:500,border:'none',cursor:'pointer',fontFamily:'var(--font-sans)'}}>{n}</button>
        ))}
        <button onClick={()=>{localStorage.removeItem('idea3_step');setStep('welcome');setRepo(null);}} style={{marginLeft:4,padding:'4px 8px',borderRadius:12,background:'transparent',color:'rgba(255,255,255,0.4)',fontSize:10,border:'1px solid rgba(255,255,255,0.08)',cursor:'pointer',fontFamily:'var(--font-sans)'}}>Restart</button>
      </div>

      {showTweaks && (
        <div className="tweaks-panel">
          <h3>Tweaks · Idea 3</h3>
          <div className="divider"/>
          <div className="toggle-row"><span>Show optimization recommendations</span><button className={'toggle'+(tweaks.showRecs?' on':'')} onClick={()=>setTweak('showRecs',!tweaks.showRecs)}/></div>
          <div className="toggle-row"><span>Offer migration credit bonus</span><button className={'toggle'+(tweaks.showCredit?' on':'')} onClick={()=>setTweak('showCredit',!tweaks.showCredit)}/></div>
          <div className="divider"/>
          <div style={{padding:'4px 8px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
            <span style={{fontSize:12,color:'rgba(255,255,255,0.75)'}}>Credit amount</span>
            <div style={{display:'flex',gap:4}}>
              {[5,10,20,50].map(v=>(
                <button key={v} onClick={()=>setTweak('creditAmount',v)} style={{padding:'4px 10px',borderRadius:6,background:tweaks.creditAmount===v?'#D97757':'rgba(255,255,255,0.05)',color:tweaks.creditAmount===v?'#fff':'rgba(255,255,255,0.6)',fontSize:11,fontWeight:500,border:'none',cursor:'pointer',fontFamily:'var(--font-sans)'}}>${v}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, {Idea3App, IDEA3_TWEAK_DEFAULTS});
