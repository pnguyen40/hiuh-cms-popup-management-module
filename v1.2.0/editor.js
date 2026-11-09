Popup.Editor = (() => {
  const S=Popup.State,U=Popup.UI;
  let form=null,original='',version=0,mode='now',platform='web',imageSlot='image',errors={},failure='',busy=false;
  const dirty=()=>form&&JSON.stringify(form)!==original;
  function open(id){
    const item=S.data.items.find(x=>x.id===id);
    form=item?structuredClone(item):S.blank();version=item?.version||0;original=JSON.stringify(form);
    mode=form.publishAt&&S.time(form.publishAt)>S.now()?'schedule':'now';platform=form.platforms[0]||'web';errors={};failure='';busy=false;render();
  }
  function field(key,label,{required=false,textarea=false,help='',placeholder=''}={}){
    return `<div class="field"><label for="field-${key}">${label}<span class="${required?'required':'optional'}">${required?'*':'Tùy chọn'}</span></label>${textarea?`<textarea id="field-${key}" name="${key}" rows="3" aria-describedby="error-${key}">${U.esc(form[key])}</textarea>`:`<input id="field-${key}" name="${key}" value="${U.esc(form[key])}" placeholder="${U.esc(placeholder)}" aria-describedby="error-${key}">`}<small class="field-help">${help}</small><p id="error-${key}" class="field-error" hidden></p></div>`;
  }
  function imageField(slot,label){
    const needed=form.platforms.some(p=>S.imageSlot(form,p)===slot);
    return `<div class="image-slot"><label>${label}<span class="${needed?'required':'optional'}">${needed?'*':'Tùy chọn'}</span></label><button type="button" id="field-${slot}" class="image-select ${form[slot]?'has-image':''}" data-action="choose-image" data-id="${slot}" aria-describedby="error-${slot}" aria-label="Chọn ${label.toLowerCase()}">${form[slot]?`<img src="${U.esc(form[slot])}" alt="">`:`${U.icon('image')}<strong>Chọn ${label.toLowerCase()}</strong><small>Thư viện hoặc thiết bị</small>`}</button><small class="filename">${U.esc(form[slot+'Name']||'Chưa chọn ảnh')}</small><div class="image-actions">${U.button(form[slot]?'Thay ảnh':'Chọn ảnh','choose-image',{id:slot,class:'text-btn small-btn'})}${form[slot]?U.button('Gỡ ảnh','remove-image',{id:slot,class:'text-btn small-btn'}):''}</div><p id="error-${slot}" class="field-error" hidden></p></div>`;
  }
  function config(){
    if(!form.platforms.length)return '<p>Chọn nền tảng để cấu hình và xem trước.</p>';
    const cfg=form.configs[platform];
    if(platform==='kiosk')return `<div class="platform-summary">${U.icon('grid')}<div><h3>Màn hình chờ khi Kiosk rảnh</h3><p>Dùng ảnh dọc. Nút Bắt đầu do Kiosk cung cấp; không cần CTA truyền thông.</p><p>Kết thúc phiên sẽ xét lại nội dung hiện hành. Không lưu lựa chọn “Không hiển thị lại”.</p></div></div>`;
    if(platform==='web')return `<p class="config-intro">Popup tại trang chủ Website, dành cho máy tính và máy tính bảng lớn. Dùng ảnh ngang.</p><div class="field"><label for="field-web-url">Đường dẫn CTA Website <span class="required">*</span></label><input id="field-web-url" name="web-url" value="${U.esc(cfg.url)}" placeholder="/dich-vu?utm_source=popup" aria-describedby="error-web-url web-help"><small id="web-help" class="field-help">Bắt đầu bằng /, tối đa 500 ký tự; cho phép query và #anchor. Mở trong cùng tab.</small><p id="error-web-url" class="field-error" hidden></p></div><p class="field-help">Chọn Mobile ở trên nghĩa là app bệnh nhân, không phải Website trên điện thoại.</p>`;
    return `<p class="config-intro">Popup trong ${platform==='mobile'?'app bệnh nhân':'ứng dụng bác sĩ'}. Đích bên dưới là dữ liệu minh họa, cần đối chiếu route thật khi tích hợp.</p>${platform==='doctor'?`<div class="field"><label for="field-doctor-image">Ảnh sử dụng</label><select id="field-doctor-image" name="doctor-image"><option value="portrait" ${cfg.imageSlot==='portrait'?'selected':''}>Ảnh dọc</option><option value="landscape" ${cfg.imageSlot==='landscape'?'selected':''}>Ảnh ngang</option></select></div>`:''}<div class="field"><label for="field-${platform}-route">Đích nội bộ ${S.platforms[platform]} <span class="required">*</span></label><select id="field-${platform}-route" name="${platform}-route" aria-describedby="error-${platform}-route"><option value="">Chọn màn hình đích</option>${S.routes[platform].map(([v,l])=>`<option value="${v}" ${cfg.route===v?'selected':''}>${l}</option>`).join('')}</select><p id="error-${platform}-route" class="field-error" hidden></p></div>`;
  }
  function impact(){
    const list=S.conflicts(form);
    return `<div class="notice ${list.length?'warning':'info'}">${U.icon(list.length?'warning':'info')}<div><strong>${mode==='schedule'?'Tác động dự kiến khi đến lịch':'Phạm vi thay thế khi xuất bản'}</strong>${list.length?`<p>Các record sau sẽ về Nháp trên <b>toàn bộ</b> nền tảng của chúng:</p><ul>${list.map(x=>`<li>${U.esc(x.id+' · '+x.title)} — ${x.platforms.map(p=>S.platforms[p]).join(', ')}</li>`).join('')}</ul>`:'<p>Hiện không có record đang hoạt động giao nền tảng với nội dung này.</p>'}${mode==='schedule'?'<p>Phạm vi thực tế được tính lại ở thời điểm kích hoạt.</p>':''}<p>Muốn vận hành từng kênh độc lập, hãy tạo record riêng.</p></div></div>`;
  }
  function render(){
    if(!form)return;
    const published=form.status==='published',existing=!!form.id,hasPopup=form.platforms.some(p=>p!=='kiosk');
    U.shell(`<div class="editor-heading"><div><a href="#list" class="back-link" data-action="leave-editor">${U.icon('back')}Danh sách nội dung</a><div class="title-line"><h2>${existing?'Chỉnh sửa nội dung':'Tạo nội dung'}</h2>${U.badge(form.status)}<span class="record-id">${form.id||'Record mới'}</span></div></div><span class="language-note">Tiếng Việt · v1.2.0</span></div>
      <div class="editor-grid"><form id="popup-form" novalidate><div id="editor-alert" role="alert"></div>
      <section class="form-section"><div class="section-heading"><h3>Nền tảng hiển thị</h3><span>* Bắt buộc khi xuất bản</span></div><fieldset class="platform-picks" id="field-platforms" aria-describedby="error-platforms"><legend class="sr-only">Chọn nền tảng</legend>${Object.entries(S.platforms).map(([p,l])=>`<label class="${form.platforms.includes(p)?'checked':''}"><input type="checkbox" name="platform" value="${p}" ${form.platforms.includes(p)?'checked':''} ${published?'disabled':''}><span><strong>${l}</strong><small>${p==='mobile'?'App bệnh nhân':p==='doctor'?'Ứng dụng bác sĩ':p==='kiosk'?'Màn hình chờ':'Website'}</small></span></label>`).join('')}</fieldset><p id="error-platforms" class="field-error" hidden></p><p class="field-help scope-note">${published?'Chuyển record về Nháp trước khi thay đổi tập nền tảng.':'Chọn một hoặc nhiều nền tảng. Tất cả dùng chung lịch và trạng thái.'}</p></section>
      <section class="form-section"><div class="section-heading"><h3>Nội dung dùng chung</h3></div>${field('title','Tiêu đề',{required:true,placeholder:'Nhập tiêu đề để nhận diện nội dung'})}${hasPopup?`${field('description','Mô tả phụ',{textarea:true})}<div class="two-fields">${field('tag','Nhãn nổi')}${field('category','Nhóm nội dung')}</div>${field('cta','Nhãn nút CTA',{required:true,placeholder:'Ví dụ: Tìm hiểu thêm',help:'Nhãn dùng chung; chọn đích riêng trong tab nền tảng bên dưới.'})}`:'<p class="field-help">Kiosk dùng ảnh dọc và nút Bắt đầu cố định. Tiêu đề chỉ dùng nhận diện record trong CMS.</p>'}</section>
      <section class="form-section"><div class="section-heading"><h3>Hình ảnh</h3><span>Không khóa tỷ lệ</span></div><div class="image-slots">${imageField('image','Ảnh ngang')}${imageField('portrait','Ảnh dọc')}</div><p class="field-help image-note">Mobile và Kiosk cần ảnh dọc. Client giữ tỷ lệ gốc; bản xem trước hiển thị đủ ảnh, không cắt. Khoảng trống phụ thuộc khung client.</p><div class="two-fields">${field('alt','Mô tả ảnh ngang')}${field('portraitAlt','Mô tả ảnh dọc')}</div></section>
      <section class="form-section platform-config"><div class="section-heading"><h3>Cấu hình theo nền tảng</h3></div>${U.platformTabs(form.platforms,platform,false)}<div id="platform-panel" role="tabpanel" aria-label="Cấu hình nền tảng">${config()}</div><p class="shared-note">Nội dung, ảnh và lịch nằm ở phần dùng chung. Tab này không có trạng thái xuất bản riêng.</p></section>
      <section class="form-section"><div class="section-heading"><h3>Lịch chung cho record</h3>${U.icon('calendar')}</div><div class="publish-options"><label class="radio-option ${mode==='now'?'checked':''}"><input type="radio" name="publishMode" value="now" ${mode==='now'?'checked':''}><span><strong>Xuất bản ngay</strong><small>Trên mọi nền tảng đã chọn</small></span></label><label class="radio-option ${mode==='schedule'?'checked':''}"><input type="radio" name="publishMode" value="schedule" ${mode==='schedule'?'checked':''}><span><strong>Hẹn lịch</strong><small>Một timeline chung</small></span></label></div><div class="two-fields"><div class="field ${mode==='now'?'hidden':''}"><label for="field-publishAt">Thời điểm bắt đầu</label><input id="field-publishAt" name="publishAt" type="datetime-local" value="${U.esc(form.publishAt)}"><p id="error-publishAt" class="field-error" hidden></p></div><div class="field"><label for="field-unpublishAt">Thời điểm gỡ <span class="optional">Tùy chọn</span></label><input id="field-unpublishAt" name="unpublishAt" type="datetime-local" value="${U.esc(form.unpublishAt)}"><p id="error-unpublishAt" class="field-error" hidden></p></div></div><p class="field-help">Giờ Việt Nam (UTC+7). Đồng hồ bản thử: ${U.date(S.data.clock)}.</p>${impact()}${existing?'<p class="field-help scope-note">Sửa cùng record giữ định danh và vết đóng Popup. Sao chép tạo record độc lập nếu cần chạy khác lịch.</p>':''}</section>
      </form><aside class="preview-column"><div class="preview-sticky"><div class="preview-heading"><h3>Xem trước · ${S.platforms[platform]||'Web'}</h3>${U.button('Mở rộng','preview-form',{icon:'external',class:'text-btn small-btn',disabled:!form.platforms.length})}</div><label class="preview-selector">Nền tảng<select id="preview-platform" aria-label="Nền tảng xem trước">${form.platforms.map(p=>`<option value="${p}" ${p===platform?'selected':''}>${S.platforms[p]}</option>`).join('')}</select></label><div class="preview-canvas"><div class="preview-browser"><span></span><span></span><span></span><p>${platform==='kiosk'?'Kiosk · Đang rảnh':platform==='web'?'hiuh.vn /':S.platforms[platform]+' · Màn hình chính'}</p></div><div id="live-preview" class="mini-preview preview-${platform}" inert aria-hidden="true">${form.platforms.length?U.popupMarkup(form,true,platform):'<p>Chọn nền tảng để xem trước.</p>'}</div></div><div class="preview-context">${U.icon(platform==='kiosk'?'grid':'info')}<span>${platform==='kiosk'?'Màn hình chờ toàn màn hình. Không có nút đóng Popup.':'Ảnh và đích CTA theo nền tảng đang chọn.'}</span></div><p class="preview-caption">Dữ liệu minh họa. Xem trước không làm xuất bản hoặc ghi nhớ lần đóng.</p><div class="notice info">${U.icon('calendar')}<p><strong>Một record · Một lịch chung</strong><br>Muốn chạy khác lịch? Tạo hoặc sao chép thành record độc lập.</p></div></div></aside></div>
      <div class="editor-actions"><span id="save-status">${existing?form.id:'Chưa lưu'}<small>${form.platforms.map(p=>S.platforms[p]).join(' · ')||'Chưa chọn nền tảng'}</small></span><div>${U.button('Hủy','leave-editor')}${published?U.button('Chuyển cả record về Nháp','draft-editor',{icon:'stop'}):U.button('Lưu nháp','save-editor',{icon:'check'})}${U.button(published?'Lưu thay đổi':mode==='schedule'?'Hẹn lịch toàn record':'Xuất bản toàn record',published?'save-editor':'publish-editor',{class:'primary',icon:'external'})}</div></div>`,existing?'Chỉnh sửa nội dung':'Tạo nội dung',true);
    showErrors();
  }
  function selectPlatform(p){if(form.platforms.includes(p)){platform=p;render();}}
  function input(target){
    if(!form)return;
    if(target.name==='platform'){
      if(form.status==='published')return;
      const p=target.value;form.platforms=target.checked?[...new Set([...form.platforms,p])]:form.platforms.filter(x=>x!==p);
      platform=target.checked?p:form.platforms.includes(platform)?platform:form.platforms[0]||'web';delete errors.platforms;render();document.querySelector('input[name="platform"][value="'+p+'"]')?.focus();return;
    }
    if(target.name==='publishMode'){mode=target.value;render();return;}
    if(target.name==='doctor-image'){form.configs.doctor.imageSlot=target.value;render();return;}
    if(target.name==='web-url')form.configs.web.url=target.value;
    else if(['mobile-route','doctor-route'].includes(target.name))form.configs[target.name.split('-')[0]].route=target.value;
    else if(S.fields.includes(target.name)||['publishAt','unpublishAt'].includes(target.name))form[target.name]=target.value;
    else return;
    delete errors[target.name];showErrors();updatePreview();document.querySelector('#save-status').firstChild.textContent='Có thay đổi chưa lưu';
  }
  function updatePreview(){const el=document.querySelector('#live-preview');if(el)el.innerHTML=U.popupMarkup(form,true,platform);}
  function showErrors(focus=false){
    for(const el of document.querySelectorAll('.field-error')){const key=el.id.slice(6);el.textContent=errors[key]||'';el.hidden=!errors[key];document.querySelector('#field-'+key)?.setAttribute('aria-invalid',String(!!errors[key]));}
    const alert=document.querySelector('#editor-alert');if(!alert)return;
    alert.innerHTML=failure?`<div class="notice danger"><div><strong>Chưa lưu được nội dung</strong><p>${U.esc(failure.message)}</p>${failure.kind==='conflict'?U.button('Nạp bản hiện tại','reload-editor'):''}</div></div>`:Object.keys(errors).length?`<div class="notice danger">${U.icon('warning')}<div><strong>Kiểm tra dữ liệu trước khi lưu</strong><ul>${Object.values(errors).map(x=>`<li>${U.esc(x)}</li>`).join('')}</ul><p>Chưa xuất bản bất kỳ nền tảng nào.</p></div></div>`:'';
    if(focus){const key=Object.keys(errors)[0];const el=document.querySelector('#field-'+key)||alert;el.setAttribute('tabindex',el.tabIndex<0?'-1':el.tabIndex);el.focus();el.scrollIntoView({block:'center'});}
  }
  async function save(intent){
    if(busy||!form)return;busy=true;failure='';
    document.querySelectorAll('.editor-actions button').forEach(x=>x.disabled=true);
    const payload=structuredClone(form);
    if(mode==='now'&&intent!=='draft'&&form.status!=='published')payload.publishAt='';
    const actual=intent==='publish'?(mode==='schedule'?'schedule':'publish'):intent==='save'&&form.status==='published'&&mode==='schedule'?'schedule':intent==='save'&&form.status==='published'&&mode==='now'&&form.publishAt&&S.time(form.publishAt)>S.now()?'publish':intent;
    const result=S.save(payload,actual,version);busy=false;
    if(!result.ok){errors=result.errors||{};failure=result.errors?'':result;const cfg=Object.keys(errors).find(k=>/^(web-url|mobile-route|doctor-route)$/.test(k));if(cfg)platform=cfg.split('-')[0];render();showErrors(true);return;}
    form=null;original='';location.hash='#list';U.toast(result.replaced.length?'Đã lưu. '+result.replaced.map(x=>x.id).join(', ')+' chuyển về Nháp trên toàn bộ nền tảng.':result.item.status==='draft'?'Đã lưu bản nháp.':'Đã lưu lịch và trạng thái chung cho toàn record.');
  }
  function chooseImage(slot='image'){
    imageSlot=slot;const d=document.querySelector('#media-dialog'),vertical=slot==='portrait';
    d.innerHTML=`<div class="dialog-heading"><div><h2 id="media-title">Chọn ${vertical?'ảnh dọc':'ảnh ngang'}</h2><p>Không ràng buộc tỷ lệ hoặc kích thước cố định</p></div><button class="icon-btn" data-action="close-dialog" aria-label="Đóng thư viện ảnh">${U.icon('close')}</button></div><div class="media-body"><div class="media-toolbar"><h3>Ảnh minh họa</h3><label class="btn">${U.icon('upload')}Tải ảnh từ thiết bị<input id="image-upload" type="file" accept="image/*" class="sr-only"></label></div><button class="media-item" data-action="use-sample-image"><img src="${vertical?S.portrait:S.image}" alt="Ảnh mẫu"><span><strong>${vertical?'Ảnh dọc minh họa':'Ảnh tham chiếu HIUH'}</strong><small>${vertical?'840 × 1200 px · Chỉ là ví dụ':'Ảnh kế thừa prototype v1.0.0'}</small></span>${U.icon('plus')}</button><p class="field-help">Client hiển thị đủ ảnh, giữ tỷ lệ gốc. File mẫu không quy định tỷ lệ bắt buộc.</p><p id="upload-error" class="field-error" role="alert"></p></div><div class="dialog-footer">${U.button('Hủy','close-dialog')}</div>`;d.showModal();
  }
  function setImage(src,name){form[imageSlot]=src;form[imageSlot+'Name']=name;delete errors[imageSlot];document.querySelector('#media-dialog').close();render();}
  function sample(){setImage(imageSlot==='portrait'?S.portrait:S.image,imageSlot==='portrait'?'portrait-demo.svg':'popup-reference.webp');}
  function removeImage(slot){form[slot]='';form[slot+'Name']='';render();}
  async function upload(file){
    if(!file)return;const err=document.querySelector('#upload-error');
    if(!file.type.startsWith('image/')){err.textContent='Chọn tệp ảnh hợp lệ.';return;}
    try{const src=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file);});const im=new Image();im.src=src;await im.decode();setImage(src,file.name);}catch{err.textContent='Không đọc được ảnh. Hãy chọn tệp khác.';}
  }
  function leave(){if(!dirty()){form=null;location.hash='#list';return;}const d=document.querySelector('#confirm-dialog');d.innerHTML=`<div class="dialog-heading"><h2 id="confirm-title">Rời trang khi chưa lưu?</h2></div><div class="dialog-body"><p>Phần đang chỉnh sửa chưa được lưu.</p></div><div class="dialog-footer">${U.button('Tiếp tục chỉnh sửa','close-dialog')}${U.button('Bỏ thay đổi','discard',{class:'primary'})}</div>`;d.showModal();}
  function discard(){form=null;original='';document.querySelector('#confirm-dialog').close();location.hash='#list';}
  function reload(){const id=form.id;S.refresh();open(id);U.toast('Đã nạp bản hiện tại.');}
  return {open,render,input,selectPlatform,save,chooseImage,sample,removeImage,upload,leave,discard,reload,dirty,get form(){return form},get platform(){return platform},get busy(){return busy}};
})();
