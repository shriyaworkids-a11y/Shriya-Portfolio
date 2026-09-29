/**
 * PIXEL Enterprise Design System — Interactive Controller (v2.0.0)
 * Ensures every single click, transition, filter, and state toggle works reliably.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initPortalTabs();
  initStateSwitcher();
  initSwatchCopy();
  initChips();
  initSwitches();
  initPlaygroundButtons();
  initDataTable();
  initModal();
  initCodeCopy();
  initTypographyAndSpacing();
  initM3SeedPicker();
});

/* ==========================================================================
   1. FLOATING TOAST NOTIFICATION SYSTEM
   ========================================================================== */
function showToast(message, type = 'info') {
  let container = document.querySelector('.pixel-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'pixel-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'pixel-toast';

  let iconName = 'info';
  if (type === 'success') iconName = 'check_circle';
  if (type === 'warning') iconName = 'warning';
  if (type === 'danger') iconName = 'error';

  toast.innerHTML = `
    <span class="material-symbols-outlined" style="font-size: 18px; color: ${type === 'success' ? '#34D399' : '#93C5FD'};">${iconName}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('is-visible');
  });

  setTimeout(() => {
    toast.classList.remove('is-visible');
    setTimeout(() => toast.remove(), 250);
  }, 2600);
}

/* ==========================================================================
   2. LIGHT / DARK THEME ENGINE
   ========================================================================== */
function initThemeEngine() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const currentTheme = localStorage.getItem('pixel-theme') || 'light';

  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeBtn(true);
  } else {
    document.documentElement.removeAttribute('data-theme');
    updateThemeBtn(false);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';

      if (newTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeBtn(true);
        showToast('Switched to High-Contrast Dark Theme', 'info');
      } else {
        document.documentElement.removeAttribute('data-theme');
        updateThemeBtn(false);
        showToast('Switched to Clean Light Theme', 'info');
      }

      localStorage.setItem('pixel-theme', newTheme);
    });
  }
}

function updateThemeBtn(isDark) {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (!themeToggleBtn) return;
  themeToggleBtn.innerHTML = `
    <span class="material-symbols-outlined">${isDark ? 'light_mode' : 'dark_mode'}</span>
    <span>${isDark ? 'Light Mode' : 'Dark Mode'}</span>
  `;
}

/* ==========================================================================
   3. TABBED VIEW CONTROLLER & NAVIGATION ENGINE
   ========================================================================== */
const PORTAL_TABS = [
  { id: 'overview', title: 'Overview', category: 'Foundations', icon: 'dashboard' },
  { id: 'token-architecture', title: 'Token Architecture', category: 'Foundations', icon: 'layers' },
  { id: 'color-tokens', title: 'Color Tokens', category: 'Foundations', icon: 'palette' },
  { id: 'typography', title: 'Typography & Spacing', category: 'Foundations', icon: 'format_size' },
  { id: 'playground-actions', title: 'Buttons & 8 States', category: 'Components', icon: 'smart_button' },
  { id: 'playground-chips', title: 'Chips & Controls', category: 'Components', icon: 'label' },
  { id: 'playground-forms', title: 'Form Inputs', category: 'Components', icon: 'edit_note' }
];

let currentTabIndex = 0;

function initPortalTabs() {
  const sidebar = document.getElementById('portal-sidebar');
  const backdrop = document.getElementById('portal-sidebar-backdrop');
  const mobileToggleBtn = document.getElementById('mobile-menu-toggle');

  // Mobile drawer toggle
  if (mobileToggleBtn && sidebar && backdrop) {
    mobileToggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('is-open');
      backdrop.classList.toggle('is-visible');
    });

    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('is-open');
      backdrop.classList.remove('is-visible');
    });
  }

  // Intercept all internal anchor clicks for seamless tab switching
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
      const targetHash = link.getAttribute('href').slice(1);
      if (PORTAL_TABS.some(t => t.id === targetHash)) {
        e.preventDefault();
        switchTab(targetHash);
      }
    }
  });

  // Top toolbar Prev/Next buttons
  const toolbarPrevBtn = document.getElementById('toolbar-prev-tab-btn');
  const toolbarNextBtn = document.getElementById('toolbar-next-tab-btn');

  if (toolbarPrevBtn) {
    toolbarPrevBtn.addEventListener('click', () => {
      if (currentTabIndex > 0) {
        switchTab(PORTAL_TABS[currentTabIndex - 1].id);
      }
    });
  }

  if (toolbarNextBtn) {
    toolbarNextBtn.addEventListener('click', () => {
      if (currentTabIndex < PORTAL_TABS.length - 1) {
        switchTab(PORTAL_TABS[currentTabIndex + 1].id);
      }
    });
  }

  // Handle browser back/forward buttons
  window.addEventListener('popstate', () => {
    const hash = window.location.hash.slice(1);
    if (hash && PORTAL_TABS.some(t => t.id === hash)) {
      switchTab(hash, false);
    }
  });

  // Keyboard navigation: Alt+Left (Prev), Alt+Right (Next)
  window.addEventListener('keydown', (e) => {
    if (e.altKey && e.key === 'ArrowLeft') {
      if (currentTabIndex > 0) switchTab(PORTAL_TABS[currentTabIndex - 1].id);
    } else if (e.altKey && e.key === 'ArrowRight') {
      if (currentTabIndex < PORTAL_TABS.length - 1) switchTab(PORTAL_TABS[currentTabIndex + 1].id);
    }
  });

  // Inject bottom footer navigation into every tab panel
  PORTAL_TABS.forEach((tab, index) => {
    const section = document.getElementById(tab.id);
    if (section && !section.querySelector('.portal-tab-footer-nav')) {
      const footerNav = document.createElement('div');
      footerNav.className = 'portal-tab-footer-nav';

      let prevHTML = '';
      if (index > 0) {
        const prevTab = PORTAL_TABS[index - 1];
        prevHTML = `
          <button class="pixel-btn pixel-btn--secondary pixel-btn--md" onclick="switchTab('${prevTab.id}')">
            <span class="material-symbols-outlined">arrow_back</span>
            <span>Back: ${prevTab.title}</span>
          </button>
        `;
      } else {
        prevHTML = `
          <a href="../index.html" class="pixel-btn pixel-btn--ghost pixel-btn--sm">
            <span class="material-symbols-outlined">home</span>
            <span>Portfolio Home</span>
          </a>
        `;
      }

      let nextHTML = '';
      if (index < PORTAL_TABS.length - 1) {
        const nextTab = PORTAL_TABS[index + 1];
        nextHTML = `
          <button class="pixel-btn pixel-btn--primary pixel-btn--md" onclick="switchTab('${nextTab.id}')">
            <span>Next: ${nextTab.title}</span>
            <span class="material-symbols-outlined">arrow_forward</span>
          </button>
        `;
      } else {
        nextHTML = `
          <a href="../projecten/pixel-design-system.html" class="pixel-btn pixel-btn--primary pixel-btn--md">
            <span>Read Editorial Case Study</span>
            <span class="material-symbols-outlined">auto_stories</span>
          </a>
        `;
      }

      footerNav.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">${prevHTML}</div>
        <div style="font-size: 12px; color: var(--pixel-text-muted); font-family: var(--pixel-font-mono);">
          Module ${index + 1} of ${PORTAL_TABS.length}
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">${nextHTML}</div>
      `;

      section.appendChild(footerNav);
    }
  });

  // Initial tab activation from URL hash or default
  const initialHash = window.location.hash.slice(1);
  const targetId = (initialHash && PORTAL_TABS.some(t => t.id === initialHash)) ? initialHash : 'overview';
  switchTab(targetId, false);
}

