function renderDashboard(){
var todaySales=0,totalQty=0;
state.products.forEach(function(p){var q=p.sales30d[29]||0;todaySales+=q*p.price;totalQty+=p.sales30d.reduce(function(a,b){return a+b},0)});
var txns=Math.max(1,Math.floor(todaySales/85));
var avgTicket=todaySales/txns;
var attachRate=(totalQty/(txns*30)).toFixed(1);
var inStore=state.members.filter(function(m){return m.inStore}).length;
var hours=[];for(var h=0;h<24;h++)hours.push({h:h,s:Math.floor(Math.random()*5000+(h>=8&&h<=20?3000:500))});
var maxH=Math.max.apply(null,hours.map(function(x){return x.s}));
var catSales={};CATEGORIES.forEach(function(c){catSales[c]=0});
state.products.forEach(function(p){catSales[p.category]+=p.sales30d.reduce(function(a,b){return a+b},0)*p.price});
var hotCats=Object.keys(catSales).sort(function(a,b){return catSales[b]-catSales[a]});
var lowStock=state.products.filter(function(p){return p.stock<p.safetyStock});
var expiring=state.products.filter(function(p){return p.daysLeft<=7});
var yoyData=CATEGORIES.map(function(c){var cu=catSales[c],pv=cu*(0.8+Math.random()*0.3);return{c:c,cu:cu,pv:pv,ch:((cu-pv)/pv*100).toFixed(1)}});
var h='<div class="page-header"><h2>店长看板</h2><div class="actions"><button class="btn btn-outline" onclick="App.exportDashboard()">导出报表</button></div></div>';
h+='<div class="grid grid-4 mb-20">';
h+='<div class="stat-card"><div class="stat-icon blue"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div><div class="stat-label">今日销售额</div><div class="stat-value">'+fmt(todaySales)+'</div><div class="stat-change up">↑ 12.5% 较昨日</div></div>';
h+='<div class="stat-card"><div class="stat-icon green"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></div><div class="stat-label">平均客单价</div><div class="stat-value">'+fmt(avgTicket)+'</div><div class="stat-change up">↑ 3.2% 较昨日</div></div>';
h+='<div class="stat-card"><div class="stat-icon orange"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg></div><div class="stat-label">连带率</div><div class="stat-value">'+attachRate+'</div><div class="stat-change down">↓ 0.3 较上周</div></div>';
h+='<div class="stat-card"><div class="stat-icon purple"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div><div class="stat-label">在店会员</div><div class="stat-value">'+inStore+'</div><div class="stat-change up">↑ 5 较昨日同期</div></div>';
h+='</div>';
h+='<div class="grid grid-2 mb-20"><div class="card"><div class="card-header"><h3>时段销售</h3><div class="live-indicator"><span class="live-dot"></span>实时</div></div><div class="card-body"><div class="bar-chart">';
hours.forEach(function(x){var pct=(x.s/maxH*100).toFixed(0);h+='<div class="bar" style="height:'+pct+'%;background:var(--primary)"><span class="bar-label">'+x.h+'时</span><span class="bar-value">'+(x.s/1000).toFixed(1)+'k</span></div>'});
h+='</div></div></div>';
h+='<div class="card"><div class="card-header"><h3>热门品类</h3></div><div class="card-body">';
var colors=['var(--primary)','var(--success)','var(--warning)','var(--info)','#7c3aed','var(--danger)'];
hotCats.slice(0,6).forEach(function(c,i){var pct=(catSales[c]/catSales[hotCats[0]]*100).toFixed(0);
h+='<div class="flex-between" style="margin-bottom:8px"><span style="font-size:13px;font-weight:500">'+(i+1)+'. '+c+'</span><span style="font-size:12px;color:var(--text-secondary)">'+fmt(catSales[c])+'</span></div><div class="progress-bar" style="margin-bottom:'+(i<5?'10':'0')+'px"><div class="fill" style="width:'+pct+'%;background:'+colors[i]+'"></div></div>'});
h+='</div></div></div>';
h+='<div class="grid grid-2 mb-20"><div class="card"><div class="card-header"><h3>库存预警</h3><span class="badge-tag danger">'+lowStock.length+'项</span></div><div class="card-body">';
if(lowStock.length===0){h+='<div style="text-align:center;color:var(--text-muted);padding:20px">暂无库存预警</div>'}
else{lowStock.slice(0,5).forEach(function(p){h+='<div class="flex-between" style="margin-bottom:10px"><div><span style="font-weight:500">'+p.name+'</span><br><span style="font-size:12px;color:var(--text-secondary)">'+p.category+'</span></div><span class="badge-tag danger">'+p.stock+'/'+p.safetyStock+'</span></div>'})}
h+='</div></div>';
h+='<div class="card"><div class="card-header"><h3>临期商品</h3><span class="badge-tag warning">'+expiring.length+'项</span></div><div class="card-body">';
if(expiring.length===0){h+='<div style="text-align:center;color:var(--text-muted);padding:20px">暂无临期商品</div>'}
else{expiring.slice(0,5).forEach(function(p){var bc=p.daysLeft<=3?'danger':'warning';h+='<div class="flex-between" style="margin-bottom:10px"><div><span style="font-weight:500">'+p.name+'</span><br><span style="font-size:12px;color:var(--text-secondary)">'+p.category+'</span></div><span class="badge-tag '+bc+'">剩余'+p.daysLeft+'天</span></div>'})}
h+='</div></div></div>';
h+='<div class="card"><div class="card-header"><h3>同比分析</h3></div><div class="card-body"><table class="data-table"><thead><tr><th>品类</th><th>本期销售额</th><th>去年同期</th><th>同比变化</th><th>趋势</th></tr></thead><tbody>';
yoyData.forEach(function(d){var cc=parseFloat(d.ch)>=0?'var(--success)':'var(--danger)';var sg=parseFloat(d.ch)>=0?'+':'';
h+='<tr><td style="font-weight:500">'+d.c+'</td><td>'+fmt(d.cu)+'</td><td>'+fmt(d.pv)+'</td><td style="color:'+cc+';font-weight:600">'+sg+d.ch+'%</td><td><div class="yoy-compare"><div class="yoy-bar"><div class="yoy-prev" style="height:'+Math.max(5,d.pv/d.cu*25)+'px"></div><div class="yoy-curr" style="height:25px"></div></div></div></td></tr>'});
h+='</tbody></table></div></div>';
return h}

