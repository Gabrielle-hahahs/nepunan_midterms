import React, { useMemo, useState } from 'react';
import {
  LayoutDashboard, Boxes, ArrowLeftRight, Wrench, Package, FileBarChart2,
  Settings, Search, Bell, ChevronDown, Plus, Download, Filter, Camera,
  Mic2, Laptop, Cable, CheckCircle2, Clock3, AlertTriangle, Menu, X,
  ArrowUpRight, ArrowDownLeft, QrCode, CalendarDays, UserRound, MoreHorizontal,
  CircleHelp, LogOut, Check, XCircle, ClipboardList, SlidersHorizontal
} from 'lucide-react';

const initialEquipment = [
  { id:'EQ-001', name:'Sony Alpha Camera', category:'Camera', owner:'Mark Reyes', ownership:'Personal', condition:'Good', status:'Available', icon:'camera', serial:'SN-AX3921', updated:'Oct 21, 2026' },
  { id:'EQ-002', name:'Wireless Microphone Set', category:'Audio', owner:'IT Department', ownership:'Department', condition:'Good', status:'Borrowed', icon:'mic', serial:'SN-WM1044', updated:'Oct 22, 2026' },
  { id:'EQ-003', name:'Canon DSLR Camera', category:'Camera', owner:'Ana Santos', ownership:'Personal', condition:'Fair', status:'Available', icon:'camera', serial:'SN-CD8812', updated:'Oct 20, 2026' },
  { id:'EQ-004', name:'Dell Latitude Laptop', category:'Computer', owner:'IT Department', ownership:'Department', condition:'Needs repair', status:'Under repair', icon:'laptop', serial:'SN-DL2408', updated:'Oct 22, 2026' },
  { id:'EQ-005', name:'HDMI Cable 10m', category:'Accessories', owner:'IT Department', ownership:'Department', condition:'Good', status:'Available', icon:'cable', serial:'SN-HD1022', updated:'Oct 18, 2026' },
  { id:'EQ-006', name:'Tripod Stand', category:'Accessories', owner:'Mark Reyes', ownership:'Personal', condition:'Good', status:'Borrowed', icon:'cable', serial:'SN-TR0901', updated:'Oct 22, 2026' },
];
const initialBorrowings = [
  { id:'BR-1042', item:'Wireless Microphone Set', code:'EQ-002', borrower:'Joshua Dela Cruz', owner:'IT Department', borrowed:'Oct 23, 2026 · 8:40 AM', due:'Oct 23, 2026 · 4:00 PM', status:'Borrowed', condition:'Good' },
  { id:'BR-1041', item:'Tripod Stand', code:'EQ-006', borrower:'Paolo Mendoza', owner:'Mark Reyes', borrowed:'Oct 23, 2026 · 8:15 AM', due:'Oct 23, 2026 · 12:00 PM', status:'Overdue', condition:'Good' },
  { id:'BR-1040', item:'Sony Alpha Camera', code:'EQ-001', borrower:'Ana Santos', owner:'Mark Reyes', borrowed:'Oct 22, 2026 · 1:20 PM', due:'Oct 22, 2026 · 5:00 PM', status:'Returned', condition:'Good' },
];
const initialRepairs = [
  { id:'RP-208', item:'Dell Latitude Laptop', code:'EQ-004', issue:'Battery does not charge; shuts down unexpectedly', reported:'Oct 21, 2026', assigned:'Mark Reyes', status:'In progress', priority:'High' },
  { id:'RP-207', item:'Canon DSLR Camera', code:'EQ-003', issue:'Intermittent autofocus and lens communication error', reported:'Oct 19, 2026', assigned:'Ana Santos', status:'Pending', priority:'Medium' },
  { id:'RP-206', item:'Wireless Microphone Set', code:'EQ-002', issue:'One microphone has low audio output', reported:'Oct 16, 2026', assigned:'Joshua Dela Cruz', status:'Completed', priority:'Low' },
];
const initialSupplies = [
  { id:'SP-031', name:'Microfiber Cleaning Cloth', category:'Cleaning', unit:'pcs', stock:8, minimum:10, location:'Supply cabinet' },
  { id:'SP-032', name:'Isopropyl Alcohol 500ml', category:'Cleaning', unit:'bottle', stock:14, minimum:5, location:'Supply cabinet' },
  { id:'SP-033', name:'Cable Ties', category:'Accessories', unit:'pack', stock:3, minimum:5, location:'Storage shelf A' },
  { id:'SP-034', name:'Compressed Air Duster', category:'Cleaning', unit:'can', stock:6, minimum:4, location:'Storage shelf B' },
  { id:'SP-035', name:'AA Batteries', category:'Power', unit:'pair', stock:0, minimum:6, location:'Supply cabinet' },
];

