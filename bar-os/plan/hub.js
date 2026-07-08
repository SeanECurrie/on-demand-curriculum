/* ============================================================
   Monday Bags — Launch Hub · shared behavior
   reveal-on-scroll · copy-to-clipboard · print-an-image
   No dependencies. Degrades gracefully offline.
   ============================================================ */
(function(){
  var els = document.querySelectorAll('.rv');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(reduce || !('IntersectionObserver' in window)){
    els.forEach(function(e){ e.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  },{threshold:.12, rootMargin:'0px 0px -8% 0px'});
  els.forEach(function(e){ io.observe(e); });
})();

function _toast(msg){
  var t = document.getElementById('toast');
  if(!t){ t = document.createElement('div'); t.id='toast'; t.className='toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(function(){ t.classList.remove('show'); }, 1900);
}

/* copy the text content of the element named in data-copy */
function copyAsset(btn){
  var el = document.getElementById(btn.getAttribute('data-copy'));
  if(!el) return;
  var text = el.innerText.replace(/\n{3,}/g,'\n\n').trim();
  var msg = btn.getAttribute('data-msg') || 'Copied — paste it in';
  var flash = function(){
    btn.classList.add('copied');
    var lab = btn.querySelector('.lab'); var old = lab ? lab.textContent : '';
    if(lab) lab.textContent = 'Copied';
    _toast(msg);
    setTimeout(function(){ btn.classList.remove('copied'); if(lab) lab.textContent = old; }, 1900);
  };
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(flash).catch(function(){ _fallbackCopy(text); flash(); });
  } else { _fallbackCopy(text); flash(); }
}
function _fallbackCopy(text){
  var ta = document.createElement('textarea');
  ta.value = text; ta.style.position='fixed'; ta.style.top='-1000px'; ta.style.opacity='0';
  document.body.appendChild(ta); ta.focus(); ta.select();
  try{ document.execCommand('copy'); }catch(e){}
  document.body.removeChild(ta);
}

/* open a print-ready window for a single image (poster) */
function printImg(src, title){
  var w = window.open('', '_blank');
  if(!w){ _toast('Allow pop-ups to print this'); return; }
  w.document.write(
    '<!doctype html><html><head><title>'+(title||'Monday Bags')+'</title>'+
    '<style>*{margin:0;padding:0}html,body{height:100%;background:#fff}'+
    'body{display:flex;align-items:center;justify-content:center}'+
    'img{max-width:100%;max-height:100vh;display:block}'+
    '@media print{@page{margin:0}img{width:100%;max-height:none}}</style></head>'+
    '<body><img src="'+src+'" onload="setTimeout(function(){window.focus();window.print();},300)"></body></html>'
  );
  w.document.close();
}