function renderInventory(){
var h='<div class="page-header"><h2>进销存管理</h2></div>';
h+='<div class="card"><div class="card-body" style="padding:0"><div class="tabs" id="inv-tabs" style="padding:0 20px">';
h+='<div class="tab active" data-tab="all">全部商品</div>';
h+='<div class="tab" data-tab="inbound">入库扫码</div>';
h+='<div class="tab" data-tab="replenish">补货建议</div>';
h+='<div class="tab" data-tab="alert">库存预警</div>';
h+='</div><div id="inv-content" style="padding:20px">'+renderInvAll()+'</div></div></div>';
return h}

function renderInvAll(){
var h='<div class="flex-between mb-16"><div class="flex gap-8"><div class="search-bar"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input id="inv-search" placeholder="搜索商品名称/编号" oninput="App.filterProducts()"></div><select id="inv-cat-filter" onchange="App.filterProducts()" style="padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius)"><option value="">全部分类</option>';
CATEGORIES.forEach(function(c){h+='<option value="'+c+'">'+c+'</option>'});
h+='</select></div><button class="btn btn-primary" onclick="App.showInboundModal()">扫码入库</button></div>';
h+='<table class="data-table" id="inv-table"><thead><tr><th>编号</th><th>商品名称</th><th>分类</th><th>进价</th><th>售价</th><th>库存</th><th>安全库存</th><th>保质期</th><th>操作</th></tr></thead><tbody>';
state.products.forEach(function(p){
var stockBadge=p.stock<p.safetyStock?'danger':'success';var priceCell=p.activePromo?fmt(p.activePromo.promoPrice)+' <span class="badge-tag warning" style="font-size:10px">'+p.activePromo.discountLabel+'</span>':fmt(p.price);
h+='<tr><td>'+p.id+'</td><td style="font-weight:500">'+p.name+'</td><td><span class="badge-tag info">'+p.category+'</span></td><td>'+fmt(p.cost)+'</td><td>'+priceCell+'</td><td><span class="badge-tag '+stockBadge+'">'+p.stock+'</span></td><td>'+p.safetyStock+'</td><td>'+p.daysLeft+'天</td><td><button class="btn btn-sm btn-outline" onclick="App.showProductDetail(\''+p.id+'\')">详情</button></td></tr>'});
h+='</tbody></table>';
return h}

function renderInvInbound(){
var h='<div class="scanner-area" onclick="App.showInboundModal()"><svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/></svg><h4>点击扫描商品条码入库</h4><p>支持条码扫描枪或手动输入</p></div>';
h+='<div class="card mt-16"><div class="card-header"><h3>最近入库记录</h3></div><div class="card-body"><table class="data-table"><thead><tr><th>商品</th><th>入库数量</th><th>入库时间</th><th>当前库存</th></tr></thead><tbody>';
state.products.slice(0,8).forEach(function(p){
h+='<tr><td style="font-weight:500">'+p.name+'</td><td>+'+Math.floor(Math.random()*30+10)+'</td><td>'+p.lastRestock+'</td><td>'+p.stock+'</td></tr>'});
h+='</tbody></table></div></div>';
return h}

function renderInvReplenish(){
var items=state.products.map(function(p){var r=calcRepl(p);return{p:p,r:r}}).filter(function(x){return x.r.sq>0}).sort(function(a,b){return b.r.sq-a.r.sq});
var h='<div class="flex-between mb-16"><div><span style="font-weight:600">共'+items.length+'项商品需要补货</span><span style="color:var(--text-muted);margin-left:12px">基于30天销量×季节因子计算</span></div><button class="btn btn-primary" onclick="App.batchReplenish()">批量生成采购单</button></div>';
h+='<table class="data-table"><thead><tr><th>商品</th><th>分类</th><th>当前库存</th><th>日均销量</th><th>季节因子</th><th>再订货点</th><th>建议补货量</th><th>操作</th></tr></thead><tbody>';
items.forEach(function(x){var p=x.p,r=x.r;
h+='<tr><td style="font-weight:500">'+p.name+'</td><td><span class="badge-tag info">'+p.category+'</span></td><td>'+p.stock+'</td><td>'+r.avg+'</td><td>'+r.sf+'</td><td>'+r.rp+'</td><td><strong style="color:var(--primary)">'+r.sq+'</strong></td><td><button class="btn btn-sm btn-primary" onclick="App.triggerPurchase(\''+p.id+'\')">采购</button></td></tr>'});
h+='</tbody></table>';
return h}