const nav = [
  { id:'Dashboard', label:'Dashboard', icon:LayoutDashboard, group:'WORKSPACE' },
  { id:'Equipment', label:'Equipment inventory', icon:Boxes, group:'WORKSPACE' },
  { id:'Borrowing', label:'Borrow & return', icon:ArrowLeftRight, group:'WORKSPACE', count:'3' },
  { id:'Repairs', label:'Repair monitoring', icon:Wrench, group:'WORKSPACE', count:'2' },
  { id:'Supplies', label:'Supply inventory', icon:Package, group:'WORKSPACE', count:'2' },
  { id:'Reports', label:'Reports', icon:FileBarChart2, group:'MANAGEMENT' },
  { id:'Settings', label:'Settings', icon:Settings, group:'MANAGEMENT' },
];

function IconFor({ type, size=20 }) {
  const props = { size, strokeWidth:1.8 };
  if (type === 'camera') return <Camera {...props}/>;
  if (type === 'mic') return <Mic2 {...props}/>;
  if (type === 'laptop') return <Laptop {...props}/>;
  return <Cable {...props}/>;
}
function Status({ children }) {
  const map = {
    'Available':'green','Returned':'green','Completed':'green','Good':'green',
    'Borrowed':'blue','In progress':'blue','Fair':'amber','Pending':'amber',
    'Overdue':'red','Under repair':'red','Needs repair':'red','Out of stock':'red'
  };
  return <span className={`status ${map[children] || 'neutral'}`}><i />{children}</span>;
}
function PageHeading({ eyebrow, title, subtitle, action }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>;
}
function EmptyNote({ text }) { return <div className="empty-note">{text}</div>; }

