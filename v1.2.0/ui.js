Popup.UI = (() => {
  const S=Popup.State;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const paths={plus:'M12 5v14M5 12h14',close:'m6 6 12 12M6 18 18 6',chevron:'m9 5 7 7-7 7',down:'m6 9 6 6 6-6',back:'m12 5-7 7 7 7M5 12h14',search:'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',filter:'M4 6h16M7 12h10M10 18h4',clock:'M12 8v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',calendar:'M4 5h16v16H4zM8 3v4M16 3v4M4 11h16',eye:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',edit:'m15 5 4 4M4 20l4-1L21 6l-3-3L5 16z',more:'M12 5h.01M12 12h.01M12 19h.01',check:'m5 12 4 4L19 6',info:'M12 11v6M12 7h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',image:'M3 3h18v18H3zM3 17l6-6 4 4 3-3 5 5M8 7h.01',upload:'M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5',file:'M14 2H5v20h14V7zM14 2v6h5M8 13h8M8 17h6',grid:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',users:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M12 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M20 21v-2a4 4 0 0 0-3-4M16 3a4 4 0 0 1 0 8',shield:'M12 2 3 6v6c0 6 9 10 9 10s9-4 9-10V6z',monitor:'M3 3h18v14H3zM8 21h8M12 17v4',phone:'M7 2h10v20H7zM11 18h2',menu:'M4 6h16M4 12h16M4 18h16',external:'M14 3h7v7M21 3 10 14M11 3H3v18h18v-8',stop:'M5 5h14v14H5z',warning:'m12 3 10 18H2zM12 9v5M12 17h.01',refresh:'M21 7v5h-5M3 17v-5h5M5 7a8 8 0 0 1 13-2l3 7M3 12l3 7a8 8 0 0 0 13-2',bell:'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',activity:'M2 12h4l3-8 6 16 3-8h4',book:'M12 5c-3-3-7-3-10-2v16c4-1 7-1 10 2 3-3 6-3 10-2V3c-3-1-7-1-10 2v16',settings:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2'};
  function icon(name, cls=''){return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name] || paths.file}"/></svg>`;}
  function button(label, action, opts={}){return `<button type="button" class="btn ${opts.class||''}" data-action="${action}" ${opts.id?`data-id="${esc(opts.id)}"`:''} ${opts.disabled?'disabled':''} ${opts.title?`title="${esc(opts.title)}"`:''}>${opts.icon?icon(opts.icon):''}${label}</button>`;}
  function date(value, short=false) {if(!value)return 'Không đặt';const d=new Date(S.time(value));const day=new Intl.DateTimeFormat('vi-VN',{day:'2-digit',month:'2-digit',year:short?undefined:'numeric',timeZone:'Asia/Ho_Chi_Minh'}).format(d);const hour=new Intl.DateTimeFormat('vi-VN',{hour:'2-digit',minute:'2-digit',hourCycle:'h23',timeZone:'Asia/Ho_Chi_Minh'}).format(d);return `${day} · ${hour}`;}
  const displayLabels={hidden:'Ẩn',active:'Đang có hiệu lực',expired:'Hết hạn'};
  function badge(value){const cfg=value==='published'||value==='draft';return `<span class="badge ${esc(value)}">${!cfg?'<span class="status-dot"></span>':''}${cfg?(value==='published'?'Xuất bản':'Nháp'):displayLabels[value]}</span>`;}
  function navItem(label,ic,active=false){return `<div class="nav-item ${active?'current':''}">${icon(ic)}<span>${label}</span></div>`;}
  function shell(content, heading='Popup & Màn hình chờ', editor=false){
    const restricted=!['Super Admin','Biên tập'].includes(S.data.role);
    document.querySelector('#app').innerHTML=`
      <aside class="sidebar ${S.ui.sidebar?'is-open':''}" aria-label="Điều hướng chính">
        <div class="brand"><svg viewBox="0 0 34 38" aria-hidden="true"><path d="M3 3h12v5h-3v9h10V8h-3V3h12v5h-3v23h3v5H19v-5h3V22H12v9h3v5H3v-5h3V8H3z" fill="currentColor"/></svg><div><strong>HIU Hospital</strong><span>Vận hành nội bộ</span></div></div>
        <div class="nav-scroll">
          ${!restricted?`<p class="nav-label">VẬN HÀNH</p>${navItem('Hàng đợi ghi','file')}${navItem('Hàng đợi đọc','book')}<p class="nav-label">THU NGÂN & LÂM SÀNG</p>${navItem('Xác nhận thanh toán','grid')}${navItem('Sinh hiệu','activity')}${navItem('Chi phí lượt khám','file')}`:''}
          <p class="nav-label">NỘI DUNG & KHÁCH HÀNG</p>
          <div class="nav-item section-active">${icon('file')}<span>Quản lý nội dung</span>${icon('down')}</div>
          <a class="subnav current" href="#list" aria-current="page">${restricted?'Popup & Màn hình chờ':'Tin tức & Truyền thông'}</a>
          ${!restricted?`<div class="subnav">Dịch vụ & Bảng giá</div><div class="subnav">Chuyên khoa & Cơ sở vật chất</div><div class="subnav">Tuyển dụng</div><div class="subnav">Trang website</div><div class="subnav">Mục đã xoá & Nhật ký</div>${navItem('Quản lý bác sĩ','users')}<p class="nav-label">SALE CRM</p>${navItem('Dashboard Giám sát','grid')}${navItem('Hồ sơ tư vấn (B2C)','file')}${navItem('Danh bạ Liên hệ','users')}<p class="nav-label">CSKH</p>${navItem('Tiếp nhận & Xử lý','users')}${navItem('Phiếu yêu cầu','file')}<p class="nav-label">HỆ THỐNG</p>${navItem('Quản trị hệ thống','shield')}`:''}
        </div>
        <button class="profile" data-action="review"><span class="avatar">M</span><span><strong>Minh Anh</strong><small>${esc(S.data.role)}</small></span>${icon('chevron')}</button>
      </aside>
      <div class="workspace"><header class="topbar"><button class="icon-btn sidebar-toggle" data-action="sidebar" aria-label="Mở điều hướng">${icon('menu')}</button><div><h1>${heading}</h1><p>Quản lý nội dung <span>›</span> Tin tức & Truyền thông ${editor?'<span>›</span> Popup & Màn hình chờ':''}</p></div><button class="design-switch" data-action="review">${icon('settings')}<span>Bản thiết kế</span><span class="demo-dot"></span></button></header>
      <main id="main" tabindex="-1" class="main ${editor?'editor-main':''}">${content}</main><footer class="prototype-footer"><span>v1.2.0 · Dữ liệu minh họa · Lưu trên trình duyệt này</span><button data-action="review">Kịch bản thử ${icon('chevron')}</button></footer></div>`;
  }

  function tabs(){
    const restricted=!['Super Admin','Biên tập'].includes(S.data.role);
    return `<div class="tabs" aria-label="Các mục quản lý nội dung">${restricted?'':['Bài viết & Tin tức','Tag tin tức','Góc báo chí','Banner & Quảng cáo'].map(label=>`<span class="tab inactive" title="Ngoài phạm vi prototype">${esc(label)}</span>`).join('')}<a href="#list" class="tab selected" aria-current="page">Quản lý Popup</a></div>`;
  }
  window.addEventListener('resize',()=>{
    const tabbar=document.querySelector('.tabs');
    if(tabbar)tabbar.scrollLeft=tabbar.scrollWidth;
  });
  function platformOverview(){
    return `<section class="platform-overview" aria-label="Nội dung có hiệu lực theo nền tảng">${Object.entries(S.platforms).map(([platform,label])=>{
      const item=S.active(platform);
      const slot=item?S.imageSlot(item,platform):null;
      const src=item?.[slot];
      const alt=item?.[slot==='image'?'alt':'portraitAlt']||item?.title||'';
      return `<div data-platform="${platform}">
        <span class="platform-label">${icon(platform==='web'?'monitor':platform==='kiosk'?'grid':'phone')}${label}</span>
        <div class="platform-thumbnail ${src?'':'is-unavailable'}">
          ${src?`<img src="${esc(src)}" alt="${esc(label+': '+alt)}">`:''}
          <span class="platform-thumbnail-empty">${icon('image')}<span>${item?'Chưa có ảnh':'Chưa có ảnh hiển thị'}</span></span>
        </div>
        <strong>${item?esc(item.title):'Chưa có nội dung'}</strong>
        <small>${platform==='kiosk'?'Màn hình chờ khi máy rảnh':'Popup'} · ${item?esc(item.id):'Mặc định'}</small>
        ${button('Trải nghiệm','client',{id:platform,class:'text-btn small-btn',icon:'external'})}
      </div>`;
    }).join('')}</section>`;
  }
  const chips=ps=>ps.map(p=>`<span class="platform-chip">${esc(S.platforms[p])}</span>`).join('');
  function platformTabs(value='all', selected=S.ui.platform, includeAll=true) {
    const entries=includeAll?[['all','Tất cả'],...Object.entries(S.platforms)]:Object.entries(S.platforms).filter(([p])=>value.includes(p));
    return `<div class="platform-tabs" role="tablist" aria-label="${includeAll?'Lọc nền tảng':'Cấu hình và xem trước nền tảng'}">${entries.map(([p,label])=>`<button type="button" role="tab" aria-selected="${p===selected}" aria-controls="${includeAll?'table-region':'platform-panel'}" tabindex="${p===selected?'0':'-1'}" class="${p===selected?'selected':''}" data-action="${includeAll?'platform-filter':'editor-platform'}" data-id="${p}">${label}${includeAll?`<span>${S.data.items.filter(x=>p==='all'||x.platforms.includes(p)).length}</span>`:''}</button>`).join('')}</div>`;
  }
  function list(){
    if(!S.allowed()){shell(`<div class="access-state">${icon('shield')}<h2>Bạn chưa có quyền quản lý nội dung</h2><p>Liên hệ quản trị viên để được cấp quyền.</p>${button('Chọn vai trò thử','review')}</div>`);return;}
    shell(`${tabs()}<div class="page-heading"><div><h2>Popup & Màn hình chờ</h2><p>Một nội dung, nhiều nền tảng. Chung lịch xuất bản và trạng thái.</p></div>${button('Tạo thông điệp','new',{icon:'plus',class:'primary'})}</div>
      ${platformOverview()}
      ${platformTabs()}
      <div class="list-toolbar"><div class="toolbar-left">${button('Bộ lọc','filters',{icon:'filter'})}<span id="result-count" class="muted"></span></div><label class="search">${icon('search')}<input id="search" type="search" aria-label="Tìm nội dung" placeholder="Tìm tiêu đề hoặc mã nội dung…" value="${esc(S.ui.search)}"></label></div>
      <section id="filter-panel" class="filter-panel ${S.ui.filterOpen?'':'hidden'}" aria-label="Bộ lọc"><label>Cấu hình<select id="config-filter"><option value="all">Tất cả</option><option value="draft">Nháp</option><option value="published">Xuất bản</option></select></label><label>Hiệu lực<select id="display-filter"><option value="all">Tất cả</option><option value="active">Đang có hiệu lực</option><option value="hidden">Ẩn</option><option value="expired">Hết hạn</option></select></label><label>Sắp xếp<select id="sort"><option value="updated">Cập nhật mới nhất</option><option value="schedule">Lịch bắt đầu</option><option value="title">Tiêu đề A–Z</option></select></label>${button('Xóa bộ lọc','clear-filters',{class:'text-btn'})}</section>
      <div id="table-region" role="tabpanel" aria-label="Danh sách nội dung" aria-live="polite"></div>
      <div class="list-footnote">${icon('info')}<span>Cần lịch khác nhau? Sao chép thành record độc lập. Chuyển về Nháp luôn dừng toàn bộ nền tảng của record.</span></div>`);
    const tabbar=document.querySelector('.tabs');
    tabbar.scrollLeft=tabbar.scrollWidth;
    document.querySelectorAll('.platform-thumbnail img').forEach(img=>{
      const showImageError=()=>{
        img.parentElement.classList.add('is-unavailable');
        img.parentElement.querySelector('.platform-thumbnail-empty>span').textContent='Không tải được ảnh';
      };
      img.addEventListener('error',showImageError,{once:true});
      if(img.complete&&!img.naturalWidth)showImageError();
    });
    document.querySelector('#config-filter').value=S.ui.config;document.querySelector('#display-filter').value=S.ui.display;document.querySelector('#sort').value=S.ui.order;renderRows();
  }
  function renderRows(){
    const region=document.querySelector('#table-region');if(!region)return;
    const q=S.ui.search.toLocaleLowerCase('vi');
    const rows=S.data.items.filter(x=>(x.title+' '+x.id).toLocaleLowerCase('vi').includes(q)&&(S.ui.platform==='all'||x.platforms.includes(S.ui.platform))&&(S.ui.config==='all'||x.status===S.ui.config)&&(S.ui.display==='all'||S.display(x)===S.ui.display));
    rows.sort(S.ui.order==='title'?(a,b)=>a.title.localeCompare(b.title,'vi'):S.ui.order==='schedule'?(a,b)=>(S.time(a.publishAt)||Infinity)-(S.time(b.publishAt)||Infinity):(a,b)=>S.time(b.updated)-S.time(a.updated));
    document.querySelector('#result-count').textContent=rows.length+' nội dung';
    if(S.ui.screenState==='loading'){region.innerHTML='<div class="empty-state table-card" aria-busy="true">Đang tải danh sách…</div>';return;}
    if(S.ui.screenState==='error'){region.innerHTML=`<div class="empty-state table-card">${icon('warning')}<h3>Chưa tải được danh sách</h3><p>Dữ liệu đang có được giữ nguyên.</p>${button('Thử lại','retry',{class:'primary'})}</div>`;return;}
    if(!rows.length||S.ui.screenState==='empty'){region.innerHTML=`<div class="empty-state table-card">${icon('search')}<h3>Chưa có nội dung phù hợp</h3><p>Tạo nội dung mới hoặc điều chỉnh tìm kiếm và bộ lọc.</p>${button('Xóa bộ lọc','clear-filters')}${button('Tạo nội dung','new',{class:'primary'})}</div>`;return;}
    region.innerHTML=`<div class="table-card"><div class="table-scroll" tabindex="0" aria-label="Bảng nội dung, cuộn ngang trên màn hình nhỏ"><table><caption class="sr-only">Danh sách nội dung đa nền tảng</caption><thead><tr><th class="content-col">NỘI DUNG</th><th>NỀN TẢNG</th><th>CẤU HÌNH</th><th>HIỆU LỰC</th><th>LỊCH CHUNG</th><th><span class="sr-only">Thao tác</span></th></tr></thead><tbody>${rows.map(x=>`<tr><td><button class="popup-cell" data-action="edit" data-id="${x.id}">${x.image||x.portrait?`<img src="${esc(x.image||x.portrait)}" alt="">`:`<span class="thumbnail-placeholder">${icon('image')}</span>`}<span><strong>${esc(x.title||'Chưa có tiêu đề')}</strong><small>${x.id}</small></span></button></td><td><div class="platform-chips">${chips(x.platforms)}</div></td><td>${badge(x.status)}</td><td>${badge(S.display(x))}${x.status==='published'&&!x.activated&&S.display(x)!=='expired'?'<small class="schedule-note">Chờ đến lịch</small>':''}${x.replaced?'<small class="schedule-note">Đã bị thay thế</small>':''}</td><td class="schedule-cell"><span>${x.publishAt?date(x.publishAt):x.status==='draft'?'Chưa đặt lịch':'Xuất bản ngay'}</span><small>${x.unpublishAt?'đến '+date(x.unpublishAt):'Không đặt thời điểm gỡ'}</small></td><td><button class="icon-btn" data-action="row-menu" data-id="${x.id}" aria-haspopup="menu" aria-label="Thao tác ${x.id}">${icon('more')}</button></td></tr>`).join('')}</tbody></table></div><div class="table-footer"><span>${rows.length} trên ${S.data.items.length} record</span><span>Mỗi record có một lịch chung</span></div></div>`;
  }
  let toastTimer;
  function toast(message,error=false){const el=document.querySelector('#toast-region');el.innerHTML=`<div class="toast ${error?'error':''}">${icon(error?'warning':'check')}<span>${esc(message)}</span><button class="icon-btn" aria-label="Đóng thông báo" data-action="close-toast">${icon('close')}</button></div>`;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.innerHTML='',7000);}
  function rowMenu(id,anchor){
    const x=S.data.items.find(i=>i.id===id),menu=document.querySelector('#row-menu');
    menu.innerHTML=`<div role="menu">${button('Xem trước','preview',{id,icon:'eye'})}${button('Chỉnh sửa','edit',{id,icon:'edit'})}${button('Sao chép thành bản nháp','duplicate',{id,icon:'file'})}${x.status==='draft'?button('Chuẩn bị xuất bản','edit',{id,icon:'external'}):button('Chuyển cả record về Nháp','draft-row',{id,icon:'stop'})}</div>`;
    menu.showPopover();const r=anchor.getBoundingClientRect();menu.style.left=Math.max(12,Math.min(r.right-260,innerWidth-272))+'px';menu.style.top=Math.max(12,Math.min(r.bottom+6,innerHeight-menu.offsetHeight-12))+'px';
  }
  function hideMenu(){const m=document.querySelector('#row-menu');if(m.matches(':popover-open'))m.hidePopover();}
  function popupMarkup(form,small=false,platform='web'){
    const slot=S.imageSlot(form,platform),src=form[slot],alt=form[slot==='image'?'alt':'portraitAlt'];
    if(platform==='kiosk')return `<article class="kiosk-screen"><div class="kiosk-brand">HIU Hospital <small>Màn hình chờ</small></div><div class="kiosk-art">${src?`<img src="${esc(src)}" alt="${esc(alt)}">`:`<div class="photo-placeholder">${icon('image')}<span>Chưa có ảnh dọc</span></div>`}</div><div class="kiosk-start"><p>Chạm để bắt đầu sử dụng</p><button class="btn primary" data-action="kiosk-start">Bắt đầu ${icon('chevron')}</button></div></article>`;
    return `<article class="website-popup ${small?'small':''} ${platform!=='web'?'app-popup':''}"><div class="popup-photo ${src?'':'photo-placeholder'}">${src?`<img src="${esc(src)}" alt="${esc(alt)}">`:`${icon('image')}<span>Chưa có ${slot==='image'?'ảnh ngang':'ảnh dọc'}</span>`}${form.tag?`<span class="floating-tag">${esc(form.tag)}</span>`:''}</div><div class="popup-copy">${form.category?`<p class="popup-category">${esc(form.category)}</p>`:''}<h2>${esc(form.title||'Tiêu đề nội dung')}</h2>${form.description?`<p class="popup-description">${esc(form.description)}</p>`:''}<div class="popup-buttons"><button class="btn primary" data-action="visitor-cta">${esc(form.cta||'Nhãn CTA')}${icon('chevron')}</button><button class="btn text-btn" data-action="visitor-close">Để sau</button></div><p class="dismiss-note">Đóng để không hiển thị lại nội dung này.</p></div><button class="popup-close icon-btn" data-action="visitor-close" aria-label="Đóng Popup">${icon('close')}</button></article>`;
  }
  return {esc,icon,button,date,badge,shell,list,renderRows,toast,rowMenu,hideMenu,popupMarkup,chips,platformTabs};
})();