function renderInvAlert(){
var alerts=state.products.filter(function(p){return p.stock<p.safetyStock});
var h='<div class="flex-between mb-16"><span class="badge-tag danger" style="font-size:13px;padding:4px 12px">'+alerts.length+'项库存低于安全水位</span></div>';
if(alerts.length===0){h+='<div style="text-align:center;padding:40px;color:var(--text-muted)">所有商品库存正常</div>'}
else{h+='<table class="data-table"><thead><tr><th>商品</th><th>分类</th><th>当前库存</th><th>安全库存</th><th>缺口</th><th>保质期</th><th>操作</th></tr></thead><tbody>';
alerts.forEach(function(p){var gap=p.safetyStock-p.stock;
h+='<tr><td style="font-weight:500">'+p.name+'</td><td><span class="badge-tag info">'+p.category+'</span></td><td><span class="badge-tag danger">'+p.stock+'</span></td><td>'+p.safetyStock+'</td><td style="color:var(--danger);font-weight:600">'+gap+'</td><td>'+p.daysLeft+'天</td><td><button class="btn btn-sm btn-primary" onclick="App.triggerPurchase(\''+p.id+'\')">采购</button> <button class="btn btn-sm btn-outline" onclick="App.triggerTransfer(\''+p.id+'\')">调拨</button></td></tr>'});
h+='</tbody></table>'}
var pendingOrders=state.purchaseOrders.filter(function(po){return po.status==='待处理'});
var completedOrders=state.purchaseOrders.filter(function(po){return po.status==='已完成'});
h+='<div class="card mt-16"><div class="card-header"><h3>待处理预警单据</h3><span class="badge-tag danger">'+pendingOrders.length+'条</span></div><div class="card-body">';
if(pendingOrders.length===0){h+='<div style="text-align:center;color:var(--text-muted);padding:20px">暂无待处理预警单据</div>'}
else{h+='<table class="data-table"><thead><tr><th>单号</th><th>类型</th><th>商品</th><th>数量</th><th>金额</th><th>状态</th><th>来源</th><th>创建时间</th><th>操作</th></tr></thead><tbody>';
pendingOrders.forEach(function(po){var typeBadge=po.type==='采购'?'info':'purple';var statusBadge=po.status==='待处理'?'warning':'success';var srcBadge=po.source==='自动预警'?'<span class="badge-tag danger">自动预警</span>':po.source==='手动采购'?'<span class="badge-tag info">手动采购</span>':po.source==='手动调拨'?'<span class="badge-tag purple">手动调拨</span>':po.source==='批量补货'?'<span class="badge-tag success">批量补货</span>':'<span class="badge-tag gray">'+(po.source||'-')+'</span>';
h+='<tr><td>'+po.id+'</td><td><span class="badge-tag '+typeBadge+'">'+po.type+'</span></td><td style="font-weight:500">'+po.productName+'</td><td>'+po.qty+'</td><td>'+fmt(po.total)+'</td><td><span class="badge-tag '+statusBadge+'">'+po.status+'</span></td><td>'+srcBadge+'</td><td>'+po.createTime+'</td><td><button class="btn btn-sm btn-primary" onclick="App.confirmPurchaseOrder(\''+po.id+'\')">确认处理</button></td></tr>'});
h+='</tbody></table>'}
h+='</div></div>';
h+='<div class="card" style="margin-top:16px"><div class="card-header"><h3>已完成处理记录</h3><span class="badge-tag success">'+completedOrders.length+'条</span></div><div class="card-body">';
if(completedOrders.length===0){h+='<div style="text-align:center;color:var(--text-muted);padding:20px">暂无已完成处理记录</div>'}
else{h+='<table class="data-table"><thead><tr><th>单号</th><th>类型</th><th>商品</th><th>数量</th><th>金额</th><th>状态</th><th>来源</th><th>创建时间</th><th>完成时间</th></tr></thead><tbody>';
completedOrders.forEach(function(po){var typeBadge=po.type==='采购'?'info':'purple';var statusBadge=po.status==='待处理'?'warning':'success';var srcBadge=po.source==='自动预警'?'<span class="badge-tag danger">自动预警</span>':po.source==='手动采购'?'<span class="badge-tag info">手动采购</span>':po.source==='手动调拨'?'<span class="badge-tag purple">手动调拨</span>':po.source==='批量补货'?'<span class="badge-tag success">批量补货</span>':'<span class="badge-tag gray">'+(po.source||'-')+'</span>';
h+='<tr><td>'+po.id+'</td><td><span class="badge-tag '+typeBadge+'">'+po.type+'</span></td><td style="font-weight:500">'+po.productName+'</td><td>'+po.qty+'</td><td>'+fmt(po.total)+'</td><td><span class="badge-tag '+statusBadge+'">'+po.status+'</span></td><td>'+srcBadge+'</td><td>'+po.createTime+'</td><td>'+(po.completeTime||'<span style="color:var(--text-muted)">-</span>')+'</td></tr>'});
h+='</tbody></table>'}
h+='</div></div>';
return h}

function renderPricing(){
var synced=state.products.filter(function(p){return p.priceTagSynced}).length;
var unsynced=state.products.length-synced;
var syncRate=((synced/state.products.length)*100).toFixed(1);
var h='<div class="page-header"><h2>电子价签</h2><div class="actions"><button class="btn btn-primary" onclick="App.syncAllPriceTags()">全部同步</button></div></div>';
h+='<div class="grid grid-3 mb-20">';
h+='<div class="stat-card"><div class="stat-icon green"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div><div class="stat-label">已同步</div><div class="stat-value">'+synced+'</div></div>';
h+='<div class="stat-card"><div class="stat-icon orange"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div><div class="stat-label">待同步</div><div class="stat-value">'+unsynced+'</div></div>';
h+='<div class="stat-card"><div class="stat-icon blue"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg></div><div class="stat-label">同步率</div><div class="stat-value">'+syncRate+'%</div><div class="progress-bar" style="margin-top:8px"><div class="fill green" style="width:'+syncRate+'%"></div></div></div>';
h+='</div>';
h+='<div class="card"><div class="card-header"><h3>价签状态列表</h3></div><div class="card-body"><table class="data-table"><thead><tr><th>商品</th><th>分类</th><th>售价</th><th>进价</th><th>毛利率</th><th>价签状态</th><th>最后同步</th><th>操作</th></tr></thead><tbody>';
state.products.forEach(function(p){var margin=((p.price-p.cost)/p.price*100).toFixed(1);
var statusBadge=p.priceTagSynced?'success':'warning';
var statusText=p.priceTagSynced?'已同步':'待同步';
h+='<tr><td style="font-weight:500">'+p.name+'</td><td><span class="badge-tag info">'+p.category+'</span></td><td>'+fmt(p.price)+'</td><td>'+fmt(p.cost)+'</td><td>'+margin+'%</td><td><span class="badge-tag '+statusBadge+'">'+statusText+'</span></td><td>'+p.lastRestock+'</td><td><button class="btn btn-sm btn-outline" onclick="App.changePrice(\''+p.id+'\')">改价</button> <button class="btn btn-sm btn-primary" onclick="App.syncPriceTag(\''+p.id+'\')" '+(p.priceTagSynced?'disabled style="opacity:.5"':'')+'>同步</button></td></tr>'});
h+='</tbody></table></div></div>';
return h}

