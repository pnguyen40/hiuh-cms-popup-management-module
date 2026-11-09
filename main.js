(() => {
  const S=Popup.State,U=Popup.UI,E=Popup.Editor,W=Popup.Website;
  let pendingSchedule=false, previousHash='', restoreHash=false;
  function route(){
    const hash=location.hash||'#list';
    if(restoreHash){restoreHash=false;return;}
    if(E.dirty() && previousHash.startsWith('#edit') || E.dirty() && previousHash==='#new') {
      if(hash!==previousHash){restoreHash=true;location.hash=previousHash;E.leave();return;}
    }
    previousHash=hash;W.cancel();U.hideMenu();
    if(hash.startsWith('#website'))W.enter();
    else if(hash==='#new'){E.open();}
    else if(hash.startsWith('#edit/')){const id=decodeURIComponent(hash.split('/')[1]);if(S.data.items.some(x=>x.id===id))E.open(id,pendingSchedule);else{location.hash='#list';U.toast('Không tìm thấy Popup.',true);}pendingSchedule=false;}
    else U.list();
    window.scrollTo(0,0);
  }
  function review(){
    const d=document.querySelector('#review-dialog');
    d.innerHTML=`<div class="dialog-heading"><div><h2 id="review-title">Kịch bản thử thiết kế</h2><p>Dữ liệu minh họa. Không kết nối hoặc cập nhật CMS thật.</p></div><button class="icon-btn" data-action="close-dialog" aria-label="Đóng kịch bản thử">${U.icon('close')}</button></div><div class="review-body">
      <section><h3>Thử các luồng chính</h3><p>Tạo nháp → xem trước → xuất bản ngay hoặc hẹn lịch. Dùng dấu ba chấm trên từng dòng để chuyển về Nháp.</p><div class="scenario-buttons">${U.button('Danh sách','review-list',{icon:'file'})}${U.button('Tạo Popup','review-new',{icon:'plus'})}${U.button('Trải nghiệm Website','review-website',{icon:'monitor'})}</div></section>
      <section><h3>Vai trò và quyền truy cập</h3><div class="review-row"><label>Đang xem với vai trò<select id="review-role">${[...S.roles,'Nhân viên thu ngân'].map(x=>`<option ${x===S.data.role?'selected':''}>${x}</option>`).join('')}</select></label>${U.button('Áp dụng vai trò','apply-role',{class:'primary'})}</div><p style="margin-top:10px">Operator và Marketing chỉ thấy tab Popup. Các vai khác ngoài danh sách không được vào module.</p></section>
      <section><h3>Lịch và thay thế Popup</h3><p>Đồng hồ mô phỏng: <span class="review-clock">${U.date(S.data.clock)}</span> (UTC+7). Tiến đến 08/11 để thấy Popup theo lịch thay Popup đang chạy.</p><div class="review-row"><label>Tiến đến thời điểm<input type="datetime-local" id="review-time" value="2026-11-08T08:00"></label>${U.button('Chạy đến mốc này','advance-clock',{icon:'clock'})}</div></section>
      <section><h3>Trạng thái danh sách</h3><div class="scenario-buttons">${U.button('Có dữ liệu','scenario-normal')}${U.button('Trống','scenario-empty')}${U.button('Đang tải','scenario-loading')}${U.button('Lỗi kết nối','scenario-error')}</div></section>
      <section><h3>Lỗi ở lần lưu tiếp theo</h3><p>Mở một Popup để sửa, rồi chọn tình huống. Lỗi xuất hiện khi bấm lưu; nội dung đang nhập được giữ lại.</p><div class="scenario-buttons">${U.button('Không lưu được','fail-save')}${U.button('Xung đột cập nhật','fail-conflict')}${U.button('Thu hồi quyền','fail-permission')}</div></section>
      <section><h3>Điểm cần chốt với BA và kỹ thuật</h3><div class="review-note"><p>Các giá trị dưới đây là đề xuất để bấm thử, chưa phải quyết định nghiệp vụ:</p><ul><li>Khung nhìn hỗ trợ từ 1024 px; lịch dùng giờ Việt Nam.</li><li>Chặn lịch gỡ trước/bằng bắt đầu và lịch bắt đầu trùng chính xác. Vẫn cho phép khoảng lịch giao nhau.</li><li>Bản nháp cần ít nhất một nội dung; nhóm nội dung nhập tự do.</li><li>Ghi nhớ trên trình duyệt này; không mô phỏng đồng bộ tài khoản.</li></ul><p>Ưu tiên mini-BRD cập nhật: kiểm tra khung nhìn một lần tại mốc 1.000 ms, không theo dõi resize để đóng/mở bù. US 11.5 cần được đối chiếu lại.</p></div></section>
      <section><h3>Dữ liệu của bản thử</h3><p>Dữ liệu chỉ lưu cục bộ. Khôi phục sẽ đưa 7 Popup mẫu và đồng hồ về trạng thái ban đầu.</p>${U.button('Khôi phục dữ liệu mẫu','reset-demo',{icon:'refresh'})}</section>
    </div><div class="dialog-footer">${U.button('Đóng','close-dialog',{class:'primary'})}</div>`;d.showModal();
  }
  function closeCurrent(target){target.closest('dialog')?.close();}
  async function action(action,target){
    const id=target.dataset.id;U.hideMenu();
    switch(action){
      case 'new': location.hash='#new'; break;
      case 'edit': location.hash='#edit/'+id; break;
      case 'website': location.hash='#website';break;
      case 'filters': S.ui.filterOpen=!S.ui.filterOpen;U.list();break;
      case 'clear-filters': Object.assign(S.ui,{search:'',config:'all',display:'all',screenState:'normal'});U.list();break;
      case 'retry':S.ui.screenState='normal';U.list();U.toast('Đã tải lại danh sách.');break;
      case 'row-menu': U.rowMenu(id,target);break;
      case 'preview': W.preview(S.data.items.find(x=>x.id===id));break;
      case 'preview-form':W.preview(E.form);break;
      case 'publish-row': {
        const item=S.data.items.find(x=>x.id===id);const result=S.save(item,'publish',item.version);
        if(!result.ok){if(result.kind==='validation'){location.hash='#edit/'+id;U.toast('Bổ sung các trường bắt buộc trước khi xuất bản.',true);}else U.toast(result.message,true);}
        else {U.list();U.toast(result.replaced?`Đã xuất bản. “${result.replaced}” đã chuyển về Nháp.`:'Đã xuất bản Popup.');}break;
      }
      case 'schedule-row':pendingSchedule=true;location.hash='#edit/'+id;break;
      case 'draft-row': {const result=S.toDraft(id);if(result.ok){U.list();U.toast('Đã chuyển về Nháp. Popup ngừng hiển thị và lịch kích hoạt được hủy.');}else U.toast(result.message,true);break;}
      case 'save-editor':await E.save('save');break;
      case 'publish-editor':await E.save('publish');break;
      case 'draft-editor':await E.save('draft');break;
      case 'choose-image':E.chooseImage();break;
      case 'use-sample-image':E.setImage(S.image,'cham-soc-suc-khoe.webp');break;
      case 'remove-image':E.removeImage();break;
      case 'leave-editor':E.leave();break;
      case 'discard':E.discard();break;
      case 'compare':E.compare();break;
      case 'reload-editor':E.reload();break;
      case 'close-dialog':closeCurrent(target);break;
      case 'close-toast':document.querySelector('#toast-region').innerHTML='';break;
      case 'sidebar':S.ui.sidebar=!S.ui.sidebar;document.querySelector('.sidebar')?.classList.toggle('is-open',S.ui.sidebar);break;
      case 'review':review();break;
      case 'review-list':case 'review-new':case 'review-website':document.querySelector('#review-dialog').close();location.hash=action==='review-list'?'#list':action==='review-new'?'#new':'#website';break;
      case 'apply-role':S.setRole(document.querySelector('#review-role').value);document.querySelector('#review-dialog').close();if(E.form&&E.dirty()){E.render();}else if(location.hash==='#list'||!location.hash)U.list();else location.hash='#list';break;
      case 'advance-clock':{const r=S.advance(document.querySelector('#review-time').value);if(r.ok){document.querySelector('#review-dialog').close();if(location.hash.startsWith('#website'))W.render();else if(location.hash==='#list'||!location.hash)U.list();U.toast('Đã cập nhật lịch và trạng thái hiển thị.');}else U.toast(r.message,true);break;}
      case 'scenario-normal':case 'scenario-empty':case 'scenario-loading':case 'scenario-error':S.ui.screenState=action.replace('scenario-','');document.querySelector('#review-dialog').close();if(location.hash==='#list'||!location.hash)U.list();else location.hash='#list';break;
      case 'fail-save':case 'fail-conflict':S.ui.failure=action==='fail-save'?'save':'conflict';document.querySelector('#review-dialog').close();U.toast('Đã chọn lỗi cho lần lưu tiếp theo.');break;
      case 'fail-permission':S.ui.roleRevoked=true;document.querySelector('#review-dialog').close();U.toast('Quyền đã bị thu hồi trong bản thử. Thao tác lưu tiếp theo sẽ bị từ chối.');break;
      case 'reset-demo': {
        const d=document.querySelector('#confirm-dialog');d.innerHTML=`<div class="dialog-heading"><h2 id="confirm-title">Khôi phục dữ liệu mẫu?</h2></div><div class="dialog-body"><p>Các chỉnh sửa trong prototype sẽ được thay bằng 7 Popup mẫu. Dữ liệu CMS thật không bị ảnh hưởng.</p></div><div class="dialog-footer">${U.button('Giữ dữ liệu hiện tại','close-dialog')}${U.button('Khôi phục','confirm-reset',{class:'primary'})}</div>`;d.showModal();break;
      }
      case 'confirm-reset':S.reset();document.querySelectorAll('dialog[open]').forEach(d=>d.close());if(E.form)E.discard();S.ui.roleRevoked=false;location.hash='#list';U.list();U.toast('Đã khôi phục dữ liệu mẫu.');break;
      case 'visitor-close':if(target.closest('#live-preview'))break;W.closeVisitor();break;
      case 'visitor-cta':if(target.closest('#live-preview'))break;W.cta();break;
      case 'visitor-reload':W.render();break;
      case 'visitor-session':W.newSession();break;
      case 'visitor-new':W.newVisitor();break;
    }
  }
  document.addEventListener('click',e=>{const t=e.target.closest('[data-action]');if(t){e.preventDefault();action(t.dataset.action,t);}});
  document.addEventListener('input',e=>{const t=e.target;if(t.id==='search'){S.ui.search=t.value;U.renderRows();}else if(t.closest('#popup-form'))E.input(t);});
  document.addEventListener('change',e=>{const t=e.target;if(t.id==='config-filter'){S.ui.config=t.value;U.renderRows();}else if(t.id==='display-filter'){S.ui.display=t.value;U.renderRows();}else if(t.id==='sort'){S.ui.order=t.value;U.renderRows();}else if(t.id==='image-upload')E.upload(t.files[0]);else if(t.id==='visitor-size')W.setSize(t.value);else if(t.id==='visitor-path')W.setPath(t.value);});
  document.addEventListener('submit',e=>{if(e.target.id==='popup-form'){e.preventDefault();E.save('save');}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&S.ui.sidebar){S.ui.sidebar=false;document.querySelector('.sidebar')?.classList.remove('is-open');}});
  document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close();}));
  window.addEventListener('hashchange',route);
  window.addEventListener('beforeunload',e=>{if(E.dirty()){e.preventDefault();e.returnValue='';}});
  window.addEventListener('storage',e=>{if(e.key==='hiuh-popup-design-v1.0.0'){S.refresh();if(E.form&&(location.hash==='#new'||location.hash.startsWith('#edit/')))S.ui.failure='conflict';else if(location.hash.startsWith('#website'))W.render();else U.list();}});
  route();if(S.loadWarning)U.toast(S.loadWarning,true);
})();