window.switchTab = function(tabId, pushHistory = true) {
  let idx = PORTAL_TABS.findIndex(t => t.id === tabId);
  if (idx === -1) {
    idx = 0;
    tabId = PORTAL_TABS[0].id;
  }
  currentTabIndex = idx;
  const currentTab = PORTAL_TABS[idx];

  // 1. Toggle tab panels
  const allSections = document.querySelectorAll('.portal-section');
  allSections.forEach(sec => sec.classList.remove('is-active'));

  const targetSection = document.getElementById(tabId);
  if (targetSection) {
    targetSection.classList.add('is-active');
  }

  // 2. Update sidebar links
  const allNavLinks = document.querySelectorAll('.portal-nav-link');
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === '#' + tabId || link.getAttribute('data-tab-id') === tabId) {
      link.classList.add('is-active');
    } else {
      link.classList.remove('is-active');
    }
  });

  // 3. Update sticky toolbar
  const catBadge = document.getElementById('tab-cat-badge');
  const currentIcon = document.getElementById('tab-current-icon');
  const currentTitle = document.getElementById('tab-current-title');
  const counterBadge = document.getElementById('tab-counter-badge');
  const toolbarPrevBtn = document.getElementById('toolbar-prev-tab-btn');
  const toolbarNextBtn = document.getElementById('toolbar-next-tab-btn');

  if (catBadge) catBadge.textContent = currentTab.category;
  if (currentIcon) currentIcon.textContent = currentTab.icon;
  if (currentTitle) currentTitle.textContent = currentTab.title;
  if (counterBadge) counterBadge.textContent = `Tab ${idx + 1} of ${PORTAL_TABS.length}`;

  if (toolbarPrevBtn) {
    toolbarPrevBtn.disabled = (idx === 0);
    toolbarPrevBtn.title = idx > 0 ? `Previous: ${PORTAL_TABS[idx - 1].title}` : '';
  }
  if (toolbarNextBtn) {
    toolbarNextBtn.disabled = (idx === PORTAL_TABS.length - 1);
    toolbarNextBtn.title = idx < PORTAL_TABS.length - 1 ? `Next: ${PORTAL_TABS[idx + 1].title}` : '';
  }

  // 4. Close mobile drawer if open
  const sidebar = document.getElementById('portal-sidebar');
  const backdrop = document.getElementById('portal-sidebar-backdrop');
  if (sidebar) sidebar.classList.remove('is-open');
  if (backdrop) backdrop.classList.remove('is-visible');

  // 5. Smooth scroll content to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // 6. Update URL hash
  if (pushHistory) {
    history.replaceState(null, null, '#' + tabId);
  }
};