function renderCheckout(){
var h='<div class="page-header"><h2>收银台</h2><div class="actions"><button class="btn btn-outline" onclick="App.startSelfCheckout()">自助扫码购</button><button class="btn btn-danger" onclick="App.clearCart()">清空购物车</button></div></div>';
h+='<div class="grid grid-2 gap-20">';
h+='<div><div class="card mb-16"><div class="card-header"><h3>扫码购物</h3><div class="live-indicator"><span class="live-dot"></span>就绪</div></div><div class="card-body"><div class="scanner-area" onclick="App.scanCheckoutItem()"><svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/></svg><h4>点击模拟扫码添加商品</h4><p>扫描商品条码加入购物车</p></div></div></div>';
h+='<div class="card"><div class="card-header"><h3>购物车</h3></div><div class="card-body"><div id="checkout-cart"><div style="text-align:center;padding:20px;color:var(--text-muted)">购物车为空，请扫码添加商品</div></div></div></div></div>';
h+='<div><div class="card mb-16"><div class="card-header"><h3>会员识别</h3></div><div class="card-body"><div class="flex gap-8"><input id="checkout-member-input" placeholder="输入会员手机号" style="flex:1;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius)"><button class="btn btn-primary" onclick="App.checkoutIdentifyMember()">识别</button></div><div id="checkout-member-info"></div></div></div>';
h+='<div class="card mb-16"><div class="card-header"><h3>结算信息</h3></div><div class="card-body"><div id="checkout-summary"><div style="text-align:center;padding:20px;color:var(--text-muted)">添加商品后显示结算信息</div></div></div></div>';
h+='<div class="card" id="checkout-coupons-section" style="display:none"><div class="card-header"><h3>会员券包</h3></div><div class="card-body"><div id="checkout-coupons"></div></div></div>';
h+='<div class="card mt-16" id="checkout-receipt" style="display:none"><div class="card-header"><h3>收银小票</h3></div><div class="card-body"><div id="receipt-body"></div></div></div></div>';
h+='</div>';
return h}

function renderMembers(){
var inStore=state.members.filter(function(m){return m.inStore});
var levels={};state.members.forEach(function(m){levels[m.level]=(levels[m.level]||0)+1});
var levelColors={'普通会员':'gray','银卡会员':'info','金卡会员':'warning','钻石会员':'purple'};
var totalMembers=state.members.length;
var h='<div class="page-header"><h2>会员管理</h2><div class="actions"><button class="btn btn-primary" onclick="App.showMemberIdentify()">会员进店识别</button></div></div>';
h+='<div class="grid grid-4 mb-20">';
h+='<div class="stat-card"><div class="stat-icon blue"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div><div class="stat-label">总会员数</div><div class="stat-value">'+totalMembers+'</div></div>';
h+='<div class="stat-card"><div class="stat-icon green"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div><div class="stat-label">在店会员</div><div class="stat-value">'+inStore.length+'</div></div>';
h+='<div class="stat-card"><div class="stat-icon orange"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg></div><div class="stat-label">金卡以上</div><div class="stat-value">'+((levels['金卡会员']||0)+(levels['钻石会员']||0))+'</div></div>';
h+='<div class="stat-card"><div class="stat-icon purple"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div><div class="stat-label">在店VIP</div><div class="stat-value">'+inStore.filter(function(m){return m.level==='金卡会员'||m.level==='钻石会员'}).length+'</div></div>';
h+='</div>';
h+='<div class="grid grid-2 mb-20"><div class="card"><div class="card-header"><h3>等级分布</h3></div><div class="card-body">';
Object.keys(levels).forEach(function(lv){var pct=(levels[lv]/totalMembers*100).toFixed(1);var lc=levelColors[lv]||'gray';
h+='<div class="flex-between" style="margin-bottom:10px"><span><span class="badge-tag '+lc+'">'+lv+'</span> '+levels[lv]+'人</span><span style="color:var(--text-secondary);font-size:12px">'+pct+'%</span></div><div class="progress-bar" style="margin-bottom:8px"><div class="fill" style="width:'+pct+'%;background:var(--primary)"></div></div>'});
h+='</div></div>';
h+='<div class="card"><div class="card-header"><h3>实时在店会员</h3><div class="live-indicator"><span class="live-dot"></span>监测中</div></div><div class="card-body">';
if(inStore.length===0){h+='<div style="text-align:center;color:var(--text-muted);padding:20px">暂无在店会员</div>'}
else{inStore.slice(0,8).forEach(function(m){var lc=levelColors[m.level]||'gray';var rsBadge=m.receptionStatus==='已接待'?'<span class="badge-tag success" style="margin-left:4px">已接待</span>':m.receptionStatus==='待接待'?'<span class="badge-tag warning" style="margin-left:4px">待接待</span>':'';var btnHtml=m.receptionStatus==='已接待'?'<span style="font-size:12px;color:var(--success)">'+(m.assignedGuide||'')+'<br><span style="font-size:11px;color:var(--text-muted)">'+(m.receptionTime||'')+'</span></span>':m.receptionStatus==='待接待'?'<button class="btn btn-sm btn-warning" onclick="App.sendGuideNotification(\''+m.id+'\')">通知导购</button>':'<button class="btn btn-sm btn-outline" onclick="App.sendGuideNotification(\''+m.id+'\')">通知导购</button>';
h+='<div class="flex-between" style="margin-bottom:8px;padding:8px;border:1px solid var(--border);border-radius:var(--radius)"><div class="flex gap-8" style="align-items:center"><div style="width:28px;height:28px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600">'+m.name[0]+'</div><div><span style="font-weight:500">'+m.name+'</span> <span class="badge-tag '+lc+'">'+m.level+'</span>'+rsBadge+'<br><span style="font-size:11px;color:var(--text-muted)">积分'+m.points+'</span></div></div>'+btnHtml+'</div>'})}
h+='</div></div></div>';
h+='<div class="card mb-20"><div class="card-header"><h3>导购接待提醒</h3><span class="badge-tag info">'+state.receptions.length+'条</span></div><div class="card-body">';
if(state.receptions.length===0){h+='<div style="text-align:center;color:var(--text-muted);padding:20px">暂无接待记录</div>'}
else{h+='<table class="data-table"><thead><tr><th>会员</th><th>等级</th><th>识别方式</th><th>状态</th><th>导购</th><th>进店时间</th><th>接待完成时间</th><th>备注</th><th>跟进结果</th></tr></thead><tbody>';
state.receptions.forEach(function(r){var sc=r.status==='已接待'?'success':'warning';
var remarkHtml=r.remark?'<span style="font-size:12px">'+r.remark+'</span>':'<button class="btn btn-sm btn-outline" onclick="showReceptionRemarkModal(\''+r.id+'\')">备注</button>';
var followUpHtml='-';
if(r.status==='已接待'){
  if(r.followUp){
    var fuColor=r.followUp==='需要回访'?'warning':r.followUp==='已购买'?'success':'info';
    followUpHtml='<span class="badge-tag '+fuColor+'">'+r.followUp+'</span>';
  }else{
    followUpHtml='<select onchange="App.completeReception(\''+r.id+'\',this.value)" style="padding:4px 8px;border:1px solid var(--border);border-radius:var(--radius);font-size:12px"><option value="">请选择</option><option value="已购买">已购买</option><option value="只咨询">只咨询</option><option value="需要回访">需要回访</option></select>';
  }
}else if(r.status==='待接待'){
  followUpHtml='<span style="color:var(--text-muted)">-</span>';
}
h+='<tr><td style="font-weight:500">'+r.memberName+'</td><td><span class="badge-tag '+(levelColors[r.memberLevel]||'gray')+'">'+r.memberLevel+'</span></td><td>'+r.method+'</td><td><span class="badge-tag '+sc+'">'+r.status+'</span></td><td>'+(r.guideName||'-')+'</td><td>'+(r.enterTime||r.createTime||'-')+'</td><td>'+(r.completeTime||'<span style="color:var(--text-muted)">-</span>')+'</td><td>'+remarkHtml+'</td><td>'+followUpHtml+'</td></tr>'});
h+='</tbody></table>'}
h+='</div></div>';
h+='<div class="card"><div class="card-header"><h3>会员列表</h3></div><div class="card-body"><table class="data-table"><thead><tr><th>会员号</th><th>姓名</th><th>等级</th><th>积分</th><th>累计消费</th><th>优惠券</th><th>最近到店</th><th>状态</th><th>操作</th></tr></thead><tbody>';
state.members.forEach(function(m){var lc=levelColors[m.level]||'gray';var statusBadge=m.inStore?'success':'gray';var statusText=m.inStore?'在店':'离店';
var mc=getMemberCouponCount(m.id);h+='<tr><td>'+m.id+'</td><td style="font-weight:500">'+m.name+'</td><td><span class="badge-tag '+lc+'">'+m.level+'</span></td><td>'+m.points.toLocaleString()+'</td><td>'+fmt(m.totalSpent)+'</td><td>'+mc+'张</td><td>'+m.lastVisit+'</td><td><span class="badge-tag '+statusBadge+'">'+statusText+'</span></td><td><button class="btn btn-sm btn-outline" onclick="App.showMemberDetail(\''+m.id+'\')">详情</button></td></tr>'});
h+='</tbody></table></div></div>';
return h}

