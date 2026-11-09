/* v1.2.0: one record, one schedule and one status across selected platforms. */
window.Popup = window.Popup || {};
Popup.State = (() => {
  const KEY = 'hiuh-popup-design-v1.2.0';
  const platforms = {web:'Web', mobile:'Mobile', kiosk:'Kiosk', doctor:'Dr App'};
  const roles = ['Super Admin','Operator','Biên tập','Trưởng phòng Marketing','Phó phòng Marketing','Nhân viên Marketing'];
  const image = 'assets/popup-reference.webp';
  const portrait = 'assets/portrait-demo.svg';
  const fields = ['image','portrait','alt','portraitAlt','tag','category','title','description','cta'];
  const routes = {
    mobile:[['appointments','Đặt lịch khám'],['services','Dịch vụ bệnh viện'],['notifications','Thông báo']],
    doctor:[['schedule','Lịch làm việc'],['announcements','Thông báo nội bộ'],['directory','Danh bạ']]
  };
  const blank = () => ({id:'',title:'',image:'',imageName:'',portrait:'',portraitName:'',alt:'',portraitAlt:'',tag:'',category:'',description:'',cta:'',platforms:['web'],configs:{web:{url:''},mobile:{route:''},kiosk:{},doctor:{route:'',imageSlot:'portrait'}},publishAt:'',unpublishAt:'',status:'draft',activated:false});
  function seed() {
    const base = {...blank(),image,imageName:'popup-reference.webp',portrait,portraitName:'portrait-demo.svg',alt:'Ảnh tham chiếu truyền thông HIUH',portraitAlt:'Nội dung minh họa cho màn hình dọc',tag:'HIU Hospital',category:'Thông tin bệnh viện',description:'Tìm hiểu thông tin và lựa chọn dịch vụ phù hợp với bạn.',cta:'Xem thông tin',version:1,updated:'2026-11-09T09:00:00+07:00',configs:{web:{url:'/dich-vu?utm_source=popup'},mobile:{route:'services'},kiosk:{},doctor:{route:'announcements',imageSlot:'portrait'}}};
    return {clock:'2026-11-09T10:30:00+07:00',role:'Super Admin',nextId:7,items:[
      {...structuredClone(base),id:'POP-001',title:'Chủ động chăm sóc sức khỏe',platforms:['web'],status:'published',activated:true,publishAt:'2026-11-09T08:00',unpublishAt:'2026-11-15T23:59'},
      {...structuredClone(base),id:'POP-002',title:'Đặt lịch khám trên ứng dụng',platforms:['mobile'],status:'published',activated:true,publishAt:'2026-11-09T08:00',unpublishAt:'2026-11-18T23:59'},
      {...structuredClone(base),id:'POP-003',title:'Chào mừng đến HIU Hospital',platforms:['kiosk'],status:'published',activated:true,publishAt:'2026-11-09T08:00',unpublishAt:''},
      {...structuredClone(base),id:'POP-004',title:'Thông tin dành cho bác sĩ',platforms:['doctor'],status:'draft'},
      {...structuredClone(base),id:'POP-005',title:'Thông tin bệnh viện tháng 11',platforms:['web','mobile','kiosk'],status:'published',activated:false,publishAt:'2026-11-12T08:00',unpublishAt:'2026-11-20T23:59'},
      {...structuredClone(base),id:'POP-006',title:'Nội dung đang chuẩn bị',platforms:['web','mobile'],portrait:'',portraitName:'',status:'draft',updated:'2026-11-09T10:00:00+07:00'}
    ]};
  }
  const time = value => {
    if(!value)return null;
    return new Date(/(Z|[+-]\d{2}:\d{2})$/i.test(value)?value:value.length===16?value+':00+07:00':value+'+07:00').getTime();
  };
  let data,loadWarning='';
  try {data=JSON.parse(localStorage.getItem(KEY))||seed();if(!Array.isArray(data.items))throw Error('invalid');}
  catch {data=seed();loadWarning='Không đọc được dữ liệu đã lưu; đang dùng dữ liệu minh họa.';}
  const ui={search:'',platform:'all',config:'all',display:'all',order:'updated',filterOpen:false,sidebar:false,screenState:'normal',failure:'',roleRevoked:false};
  const now=()=>time(data.clock);
  const displayAt=(item,at)=>item.status==='draft'?'hidden':item.unpublishAt&&time(item.unpublishAt)<=at?'expired':item.activated?'active':'hidden';
  const display=item=>displayAt(item,now());
  const active=platform=>data.items.find(x=>display(x)==='active'&&x.platforms.includes(platform));
  const activeItems=()=>data.items.filter(x=>display(x)==='active');
  const overlap=(a,b)=>a.platforms.some(p=>b.platforms.includes(p));
  const conflicts=form=>activeItems().filter(x=>x.id!==form.id&&overlap(x,form));
  const allowed=()=>roles.includes(data.role)&&!ui.roleRevoked;
  const imageSlot=(form,p)=>p==='web'?'image':p==='doctor'&&form.configs.doctor.imageSlot==='landscape'?'image':'portrait';
  function persist(candidate) {
    try {localStorage.setItem(KEY,JSON.stringify(candidate));data=candidate;return true;}catch{return false;}
  }
  function validate(form,required=false) {
    const e={};
    if(required&&!form.platforms.length)e.platforms='Chọn ít nhất một nền tảng.';
    if(required&&!form.title.trim())e.title='Nhập tiêu đề để nhận diện nội dung.';
    if(required)for(const p of form.platforms) {
      const slot=imageSlot(form,p);
      if(!form[slot])e[slot]=slot==='image'?'Bổ sung ảnh ngang cho nền tảng đã chọn.':'Bổ sung ảnh dọc cho Mobile, Kiosk hoặc Dr App dùng ảnh dọc.';
      if(p!=='kiosk'&&!form.cta.trim())e.cta='Nhập nhãn CTA cho các nền tảng Popup.';
      if(p==='web'&&!form.configs.web.url.trim())e['web-url']='Nhập đường dẫn nội bộ Website.';
      if(routes[p]&&!routes[p].some(([value])=>value===form.configs[p].route))e[p+'-route']='Chọn đích nội bộ của ứng dụng.';
    }
    const url=form.configs.web.url.trim();
    if(form.platforms.includes('web')&&url&&(url.length>500||!url.startsWith('/')||/https?:|\/\/|\\|[\u0000-\u0020]/i.test(url)))e['web-url']='Đường dẫn bắt đầu bằng /, tối đa 500 ký tự; không nhận HTTP, HTTPS hoặc //.';
    return e;
  }
  function save(form,intent,version) {
    if(!allowed())return {ok:false,kind:'permission',message:'Bạn không còn quyền quản lý nội dung. Dữ liệu đang nhập được giữ lại.'};
    const old=data.items.find(x=>x.id===form.id);
    if(old&&(old.version!==version||ui.failure==='conflict')){ui.failure='';return {ok:false,kind:'conflict',message:'Record đã được cập nhật ở phiên khác. Nạp bản mới nhất trước khi lưu.',current:structuredClone(old)};}
    if(old?.status==='published'&&intent!=='draft'&&[...old.platforms].sort().join()!==[...form.platforms].sort().join())return {ok:false,kind:'validation',errors:{platforms:'Chuyển cả record về Nháp trước khi đổi nền tảng.'}};
    const publishing=['publish','schedule'].includes(intent)||intent==='save'&&old?.status==='published';
    const item=structuredClone(form);
    if(intent==='publish')item.publishAt='';
    const errors=validate(item,publishing);
    if(!publishing&&!item.title.trim()&&!item.image&&!item.portrait)errors.title='Nhập tiêu đề hoặc chọn ảnh để lưu nháp.';
    for(const key of ['publishAt','unpublishAt'])if(item[key]&&!Number.isFinite(time(item[key])))errors[key]='Thời điểm không hợp lệ.';
    if(publishing&&item.unpublishAt&&time(item.unpublishAt)<=(item.publishAt?time(item.publishAt):now()))errors.unpublishAt='Thời điểm gỡ phải sau thời điểm bắt đầu.';
    if(intent==='schedule'&&(!item.publishAt||time(item.publishAt)<=now()))errors.publishAt='Chọn thời điểm bắt đầu trong tương lai.';
    if(publishing&&item.publishAt&&time(item.publishAt)>now()&&data.items.some(x=>x.id!==item.id&&x.status==='published'&&!x.activated&&x.publishAt===item.publishAt&&overlap(x,item)))errors.publishAt='Trùng giờ bắt đầu với record có cùng nền tảng. Chọn mốc khác trong bản thử.';
    if(Object.keys(errors).length)return {ok:false,kind:'validation',errors};
    if(ui.failure==='save'){ui.failure='';return {ok:false,kind:'save',message:'Chưa lưu được nội dung. Phần đang nhập và dữ liệu cũ được giữ nguyên.'};}
    const candidate=structuredClone(data);
    Object.assign(item,{id:old?.id||'POP-'+String(candidate.nextId++).padStart(3,'0'),version:(old?.version||0)+1,updated:data.clock,status:intent==='draft'?'draft':publishing?'published':'draft'});
    item.activated=item.status==='published'&&(!item.publishAt||time(item.publishAt)<=now());
    item.replaced=false;
    const replaced=[];
    if(item.activated&&displayAt(item,now())==='active')for(const x of candidate.items)if(x.id!==item.id&&displayAt(x,now())==='active'&&overlap(x,item)){
      replaced.push({id:x.id,title:x.title,platforms:[...x.platforms]});
      Object.assign(x,{status:'draft',activated:false,replaced:true,version:x.version+1,updated:data.clock});
    }
    const index=candidate.items.findIndex(x=>x.id===item.id);
    if(index<0)candidate.items.unshift(item);else candidate.items[index]=item;
    if(!persist(candidate))return {ok:false,kind:'save',message:'Không lưu được vào bộ nhớ trình duyệt. Thử ảnh nhẹ hơn; dữ liệu cũ chưa thay đổi.'};
    return {ok:true,item,replaced};
  }
  function toDraft(id){const x=data.items.find(i=>i.id===id);return x?save(x,'draft',x.version):{ok:false,message:'Không tìm thấy record.'};}
  function duplicate(id) {
    const x=data.items.find(i=>i.id===id);if(!x)return {ok:false,message:'Không tìm thấy record nguồn.'};
    return save({...structuredClone(x),id:'',title:x.title+' — Bản sao',status:'draft',activated:false,replaced:false,publishAt:'',unpublishAt:''},'draft',0);
  }
  function advance(value) {
    const target=time(value);if(!Number.isFinite(target)||target<=now())return {ok:false,message:'Chọn thời điểm sau đồng hồ hiện tại.'};
    const candidate=structuredClone(data);
    const due=candidate.items.filter(x=>x.status==='published'&&!x.activated&&x.publishAt&&time(x.publishAt)>now()&&time(x.publishAt)<=target).sort((a,b)=>time(a.publishAt)-time(b.publishAt));
    for(const item of due){
      const at=time(item.publishAt);
      if(item.status!=='published')continue;
      for(const other of candidate.items)if(other.id!==item.id&&displayAt(other,at)==='active'&&overlap(other,item))Object.assign(other,{status:'draft',activated:false,replaced:true,version:other.version+1,updated:new Date(at).toISOString()});
      item.activated=true;item.version++;
    }
    candidate.clock=new Date(target).toISOString();
    return persist(candidate)?{ok:true}:{ok:false,message:'Không lưu được đồng hồ mô phỏng.'};
  }
  function reset(){const ok=persist(seed());Object.assign(ui,{platform:'all',search:'',config:'all',display:'all',failure:'',screenState:'normal',roleRevoked:false});return ok;}
  function setRole(role){persist({...data,role});ui.roleRevoked=false;}
  function refresh(){try{const v=JSON.parse(localStorage.getItem(KEY));if(v&&Array.isArray(v.items))data=v;}catch{}}
  return {KEY,platforms,routes,roles,fields,image,portrait,blank,ui,get data(){return data},loadWarning,time,now,display,active,activeItems,conflicts,overlap,imageSlot,allowed,validate,save,toDraft,duplicate,advance,reset,setRole,refresh};
})();