export default function App() {
  const [page, setPage] = useState('Dashboard');
  const [mobileNav, setMobileNav] = useState(false);
  const [equipment, setEquipment] = useState(initialEquipment);
  const [borrowings, setBorrowings] = useState(initialBorrowings);
  const [repairs, setRepairs] = useState(initialRepairs);
  const [supplies, setSupplies] = useState(initialSupplies);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [modal, setModal] = useState('');
  const [toast, setToast] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState({});
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notify = (msg) => { setToast(msg); window.setTimeout(() => setToast(''), 2800); };
  const go = (p) => { setPage(p); setSearch(''); setFilter('All'); setMobileNav(false); };
  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const openModal = (type, item=null) => {
    setSelectedItem(item);
    setForm(item ? { ...item } : {});
    setModal(type);
  };
  const closeModal = () => { setModal(''); setSelectedItem(null); setForm({}); };

  const filteredEquipment = useMemo(() => equipment.filter(x =>
    [x.name,x.id,x.category,x.owner,x.status].join(' ').toLowerCase().includes(search.toLowerCase()) &&
    (filter === 'All' || x.status === filter || x.ownership === filter)
  ), [equipment, search, filter]);
  const filteredBorrowings = useMemo(() => borrowings.filter(x =>
    [x.item,x.borrower,x.id,x.code].join(' ').toLowerCase().includes(search.toLowerCase()) &&
    (filter === 'All' || x.status === filter)
  ), [borrowings, search, filter]);
  const filteredRepairs = useMemo(() => repairs.filter(x =>
    [x.item,x.issue,x.assigned,x.id].join(' ').toLowerCase().includes(search.toLowerCase()) &&
    (filter === 'All' || x.status === filter)
  ), [repairs, search, filter]);
  const filteredSupplies = useMemo(() => supplies.filter(x =>
    [x.name,x.id,x.category].join(' ').toLowerCase().includes(search.toLowerCase()) &&
    (filter === 'All' || (filter === 'Low stock' && x.stock <= x.minimum) || x.category === filter)
  ), [supplies, search, filter]);

  const saveEquipment = () => {
    if (!form.name?.trim()) return notify('Please enter an equipment name.');
    if (selectedItem) setEquipment(prev => prev.map(x => x.id === selectedItem.id ? { ...x, ...form } : x));
    else setEquipment(prev => [{ id:`EQ-${String(Date.now()).slice(-4)}`, category:'Accessories', owner:'IT Department', ownership:'Department', condition:'Good', status:'Available', icon:'cable', serial:'Not assigned', updated:'Oct 23, 2026', ...form }, ...prev]);
    closeModal(); notify(selectedItem ? 'Equipment record updated.' : 'Equipment added successfully.');
  };
  const saveSupply = () => {
    if (!form.name?.trim()) return notify('Please enter a supply name.');
    if (selectedItem) setSupplies(prev => prev.map(x => x.id === selectedItem.id ? { ...x, ...form, stock:Number(form.stock)||0, minimum:Number(form.minimum)||0 } : x));
    else setSupplies(prev => [{ id:`SP-${String(Date.now()).slice(-3)}`, category:'General', unit:'pcs', stock:0, minimum:5, location:'Supply cabinet', ...form, stock:Number(form.stock)||0, minimum:Number(form.minimum)||0 }, ...prev]);
    closeModal(); notify('Supply record saved.');
  };
  const saveBorrow = () => {
    if (!form.item || !form.borrower) return notify('Select equipment and enter the borrower.');
    const eq = equipment.find(x => x.id === form.item);
    if (!eq) return notify('Equipment not found.');
    if (eq.status !== 'Available') return notify('This equipment is not currently available.');
    const record = { id:`BR-${String(Date.now()).slice(-4)}`, item:eq.name, code:eq.id, borrower:form.borrower, owner:eq.owner, borrowed:new Date().toLocaleString('en-US',{month:'short',day:'2-digit',year:'numeric',hour:'numeric',minute:'2-digit'}), due:form.due || 'Not set', status:'Borrowed', condition:form.condition || eq.condition };
    setBorrowings(prev => [record, ...prev]);
    setEquipment(prev => prev.map(x => x.id === eq.id ? { ...x, status:'Borrowed' } : x));
    closeModal(); notify('Borrowing recorded. Ask the borrower to acknowledge the release.');
  };
  const returnBorrow = (record) => {
    setBorrowings(prev => prev.map(x => x.id === record.id ? {...x, status:'Returned'} : x));
    setEquipment(prev => prev.map(x => x.id === record.code ? {...x, status:'Available', condition:record.condition || x.condition} : x));
    notify(`${record.item} marked as returned.`);
  };
  const saveRepair = () => {
    if (!form.item || !form.issue?.trim()) return notify('Select equipment and describe the problem.');
    const eq = equipment.find(x => x.id === form.item || x.name === form.item);
    const record = { id:`RP-${String(Date.now()).slice(-3)}`, item:eq?.name || form.item, code:eq?.id || '', issue:form.issue, reported:'Oct 23, 2026', assigned:form.assigned || 'Unassigned', status:'Pending', priority:form.priority || 'Medium' };
    setRepairs(prev => [record, ...prev]);
    if (eq) setEquipment(prev => prev.map(x => x.id === eq.id ? {...x, status:'Under repair', condition:'Needs repair'} : x));
    closeModal(); notify('Repair report created.');
  };
  const changeRepairStatus = (repair, status) => {
    setRepairs(prev => prev.map(x => x.id === repair.id ? {...x, status} : x));
    if (status === 'Completed') setEquipment(prev => prev.map(x => x.id === repair.code ? {...x, status:'Available', condition:'Good'} : x));
    notify(`Repair status updated to ${status}.`);
  };
  const lowStock = supplies.filter(s => s.stock <= s.minimum).length;
  const pendingRepairs = repairs.filter(r => r.status !== 'Completed').length;
  const borrowedCount = borrowings.filter(b => b.status === 'Borrowed' || b.status === 'Overdue').length;

  const tableSearch = <div className="table-tools"><div className="searchbox"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search records..." /></div><button className="btn btn-light btn-sm" onClick={()=>notify('Filter options are available from the dropdown.')}><Filter size={15}/> Filter</button></div>;

  const renderDashboard = () => <>
    <PageHeading eyebrow="OVERVIEW" title="Good morning, Admin 👋" subtitle="Here's what's happening with your equipment and supplies today." action={<button className="btn btn-primary" onClick={()=>openModal('borrow')}><Plus size={17}/> New transaction</button>} />
    <div className="welcome-banner"><div className="welcome-icon"><Boxes size={25}/></div><div><strong>Keep your equipment accountable.</strong><p>Track equipment, borrowing activity, repairs, and supply levels in one place.</p></div><button className="banner-link" onClick={()=>go('Equipment')}>View inventory <ArrowUpRight size={16}/></button></div>
    <div className="stats-grid">
      <Stat icon={Boxes} label="Total equipment" value={equipment.length} detail="Across all categories" tone="mint" />
      <Stat icon={ArrowLeftRight} label="Currently borrowed" value={borrowedCount} detail="Includes overdue items" tone="blue" />
      <Stat icon={Wrench} label="Open repairs" value={pendingRepairs} detail="Pending or in progress" tone="amber" />
      <Stat icon={Package} label="Low stock supplies" value={lowStock} detail="Needs your attention" tone="rose" />
    </div>
    <div className="dashboard-grid">
      <section className="panel"><div className="panel-head"><div><h2>Recent borrowing activity</h2><p>Latest equipment transactions</p></div><button className="text-btn" onClick={()=>go('Borrowing')}>View all <ArrowUpRight size={15}/></button></div>
        <div className="activity-list">{borrowings.slice(0,3).map((b,i)=><div className="activity-row" key={b.id}><div className={`activity-icon ${i===0?'mint':i===1?'blue':'gray'}`}><IconFor type={equipment.find(e=>e.id===b.code)?.icon || 'cable'} size={19}/></div><div className="activity-main"><strong>{b.item}</strong><span>{b.borrower} · {b.borrowed}</span></div><Status>{b.status}</Status></div>)}</div>
      </section>
      <section className="panel"><div className="panel-head"><div><h2>Needs attention</h2><p>Items that may need action</p></div><span className="tiny-count">{pendingRepairs + lowStock}</span></div>
        <div className="attention-list">{repairs.filter(r=>r.status!=='Completed').slice(0,2).map(r=><button className="attention-row" key={r.id} onClick={()=>go('Repairs')}><span className="attention-symbol orange"><Wrench size={17}/></span><span className="attention-copy"><strong>{r.item}</strong><small>{r.status} · {r.issue}</small></span><ChevronDown className="side-chevron" size={16}/></button>)}{supplies.filter(s=>s.stock<=s.minimum).slice(0,2).map(s=><button className="attention-row" key={s.id} onClick={()=>go('Supplies')}><span className="attention-symbol pink"><Package size={17}/></span><span className="attention-copy"><strong>{s.name}</strong><small>{s.stock===0?'Out of stock':`${s.stock} ${s.unit} remaining`} · Low stock</small></span><ChevronDown className="side-chevron" size={16}/></button>)}</div>
      </section>
    </div>
    <section className="panel inventory-panel"><div className="panel-head"><div><h2>Equipment overview</h2><p>A quick look at your registered equipment</p></div><button className="text-btn" onClick={()=>go('Equipment')}>See inventory <ArrowUpRight size={15}/></button></div>{renderEquipmentTable(equipment.slice(0,4),false)}</section>
  </>;

  function Stat({icon:Icon,label,value,detail,tone}) {
    return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={20}/></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-detail">{detail}</div></div>;
  }

  const renderEquipmentTable = (items, editable=true) => <div className="table-wrap"><table><thead><tr><th>Equipment</th><th>Ownership</th><th>Condition</th><th>Status</th>{editable&&<th></th>}</tr></thead><tbody>{items.map(item=><tr key={item.id}><td><div className="item-cell"><span className="item-icon"><IconFor type={item.icon}/></span><span><strong>{item.name}</strong><small>{item.id} · {item.category}</small></span></div></td><td><div className="owner-cell"><strong>{item.owner}</strong><small>{item.ownership}-owned</small></div></td><td><Status>{item.condition}</Status></td><td><Status>{item.status}</Status></td>{editable&&<td><button className="icon-btn" title="Edit equipment" onClick={()=>openModal('equipment',item)}><MoreHorizontal size={19}/></button></td>}</tr>)}</tbody></table>{!items.length&&<EmptyNote text="No equipment matches your search."/>}</div>;

  const renderEquipment = () => <>
    <PageHeading eyebrow="ASSET MANAGEMENT" title="Equipment inventory" subtitle="Keep track of equipment, ownership, condition, and availability." action={<button className="btn btn-primary" onClick={()=>openModal('equipment')}><Plus size={17}/> Add equipment</button>} />
    <div className="stats-strip"><div><span>Total equipment</span><strong>{equipment.length}</strong></div><div><span>Available</span><strong>{equipment.filter(x=>x.status==='Available').length}</strong></div><div><span>Borrowed</span><strong>{equipment.filter(x=>x.status==='Borrowed').length}</strong></div><div><span>Under repair</span><strong>{equipment.filter(x=>x.status==='Under repair').length}</strong></div></div>
    <section className="panel"><div className="panel-head"><div><h2>All equipment</h2><p>Equipment can be personally owned or department-managed.</p></div><button className="btn btn-light btn-sm" onClick={()=>notify('Demo export: connect a backend to export live records.')}><Download size={15}/> Export</button></div><div className="table-toolbar">{tableSearch}<select className="select-filter" value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option><option>Available</option><option>Borrowed</option><option>Under repair</option><option>Personal</option><option>Department</option></select></div>{renderEquipmentTable(filteredEquipment)}</section>
  </>;

  const renderBorrowing = () => <>
    <PageHeading eyebrow="TRANSACTION MANAGEMENT" title="Borrow & return" subtitle="Record who has each item, when it was borrowed, and when it is due." action={<button className="btn btn-primary" onClick={()=>openModal('borrow')}><Plus size={17}/> Record borrowing</button>} />
    <div className="stats-strip"><div><span>Active borrowings</span><strong>{borrowings.filter(x=>x.status==='Borrowed').length}</strong></div><div><span>Overdue</span><strong className="red-number">{borrowings.filter(x=>x.status==='Overdue').length}</strong></div><div><span>Returned</span><strong>{borrowings.filter(x=>x.status==='Returned').length}</strong></div><div><span>Total transactions</span><strong>{borrowings.length}</strong></div></div>
    <section className="panel"><div className="panel-head"><div><h2>Borrowing records</h2><p>Confirm the borrower's identity before releasing the item.</p></div><button className="btn btn-light btn-sm" onClick={()=>notify('Export is a prototype action.')}><Download size={15}/> Export</button></div><div className="table-toolbar">{tableSearch}<select className="select-filter" value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option><option>Borrowed</option><option>Overdue</option><option>Returned</option></select></div><div className="table-wrap"><table><thead><tr><th>Equipment / Transaction</th><th>Borrower</th><th>Borrowed at</th><th>Expected return</th><th>Status</th><th>Action</th></tr></thead><tbody>{filteredBorrowings.map(b=><tr key={b.id}><td><div className="owner-cell"><strong>{b.item}</strong><small>{b.id} · {b.code}</small></div></td><td><div className="owner-cell"><strong>{b.borrower}</strong><small>Owner: {b.owner}</small></div></td><td>{b.borrowed}</td><td>{b.due}</td><td><Status>{b.status}</Status></td><td>{b.status!=='Returned'?<button className="btn btn-light btn-sm" onClick={()=>{setSelectedItem(b);setModal('return')}}><ArrowDownLeft size={15}/> Return</button>:<span className="muted-text">Completed</span>}</td></tr>)}</tbody></table>{!filteredBorrowings.length&&<EmptyNote text="No borrowing records found."/>}</div></section>
    <div className="info-callout"><QrCode size={20}/><div><strong>Borrower verification matters</strong><p>A typed name alone does not prove who took the item. In the live system, require the borrower's account/PIN acknowledgment and an admin confirmation at release.</p></div></div>
  </>;

  const renderRepairs = () => <>
    <PageHeading eyebrow="MAINTENANCE" title="Repair monitoring" subtitle="Document equipment issues and track each repair until it is resolved." action={<button className="btn btn-primary" onClick={()=>openModal('repair')}><Plus size={17}/> Report a problem</button>} />
    <div className="stats-strip"><div><span>Open repairs</span><strong>{repairs.filter(x=>x.status!=='Completed').length}</strong></div><div><span>Pending</span><strong>{repairs.filter(x=>x.status==='Pending').length}</strong></div><div><span>In progress</span><strong>{repairs.filter(x=>x.status==='In progress').length}</strong></div><div><span>Completed</span><strong>{repairs.filter(x=>x.status==='Completed').length}</strong></div></div>
    <section className="panel"><div className="panel-head"><div><h2>Repair records</h2><p>Keep a clear history of reported faults and resolution.</p></div></div><div className="table-toolbar">{tableSearch}<select className="select-filter" value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option><option>Pending</option><option>In progress</option><option>Completed</option></select></div><div className="repair-list">{filteredRepairs.map(r=><article className="repair-card" key={r.id}><div className="repair-icon"><Wrench size={20}/></div><div className="repair-content"><div className="repair-top"><div><div className="repair-id">{r.id} <span>·</span> Reported {r.reported}</div><h3>{r.item}</h3></div><Status>{r.status}</Status></div><p>{r.issue}</p><div className="repair-meta"><span><UserRound size={14}/> Assigned: {r.assigned}</span><span className={`priority ${r.priority.toLowerCase()}`}><i/> {r.priority} priority</span></div></div><div className="repair-action"><label>Update status</label><select value={r.status} onChange={e=>changeRepairStatus(r,e.target.value)}><option>Pending</option><option>In progress</option><option>Completed</option></select></div></article>)}{!filteredRepairs.length&&<EmptyNote text="No repair records found."/>}</div></section>
  </>;

  const renderSupplies = () => <>
    <PageHeading eyebrow="STOCK MANAGEMENT" title="Supply inventory" subtitle="Monitor cleaning materials and other supplies used by the IT Department." action={<button className="btn btn-primary" onClick={()=>openModal('supply')}><Plus size={17}/> Add supply</button>} />
    <div className="stats-strip"><div><span>Supply items</span><strong>{supplies.length}</strong></div><div><span>Low stock</span><strong className="amber-number">{supplies.filter(s=>s.stock>0&&s.stock<=s.minimum).length}</strong></div><div><span>Out of stock</span><strong className="red-number">{supplies.filter(s=>s.stock===0).length}</strong></div><div><span>Categories</span><strong>{new Set(supplies.map(s=>s.category)).size}</strong></div></div>
    <section className="panel"><div className="panel-head"><div><h2>All supplies</h2><p>Record quantities received, released, and remaining.</p></div><button className="btn btn-light btn-sm" onClick={()=>notify('Export is a prototype action.')}><Download size={15}/> Export</button></div><div className="table-toolbar">{tableSearch}<select className="select-filter" value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option><option>Low stock</option>{[...new Set(supplies.map(s=>s.category))].map(c=><option key={c}>{c}</option>)}</select></div><div className="table-wrap"><table><thead><tr><th>Supply item</th><th>Category</th><th>Stock level</th><th>Minimum</th><th>Storage location</th><th></th></tr></thead><tbody>{filteredSupplies.map(s=><tr key={s.id}><td><div className="item-cell"><span className="item-icon supply-icon"><Package size={20}/></span><span><strong>{s.name}</strong><small>{s.id} · {s.unit}</small></span></div></td><td>{s.category}</td><td><div className="stock-cell"><strong>{s.stock} {s.unit}</strong><div className="stock-track"><span style={{width:`${Math.min(100,s.stock/Math.max(s.minimum*2,1)*100)}%`}} className={s.stock<=s.minimum?'low':''}/></div>{s.stock===0?<Status>Out of stock</Status>:s.stock<=s.minimum?<Status>Pending</Status>:<span className="stock-ok">In stock</span>}</div></td><td>{s.minimum} {s.unit}</td><td>{s.location}</td><td><button className="icon-btn" title="Edit supply" onClick={()=>openModal('supply',s)}><MoreHorizontal size={19}/></button></td></tr>)}</tbody></table>{!filteredSupplies.length&&<EmptyNote text="No supplies match your search."/>}</div></section>
  </>;

  const renderReports = () => <>
    <PageHeading eyebrow="INSIGHTS" title="Reports" subtitle="A summary of inventory, transactions, repairs, and supply status." action={<button className="btn btn-primary" onClick={()=>window.print()}><Download size={17}/> Print report</button>} />
    <div className="stats-grid"><Stat icon={Boxes} label="Registered equipment" value={equipment.length} detail="All ownership types" tone="mint"/><Stat icon={ArrowLeftRight} label="Borrowing records" value={borrowings.length} detail="All transactions" tone="blue"/><Stat icon={Wrench} label="Repair records" value={repairs.length} detail={`${pendingRepairs} still open`} tone="amber"/><Stat icon={Package} label="Supply items" value={supplies.length} detail={`${lowStock} low or out of stock`} tone="rose"/></div>
    <div className="dashboard-grid"><section className="panel"><div className="panel-head"><div><h2>Equipment status</h2><p>Current equipment availability</p></div></div>{['Available','Borrowed','Under repair'].map(st=><div className="report-bar" key={st}><div><span>{st}</span><strong>{equipment.filter(e=>e.status===st).length}</strong></div><div className="bar-track"><span style={{width:`${equipment.filter(e=>e.status===st).length/Math.max(equipment.length,1)*100}%`}}/></div></div>)}</section><section className="panel"><div className="panel-head"><div><h2>Repair status</h2><p>Current repair workload</p></div></div>{['Pending','In progress','Completed'].map(st=><div className="report-bar" key={st}><div><span>{st}</span><strong>{repairs.filter(r=>r.status===st).length}</strong></div><div className="bar-track"><span style={{width:`${repairs.filter(r=>r.status===st).length/Math.max(repairs.length,1)*100}%`}}/></div></div>)}</section></div>
    <section className="panel"><div className="panel-head"><div><h2>Low-stock items</h2><p>Supplies at or below their minimum stock level</p></div><button className="text-btn" onClick={()=>go('Supplies')}>Manage supplies <ArrowUpRight size={15}/></button></div>{supplies.filter(s=>s.stock<=s.minimum).length ? <div className="low-stock-list">{supplies.filter(s=>s.stock<=s.minimum).map(s=><div key={s.id}><span className="attention-symbol pink"><Package size={17}/></span><strong>{s.name}</strong><span>{s.stock} {s.unit} left</span><Status>{s.stock===0?'Out of stock':'Pending'}</Status></div>)}</div> : <EmptyNote text="All supplies are above their minimum stock level."/>}</section>
  </>;

  const renderSettings = () => <>
    <PageHeading eyebrow="PREFERENCES" title="Settings" subtitle="Manage profile and basic system preferences." />
    <section className="panel settings-panel"><div className="settings-profile"><div className="avatar large">AD</div><div><h2>Administrator</h2><p>admin@tanza.gov.ph</p><span className="role-pill">System administrator</span></div></div><div className="settings-section"><h3>System information</h3><div className="setting-line"><div><strong>System name</strong><p>Equipment and Supply Management System</p></div><span>ESMS v1.0</span></div><div className="setting-line"><div><strong>Department</strong><p>Tanza Municipal IT Department</p></div><span>Municipal IT</span></div><div className="setting-line"><div><strong>Record storage</strong><p>This demo stores changes in browser memory only.</p></div><Status>Prototype</Status></div></div><div className="info-callout"><CircleHelp size={20}/><div><strong>Before deployment</strong><p>Connect authentication and a database before using this system for real municipal records. This front-end prototype is not a secure production system yet.</p></div></div></section>
  </>;

  const content = {
    Dashboard:renderDashboard, Equipment:renderEquipment, Borrowing:renderBorrowing,
    Repairs:renderRepairs, Supplies:renderSupplies, Reports:renderReports, Settings:renderSettings
  }[page]?.();

  const modalTitle = modal==='equipment'?(selectedItem?'Edit equipment':'Add equipment'):modal==='supply'?(selectedItem?'Edit supply':'Add supply'):modal==='borrow'?'Record equipment borrowing':modal==='repair'?'Report equipment problem':modal==='return'?'Confirm equipment return':'';
  const field = (label,key,placeholder='',type='text',options=null) => <label className="form-field"><span>{label}</span>{options?<select value={form[key]||''} onChange={e=>updateForm(key,e.target.value)}><option value="">Select {label.toLowerCase()}</option>{options.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}</select>:<input type={type} placeholder={placeholder} value={form[key]||''} onChange={e=>updateForm(key,e.target.value)}/>}</label>;

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav?'open':''}`}>
      <div className="brand"><div className="brand-mark"><Boxes size={23}/></div><div><strong>Tanza<span>IT</span></strong><small>Equipment & Supply System</small></div><button className="mobile-close" onClick={()=>setMobileNav(false)}><X size={20}/></button></div>
      <div className="workspace-switch"><div className="municipal-seal">T</div><div><strong>Municipality of Tanza</strong><small>IT Department</small></div><ChevronDown size={15}/></div>
      <nav className="side-nav">{['WORKSPACE','MANAGEMENT'].map(group=><div className="nav-group" key={group}><div className="nav-label">{group}</div>{nav.filter(n=>n.group===group).map(n=><button key={n.id} className={`nav-item ${page===n.id?'active':''}`} onClick={()=>go(n.id)}><n.icon size={18}/><span>{n.label}</span>{n.count&&<span className="nav-count">{n.count}</span>}</button>)}</div>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><CircleHelp size={17}/></div><strong>Need a hand?</strong><p>Keep your inventory up to date for better tracking.</p><button onClick={()=>notify('Ask your system administrator for help.')}>Get help <ArrowUpRight size={14}/></button></div><div className="sidebar-user"><div className="avatar">AD</div><div><strong>Admin User</strong><small>Administrator</small></div><button className="icon-btn" onClick={()=>setProfileOpen(!profileOpen)}><MoreHorizontal size={19}/></button>{profileOpen&&<div className="profile-menu"><button onClick={()=>{go('Settings');setProfileOpen(false)}}><Settings size={15}/> Settings</button><button onClick={()=>notify('Demo logout only.')}><LogOut size={15}/> Log out</button></div>}</div></div>
    </aside>
    {mobileNav&&<div className="mobile-scrim" onClick={()=>setMobileNav(false)} />}
    <main className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="menu-toggle" onClick={()=>setMobileNav(true)}><Menu size={21}/></button><div className="breadcrumb">Workspace <span>/</span> <strong>{page}</strong></div></div><div className="topbar-right"><div className="today"><CalendarDays size={16}/><span>Friday, October 23, 2026</span></div><div className="notification-wrap"><button className="top-icon-btn" aria-label="Notifications" onClick={()=>setNotificationsOpen(!notificationsOpen)}><Bell size={19}/><i/></button>{notificationsOpen&&<div className="notification-pop"><strong>Notifications</strong><p><AlertTriangle size={15}/> {lowStock} supply items need attention.</p><p><Wrench size={15}/> {pendingRepairs} repairs are still open.</p></div>}</div><div className="top-profile"><div className="avatar">AD</div><div><strong>Admin User</strong><small>Administrator</small></div><ChevronDown size={15}/></div></div></header>
      <div className="page-content">{content}</div>
      <footer className="footer"><span>© 2026 Municipality of Tanza · IT Department</span><span><i/> All systems operational <b>·</b> Prototype data</span></footer>
    </main>
    {toast&&<div className="toast"><CheckCircle2 size={18}/>{toast}</div>}
    {modal&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)closeModal()}}><div className="modal"><div className="modal-head"><div><div className="eyebrow">RECORD MANAGEMENT</div><h2>{modalTitle}</h2></div><button className="icon-btn" onClick={closeModal}><X size={20}/></button></div>
      {modal==='equipment'&&<div className="form-grid">{field('Equipment name','name','e.g. Sony Alpha Camera')}{field('Category','category','', 'text',['Camera','Audio','Computer','Accessories','Networking'])}{field('Ownership','ownership','', 'text',['Personal','Department'])}{field('Owner / assigned personnel','owner','e.g. Mark Reyes')}{field('Condition','condition','', 'text',['Good','Fair','Needs repair'])}{field('Availability status','status','', 'text',['Available','Borrowed','Under repair','Unavailable'])}{field('Serial number','serial','Optional serial number')}</div>}
      {modal==='supply'&&<div className="form-grid">{field('Supply name','name','e.g. Microfiber cleaning cloth')}{field('Category','category','', 'text',['Cleaning','Accessories','Power','General'])}{field('Unit','unit','e.g. pcs / bottle')}{field('Quantity in stock','stock','0','number')}{field('Minimum stock level','minimum','5','number')}{field('Storage location','location','e.g. Supply cabinet')}</div>}
      {modal==='borrow'&&<div className="form-grid">{field('Equipment','item','', 'text',equipment.filter(e=>e.status==='Available').map(e=>({value:e.id,label:`${e.name} (${e.id})`})))}{field('Borrower full name','borrower','Enter registered borrower name')}{field('Expected return','due','','datetime-local')}{field('Condition before release','condition','', 'text',['Good','Fair','Needs repair'])}<div className="form-note full"><QrCode size={18}/><span>Verification step: confirm the borrower's identity and have them acknowledge the transaction before releasing the equipment.</span></div><label className="check-field full"><input type="checkbox" checked={!!form.ack} onChange={e=>updateForm('ack',e.target.checked)}/> I have verified the borrower and recorded the equipment condition.</label></div>}
      {modal==='repair'&&<div className="form-grid">{field('Equipment','item','', 'text',equipment.map(e=>({value:e.id,label:`${e.name} (${e.id})`})))}{field('Priority','priority','', 'text',['Low','Medium','High'])}{field('Assigned personnel','assigned','Name of technician')}{<label className="form-field full"><span>Reported problem / damage</span><textarea rows="4" placeholder="Describe the issue, symptoms, or damage..." value={form.issue||''} onChange={e=>updateForm('issue',e.target.value)}/></label>}</div>}
      {modal==='return'&&selectedItem&&<div className="return-summary"><div className="return-icon"><ArrowDownLeft size={22}/></div><h3>{selectedItem.item}</h3><p>Borrowed by {selectedItem.borrower}</p><div className="return-detail"><span>Transaction ID</span><strong>{selectedItem.id}</strong></div><div className="return-detail"><span>Condition on record</span><strong>{selectedItem.condition}</strong></div><label className="form-field"><span>Condition upon return</span><select value={form.returnCondition||selectedItem.condition} onChange={e=>updateForm('returnCondition',e.target.value)}><option>Good</option><option>Fair</option><option>Needs repair</option></select></label><label className="form-field"><span>Return remarks</span><textarea rows="2" placeholder="Optional notes..." value={form.remarks||''} onChange={e=>updateForm('remarks',e.target.value)}/></label><label className="check-field"><input type="checkbox" checked={!!form.returnAck} onChange={e=>updateForm('returnAck',e.target.checked)}/> I have checked the equipment condition.</label></div>}
      <div className="modal-actions"><button className="btn btn-light" onClick={closeModal}>Cancel</button><button className="btn btn-primary" onClick={()=>{if(modal==='equipment')saveEquipment();else if(modal==='supply')saveSupply();else if(modal==='borrow'){if(!form.ack)return notify('Confirm borrower verification before saving.');saveBorrow();}else if(modal==='repair')saveRepair();else if(modal==='return'){if(!form.returnAck)return notify('Confirm the return condition before completing.');const b=selectedItem;setBorrowings(prev=>prev.map(x=>x.id===b.id?{...x,status:'Returned',condition:form.returnCondition||x.condition}:x));setEquipment(prev=>prev.map(x=>x.id===b.code?{...x,status:form.returnCondition==='Needs repair'?'Under repair':'Available',condition:form.returnCondition||x.condition}:x));if(form.returnCondition==='Needs repair')setRepairs(prev=>[{id:`RP-${String(Date.now()).slice(-3)}`,item:b.item,code:b.code,issue:form.remarks||'Issue noted upon return',reported:'Oct 23, 2026',assigned:'Unassigned',status:'Pending',priority:'Medium'},...prev]);closeModal();notify('Return recorded successfully.');}}}><Check size={16}/>{modal==='return'?'Confirm return':'Save record'}</button></div>
    </div></div>}
  </div>;
}