function renderPromotions(){
var expiring=state.products.filter(function(p){return p.daysLeft<=7});
var h='<div class="page-header"><h2>促销管理</h2><div class="actions"><button class="btn btn-primary" onclick="App.showCreatePromo()">创建促销活动</button></div></div>';
h+='<div class="grid grid-2 mb-20"><div class="card"><div class="card-header"><h3>临期商品自动促销</h3><span class="badge-tag warning">'+expiring.length+'项</span></div><div class="card-body">';
if(expiring.length===0){h+='<div style="text-align:center;color:var(--text-muted);padding:20px">暂无临期商品</div>'}
else{expiring.forEach(function(p){var disc=p.daysLeft<=3?0.5:0.8;var newPrice=(p.origPrice*disc).toFixed(2);var badge=p.daysLeft<=3?'danger':'warning';var priceDisplay=p.activePromo?'<span style="font-size:12px;color:var(--text-secondary)">'+fmt(p.origPrice)+' → <strong style="color:var(--danger)">'+fmt(p.activePromo.promoPrice)+'</strong></span>':'<span style="font-size:12px;color:var(--text-secondary)">'+fmt(p.origPrice)+' → <strong style="color:var(--danger)">'+fmt(newPrice)+'</strong></span>';var actionBtn=p.activePromo?'<span class="badge-tag success">促销已生效</span>':'<button class="btn btn-sm btn-warning" onclick="App.pushExpiryPromo(\''+p.id+'\','+disc+')">推送促销</button>';
h+='<div class="flex-between" style="margin-bottom:10px;padding:10px;border:1px solid var(--border);border-radius:var(--radius)"><div><span style="font-weight:500">'+p.name+'</span> <span class="badge-tag '+badge+'">剩余'+p.daysLeft+'天</span><br>'+priceDisplay+'</div>'+actionBtn+'</div>'})}
h+='</div></div>';
h+='<div class="card"><div class="card-header"><h3>优惠券管理</h3></div><div class="card-body">';
state.coupons.forEach(function(c){var usedCount=state.memberCouponInstances.filter(function(mci){return mci.couponId===c.id&&mci.status==='已核销'}).length;var totalCount=state.memberCouponInstances.filter(function(mci){return mci.couponId===c.id}).length;var usage=totalCount>0?((usedCount/totalCount*100).toFixed(1)):0;var typeBadge=c.type==='折扣'?'info':'purple';
var scopeText=c.category?c.category:'全品类';
h+='<div style="margin-bottom:12px;padding:12px;border:1px solid var(--border);border-radius:var(--radius)"><div class="flex-between" style="margin-bottom:6px"><span style="font-weight:600">'+c.name+'</span><span class="badge-tag '+typeBadge+'">'+c.type+'</span></div><div class="flex-between" style="font-size:12px;color:var(--text-secondary);margin-bottom:4px"><span>有效期至'+c.validTo+'</span><span>核销统计：'+usedCount+'/'+totalCount+'</span></div><div style="font-size:12px;color:var(--text-secondary);margin-bottom:8px">适用范围：<span class="badge-tag '+(c.category?'info':'success')+'" style="font-size:10px">'+scopeText+'</span></div><div class="flex-between"><div class="progress-bar" style="flex:1;margin-right:12px"><div class="fill blue" style="width:'+usage+'%"></div></div><button class="btn btn-sm btn-primary" onclick="App.showSendCouponModal(\''+c.id+'\')">发券</button></div></div>'});
h+='</div></div></div>';
h+='<div class="card mb-20"><div class="card-header"><h3>已生效促销</h3><span class="badge-tag success">'+state.activePromotions.length+'项</span></div><div class="card-body">';
if(state.activePromotions.length===0){h+='<div style="text-align:center;color:var(--text-muted);padding:20px">暂无生效中的促销</div>'}
else{h+='<table class="data-table"><thead><tr><th>商品名</th><th>促销类型</th><th>原价</th><th>促销价</th><th>折扣</th><th>生效时间</th></tr></thead><tbody>';
state.activePromotions.forEach(function(ap){
h+='<tr><td style="font-weight:500">'+ap.productName+'</td><td><span class="badge-tag warning">'+ap.type+'</span></td><td>'+fmt(ap.origPrice)+'</td><td style="color:var(--danger);font-weight:600">'+fmt(ap.promoPrice)+'</td><td>'+ap.discountLabel+'</td><td>'+ap.createTime+'</td></tr>'});
h+='</tbody></table>'}
h+='</div></div>';
h+='<h3 style="margin-top:24px">发券记录</h3>';
h+='<div class="card"><div class="card-body"><table class="data-table"><thead><tr><th>活动编号</th><th>券名</th><th>发放对象</th><th>发放数量</th><th>已核销</th><th>未使用</th><th>创建时间</th><th>创建人</th></tr></thead><tbody>';
if(!state.campaigns||state.campaigns.length===0){h+='<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:20px">暂无发券记录</td></tr>'}
else{state.campaigns.forEach(function(camp){var coupon=state.coupons.find(function(c){return c.id===camp.couponId});var couponName=coupon?coupon.name:'-';var targetText=camp.targetType+': '+camp.targetValue;var usedCount=state.memberCouponInstances.filter(function(mci){return mci.couponId===camp.couponId&&mci.status==='已核销'}).length;var unusedCount=state.memberCouponInstances.filter(function(mci){return mci.couponId===camp.couponId&&mci.status==='可用'}).length;
h+='<tr><td>'+camp.id+'</td><td style="font-weight:500">'+couponName+'</td><td>'+targetText+'</td><td>'+camp.quantity+'</td><td><span style="color:var(--success)">'+usedCount+'</span></td><td><span style="color:var(--warning)">'+unusedCount+'</span></td><td>'+camp.createTime+'</td><td>'+camp.creator+'</td></tr>'});}
h+='</tbody></table></div></div>';
return h}