/* ==========================================================================
   4. INTERACTIVE 8-STATE COMPONENT PLAYGROUND
   ========================================================================== */
function initStateSwitcher() {
  const stateBtns = document.querySelectorAll('[data-target-state]');
  const targets = document.querySelectorAll('.playground-target');

  stateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      stateBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const state = btn.getAttribute('data-target-state');

      targets.forEach(el => {
        el.classList.remove('is-focused', 'is-disabled', 'is-loading', 'is-error');
        el.removeAttribute('disabled');

        if (state === 'focus') {
          el.classList.add('is-focused');
        } else if (state === 'disabled') {
          el.classList.add('is-disabled');
          el.setAttribute('disabled', 'true');
        } else if (state === 'loading') {
          el.classList.add('is-loading');
        } else if (state === 'error') {
          el.classList.add('is-error');
        }
      });

      showToast(`Simulating state: ${state.toUpperCase()}`, 'info');
    });
  });
}

/* ==========================================================================
   5. COLOR SWATCH CLICK-TO-COPY
   ========================================================================== */
function initSwatchCopy() {
  const swatches = document.querySelectorAll('.token-swatch');
  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const varName = swatch.getAttribute('data-var-name') || swatch.querySelector('.token-swatch__name')?.textContent.trim();
      if (varName) {
        navigator.clipboard.writeText(varName).then(() => {
          showToast(`Copied ${varName} to clipboard!`, 'success');
        });
      }
    });
  });
}

/* ==========================================================================
   6. INTERACTIVE CHIPS & SWITCHES
   ========================================================================== */
function initChips() {
  const chips = document.querySelectorAll('.pixel-chip--interactive, .pixel-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('is-active');
      chip.classList.toggle('is-selected');
      const icon = chip.querySelector('.pixel-chip__icon, .chip-check-icon');
      if (icon) {
        const isActive = chip.classList.contains('is-active') || chip.classList.contains('is-selected');
        icon.textContent = isActive ? 'check' : (icon.getAttribute('data-default-icon') || 'tune');
      }
      showToast(`Filter chip "${chip.textContent.trim()}" toggled`, 'info');
    });
  });
}

