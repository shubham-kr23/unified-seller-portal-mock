const state = {
  activeView: "overview",
  activeOrderFilter: "all",
  channelFilter: "all",
  orders: [
    { id: "AMZ-48291", channel: "amazon", items: 3, amount: 129.97, status: "pending", placed: "8 min ago", customer: "Maya Sharma" },
    { id: "FLP-99104", channel: "flipkart", items: 1, amount: 44.5, status: "pending", placed: "22 min ago", customer: "Arjun Rao" },
    { id: "WMT-73180", channel: "walmart", items: 2, amount: 86.0, status: "acknowledged", placed: "1 hr ago", customer: "Olivia Chen" },
    { id: "AMZ-48270", channel: "amazon", items: 4, amount: 219.0, status: "shipped", placed: "2 hrs ago", customer: "Noah Williams" },
    { id: "FLP-99088", channel: "flipkart", items: 2, amount: 72.25, status: "pending", placed: "3 hrs ago", customer: "Priya Mehta" },
    { id: "WMT-73142", channel: "walmart", items: 1, amount: 32.0, status: "acknowledged", placed: "4 hrs ago", customer: "Ethan Brooks" },
    { id: "AMZ-48201", channel: "amazon", items: 2, amount: 58.0, status: "shipped", placed: "5 hrs ago", customer: "Ava Patel" },
    { id: "FLP-99034", channel: "flipkart", items: 1, amount: 25.99, status: "pending", placed: "6 hrs ago", customer: "Rohan Singh" },
  ],
  inventory: [
    { sku: "LAMP-OAK-01", name: "Oak Arc Floor Lamp", warehouse: "Mumbai · Main", onHand: 128, reserved: 18, safety: 20, status: "Healthy" },
    { sku: "CUSH-CREAM-04", name: "Cloud Linen Cushion", warehouse: "Mumbai · Main", onHand: 64, reserved: 11, safety: 15, status: "Healthy" },
    { sku: "TRAY-WALNUT-02", name: "Walnut Serving Tray", warehouse: "Pune · North", onHand: 17, reserved: 9, safety: 10, status: "Low stock" },
    { sku: "VASE-SAND-09", name: "Sandstone Ceramic Vase", warehouse: "Mumbai · Main", onHand: 42, reserved: 4, safety: 8, status: "Healthy" },
  ],
  products: [
    { sku: "LAMP-OAK-01", name: "Oak Arc Floor Lamp", category: "Lighting", channels: 3, health: "Good" },
    { sku: "CUSH-CREAM-04", name: "Cloud Linen Cushion", category: "Soft furnishings", channels: 3, health: "Good" },
    { sku: "TRAY-WALNUT-02", name: "Walnut Serving Tray", category: "Kitchen & dining", channels: 2, health: "Review" },
    { sku: "VASE-SAND-09", name: "Sandstone Ceramic Vase", category: "Decor", channels: 3, health: "Good" },
    { sku: "MIRROR-ARCH-07", name: "Arched Brass Mirror", category: "Decor", channels: 2, health: "Good" },
    { sku: "RUG-JUTE-11", name: "Handwoven Jute Runner", category: "Textiles", channels: 3, health: "Good" },
  ],
  connections: [
    { provider: "amazon", name: "Amazon Seller Central", account: "acme-home-goods", status: "Healthy", sync: "4 min ago", accent: "amazon" },
    { provider: "flipkart", name: "Flipkart Seller Hub", account: "Acme Home India", status: "Healthy", sync: "7 min ago", accent: "flipkart" },
    { provider: "walmart", name: "Walmart Marketplace", account: "Acme Home US", status: "Healthy", sync: "11 min ago", accent: "walmart" },
  ],
  rules: [
    { name: "New order alert", description: "When an order is received → Telegram", enabled: true, icon: "◉" },
    { name: "Low stock watch", description: "When available stock drops below 10 → Email", enabled: true, icon: "!" },
    { name: "Sync exception", description: "When a marketplace sync fails → Telegram", enabled: true, icon: "↻" },
  ],
  deliveries: [
    { channel: "telegram", title: "New Amazon order AMZ-48291", time: "8 min ago", status: "Delivered" },
    { channel: "email", title: "Low stock: TRAY-WALNUT-02", time: "42 min ago", status: "Delivered" },
    { channel: "telegram", title: "Flipkart sync completed", time: "1 hr ago", status: "Delivered" },
  ],
};

const channelMeta = {
  amazon: { label: "Amazon", letter: "a" },
  flipkart: { label: "Flipkart", letter: "f" },
  walmart: { label: "Walmart", letter: "w" },
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value);
}

