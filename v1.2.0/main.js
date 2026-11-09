(() => {
  const S=Popup.State,U=Popup.UI,E=Popup.Editor,C=Popup.Clients;
  let previousHash='',restoring=false;
  function route(){
    const hash=location.hash||'#list';
    if(restoring){restoring=false;return;}
    if(E.dirty()&&(previousHash.startsWith('#edit/')||previousHash==='#new')&&hash!==previousHash){restoring=true;location.hash=previousHash;E.leave();return;}
    previousHash=hash;C.cancel();U.hideMenu();
    if(hash.startsWith('#client/'))C.enter(hash.split('/')[1]);
    else if(hash==='#new')E.open();
    else if(hash.startsWith('#edit/')){const id=decodeURIComponent(hash.split('/')[1]);if(S.data.items.some(x=>x.id===id))E.open(id);else{location.hash='#list';U.toast('Không tìm thấy record.',true);}}
    else U.list();
    window.scrollTo(0,0);
  }
  function review(){
    const d=document.querySelector('#review-dialog');
    d.innerHTML=`<div class="dialog-heading"><div><h2 id="review-title">Kịch bản thử · v1.2.0</h2><p>Dữ liệu minh họa chỉ lưu trên trình duyệt này.</p></div><button class="icon-btn" data-action="close-dialog" aria-label="Đóng kịch bản thử">${U.icon('close')}</button></div><div class="review-body">
      <section><h3>Phạm vi đã thu gọn</h3><p>Checkbox chọn nền tảng; tab cấu hình ảnh/CTA. Một record có chung lịch và trạng thái. Muốn khác lịch, dùng Sao chép thành bản nháp rồi sửa nền tảng.</p><p>Khi thay thế record đa nền tảng, cả record cũ về Nháp. Ví dụ B chỉ Web có thể dừng A Web+Kiosk; phần tác động xuất bản liệt kê đầy đủ.</p></section>
      <section><h3>Vai trò</h3><label class="review-row">Vai trò đang thử<select id="review-role">${[...S.roles,'Nhân viên thu ngân'].map(x=>`<option ${x===S.data.role?'selected':''}>${x}</option>`).join('')}</select>${U.button('Áp dụng','apply-role')}</label></section>
      <section><h3>Đồng hồ mô phỏng</h3><p>Hiện tại: <strong>${U.date(S.data.clock)}</strong> · UTC+7.</p><p>Tiến đến 12/11 08:00 để record POP-005 thay các record Web, Mobile và Kiosk.</p><div class="review-row"><label>Tiến đến<input id="review-time" type="datetime-local" value="2026-11-12T08:00"></label>${U.button('Chạy đến mốc này','advance-clock',{icon:'clock'})}</div><p id="review-feedback" role="status"></p></section>
      <section><h3>Trạng thái và lỗi</h3><div class="scenario-buttons">${['normal','empty','loading','error'].map((x,i)=>U.button(['Có dữ liệu','Trống','Đang tải','Lỗi kết nối'][i],'scenario-'+x)).join('')}${U.button('Lỗi ở lần lưu tới','fail-save')}${U.button('Xung đột ở lần lưu tới','fail-conflict')}${U.button('Thu hồi quyền','fail-permission')}</div></section>
      <section><h3>Đề xuất để thử, cần chốt khi triển khai</h3><ul><li>Ảnh hiển thị đủ bằng contain, không ép tỷ lệ.</li><li>Web từ 1024 px; app tại màn hình chính sau 1 giây, ghi nhớ đóng riêng từng nền tảng.</li><li>Dr App chọn ảnh ngang/dọc; route ứng dụng là dữ liệu minh họa.</li><li>Chặn cùng giờ bắt đầu nếu giao nền tảng; vẫn cho phép khoảng lịch giao nhau.</li><li>Kiosk dùng nút Bắt đầu và Kết thúc phiên để thử trạng thái rảnh; không mô phỏng timeout giao dịch.</li></ul></section>
      <section><h3>Khôi phục dữ liệu</h3><p>Đưa 6 record mẫu và đồng hồ về 09/11/2026. Không ảnh hưởng prototype cũ.</p>${U.button('Khôi phục dữ liệu mẫu','reset-demo',{icon:'refresh'})}</section>
    </div><div class="dialog-footer">${U.button('Đóng','close-dialog',{class:'primary'})}</div>`;d.showModal();
  }
  function closeDialogs(){document.querySelectorAll('dialog[open]').forEach(d=>d.close());}
  async function action(name,target){
    const id=target.dataset.id;U.hideMenu();
    switch(name){
      case 'new':location.hash='#new';break;
      case 'edit':location.hash='#edit/'+id;break;
      case 'client':location.hash='#client/'+id;break;
      case 'platform-filter':S.ui.platform=id;U.list();document.querySelector('[data-action="platform-filter"][data-id="'+id+'"]')?.focus();break;
      case 'editor-platform':E.selectPlatform(id);document.querySelector('[data-action="editor-platform"][data-id="'+id+'"]')?.focus();break;
      case 'filters':S.ui.filterOpen=!S.ui.filterOpen;U.list();break;
      case 'clear-filters':Object.assign(S.ui,{platform:'all',search:'',config:'all',display:'all',screenState:'normal'});U.list();break;
      case 'retry':S.ui.screenState='normal';U.list();break;
      case 'row-menu':U.rowMenu(id,target);break;
      case 'preview':C.preview(S.data.items.find(x=>x.id===id));break;
      case 'preview-platform':C.previewPlatform(id);break;
      case 'preview-form':C.preview(E.form,E.platform);break;
      case 'duplicate':{const r=S.duplicate(id);if(r.ok){location.hash='#edit/'+r.item.id;U.toast('Đã tạo '+r.item.id+' độc lập, trạng thái Nháp và lịch trống.');}else U.toast(r.message||'Không sao chép được.',true);break;}
      case 'draft-row':{const r=S.toDraft(id);if(r.ok){U.list();U.toast('Đã chuyển toàn record về Nháp trên mọi nền tảng.');}else U.toast(r.message||'Không thể chuyển Nháp.',true);break;}
      case 'save-editor':await E.save('save');break;
      case 'publish-editor':await E.save('publish');break;
      case 'draft-editor':await E.save('draft');break;
      case 'choose-image':E.chooseImage(id);break;
      case 'use-sample-image':E.sample();break;
      case 'remove-image':E.removeImage(id);break;
      case 'leave-editor':E.leave();break;
      case 'discard':E.discard();break;
      case 'reload-editor':E.reload();break;
      case 'close-dialog':target.closest('dialog')?.close();break;
      case 'close-toast':document.querySelector('#toast-region').innerHTML='';break;
      case 'sidebar':S.ui.sidebar=!S.ui.sidebar;document.querySelector('.sidebar')?.classList.toggle('is-open',S.ui.sidebar);break;
      case 'review':review();break;
      case 'apply-role':S.setRole(document.querySelector('#review-role').value);closeDialogs();if(E.form&&E.dirty())E.render();else location.hash='#list';if(location.hash==='#list')U.list();break;
      case 'advance-clock':{const r=S.advance(document.querySelector('#review-time').value);if(!r.ok){document.querySelector('#review-feedback').textContent=r.message;break;}closeDialogs();if(location.hash.startsWith('#client/'))C.render();else if(E.form&&(location.hash==='#new'||location.hash.startsWith('#edit/')))E.render();else U.list();U.toast('Đã cập nhật lịch chung và trạng thái các record.');break;}
      case 'scenario-normal':case 'scenario-empty':case 'scenario-loading':case 'scenario-error':S.ui.screenState=name.slice(9);closeDialogs();if(E.dirty())E.leave();else{location.hash='#list';U.list();}break;
      case 'fail-save':case 'fail-conflict':S.ui.failure=name.slice(5);closeDialogs();U.toast('Đã chọn lỗi cho lần lưu tiếp theo.');break;
      case 'fail-permission':S.ui.roleRevoked=true;closeDialogs();U.toast('Quyền quản lý đã bị thu hồi trong bản thử.');break;
      case 'reset-demo':{const d=document.querySelector('#confirm-dialog');d.innerHTML=`<div class="dialog-heading"><h2 id="confirm-title">Khôi phục dữ liệu mẫu?</h2></div><div class="dialog-body"><p>Thay các chỉnh sửa của bản thử v1.2.0 bằng 6 record mẫu.</p></div><div class="dialog-footer">${U.button('Giữ dữ liệu','close-dialog')}${U.button('Khôi phục','confirm-reset',{class:'primary'})}</div>`;d.showModal();break;}
      case 'confirm-reset':if(S.reset()){closeDialogs();E.discard();U.list();U.toast('Đã khôi phục dữ liệu mẫu.');}else U.toast('Không lưu được dữ liệu mẫu.',true);break;
      case 'visitor-close':C.closeVisitor();break;
      case 'visitor-cta':C.cta();break;
      case 'visitor-reload':C.render();break;
      case 'visitor-session':C.newSession();break;
      case 'visitor-new':C.newVisitor();break;
      case 'kiosk-start':C.startKiosk();break;
      case 'kiosk-end':C.endKiosk();break;
    }
  }
  document.addEventListener('click',e=>{const t=e.target.closest('[data-action]');if(t){e.preventDefault();action(t.dataset.action,t);}});
  document.addEventListener('input',e=>{const t=e.target;if(t.id==='search'){S.ui.search=t.value;U.renderRows();}else if(t.closest('#popup-form')&&!['checkbox','radio'].includes(t.type)&&t.tagName!=='SELECT')E.input(t);});
  document.addEventListener('change',e=>{
    const t=e.target;
    if(t.closest('#popup-form')&&(['checkbox','radio'].includes(t.type)||t.tagName==='SELECT'))E.input(t);
    else if(t.id==='preview-platform')E.selectPlatform(t.value);
    else if(t.id==='config-filter'){S.ui.config=t.value;U.renderRows();}
    else if(t.id==='display-filter'){S.ui.display=t.value;U.renderRows();}
    else if(t.id==='sort'){S.ui.order=t.value;U.renderRows();}
    else if(t.id==='image-upload')E.upload(t.files[0]);
    else if(t.id==='client-platform')location.hash='#client/'+t.value;
    else if(t.id==='visitor-size')C.setSize(t.value);
    else if(t.id==='visitor-path')C.setPath(t.value);
    else if(t.id==='broken-image')C.setBroken(t.checked);
  });
  document.addEventListener('submit',e=>{if(e.target.id==='popup-form'){e.preventDefault();E.save('save');}});
  document.addEventListener('keydown',e=>{
    const tab=e.target.closest('[role="tab"]');
    if(tab&&['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();const tabs=[...tab.parentElement.querySelectorAll('[role="tab"]')],i=tabs.indexOf(tab);tabs[e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length].click();}
    if(e.key==='Escape'&&S.ui.sidebar){S.ui.sidebar=false;document.querySelector('.sidebar')?.classList.remove('is-open');}
  });
  window.addEventListener('hashchange',route);
  window.addEventListener('beforeunload',e=>{if(E.dirty()){e.preventDefault();e.returnValue='';}});
  window.addEventListener('storage',e=>{if(e.key===S.KEY){S.refresh();if(location.hash.startsWith('#client/'))C.render();else if(E.form&&(location.hash==='#new'||location.hash.startsWith('#edit/')))S.ui.failure='conflict';else U.list();}});
  route();if(S.loadWarning)U.toast(S.loadWarning,true);
})();