function initSwitches() {
  const switches = document.querySelectorAll('.pixel-switch');
  switches.forEach(sw => {
    sw.addEventListener('click', () => {
      sw.classList.toggle('is-checked');
      const isChecked = sw.classList.contains('is-checked');
      const thumb = sw.querySelector('.pixel-switch__thumb');
      if (thumb) {
        thumb.innerHTML = isChecked ? '<span class="material-symbols-outlined" style="font-size: 14px;">check</span>' : '';
      }
      showToast(`Configuration toggle set to: ${isChecked ? 'ON' : 'OFF'}`);
    });
  });
}

/* ==========================================================================
   7. PLAYGROUND BUTTON CLICKS FEEDBACK
   ========================================================================== */
function initPlaygroundButtons() {
  const sampleBtns = document.querySelectorAll('.demo-action-btn');
  sampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.disabled || btn.classList.contains('is-loading')) return;
      const label = btn.querySelector('.pixel-btn__label')?.textContent || btn.textContent.trim();
      showToast(`Action executed: "${label}"`, 'success');
    });
  });
}

/* ==========================================================================
   8. REAL-TIME DATA TABLE WITH WORKING PAGINATION & SORTING
   ========================================================================== */
const sampleIncidentsData = [
  { id: "PX-9042", entity: "Payment Gateway Microservice", host: "srv-prod-us-east-1", status: "Failed", date: "2 mins ago" },
  { id: "PX-9041", entity: "Inventory Rebalancing Queue", host: "worker-batch-04", status: "Operational", date: "14 mins ago" },
  { id: "PX-9040", entity: "OAuth Identity Broker", host: "auth-core-cluster", status: "Contained", date: "28 mins ago" },
  { id: "PX-9039", entity: "Enterprise Order Ingress", host: "stream-ingress-02", status: "Operational", date: "1 hour ago" },
  { id: "PX-9038", entity: "Database Read Replica Sync", host: "db-replica-eu-west", status: "Pending", date: "3 hours ago" },
  { id: "PX-9037", entity: "Webhook Notification Service", host: "dispatch-cluster-01", status: "Operational", date: "5 hours ago" },
  { id: "PX-9036", entity: "Audit Log Ingestion Pipeline", host: "elk-logging-node-09", status: "Operational", date: "6 hours ago" },
  { id: "PX-9035", entity: "Billing Export Dispatcher", host: "finance-batch-01", status: "Failed", date: "8 hours ago" },
  { id: "PX-9034", entity: "Customer Profile Cache", host: "redis-cluster-primary", status: "Operational", date: "10 hours ago" },
  { id: "PX-9033", entity: "Asset Storage CDN Proxy", host: "edge-proxy-lon-01", status: "Operational", date: "12 hours ago" },
  { id: "PX-9032", entity: "SMS Verification Relay", host: "comm-relay-node-03", status: "Pending", date: "14 hours ago" },
  { id: "PX-9031", entity: "Search Index Elasticsearch", host: "search-cluster-master", status: "Operational", date: "16 hours ago" },
  { id: "PX-9030", entity: "PDF Invoice Renderer", host: "render-worker-08", status: "Contained", date: "18 hours ago" },
  { id: "PX-9029", entity: "GraphQL Gateway Router", host: "api-router-us-west", status: "Operational", date: "20 hours ago" },
  { id: "PX-9028", entity: "Fraud Detection Engine", host: "ai-fraud-eval-02", status: "Operational", date: "22 hours ago" },
  { id: "PX-9027", entity: "Backup Snapshot Archiver", host: "storage-archive-s3", status: "Operational", date: "24 hours ago" }
];

let filteredData = [...sampleIncidentsData];
let selectedRowIds = new Set();
let currentPage = 1;
const rowsPerPage = 5;
let currentSortCol = 'id';
let isSortAsc = false;