function providerLabel(provider) {
  return channelMeta[provider]?.label || provider;
}

function metricCard(label, value, note, trend = "") {
  return `<div class="metric"><span class="eyebrow">${label}</span><strong>${value}</strong><span class="muted small">${note}</span>${trend ? `<span class="trend">${trend}</span>` : ""}</div>`;
}

function renderMetrics() {
  const pending = state.orders.filter((order) => order.status === "pending").length;
  const stockAvailable = state.inventory.reduce((sum, item) => sum + item.onHand - item.reserved, 0);
  const revenue = state.orders.reduce((sum, order) => sum + order.amount, 0);
  $("#overviewMetrics").innerHTML = [
    metricCard("ORDERS TODAY", "24", `${pending} need attention`, "+18.6% vs last Tuesday"),
    metricCard("GROSS SALES", formatCurrency(revenue), "Across all channels", "+12.4% this week"),
    metricCard("AVAILABLE STOCK", stockAvailable.toLocaleString("en-IN"), "Across 4 locations", "Healthy coverage"),
    metricCard("SYNC HEALTH", "98.4%", "3 connectors online", "All systems nominal"),
  ].join("");
  $("#inventoryMetrics").innerHTML = [
    metricCard("ACTIVE SKUs", state.inventory.length, "Across all channels"),
    metricCard("AVAILABLE UNITS", stockAvailable, "After reservations"),
    metricCard("LOW STOCK", state.inventory.filter((item) => item.status === "Low stock").length, "Need attention", "Review today"),
    metricCard("RESERVED", state.inventory.reduce((sum, item) => sum + item.reserved, 0), "Open orders"),
  ].join("");
  const report = {
    orders: 24,
    units: state.orders.reduce((sum, order) => sum + order.items, 0),
    available: stockAvailable,
    shipments: state.orders.filter((order) => order.status === "shipped").length + 7,
    returns: 3,
  };
  $("#reportMetrics").innerHTML = [
    metricCard("ORDERS", report.orders, "Last 7 days", "+14.2%"),
    metricCard("UNITS SOLD", report.units, "Last 7 days", "+9.8%"),
    metricCard("AVAILABLE STOCK", report.available, "Across channels", "Stable"),
    metricCard("RETURN RATE", "2.1%", "Last 30 days", "-0.4%"),
  ].join("");
}

function orderStatus(order) {
  return `<span class="statusPill ${order.status}">${order.status}</span>`;
}

function renderAttentionOrders() {
  const attention = state.orders.filter((order) => order.status === "pending").slice(0, 4);
  $("#attentionOrders").innerHTML = attention.map((order) => `<div class="miniOrder"><span class="orderIcon">${order.items}</span><div><strong>${order.id}</strong><span class="muted small">${providerLabel(order.channel)} · ${order.customer}</span></div>${orderStatus(order)}</div>`).join("");
}

function renderConnections(target = "#overviewConnections") {
  $(target).innerHTML = state.connections.map((connection) => `<div class="connectionItem"><span class="channelIcon ${connection.accent}">${channelMeta[connection.provider]?.letter || "•"}</span><div><strong>${connection.name}</strong><span class="muted small">${connection.account} · synced ${connection.sync}</span></div><span class="statusPill acknowledged">${connection.status}</span></div>`).join("");
}

function renderInventory(target = "#overviewInventory") {
  const items = state.inventory.slice(0, target === "#overviewInventory" ? 4 : state.inventory.length);
  $(target).innerHTML = items.map((item) => {
    const available = item.onHand - item.reserved;
    return `<div class="stockItem"><span class="stockIcon">▦</span><div><strong>${item.name}</strong><span class="muted small">${item.sku} · ${item.warehouse}</span></div><span class="${item.status === "Low stock" ? "statusPill low" : "statusPill acknowledged"}">${available} available</span></div>`;
  }).join("");
}

function renderOrders() {
  const filtered = state.orders.filter((order) => {
    const statusMatch = state.activeOrderFilter === "all" || order.status === state.activeOrderFilter;
    const channelMatch = state.channelFilter === "all" || order.channel === state.channelFilter;
    return statusMatch && channelMatch;
  });
  $("#ordersTable").innerHTML = filtered.map((order) => `<tr><td>${order.id}<br><span class="muted small">${order.customer}</span></td><td><span class="channelIcon ${order.channel}">${channelMeta[order.channel].letter}</span> ${providerLabel(order.channel)}</td><td>${order.items} item${order.items === 1 ? "" : "s"}</td><td>${formatCurrency(order.amount)}</td><td>${orderStatus(order)}</td><td>${order.placed}</td><td>${order.status === "pending" ? `<button class="tableButton" data-acknowledge="${order.id}">Acknowledge</button>` : `<button class="tableButton" data-order-detail="${order.id}">Details</button>`}</td></tr>`).join("") || `<tr><td colspan="7"><div class="emptyState">No orders match this view.</div></td></tr>`;
}

