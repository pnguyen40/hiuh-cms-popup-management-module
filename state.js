/* Local prototype state. No production API requests. */
window.Popup = window.Popup || {};
Popup.State = (() => {
  const KEY = 'hiuh-popup-design-v1.0.0';
  const BASE_TIME = '2026-11-06T10:30:00+07:00';
  const image = 'assets/popup-reference.webp';
  const fields = ['image', 'alt', 'tag', 'category', 'title', 'description', 'cta', 'url'];
  const roles = ['Super Admin', 'Operator', 'Biên tập', 'Trưởng phòng Marketing', 'Phó phòng Marketing', 'Nhân viên Marketing'];
  function seed() {
    const common = {image, imageName:'cham-soc-suc-khoe.webp', alt:'Không gian thăm khám và tư vấn tại bệnh viện', tag:'Chăm sóc sức khỏe', category:'Dịch vụ y tế', description:'Tìm hiểu các dịch vụ và lựa chọn lịch khám phù hợp với bạn.', cta:'Tìm hiểu thêm', url:'/dich-vu?utm_source=popup', version:1, activated:false, updated:'2026-11-06T09:15:00+07:00'};
    return {
      clock:BASE_TIME, role:'Super Admin', nextId:8,
      items:[
        {...common, id:'POP-001', title:'Chủ động chăm sóc sức khỏe của bạn', status:'published', activated:true, publishAt:'2026-11-05T08:00', unpublishAt:'2026-11-15T23:59'},
        {...common, id:'POP-002', title:'Đặt lịch khám, thuận tiện hơn mỗi ngày', tag:'Lịch hẹn của bạn', cta:'Đặt lịch khám', url:'/dat-lich', status:'draft', publishAt:'', unpublishAt:'', updated:'2026-11-06T10:10:00+07:00'},
        {...common, id:'POP-003', title:'Cùng bạn chăm sóc sức khỏe gia đình', status:'published', publishAt:'2026-11-08T08:00', unpublishAt:'2026-11-20T23:59', updated:'2026-11-06T09:40:00+07:00'},
        {...common, id:'POP-004', title:'Tìm hiểu các chuyên khoa tại HIU Hospital', category:'Chuyên khoa', url:'/chuyen-khoa#khoa-san', status:'published', publishAt:'2026-11-12T08:00', unpublishAt:'', updated:'2026-11-05T16:45:00+07:00'},
        {...common, id:'POP-005', title:'Thông tin dịch vụ tháng 10', status:'published', activated:true, publishAt:'2026-10-01T08:00', unpublishAt:'2026-10-31T23:59', updated:'2026-10-31T15:00:00+07:00'},
        {...common, id:'POP-006', title:'Khám phá không gian chăm sóc tại HIU', status:'draft', activated:false, publishAt:'2026-10-20T08:00', unpublishAt:'', replaced:true, updated:'2026-11-05T08:00:00+07:00'},
        {...common, id:'POP-007', image:'', imageName:'', title:'Nội dung tháng 12', description:'', tag:'', category:'', cta:'', url:'', status:'draft', publishAt:'', unpublishAt:'', updated:'2026-11-04T14:20:00+07:00'}
      ]
    };
  }
  let data, loadWarning = '';
  try { data = JSON.parse(localStorage.getItem(KEY)) || seed(); if (!Array.isArray(data.items)) throw Error('invalid'); }
  catch { data = seed(); loadWarning = 'Không đọc được dữ liệu đã lưu. Đang dùng dữ liệu mẫu.'; }
  const ui = {search:'', config:'all', display:'all', order:'updated', filterOpen:false, screenState:'normal', failure:'', roleRevoked:false, sidebar:false};
  const time = v => v ? new Date(/[zZ]|[+]\d\d:\d\d$/.test(v) ? v : v + ':00+07:00').getTime() : null;
  const now = () => new Date(data.clock).getTime();
  const display = item => item.status === 'draft' ? 'hidden' : item.unpublishAt && time(item.unpublishAt) <= now() ? 'expired' : item.activated ? 'active' : 'hidden';
  const active = () => data.items.find(x => display(x) === 'active');
  const allowed = () => roles.includes(data.role) && !ui.roleRevoked;
  function persist(candidate) {
    try { localStorage.setItem(KEY, JSON.stringify(candidate)); data = candidate; return true; }
    catch { return false; }
  }
  function validate(form, required = false) {
    const errors = {};
    if(required) {
      for(const [key,label] of [['image','Chọn ảnh chính.'],['title','Nhập tiêu đề Popup.'],['cta','Nhập nhãn nút CTA.'],['url','Nhập đường dẫn CTA.']])
        if(!String(form[key] || '').trim()) errors[key] = label;
    }
    const url=String(form.url || '').trim();
    if(url && (url.length > 500 || !url.startsWith('/') || /https?:|\/\/|\\|[\u0000-\u0020]/i.test(url))) errors.url='Dùng đường dẫn nội bộ bắt đầu bằng /, tối đa 500 ký tự; không dùng http://, https:// hoặc //.';
    return errors;
  }
  function save(form, intent, version) {
    if(!allowed()) return {ok:false, kind:'permission', message:'Bạn không còn quyền quản lý Popup. Nội dung đang nhập được giữ lại để đối chiếu.'};
    const old=data.items.find(x => x.id === form.id);
    if(old && (old.version !== version || ui.failure === 'conflict')) { ui.failure=''; return {ok:false, kind:'conflict', message:'Popup đã được cập nhật ở phiên khác. Đối chiếu bản hiện tại trước khi lưu.', current:structuredClone(old)}; }
    const publishing = intent === 'publish' || intent === 'schedule' || intent === 'save' && old?.status === 'published';
    const errors = validate(form, publishing);
    if(!publishing && !fields.some(f => String(form[f] || '').trim())) errors.title='Nhập ít nhất một nội dung để lưu bản nháp.';
    if(publishing && form.unpublishAt && time(form.unpublishAt) <= (form.publishAt ? time(form.publishAt) : now())) errors.unpublishAt='Thời điểm gỡ cần sau thời điểm bắt đầu.';
    if(intent === 'schedule' && (!form.publishAt || time(form.publishAt) <= now())) errors.publishAt='Chọn thời điểm bắt đầu trong tương lai.';
    if(intent === 'publish' && form.unpublishAt && time(form.unpublishAt) <= now()) errors.unpublishAt='Chọn thời điểm gỡ trong tương lai hoặc để trống.';
    if(publishing && form.publishAt && time(form.publishAt) > now() && data.items.some(x=>x.id!==form.id && x.status==='published' && !x.activated && x.publishAt===form.publishAt)) errors.publishAt='Thời điểm bắt đầu trùng với một Popup khác. Chọn thời điểm khác trong bản thử này.';
    if(Object.keys(errors).length) return {ok:false,kind:'validation',errors};
    if(ui.failure === 'save') { ui.failure=''; return {ok:false,kind:'save',message:'Chưa lưu được Popup. Nội dung của bạn vẫn được giữ nguyên. Hãy thử lại.'}; }
    const candidate=structuredClone(data);
    const item={...form, id:old?.id || `POP-${String(candidate.nextId++).padStart(3,'0')}`, version:(old?.version || 0)+1, updated:data.clock};
    item.status = intent === 'draft' ? 'draft' : publishing ? 'published' : old?.status || 'draft';
    if(intent === 'publish') item.publishAt = '';
    item.activated = item.status === 'published' && (!item.publishAt || time(item.publishAt) <= now());
    if(old?.status === 'published' && intent === 'save' && old.activated && item.publishAt === old.publishAt) item.activated=true;
    let replaced='';
    if(item.activated && (!item.unpublishAt || time(item.unpublishAt)>now())) {
      candidate.items.forEach(x=>{if(x.id!==item.id && display(x)==='active') {replaced=x.title; x.status='draft'; x.activated=false; x.replaced=true; x.version++; x.updated=data.clock;}});
    }
    const idx=candidate.items.findIndex(x=>x.id===item.id);
    if(idx<0) candidate.items.unshift(item); else candidate.items[idx]=item;
    if(!persist(candidate)) return {ok:false,kind:'save',message:'Bộ nhớ trình duyệt không đủ để lưu. Thử chọn ảnh nhẹ hơn; nội dung và dữ liệu cũ vẫn được giữ.'};
    return {ok:true,item,replaced};
  }
  function toDraft(id) {
    const old=data.items.find(x=>x.id===id); if(!old) return {ok:false,message:'Không tìm thấy Popup.'};
    return save(structuredClone(old),'draft',old.version);
  }
  function advance(date) {
    const target=time(date); if(!target || target<now()) return {ok:false,message:'Chọn thời gian sau mốc mô phỏng hiện tại.'};
    const candidate=structuredClone(data);
    const due=candidate.items.filter(x=>x.status==='published' && !x.activated && x.publishAt && time(x.publishAt)>now() && time(x.publishAt)<=target).sort((a,b)=>time(a.publishAt)-time(b.publishAt));
    for(const item of due) {
      for(const other of candidate.items) if(other.id!==item.id && other.status==='published' && other.activated && (!other.unpublishAt || time(other.unpublishAt)>time(item.publishAt))) {other.status='draft';other.activated=false;other.replaced=true;other.version++;}
      item.activated=true;item.version++;
    }
    candidate.clock=new Date(target).toISOString();
    return persist(candidate) ? {ok:true} : {ok:false,message:'Không lưu được đồng hồ mô phỏng.'};
  }
  function reset(){ const ok=persist(seed()); Object.assign(ui,{search:'',config:'all',display:'all',failure:'',screenState:'normal',roleRevoked:false}); return ok; }
  function setRole(role){persist({...data,role});ui.roleRevoked=false;}
  function refresh(){try{const latest=JSON.parse(localStorage.getItem(KEY));if(latest&&Array.isArray(latest.items))data=latest;}catch{/* Keep readable in-memory data when storage is unavailable. */}}
  return {get data(){return data}, ui, image, roles, fields, time, now, display, active, allowed, validate, save, toDraft, advance, reset, setRole, refresh, loadWarning};
})();