function initDataTable() {
  const searchInput = document.getElementById('table-search-input');
  const statusFilter = document.getElementById('table-status-filter');
  const masterCheckbox = document.getElementById('master-checkbox');
  const prevBtn = document.getElementById('table-prev-btn');
  const nextBtn = document.getElementById('table-next-btn');

  function renderTable() {
    const tableBody = document.getElementById('ops-table-body');
    const paginationInfo = document.getElementById('table-pagination-info');
    const pageBtnsContainer = document.getElementById('table-page-buttons');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    const totalRows = filteredData.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
    const pageItems = filteredData.slice(startIndex, endIndex);

    if (pageItems.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: var(--pixel-text-muted);">
            <span class="material-symbols-outlined" style="font-size: 36px; margin-bottom: 8px;">search_off</span>
            <div style="font-weight: 600;">No matching records found</div>
            <div style="font-size: 12px; margin-top: 4px;">Try searching for a different keyword or reset status filters.</div>
          </td>
        </tr>`;
    } else {
      pageItems.forEach(item => {
        const isSelected = selectedRowIds.has(item.id);
        const row = document.createElement('tr');
        row.className = isSelected ? 'is-selected' : '';

        let badgeClass = 'pixel-badge--info';
        let badgeIcon = 'info';
        if (item.status === 'Operational') {
          badgeClass = 'pixel-badge--success';
          badgeIcon = 'check_circle';
        } else if (item.status === 'Pending') {
          badgeClass = 'pixel-badge--warning';
          badgeIcon = 'hourglass_top';
        } else if (item.status === 'Failed') {
          badgeClass = 'pixel-badge--danger';
          badgeIcon = 'error';
        } else if (item.status === 'Contained') {
          badgeClass = 'pixel-badge--info';
          badgeIcon = 'shield';
        }

        row.innerHTML = `
          <td style="width: 44px; text-align: center; vertical-align: middle;">
            <input type="checkbox" class="row-checkbox" data-id="${item.id}" ${isSelected ? 'checked' : ''} style="cursor: pointer; width: 16px; height: 16px; margin: 0 auto; display: block; accent-color: var(--pixel-action-primary);" />
          </td>
          <td style="font-family: var(--pixel-font-mono); font-weight: 600; color: var(--pixel-text-brand); vertical-align: middle;">${item.id}</td>
          <td style="font-weight: 600; vertical-align: middle;">${item.entity}</td>
          <td style="color: var(--pixel-text-secondary); font-family: var(--pixel-font-mono); font-size: 12px; vertical-align: middle;">${item.host}</td>
          <td style="vertical-align: middle;">
            <span class="pixel-badge ${badgeClass}">
              <span class="material-symbols-outlined" style="font-size: 14px;">${badgeIcon}</span>
              <span>${item.status}</span>
            </span>
          </td>
          <td style="color: var(--pixel-text-muted); font-size: 12px; vertical-align: middle;">${item.date}</td>
          <td style="text-align: right; vertical-align: middle;">
            <button class="pixel-btn pixel-btn--tonal pixel-btn--sm" onclick="openApprovalModal('${item.id}', '${item.host}')">
              <span class="material-symbols-outlined" style="font-size: 16px;">shield</span>
              <span>Review</span>
            </button>
          </td>
        `;

        const chk = row.querySelector('.row-checkbox');
        chk.addEventListener('change', () => {
          if (chk.checked) {
            selectedRowIds.add(item.id);
          } else {
            selectedRowIds.delete(item.id);
          }
          renderTable();
        });

        tableBody.appendChild(row);
      });
    }

    // Update Pagination Footer
    if (paginationInfo) {
      paginationInfo.innerHTML = `Showing <strong>${totalRows > 0 ? startIndex + 1 : 0} to ${endIndex}</strong> of <strong>${totalRows}</strong> records`;
    }

    if (prevBtn) prevBtn.disabled = currentPage <= 1;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages;

    // Render Page Number Buttons
    if (pageBtnsContainer) {
      pageBtnsContainer.innerHTML = '';
      for (let p = 1; p <= totalPages; p++) {
        const pBtn = document.createElement('button');
        pBtn.className = `pixel-btn pixel-btn--sm ${p === currentPage ? 'pixel-btn--primary' : 'pixel-btn--secondary'}`;
        pBtn.style.minWidth = '32px';
        pBtn.style.width = '32px';
        pBtn.style.height = '32px';
        pBtn.style.padding = '0';
        pBtn.style.display = 'inline-flex';
        pBtn.style.alignItems = 'center';
        pBtn.style.justifyContent = 'center';
        pBtn.textContent = p;
        pBtn.addEventListener('click', () => {
          currentPage = p;
          renderTable();
        });
        pageBtnsContainer.appendChild(pBtn);
      }
    }

    updateBulkBar();
  }

  function updateBulkBar() {
    const bulkBar = document.getElementById('bulk-action-bar');
    const countSpan = document.getElementById('selected-count-span');
    if (!bulkBar) return;
    if (selectedRowIds.size > 0) {
      bulkBar.style.display = 'flex';
      if (countSpan) countSpan.textContent = `${selectedRowIds.size} row${selectedRowIds.size > 1 ? 's' : ''} selected`;
    } else {
      bulkBar.style.display = 'none';
    }
  }

  // Filter input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      applyFilters(q, statusFilter ? statusFilter.value : 'ALL');
    });
  }

  // Status select
  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
      applyFilters(q, e.target.value);
    });
  }

  function applyFilters(query, status) {
    filteredData = sampleIncidentsData.filter(item => {
      const matchQuery = !query || 
        item.id.toLowerCase().includes(query) || 
        item.entity.toLowerCase().includes(query) || 
        item.host.toLowerCase().includes(query);
      const matchStatus = status === 'ALL' || item.status === status;
      return matchQuery && matchStatus;
    });
    currentPage = 1;
    renderTable();
  }

  // Master Checkbox
  if (masterCheckbox) {
    masterCheckbox.addEventListener('change', () => {
      if (masterCheckbox.checked) {
        filteredData.forEach(item => selectedRowIds.add(item.id));
      } else {
        selectedRowIds.clear();
      }
      renderTable();
    });
  }

  // Next / Previous Buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const totalPages = Math.ceil(filteredData.length / rowsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        renderTable();
      }
    });
  }

  // Column Sorting
  window.sortTable = function(column) {
    if (currentSortCol === column) {
      isSortAsc = !isSortAsc;
    } else {
      currentSortCol = column;
      isSortAsc = true;
    }

    filteredData.sort((a, b) => {
      const valA = a[column] || '';
      const valB = b[column] || '';
      return isSortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    renderTable();
    showToast(`Sorted table by ${column.toUpperCase()} (${isSortAsc ? 'Ascending' : 'Descending'})`, 'info');
  };

  // CSV Export
  window.exportCSV = function() {
    let csv = "Incident ID,Microservice Entity,Host DNS,Status,Observed\n";
    filteredData.forEach(item => {
      csv += `"${item.id}","${item.entity}","${item.host}","${item.status}","${item.date}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "pixel_operations_telemetry.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV file successfully exported!", "success");
  };

  renderTable();
}

/* ==========================================================================
   9. MODAL DIALOG CONTROLLER (APPROVAL PATTERN)
   ========================================================================== */
function initModal() {
  const modalBackdrop = document.getElementById('approval-modal-backdrop');
  const closeTriggers = document.querySelectorAll('.close-modal-trigger');
  const confirmBtn = document.getElementById('confirm-quarantine-btn');

  closeTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      if (modalBackdrop) modalBackdrop.classList.remove('is-open');
    });
  });

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        modalBackdrop.classList.remove('is-open');
      }
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      const targetId = document.getElementById('modal-target-id')?.textContent;
      if (targetId) {
        // Mark as Contained in data
        const item = sampleIncidentsData.find(i => i.id === targetId);
        if (item) {
          item.status = 'Contained';
        }
      }
      if (modalBackdrop) modalBackdrop.classList.remove('is-open');
      showToast(`Host quarantine successfully enforced for ${targetId}!`, 'success');
      
      // Refresh table
      const searchInput = document.getElementById('table-search-input');
      const statusFilter = document.getElementById('table-status-filter');
      const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
      const s = statusFilter ? statusFilter.value : 'ALL';
      filteredData = sampleIncidentsData.filter(item => {
        const matchQuery = !q || item.id.toLowerCase().includes(q) || item.entity.toLowerCase().includes(q);
        const matchStatus = s === 'ALL' || item.status === s;
        return matchQuery && matchStatus;
      });
      const tableBody = document.getElementById('ops-table-body');
      if (tableBody) {
        window.location.hash = '#operations-prototype';
      }
    });
  }
}