function renderInventoryTable() {
  $("#inventoryTable").innerHTML = state.inventory.map((item) => `<tr><td><strong>${item.name}</strong><br><span class="muted small">${item.sku}</span></td><td>${item.warehouse}</td><td>${item.onHand}</td><td>${item.reserved}</td><td><strong>${item.onHand - item.reserved}</strong></td><td><span class="${item.status === "Low stock" ? "statusPill low" : "statusPill acknowledged"}">${item.status}</span></td></tr>`).join("");
}

function renderCatalog() {
  $("#catalogGrid").innerHTML = state.products.map((product) => `<div class="catalogCard"><div class="productVisual">${product.name.slice(0, 1)}</div><div><h3>${product.name}</h3><span class="muted small">${product.sku} · ${product.category}</span><span class="muted small">${product.channels} channels · <b>${product.health}</b></span></div></div>`).join("");
}

function renderConnectionsPage() {
  $("#connectionsGrid").innerHTML = state.connections.map((connection) => `<div class="connectionCard"><div class="connectionCardTop"><span class="channelIcon ${connection.accent}">${channelMeta[connection.provider].letter}</span><span class="statusPill acknowledged">Connected</span></div><h3>${connection.name}</h3><p class="muted">${connection.account}</p><div class="connectionCardFooter"><span>Last sync ${connection.sync}</span><b>Healthy</b></div></div>`).join("") + `<div class="connectionCard"><div class="connectionCardTop"><span class="channelIcon">+</span><span class="statusPill">Available</span></div><h3>Add a marketplace</h3><p class="muted">Connect eBay or another channel to extend your workspace.</p><div class="connectionCardFooter"><span>OAuth connection</span><button class="textButton" id="pageAddMarketplace">Connect →</button></div></div>`;
  $("#pageAddMarketplace")?.addEventListener("click", openMarketplaceModal);
}

function renderAutomations() {
  $("#rulesList").innerHTML = state.rules.map((rule, index) => `<div class="ruleItem"><span class="ruleIcon">${rule.icon}</span><div><strong>${rule.name}</strong><span class="muted small">${rule.description}</span></div><button class="switch ${rule.enabled ? "on" : ""}" data-rule-index="${index}" aria-label="Toggle rule"></button></div>`).join("");
  $("#deliveryList").innerHTML = state.deliveries.map((delivery) => `<div class="deliveryItem"><span class="deliveryIcon">${delivery.channel === "telegram" ? "✈" : "@"}</span><div><strong>${delivery.title}</strong><span class="muted small">${delivery.channel} · ${delivery.time}</span></div><span class="statusPill acknowledged">${delivery.status}</span></div>`).join("");
}

function renderReports() {
  const days = ["Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"];
  const values = [46, 69, 54, 78, 62, 86, 72];
  $("#barChart").innerHTML = values.map((value, index) => `<div class="barGroup"><div class="bar amazonBar" style="height:${Math.round(value * .55)}%"></div><div class="bar flipkartBar" style="height:${Math.round(value * .28)}%"></div><div class="bar walmartBar" style="height:${Math.round(value * .17)}%"></div><span class="muted" style="position:absolute;transform:translateY(28px);font-size:10px">${days[index]}</span></div>`).join("");
  const counts = { amazon: 11, flipkart: 7, walmart: 6 };
  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
  $("#channelMix").innerHTML = Object.entries(counts).map(([channel, count]) => `<div class="mixRow"><div><span>${providerLabel(channel)}</span><b>${count} orders · ${Math.round(count / total * 100)}%</b></div><div class="mixTrack"><div class="mixFill ${channel}" style="width:${count / total * 100}%"></div></div></div>`).join("");
}

function renderAll() {
  renderMetrics();
  renderAttentionOrders();
  renderConnections();
  renderInventory();
  renderOrders();
  renderInventoryTable();
  renderCatalog();
  renderConnectionsPage();
  renderAutomations();
  renderReports();
}