function renderTransactions(){
if(!state.txFilter)state.txFilter={range:'today',phone:'',product:'',coupon:'',cashier:''};
var today=new Date();
var todayStr=today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');
var weekAgo=new Date(today.getTime()-7*24*60*60*1000);
var weekAgoStr=weekAgo.getFullYear()+'-'+String(weekAgo.getMonth()+1).padStart(2,'0')+'-'+String(weekAgo.getDate()).padStart(2,'0');
var filtered=state.transactions.filter(function(tx){
  if(state.txFilter.range==='today'){
    if(tx.time.indexOf(todayStr)!==0)return false;
  }
  if(state.txFilter.range==='week'){
    if(tx.time<weekAgoStr)return false;
  }
  if(state.txFilter.phone){
    if(!tx.memberPhone||tx.memberPhone.indexOf(state.txFilter.phone)===-1)return false;
  }
  return true;
});
var todayTxns=state.transactions.filter(function(tx){return tx.time.indexOf(todayStr)===0});
var todayRevenue=todayTxns.reduce(function(s,tx){return s+tx.finalAmount},0);
var todayDiscount=todayTxns.reduce(function(s,tx){return s+tx.discount},0);
var totalDiscount=state.transactions.reduce(function(s,tx){return s+tx.discount},0);
var h='<div class="page-header"><h2>交易流水</h2><div class="actions"><button class="btn btn-outline" onclick="App.exportTransactions()">导出</button></div></div>';
h+='<div class="grid grid-4 mb-20">';
h+='<div class="stat-card"><div class="stat-icon blue"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></div><div class="stat-label">今日交易数</div><div class="stat-value">'+todayTxns.length+'</div></div>';
h+='<div class="stat-card"><div class="stat-icon green"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div><div class="stat-label">今日营收</div><div class="stat-value">'+fmt(todayRevenue)+'</div></div>';
h+='<div class="stat-card"><div class="stat-icon orange"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg></div><div class="stat-label">今日优惠</div><div class="stat-value">'+fmt(todayDiscount)+'</div></div>';
h+='<div class="stat-card"><div class="stat-icon purple"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div><div class="stat-label">累计优惠</div><div class="stat-value">'+fmt(totalDiscount)+'</div></div>';
h+='</div>';
h+='<div class="flex-between mb-16"><div class="flex gap-8"><select id="tx-filter-range" style="padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius)"><option value="today"'+(state.txFilter.range==='today'?' selected':'')+'>今天</option><option value="week"'+(state.txFilter.range==='week'?' selected':'')+'>本周</option><option value="all"'+(state.txFilter.range==='all'?' selected':'')+'>全部</option></select><div class="search-bar"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input id="tx-filter-phone" placeholder="会员手机号" value="'+(state.txFilter.phone||'')+'"></div><input id="tx-filter-product" type="text" placeholder="输入商品名模糊搜索" value="'+(state.txFilter.product||'')+'" style="padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius)"><input id="tx-filter-coupon" type="text" placeholder="输入券名模糊搜索" value="'+(state.txFilter.coupon||'')+'" style="padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius)"><input id="tx-filter-cashier" type="text" placeholder="输入收银员姓名" value="'+(state.txFilter.cashier||'')+'" style="padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius)"><button class="btn btn-primary" onclick="filterTxPage()">筛选</button></div></div>';
h+='<table class="data-table"><thead><tr><th>交易编号</th><th>时间</th><th>收银员</th><th>会员</th><th>商品数</th><th>原价</th><th>优惠</th><th>实收</th><th>积分</th><th>操作</th></tr></thead><tbody>';
if(filtered.length===0){h+='<tr><td colspan="10" style="text-align:center;color:var(--text-muted);padding:20px">暂无交易记录</td></tr>'}
else{filtered.forEach(function(tx){
var itemCount=tx.items.reduce(function(s,i){return s+i.qty},0);
var discountCell=tx.discount>0?'<span style="color:var(--danger)">-'+fmt(tx.discount)+'</span>':'-';
var pointsCell=tx.pointsEarned>0?'+'+tx.pointsEarned:'-';
h+='<tr><td>'+tx.id+'</td><td>'+tx.time+'</td><td>'+tx.cashierName+'</td><td>'+(tx.memberName||'非会员')+'</td><td>'+itemCount+'</td><td>'+fmt(tx.subtotal)+'</td><td>'+discountCell+'</td><td style="font-weight:600">'+fmt(tx.finalAmount)+'</td><td>'+pointsCell+'</td><td><button class="btn btn-sm btn-outline" onclick="App.showTransactionDetail(\''+tx.id+'\')">详情</button></td></tr>'})}
h+='</tbody></table>';
return h}

