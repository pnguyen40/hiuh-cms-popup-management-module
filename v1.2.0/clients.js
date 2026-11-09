Popup.Clients = (() => {
  const S=Popup.State,U=Popup.UI;
  const closedKey='hiuh-popup-v1.2.0-dismissed',seenKey='hiuh-popup-v1.2.0-seen';
  let platform='web',selected=null,previewing=false,previewPlatform='web',previewForm=null;
  let generation=0,timer,path='/',size='1440',kioskBusy=false,broken=false;
  const read=(storage,key)=>{try{return JSON.parse(storage.getItem(key))||[];}catch{return [];}};
  function record(storage,key,id){try{storage.setItem(key,JSON.stringify([...new Set([...read(storage,key),id])]))}catch{}}
  const mark=()=>platform+':'+selected.id;
  function cancel(){generation++;clearTimeout(timer);document.querySelector('#visitor-dialog')?.close();}
  function preview(form,p){
    previewForm=structuredClone(form);previewPlatform=p||form.platforms[0]||'web';previewing=true;
    const d=document.querySelector('#preview-dialog');
    d.innerHTML=`<div class="dialog-heading"><div><h2 id="preview-title">Xem trước · ${S.platforms[previewPlatform]}</h2><p>${previewPlatform==='kiosk'?'Kiosk rảnh · Màn hình chờ':'Popup · Nội dung minh họa'}</p></div><button class="icon-btn" data-action="close-dialog" aria-label="Đóng xem trước">${U.icon('close')}</button></div><div class="preview-platforms">${form.platforms.map(x=>U.button(S.platforms[x],'preview-platform',{id:x,class:x===previewPlatform?'is-active':''})).join('')}</div><div class="preview-stage stage-${previewPlatform}">${U.popupMarkup(previewForm,false,previewPlatform)}</div><div class="preview-bottom">Xem trước không thay đổi trạng thái record hoặc lưu vết đóng.</div>`;
    if(!d.open)d.showModal();
  }
  function setStatus(text){const el=document.querySelector('#visitor-status');if(el)el.textContent=text;}
  function defaultKiosk(){return `<article class="kiosk-screen kiosk-default"><div class="kiosk-brand">HIU Hospital <small>Màn hình chờ mặc định</small></div><div class="kiosk-welcome">${U.icon('grid')}<h2>Chào mừng bạn</h2><p>Máy sẵn sàng phục vụ.</p></div><div class="kiosk-start"><button class="btn primary" data-action="kiosk-start">Bắt đầu ${U.icon('chevron')}</button></div></article>`;}
  function kiosk(){
    const el=document.querySelector('#client-stage');if(!el)return;
    if(kioskBusy){el.innerHTML=`<div class="kiosk-screen kiosk-busy"><div class="kiosk-brand">HIU Hospital <small>Đang sử dụng</small></div><div class="kiosk-welcome">${U.icon('users')}<h2>Phiên sử dụng đang diễn ra</h2><p>Nội dung truyền thông không xuất hiện trong lúc bạn thao tác.</p><p class="muted">Luồng nghiệp vụ Kiosk được mô phỏng tại đây.</p></div><div class="kiosk-start">${U.button('Kết thúc phiên, trở về màn hình chờ','kiosk-end',{class:'primary'})}</div></div>`;setStatus('Kiosk đang sử dụng. Chiến dịch mới, gỡ hoặc hết hạn không ngắt phiên.');return;}
    selected=S.active('kiosk');
    el.innerHTML=selected&&!broken?U.popupMarkup(selected,false,'kiosk'):defaultKiosk();
    setStatus(selected&&!broken?'Kiosk rảnh · '+selected.id+' · Có thể xuất hiện lại sau mỗi phiên.':'Kiosk rảnh · Màn hình mặc định · Luôn có thể Bắt đầu.');
    const img=el.querySelector('.kiosk-art img');if(img){const token=generation;img.addEventListener('error',()=>{if(token!==generation||kioskBusy)return;el.innerHTML=defaultKiosk();setStatus('Ảnh không tải được. Kiosk dùng màn hình mặc định và vẫn cho Bắt đầu.');},{once:true});}
  }
  function render(){
    cancel();previewing=false;selected=S.active(platform)?structuredClone(S.active(platform)):null;
    const app=platform==='mobile'||platform==='doctor',label=S.platforms[platform];
    document.querySelector('#app').innerHTML=`<div class="website-demo"><header class="website-demo-bar"><a href="#list">${U.icon('back')}Quản lý nội dung</a><span>${label}<small> · Mô phỏng client</small></span>${U.button('Kịch bản thử','review',{icon:'settings',class:'small-btn'})}</header><div class="visitor-controls"><label>Nền tảng<select id="client-platform">${Object.entries(S.platforms).map(([v,l])=>`<option value="${v}" ${v===platform?'selected':''}>${l}</option>`).join('')}</select></label>${platform==='web'?`<label>Khung nhìn<select id="visitor-size"><option value="1440" ${size==='1440'?'selected':''}>Máy tính · 1440 px</option><option value="1024" ${size==='1024'?'selected':''}>Máy tính bảng · 1024 px</option><option value="390" ${size==='390'?'selected':''}>Web mobile · 390 px</option></select></label><label>Trang<select id="visitor-path"><option value="/" ${path==='/'?'selected':''}>Trang chủ /</option><option value="/dich-vu" ${path!=='/'?'selected':''}>Trang dịch vụ</option></select></label>`:''}${platform!=='kiosk'?`${U.button('Tải lại','visitor-reload',{icon:'refresh'})}${U.button('Phiên mới','visitor-session')}${U.button('Người xem mới','visitor-new')}`:''}<label class="failure-check"><input type="checkbox" id="broken-image" ${broken?'checked':''}>Mô phỏng ảnh lỗi</label></div><p class="visitor-status" id="visitor-status" role="status">Đang kiểm tra nội dung…</p>${app?'<p class="client-disclaimer">Đề xuất thử: Popup tại màn hình chính sau 1 giây, ghi nhớ lần đóng riêng từng app. Route bên dưới là minh họa.</p>':''}<div class="client-stage ${platform==='kiosk'?'kiosk-stage':app?'app-stage':'web-stage'}" id="client-stage"></div><dialog id="visitor-dialog" aria-label="Nội dung truyền thông"></dialog><p class="client-footer">Prototype v1.2.0 · Không kết nối Website, ứng dụng hoặc Kiosk thật.</p></div>`;
    if(platform==='kiosk'){kiosk();return;}
    const el=document.querySelector('#client-stage');
    el.innerHTML=app?`<section class="app-home"><header><strong>${platform==='mobile'?'HIU Hospital':'HIU · Dr App'}</strong><span>${platform==='mobile'?'Ứng dụng bệnh nhân':'Ứng dụng bác sĩ'}</span></header><div class="app-home-body"><h2>${path==='/'?'Xin chào bạn':U.esc(path)}</h2><p>${path==='/'?'Các tiện ích dành cho bạn hôm nay.':'Đã điều hướng đến màn hình nội bộ minh họa.'}</p><div class="app-services">${S.routes[platform].map(([r,l])=>`<div>${U.icon(r==='schedule'||r==='appointments'?'calendar':'file')}<span>${l}</span>${U.icon('chevron')}</div>`).join('')}</div><p class="muted">Dữ liệu minh họa</p></div><footer>Trang chủ · Thông báo · Tài khoản</footer></section>`:`<section class="website-frame" style="max-width:${size}px"><div class="hospital-nav"><div class="hospital-brand">HIU <span>HOSPITAL</span></div><nav><span>Giới thiệu</span><span>Chuyên khoa</span><span>Dịch vụ</span></nav></div><div class="site-breadcrumb">HIU Hospital › ${path==='/'?'Trang chủ':U.esc(path)}</div><section class="hospital-hero"><div><h1>Chủ động chăm sóc sức khỏe</h1><p>Thông tin và dịch vụ dành cho bạn.</p></div><img src="${S.image}" alt="Ảnh tham chiếu"></section><p class="website-demo-note">Website minh họa để kiểm tra Popup.</p></section>`;
    if(path!=='/'){setStatus('Đang ở màn hình đích: '+path+'. Không kích hoạt Popup tại đây.');return;}
    const token=generation;
    setStatus('Đang tải nội dung client minh họa…');
    Promise.all([...el.querySelectorAll('img')].map(img=>img.decode().catch(()=>{}))).then(()=>{
    if(token!==generation)return;
    setStatus('Client đã tải xong. Đang chờ 1 giây…');
    timer=setTimeout(async()=>{
      if(token!==generation)return;
      if(path!=='/'){setStatus('Không hiển thị: đang ở màn hình đích khác.');return;}
      if(platform==='web'&&(Number(size)<1024||innerWidth<1024)){setStatus('Web mobile chưa thuộc phạm vi. Chọn Mobile để thử app bệnh nhân.');return;}
      if(!selected||S.active(platform)?.id!==selected.id){setStatus('Không có nội dung đang có hiệu lực cho '+label+'.');return;}
      if(read(localStorage,closedKey).includes(mark())){setStatus('Đã đóng '+selected.id+' trên '+label+'. Không hiển thị lại.');return;}
      if(read(sessionStorage,seenKey).includes(mark())){setStatus('Đã xem '+selected.id+' trong phiên này trên '+label+'.');return;}
      const im=new Image();im.src=selected[S.imageSlot(selected,platform)];
      try{if(broken)throw Error('demo');await im.decode();}catch{if(token===generation)setStatus('Ảnh không tải được. Bỏ qua Popup để không chặn người xem.');return;}
      if(token!==generation)return;
      const d=document.querySelector('#visitor-dialog');d.innerHTML=U.popupMarkup(selected,false,platform);d.showModal();record(sessionStorage,seenKey,mark());setStatus('Đang hiển thị '+selected.id+' trên '+label+'.');
      d.addEventListener('cancel',e=>{e.preventDefault();if(platform==='web')closeVisitor();});
      d.addEventListener('click',e=>{if(e.target===d&&platform==='web')closeVisitor();});
    },1000);
    });
  }
  function closeVisitor(){const p=document.querySelector('#preview-dialog');if(p.open){p.close();return;}const d=document.querySelector('#visitor-dialog');if(d?.open){d.close();if(selected)record(localStorage,closedKey,mark());setStatus('Đã đóng '+selected.id+' trên '+S.platforms[platform]+'. Không hiển thị lại ở phiên sau trên nền tảng này.');}}
  function cta(){
    const inPreview=document.querySelector('#preview-dialog').open;
    const item=inPreview?previewForm:selected,p=inPreview?previewPlatform:platform;
    if(!item)return;const destination=p==='web'?item.configs.web.url:S.routes[p]?.find(([r])=>r===item.configs[p].route)?.[1];
    if(inPreview){document.querySelector('#preview-dialog .preview-bottom').textContent='Đích '+S.platforms[p]+': '+(destination||'Chưa cấu hình');return;}
    path=destination||'/';document.querySelector('#visitor-dialog')?.close();render();setStatus('Đã điều hướng nội bộ: '+path+'. Không ghi vết đóng.');
  }
  function startKiosk(){if(document.querySelector('#preview-dialog').open){document.querySelector('#preview-dialog .preview-bottom').textContent='Bắt đầu sẽ thoát màn hình chờ và mở phiên Kiosk. Đây chỉ là xem trước.';return;}kioskBusy=true;kiosk();}
  function endKiosk(){kioskBusy=false;kiosk();}
  function newSession(){try{const values=read(sessionStorage,seenKey).filter(x=>!x.startsWith(platform+':'));sessionStorage.setItem(seenKey,JSON.stringify(values));}catch{}path='/';render();}
  function newVisitor(){try{localStorage.setItem(closedKey,JSON.stringify(read(localStorage,closedKey).filter(x=>!x.startsWith(platform+':'))));}catch{}newSession();}
  function enter(p){platform=S.platforms[p]?p:'web';path='/';broken=false;render();}
  function setSize(v){size=v;render();}
  function setPath(v){path=v;render();}
  function setBroken(v){broken=v;render();}
  return {render,enter,cancel,preview,previewPlatform:p=>preview(previewForm,p),closeVisitor,cta,startKiosk,endKiosk,newSession,newVisitor,setSize,setPath,setBroken,get platform(){return platform}};
})();