window.openApprovalModal = function(id, host) {
  const modalBackdrop = document.getElementById('approval-modal-backdrop');
  const targetIdSpan = document.getElementById('modal-target-id');
  const targetHostSpan = document.getElementById('modal-target-host');

  if (targetIdSpan) targetIdSpan.textContent = id;
  if (targetHostSpan) targetHostSpan.textContent = host;

  if (modalBackdrop) modalBackdrop.classList.add('is-open');
};

/* ==========================================================================
   10. CODE SNIPPET CLIPBOARD COPY
   ========================================================================== */
function initCodeCopy() {
  const copyButtons = document.querySelectorAll('.portal-copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-copy-target');
      const codeBlock = document.getElementById(targetId);
      if (codeBlock) {
        navigator.clipboard.writeText(codeBlock.innerText).then(() => {
          const originalHTML = btn.innerHTML;
          btn.innerHTML = `<span class="material-symbols-outlined" style="font-size: 16px;">check</span><span>Copied!</span>`;
          btn.style.backgroundColor = 'var(--pixel-primitive-emerald-600)';
          showToast('Code snippet copied to clipboard!', 'success');
          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.backgroundColor = '';
          }, 1800);
        });
      }
    });
  });
}

/* ==========================================================================
   11. TYPOGRAPHY & SPACING INTERACTIVE CONTROLS
   ========================================================================== */
