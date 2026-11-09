Popup.Website = (()=>{
  const S=Popup.State,U=Popup.UI;
  const closedKey='hiuh-popup-design-dismissed',seenKey='hiuh-popup-design-seen';
  let generation=0,timer,selected=null,visitor=false,path='/',size='1440',status='';
  const read=(storage,key)=>{try{return JSON.parse(storage.getItem(key))||[];}catch{return [];}};
  function record(storage,key,id){try{storage.setItem(key,JSON.stringify([...new Set([...read(storage,key),id])]))}catch{/* Closing must still work if storage is blocked. */}}
  function cancel(){generation++;clearTimeout(timer);}
  function preview(form){
    selected=structuredClone(form);visitor=false;
    const d=document.querySelector('#preview-dialog');d.innerHTML=`<div class="dialog-heading"><div><h2 id="preview-title">Xem trước Popup</h2><p>Trang chủ · Máy tính · Ảnh 3:2</p></div><button class="icon-btn" data-action="close-dialog" aria-label="Đóng xem trước">${U.icon('close')}</button></div><div class="preview-stage">${U.popupMarkup(selected)}</div><div class="preview-bottom">Bản xem trước không ảnh hưởng trạng thái hoặc ghi nhớ của người xem.</div>`;d.showModal();
  }
  function render(){
    cancel();visitor=true;selected=S.active()?structuredClone(S.active()):null;
    document.querySelector('#app').innerHTML=`<div class="website-demo"><header class="website-demo-bar"><a href="#list">${U.icon('back')}Quản lý Popup</a><span>Website HIUH <small>· Mô phỏng trải nghiệm</small></span>${U.button('Kịch bản thử','review',{icon:'settings',class:'small-btn'})}</header><div class="visitor-controls"><label>Khung nhìn<select id="visitor-size"><option value="1440">Máy tính · 1440 px</option><option value="1024">Máy tính bảng lớn · 1024 px</option><option value="390">Di động · 390 px</option></select></label><label>Trang<select id="visitor-path"><option value="/">Trang chủ /</option><option value="/dich-vu">Trang dịch vụ /dich-vu</option></select></label>${U.button('Tải lại trang','visitor-reload',{icon:'refresh'})}${U.button('Phiên mới','visitor-session',{class:'quiet'})}${U.button('Người xem mới','visitor-new',{class:'quiet'})}</div><div class="visitor-status" role="status" id="visitor-status">Đang tải trang mô phỏng…</div><div class="website-frame ${size==='390'?'mobile-frame':''}" id="website-frame" style="--frame-width:${size}px"><div class="hospital-nav"><div class="hospital-brand">HIU <span>HOSPITAL</span></div><nav><span>Giới thiệu</span><span>Chuyên khoa</span><span>Dịch vụ</span><span>Tin tức</span></nav><span class="hospital-contact">Chăm sóc sức khỏe</span></div><div class="site-breadcrumb">HIU Hospital <span>›</span> ${path==='/'?'Trang chủ':U.esc(path)}</div><section class="hospital-hero"><div><h1>${path==='/'?'Cùng bạn chăm sóc sức khỏe mỗi ngày':'Thông tin dành cho bạn'}</h1><p>${path==='/'?'Tìm hiểu dịch vụ và chủ động lựa chọn lịch khám phù hợp.':`Bạn đã mở đường dẫn nội bộ ${U.esc(path)} trong cùng tab mô phỏng.`}</p><span class="site-cta">${path==='/'?'Khám phá các dịch vụ':'Nội dung trang đích minh họa'}${U.icon('chevron')}</span></div><img src="${S.image}" alt="Ảnh tham chiếu từ mini-BRD"></section><div class="site-services"><div>${U.icon('calendar')}<span>Đặt lịch khám</span></div><div>${U.icon('users')}<span>Chuyên khoa</span></div><div>${U.icon('file')}<span>Thông tin dịch vụ</span></div></div><p class="website-demo-note">Bố cục Website minh họa để kiểm tra Popup; không phải bản thiết kế thay thế Website.</p></div><dialog id="visitor-dialog" aria-label="Thông báo từ HIU Hospital"></dialog></div>`;
    document.querySelector('#visitor-size').value=size;document.querySelector('#visitor-path').value=path==='/'?'/':'/dich-vu';
    const token=generation;
    const images=[...document.querySelectorAll('#website-frame img')];
    Promise.all(images.map(im=>im.decode().catch(()=>{}))).then(()=>{
      if(token!==generation)return;setStatus('Trang đã tải xong. Đang chờ 1 giây…');
      timer=setTimeout(()=>{
        if(token!==generation)return;
        if(path!=='/'){setStatus('Không hiển thị Popup: đây không phải trang chủ.');return;}
        if(Number(size)<1024 || innerWidth<1024){setStatus('Không hiển thị Popup hoặc nền mờ trên khung nhìn chưa được hỗ trợ.');return;}
        if(!selected||!S.active()||S.active().id!==selected.id){setStatus('Không có Popup đang hoạt động.');return;}
        if(read(localStorage,closedKey).includes(selected.id)){setStatus(`Không hiển thị ${selected.id}: người xem đã đóng Popup này trước đó.`);return;}
        if(read(sessionStorage,seenKey).includes(selected.id)){setStatus(`Không hiển thị ${selected.id}: Popup đã xuất hiện trong phiên này.`);return;}
        const d=document.querySelector('#visitor-dialog');d.innerHTML=U.popupMarkup(selected);d.showModal();record(sessionStorage,seenKey,selected.id);setStatus(`Đã hiển thị ${selected.id} sau 1.000 ms. Chưa ghi vết đóng.`);
        d.addEventListener('cancel',e=>{e.preventDefault();closeVisitor();});
        d.addEventListener('click',e=>{if(e.target===d)closeVisitor();});
      },1000);
    });
  }
  function setStatus(s){status=s;const el=document.querySelector('#visitor-status');if(el)el.textContent=s;}
  function closeVisitor(){const p=document.querySelector('#preview-dialog');if(p.open){p.close();return;}const d=document.querySelector('#visitor-dialog');if(d?.open){d.close();if(selected)record(localStorage,closedKey,selected.id);setStatus(`Đã đóng ${selected?.id}. Không hiển thị lại cho người xem này, kể cả trong phiên sau.`);}}
  function cta(){
    if(document.querySelector('#preview-dialog').open){U.toast(`Đường dẫn cùng tab: ${selected.url||'Chưa nhập đường dẫn CTA'}`);return;}
    if(!visitor || !document.querySelector('#visitor-dialog')?.open)return;
    if(S.validate(selected,true).url){setStatus('Đường dẫn CTA không hợp lệ. Chưa điều hướng.');return;}
    document.querySelector('#visitor-dialog').close();path=selected.url;history.replaceState(null,'',`#website?path=${encodeURIComponent(path)}`);render();setStatus('Đã mở trang nội bộ trong cùng tab. Vết đã xem được giữ; không ghi vết đóng.');
  }
  function setSize(value){size=value;document.querySelector('#website-frame').style.setProperty('--frame-width',size+'px');document.querySelector('#website-frame').classList.toggle('mobile-frame',size==='390');setStatus('Đã đổi khung nhìn. Bấm Tải lại trang để thử điều kiện hiển thị từ đầu.');}
  function setPath(value){path=value;history.replaceState(null,'',`#website?path=${encodeURIComponent(path)}`);render();}
  function newSession(){try{sessionStorage.removeItem(seenKey);}catch{}render();}
  function newVisitor(){try{localStorage.removeItem(closedKey);sessionStorage.removeItem(seenKey);}catch{}render();}
  function enter(){const query=location.hash.split('?')[1]||'';path=new URLSearchParams(query).get('path')||'/';render();}
  return {preview,render,enter,cancel,closeVisitor,cta,setSize,setPath,newSession,newVisitor};
})();