function setView(view) {
  state.activeView = view;
  $$(".navItem[data-view]").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  $$(".view").forEach((section) => section.classList.toggle("activeView", section.dataset.section === view));
  $("#pageLabel").textContent = view.charAt(0).toUpperCase() + view.slice(1);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openMarketplaceModal() { $("#marketplaceModal").showModal(); }

function connectProvider(provider) {
  const slug = provider.toLowerCase();
  if (!state.connections.some((connection) => connection.provider === slug)) {
    state.connections.push({ provider: slug, name: `${provider} Marketplace`, account: "Demo connected account", status: "Healthy", sync: "just now", accent: slug });
    showToast(`${provider} connected to Acme Home Goods`);
  } else {
    showToast(`${provider} is already connected`);
  }
  renderAll();
  setView("connections");
}

function acknowledgeOrder(orderId) {
  const order = state.orders.find((item) => item.id === orderId);
  if (!order) return;
  order.status = "acknowledged";
  showToast(`${orderId} acknowledged successfully`);
  renderAll();
}

function syncChannels() {
  showToast("Sync started across Amazon, Flipkart, and Walmart");
  $("#syncButton").innerHTML = "↻ Syncing...";
  setTimeout(() => { $("#syncButton").innerHTML = "<span>↻</span> Sync channels"; state.connections.forEach((connection) => { connection.sync = "just now"; }); renderAll(); showToast("All channels synced · 24 orders checked"); }, 950);
}

function exportReport() {
  const rows = [["Metric", "Value"], ["Orders", "24"], ["Units sold", state.orders.reduce((sum, order) => sum + order.items, 0)], ["Available stock", state.inventory.reduce((sum, item) => sum + item.onHand - item.reserved, 0)], ["Returns", "3"]];
  const blob = new Blob([rows.map((row) => row.join(",")).join("\n")], { type: "text/csv" });
  const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "acme-home-goods-report.csv"; link.click(); URL.revokeObjectURL(link.href); showToast("Report downloaded");
}

function bindEvents() {
  $("#loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const email = $("#emailInput").value.trim(); const password = $("#passwordInput").value;
    if (email !== "demo@unifiedseller.com" || password !== "demo123") { showToast("Use demo@unifiedseller.com / demo123"); return; }
    $("#loginScreen").classList.add("hidden"); $("#appShell").classList.remove("hidden"); renderAll(); showToast("Welcome to Acme Home Goods");
  });
  $("#logoutButton").addEventListener("click", () => { $("#appShell").classList.add("hidden"); $("#loginScreen").classList.remove("hidden"); showToast("Signed out of the demo workspace"); });
  $$(".navItem[data-view]").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
  $$('[data-view-link]').forEach((button) => button.addEventListener("click", () => setView(button.dataset.viewLink)));
  $("#syncButton").addEventListener("click", syncChannels); $("#ordersSyncButton").addEventListener("click", syncChannels);
  $("#addMarketplaceButton").addEventListener("click", openMarketplaceModal); $("#overviewAddButton").addEventListener("click", openMarketplaceModal); $("#connectionsAddButton").addEventListener("click", openMarketplaceModal);
  $("#exportButton").addEventListener("click", exportReport);
  $("#marketplaceModal").addEventListener("click", (event) => { const button = event.target.closest(".marketplaceChoice"); if (button) { $("#marketplaceModal").close(); connectProvider(button.dataset.provider); } });
  $$(".filterTab").forEach((button) => button.addEventListener("click", () => { $$(".filterTab").forEach((tab) => tab.classList.remove("active")); button.classList.add("active"); state.activeOrderFilter = button.dataset.filter; renderOrders(); }));
  $("#channelFilter").addEventListener("change", (event) => { state.channelFilter = event.target.value; renderOrders(); });
  $("#ordersTable").addEventListener("click", (event) => { const acknowledge = event.target.closest("[data-acknowledge]"); if (acknowledge) acknowledgeOrder(acknowledge.dataset.acknowledge); });
  $("#rulesList").addEventListener("click", (event) => { const toggle = event.target.closest("[data-rule-index]"); if (!toggle) return; const rule = state.rules[Number(toggle.dataset.ruleIndex)]; rule.enabled = !rule.enabled; renderAutomations(); showToast(`${rule.name} ${rule.enabled ? "enabled" : "paused"}`); });
  $("#globalSearch").addEventListener("input", (event) => { const query = event.target.value.toLowerCase(); if (query.length < 2) return; const match = state.orders.find((order) => order.id.toLowerCase().includes(query) || order.customer.toLowerCase().includes(query)); if (match) { setView("orders"); showToast(`Found ${match.id}`); } });
}

bindEvents();