function filterTxPage(){
var rangeEl=document.getElementById('tx-filter-range');
var phoneEl=document.getElementById('tx-filter-phone');
var productEl=document.getElementById('tx-filter-product');
var couponEl=document.getElementById('tx-filter-coupon');
var cashierEl=document.getElementById('tx-filter-cashier');
if(!state.txFilter)state.txFilter={range:'today',phone:'',product:'',coupon:'',cashier:''};
state.txFilter.range=rangeEl?rangeEl.value:'today';
state.txFilter.phone=phoneEl?phoneEl.value.trim():'';
state.txFilter.product=productEl?productEl.value.trim():'';
state.txFilter.coupon=couponEl?couponEl.value.trim():'';
state.txFilter.cashier=cashierEl?cashierEl.value.trim():'';
navigate('transactions');
}

function showReceptionRemarkModal(recId){
App.showModal('添加备注','<div class="form-group"><label>备注内容</label><textarea id="reception-remark-input" rows="4" style="width:100%;padding:8px;border:1px solid var(--border);border-radius:var(--radius);resize:vertical"></textarea></div>','<button class="btn btn-primary" onclick="confirmReceptionRemark(\''+recId+'\')">确认</button><button class="btn btn-outline" onclick="App.closeModal()">取消</button>');
}

function confirmReceptionRemark(recId){
var ta=document.getElementById('reception-remark-input');
if(!ta||!ta.value.trim()){App.toast('请输入备注内容','warning');return}
App.setReceptionRemark(recId,ta.value.trim());
App.closeModal();
}

function renderLoss(){
var cameras=[{id:'CAM01',name:'出口通道A',alert:true},{id:'CAM02',name:'出口通道B',alert:false},{id:'CAM03',name:'生鲜区A',alert:false},{id:'CAM04',name:'生鲜区B',alert:true},{id:'CAM05',name:'酒水区C',alert:false},{id:'CAM06',name:'收银区',alert:false}];
var h='<div class="page-header"><h2>防损系统</h2><div class="actions"><button class="btn btn-danger" onclick="App.emergencyLock()"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>紧急锁门</button></div></div>';
h+='<div class="card mb-20"><div class="card-header"><h3>CCTV监控</h3><div class="live-indicator"><span class="live-dot"></span>实时监控</div></div><div class="card-body"><div class="cCTV-grid">';
cameras.forEach(function(cam){
h+='<div class="cctv-feed'+(cam.alert?' alert-active':'')+'"><div class="feed-header"><span class="feed-label">'+cam.id+' '+cam.name+'</span><span class="feed-live">REC</span></div><div class="feed-content"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg></div></div>'});
h+='</div></div></div>';
h+='<div class="grid grid-2"><div class="card"><div class="card-header"><h3>警报事件</h3><button class="btn btn-sm btn-danger" onclick="App.triggerLossAlert()">模拟防损警报</button></div><div class="card-body"><div class="timeline">';
state.lossEvents.forEach(function(ev){var tc=ev.type==='大宗未结账'?'danger':'warning';var sc=ev.status==='已处理'?'success':'warning';var resolveBtn=ev.status==='监控中'?' <button class="btn btn-sm btn-primary" style="margin-top:6px" onclick="App.resolveLossEvent(\''+ev.id+'\')">处理并解锁</button>':'';
h+='<div class="timeline-item '+tc+'"><div class="tl-time">'+ev.time+'</div><div class="tl-title">'+ev.type+' <span class="badge-tag '+sc+'">'+ev.status+'</span></div><div class="tl-desc">'+ev.camera+' - '+ev.detail+'</div>'+resolveBtn+'</div>'});
h+='</div></div></div>';
h+='<div class="card"><div class="card-header"><h3>闸机控制</h3></div><div class="card-body">';
state.gates.forEach(function(g){var badge=g.status==='正常'?'success':'danger';var lockInfo=g.status==='已锁定'&&g.linkedEvent?'<br><span style="font-size:11px;color:var(--danger)">关联事件: '+g.linkedEvent+'</span>':'';var gateBtn=g.status==='已锁定'?'<button class="btn btn-sm btn-primary" onclick="App.unlockGate(\''+g.id+'\')">解锁</button>':'<span class="badge-tag success">正常运行</span>';
h+='<div class="flex-between" style="margin-bottom:12px;padding:12px;border:1px solid var(--border);border-radius:var(--radius)"><div><span style="font-weight:500">'+g.name+'</span><br><span class="badge-tag '+badge+'">'+g.status+'</span>'+lockInfo+'</div>'+gateBtn+'</div>'});
h+='</div></div></div>';
return h}

