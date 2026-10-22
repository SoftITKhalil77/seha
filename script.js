/* =====================================================================
   Navigation Menu — قائمة منسدلة بملء الشاشة
   [تعديل] استُبدلت الدالة القديمة (toggle فقط) بمنطق كامل:
     - فتح/إغلاق مع تحديث aria-expanded وسمة inert (إمكانية الوصول).
     - قفل تمرير الصفحة خلف القائمة.
     - الإغلاق بزر X أو بمفتاح Escape أو بالضغط على أي رابط داخل القائمة.
     - حبس التركيز (focus trap) داخل القائمة وإعادته للزر عند الإغلاق.
   ===================================================================== */
(function () {
  const root = document.documentElement;
  const menu = document.getElementById('navigationPopupMenu');
  const openBtn = document.getElementById('hamburgerMenuIcon');
  const closeBtn = document.getElementById('menuCloseBtn');
  if (!menu || !openBtn || !closeBtn) return;

  const FOCUSABLE = 'a[href], button:not([disabled])';

  function isOpen() {
    return menu.classList.contains('open');
  }

  function openMenu() {
    if (isOpen()) return;
    menu.inert = false;                              // السماح بالتركيز على عناصر القائمة
    menu.classList.add('open');                      // يشغّل حركة النزول من الأعلى
    root.classList.add('menu-open');                 // قفل تمرير الصفحة
    openBtn.setAttribute('aria-expanded', 'true');
    openBtn.setAttribute('aria-label', 'إغلاق القائمة');
    // ننتظر إطارًا واحدًا ليصبح العنصر مرئيًا قبل نقل التركيز إليه
    requestAnimationFrame(function () {
      closeBtn.focus({ preventScroll: true });
    });
  }

  function closeMenu(returnFocus) {
    if (!isOpen()) return;
    menu.classList.remove('open');                   // يشغّل حركة الصعود
    root.classList.remove('menu-open');
    menu.inert = true;                               // منع التركيز على القائمة المغلقة
    openBtn.setAttribute('aria-expanded', 'false');
    openBtn.setAttribute('aria-label', 'فتح القائمة');
    if (returnFocus) openBtn.focus({ preventScroll: true });
  }

  function toggleMenu() {
    isOpen() ? closeMenu(true) : openMenu();
  }

  openBtn.addEventListener('click', toggleMenu);
  closeBtn.addEventListener('click', function () { closeMenu(true); });

  // إغلاق القائمة عند الضغط على أي رابط (يشمل رابطي إنشاء حساب وتسجيل دخول)
  menu.querySelectorAll('[data-menu-link]').forEach(function (link) {
    link.addEventListener('click', function () { closeMenu(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (!isOpen()) return;

    if (e.key === 'Escape') {
      closeMenu(true);
      return;
    }

    // حبس التركيز داخل القائمة أثناء التنقل بمفتاح Tab
    if (e.key === 'Tab') {
      const items = menu.querySelectorAll(FOCUSABLE);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // توافق مع الكود القديم: إن بقي أي onclick="toggleNavigationMenu()" في مكان ما سيعمل
  window.toggleNavigationMenu = toggleMenu;
})();

function toggleChatPopup() {
  const overlay = document.getElementById('chatPopupOverlay');
  overlay.style.display = (overlay.style.display === 'flex') ? 'none' : 'flex';
}
/* ============ Elements ============ */
const serviceCodeInput = document.getElementById('serviceCode');
const identityInput = document.getElementById('identityNumber');
const searchBtn = document.getElementById('searchBtn');
const searchBtnText = document.getElementById('searchBtnText');
const searchBtnIcon = document.getElementById('searchBtnIcon');
const loadingSpinnerElement = document.getElementById('loadingSpinnerElement');
const errorBox = document.getElementById('errorBox');
const noResultsBox = document.getElementById('noResultsBox');
const resultsArea = document.getElementById('resultsArea');
const resultsContent = document.getElementById('resultsContent');
const backToInqBtn = document.getElementById('backToInqBtn');
/* ============ Data ============ */
function initializeApplicationData() {
  const medicalLeaveData = [
        {
          leaveCode: "PSL26030807750",
          idNumber: "1097131031",
          name: "هيف ظافر ابن محمد آل سلیم ",
          from: "2026-05-04",
          to: "2026-05-31",
          days: "28",
          doctor: "عبدالرحمن عبدالله الصائغ ",
          title: "طب بشري ",
          date: "2026-05-04"
        },
{
          leaveCode: "GSL22636334589",
          idNumber: "1152671705",
          name: "نادر موسی محمد الخمجانی",
          from: "2026-04-23",
          to: "2026-04-23",
          days: "1",
          doctor: "محمد جمال كمال خلف ",
          title: "طب بشري",
          date: "2026-04-23"
}
        
  
 ];
  localStorage.setItem("leaveData", JSON.stringify(medicalLeaveData));
}
/* ============ Identity input restrictions ============ */
identityInput.addEventListener('input', function () {
  const val = this.value;
  if (val.length === 0) return;
  const firstChar = val[0];
  if (/^\d/.test(firstChar)) {
    this.value = val.replace(/\D/g, '').slice(0, 10);
  }
  hideAllErrors();
});
identityInput.addEventListener('blur', function () {
  const val = this.value;
  if (val.length > 0 && !/^\d/.test(val[0])) {
    this.value = val.slice(0, 10);
  }
});
serviceCodeInput.addEventListener('input', function () {
  hideAllErrors();
});
/* ============ Error helpers ============ */
function showError(msg) {
  errorBox.textContent = msg;
  errorBox.style.display = 'block';
}
function hideAllErrors() {
  errorBox.style.display = 'none';
  noResultsBox.style.display = 'none';
}
/* ============ Reset / New Search ============ */
function resetToInitial() {
  serviceCodeInput.value = '';
  identityInput.value = '';
  serviceCodeInput.classList.remove('locked');
  identityInput.classList.remove('locked');
  hideAllErrors();
  resultsArea.style.display = 'none';
  resultsContent.innerHTML = '';
  backToInqBtn.style.display = 'none';
  searchBtn.classList.remove('loading');
  searchBtn.disabled = false;
  searchBtnText.textContent = 'استعلام';
  searchBtnIcon.style.display = 'inline-block';
  loadingSpinnerElement.style.display = 'none';
}
/* ============ Main handler ============ */
function handleSearchClick() {
  const code = serviceCodeInput.value.trim();
  const id = identityInput.value.trim();
  hideAllErrors();
  if (!code) {
    showError('فضلا اكتب الرمز');
    return;
  }
  if (!id || !/^\d{10}$/.test(id)) {
    showError('رقم الهوية خاطئ');
    return;
  }
  searchBtn.classList.add('loading');
  searchBtn.disabled = true;
  searchBtnIcon.style.display = 'none';
  loadingSpinnerElement.style.display = 'inline-block';
  setTimeout(function () {
    searchBtn.classList.remove('loading');
    searchBtn.disabled = false;
    searchBtnIcon.style.display = 'inline-block';
    loadingSpinnerElement.style.display = 'none';
    serviceCodeInput.classList.add('locked');
    identityInput.classList.add('locked');
    const data = JSON.parse(localStorage.getItem('leaveData')) || [];
    const result = data.find(function (r) {
      return r.leaveCode === code && r.idNumber === id;
    });
    if (result) {
      showResults(result);
    } else {
      showNoResults();
    }
  }, 5000);
}
/* ============ Results / No-results ============ */
function showResults(r) {
  resultsContent.innerHTML = `
    <div class="result-item"><div class="result-label">الاسم :</div><div class="result-value">${r.name}</div></div>
    <div class="result-item"><div class="result-label">تاريخ إصدار تقرير الإجازة :</div><div class="result-value">${r.date}</div></div>
    <div class="result-item"><div class="result-label">تبدأ من :</div><div class="result-value">${r.from}</div></div>
    <div class="result-item"><div class="result-label">وحتى :</div><div class="result-value">${r.to}</div></div>
    <div class="result-item"><div class="result-label">المدة بالأيام :</div><div class="result-value">${r.days}</div></div>
    <div class="result-item"><div class="result-label">اسم الطبيب :</div><div class="result-value">${r.doctor}</div></div>
    <div class="result-item"><div class="result-label">المسمى الوظيفي :</div><div class="result-value">${r.title}</div></div>
  `;
  resultsArea.style.display = 'block';
  noResultsBox.style.display = 'none';
  errorBox.style.display = 'none';
  searchBtnText.textContent = 'استعلام جديد';
  searchBtnIcon.style.display = 'inline-block';
  searchBtn.onclick = function () { resetToInitial(); searchBtn.onclick = handleSearchClick; };
  backToInqBtn.style.display = 'flex';
}
function showNoResults() {
  resultsArea.style.display = 'none';
  resultsContent.innerHTML = '';
  noResultsBox.style.display = 'block';
  errorBox.style.display = 'none';
  searchBtnText.textContent = 'استعلام جديد';
  searchBtnIcon.style.display = 'inline-block';
  searchBtn.onclick = function () { resetToInitial(); searchBtn.onclick = handleSearchClick; };
  backToInqBtn.style.display = 'flex';
}
/* ============ Init ============ */
window.addEventListener('load', function () {
  document.getElementById('mainHeader').classList.add('show');
  initializeApplicationData();
  resetToInitial();
});