function initTypographyAndSpacing() {
  // 1. Live type specimen tester input
  const typeTester = document.getElementById('type-tester');
  if (typeTester) {
    typeTester.addEventListener('input', (e) => {
      const val = e.target.value.trim() || 'Pixel Operations Platform — High Density Telemetry & Node Health';
      const specimens = document.querySelectorAll('#type-scale-container .specimen-text');
      specimens.forEach(el => {
        el.textContent = val;
      });
    });
  }

  // 2. Click to copy token strings for typography, spacing, radius, and elevation
  const copyableTokens = document.querySelectorAll('.copyable-token');
  copyableTokens.forEach(item => {
    item.addEventListener('click', () => {
      const token = item.getAttribute('data-token');
      if (token) {
        navigator.clipboard.writeText(token).then(() => {
          showToast(`Copied token: ${token}`, 'success');
        }).catch(() => {
          showToast(`Token: ${token}`, 'info');
        });
      }
    });
  });
}

/* ==========================================================================
   12. PIXEL DYNAMIC COLOR PALETTE SEED SWITCHER
   ========================================================================== */
function initM3SeedPicker() {
  const seedDots = document.querySelectorAll('.m3-seed-dot');
  let savedSeed = localStorage.getItem('pixel-seed');
  if (!savedSeed || savedSeed === 'purple') {
    // Default to Pixel's original signature blue
    savedSeed = 'blue';
    localStorage.setItem('pixel-seed', 'blue');
  }

  document.documentElement.setAttribute('data-seed', savedSeed);
  seedDots.forEach(dot => {
    if (dot.getAttribute('data-seed') === savedSeed) {
      dot.classList.add('is-active');
    } else {
      dot.classList.remove('is-active');
    }

    dot.addEventListener('click', () => {
      const seed = dot.getAttribute('data-seed');
      document.documentElement.setAttribute('data-seed', seed);
      localStorage.setItem('pixel-seed', seed);

      seedDots.forEach(d => d.classList.remove('is-active'));
      dot.classList.add('is-active');

      const seedNames = {
        blue: 'Pixel Electric Blue (Original Signature)',
        teal: 'Electric Cyan & Teal',
        purple: 'Cyber Violet',
        amber: 'Sunburst Amber',
        rose: 'Coral Crimson'
      };
      showToast(`Dynamic Palette: ${seedNames[seed] || seed}`, 'info');
    });
  });
}