function renderFinance(){
var catPL=CATEGORIES.map(function(c){var prods=state.products.filter(function(p){return p.category===c});var revenue=0,cost=0;prods.forEach(function(p){var q=p.sales30d.reduce(function(a,b){return a+b},0);revenue+=q*p.price;cost+=q*p.cost});return{c:c,revenue:revenue,cost:cost,profit:revenue-cost,margin:revenue>0?(revenue-cost)/revenue*100:0}});
var totalRev=catPL.reduce(function(s,x){return s+x.revenue},0);
var totalCost=catPL.reduce(function(s,x){return s+x.cost},0);
var totalProfit=totalRev-totalCost;
var days=['2026-06-19','2026-06-18','2026-06-17','2026-06-16','2026-06-15'];
var recons=days.map(function(d){var r=totalRev*(0.85+Math.random()*0.3);var c=totalCost*(0.85+Math.random()*0.3);return{date:d,revenue:r,cost:c,profit:r-c,status:Math.random()>.2?'已对齐':'待复核'}});
var h='<div class="page-header"><h2>财务对账</h2><div class="actions"><button class="btn btn-primary" onclick="App.runDailyRecon()">每日对账</button><button class="btn btn-outline" onclick="App.exportFinance()">导出报表</button></div></div>';
h+='<div class="grid grid-3 mb-20">';
h+='<div class="stat-card"><div class="stat-icon blue"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div><div class="stat-label">30天营收</div><div class="stat-value">'+fmt(totalRev)+'</div></div>';
h+='<div class="stat-card"><div class="stat-icon orange"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8"/></svg></div><div class="stat-label">30天成本</div><div class="stat-value">'+fmt(totalCost)+'</div></div>';
h+='<div class="stat-card"><div class="stat-icon green"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg></div><div class="stat-label">30天毛利</div><div class="stat-value">'+fmt(totalProfit)+'</div><div class="stat-change up">毛利率'+(totalRev>0?(totalProfit/totalRev*100).toFixed(1):0)+'%</div></div>';
h+='</div>';
h+='<div class="card mb-20"><div class="card-header"><h3>品类毛利分析</h3></div><div class="card-body"><table class="data-table"><thead><tr><th>品类</th><th>营收</th><th>成本</th><th>毛利</th><th>毛利率</th><th>占比</th></tr></thead><tbody>';
catPL.forEach(function(x){var marginColor=x.margin>=30?'var(--success)':x.margin>=20?'var(--warning)':'var(--danger)';var share=(totalRev>0?(x.revenue/totalRev*100).toFixed(1):0);
h+='<tr><td style="font-weight:500">'+x.c+'</td><td>'+fmt(x.revenue)+'</td><td>'+fmt(x.cost)+'</td><td style="font-weight:600">'+fmt(x.profit)+'</td><td><span style="color:'+marginColor+';font-weight:600">'+x.margin.toFixed(1)+'%</span></td><td><div class="progress-bar" style="width:100px;display:inline-block"><div class="fill blue" style="width:'+share+'%"></div></div> '+share+'%</td></tr>'});
h+='</tbody></table></div></div>';
h+='<div class="card"><div class="card-header"><h3>每日对账记录</h3></div><div class="card-body"><table class="data-table"><thead><tr><th>日期</th><th>营收</th><th>成本</th><th>毛利</th><th>状态</th></tr></thead><tbody>';
recons.forEach(function(r){var sc=r.status==='已对齐'?'success':'warning';
h+='<tr><td>'+r.date+'</td><td>'+fmt(r.revenue)+'</td><td>'+fmt(r.cost)+'</td><td>'+fmt(r.profit)+'</td><td><span class="badge-tag '+sc+'">'+r.status+'</span></td></tr>'});
h+='</tbody></table></div></div>';
return h}

function renderPermissions(){
var modules=['店长看板','进销存管理','电子价签','收银台','会员管理','促销管理','防损系统','财务对账','权限管理'];
var keys=['dashboard','inventory','pricing','checkout','members','promotions','lossprevention','finance','permissions'];
var roleKeys=Object.keys(ROLES);
var h='<div class="page-header"><h2>权限管理</h2></div>';
h+='<div class="grid grid-4 mb-20">';
roleKeys.forEach(function(rk){var r=ROLES[rk];
h+='<div class="stat-card"><div class="stat-icon '+(rk==='storeManager'?'blue':rk==='regionalManager'?'purple':rk==='cashier'?'green':'orange')+'"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div><div class="stat-label">'+r.label+'</div><div class="stat-value" style="font-size:20px">L'+r.level+'</div><div style="font-size:12px;color:var(--text-secondary);margin-top:4px">'+r.perms.length+'项权限</div></div>'});
h+='</div>';
h+='<div class="card"><div class="card-header"><h3>权限矩阵</h3></div><div class="card-body"><div class="permission-matrix"><table class="perm-table"><thead><tr><th>功能模块</th>';
roleKeys.forEach(function(rk){h+='<th>'+ROLES[rk].label+'</th>'});
h+='</tr></thead><tbody>';
keys.forEach(function(k,i){h+='<tr><td>'+modules[i]+'</td>';roleKeys.forEach(function(rk){var has=ROLES[rk].perms.indexOf(k)!==-1;h+='<td><span class="'+(has?'perm-check':'perm-cross')+'">'+(has?'✓':'✗')+'</span></td>'});h+='</tr>'});
h+='</tbody></table></div></div></div>';
return h}