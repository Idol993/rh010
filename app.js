var App={};
(function(){
'use strict';
var ROLES={
  guide:{label:'导购',level:1,perms:['dashboard','members','promotions','checkout','transactions']},
  cashier:{label:'收银',level:2,perms:['dashboard','checkout','members','pricing','transactions']},
  storeManager:{label:'店长',level:3,perms:['dashboard','inventory','pricing','checkout','members','promotions','lossprevention','finance','transactions']},
  regionalManager:{label:'区域经理',level:4,perms:['dashboard','inventory','pricing','checkout','members','promotions','lossprevention','finance','permissions','transactions']}
};
var USERS=[
  {id:'u001',name:'张店长',role:'storeManager',avatar:'店'},
  {id:'u002',name:'李导购',role:'guide',avatar:'导'},
  {id:'u003',name:'王收银',role:'cashier',avatar:'收'},
  {id:'u004',name:'赵区经',role:'regionalManager',avatar:'区'}
];
var GUIDES=[USERS[1]];
var CATEGORIES=['生鲜果蔬','乳品烘焙','粮油调味','酒水饮料','个人护理','家居清洁','休闲零食','母婴用品'];
var SF={'生鲜果蔬':[1.2,1.1,1,.9,.9,1.1,1,1,1.1,1,.9,1],'乳品烘焙':[1,1,1,1,1.1,1.2,1.2,1.1,1,1,1,1],'粮油调味':[.9,.9,1,1,1,1,1,1,1,1.1,1.2,1.3],'酒水饮料':[.8,.9,1,1,1.2,1.3,1.3,1.2,1,1,1,1.1],'个人护理':[1,1,1,1.1,1,1,1.1,1,1,1,1.1,1.2],'家居清洁':[1,1,1.1,1.1,1,.9,.9,1,1,1,1,1],'休闲零食':[1,1.1,1,1,1,1.1,1.2,1.1,1.1,1,1,1.2],'母婴用品':[1,1,1,1,1,1,1,1,1,1,1,1]};
var NAMES={'生鲜果蔬':['红富士苹果','有机西兰花','泰国榴莲','山东大姜','有机胡萝卜','进口蓝莓','云南小番茄','新疆香梨'],'乳品烘焙':['蒙牛纯牛奶','安佳黄油','巴黎贝甜吐司','光明酸奶','味全每日C','曼可顿全麦面包','新希望鲜牛奶','伊利奶粉'],'粮油调味':['金龙鱼菜籽油','海天酱油','福临门大米','老干妈辣酱','李锦记蚝油','十月稻田五常米','鲁花花生油','王致和腐乳'],'酒水饮料':['可口可乐','百威啤酒','农夫山泉','青岛啤酒','元气森林','东鹏特饮','汇源果汁','五粮液'],'个人护理':['海飞丝洗发水','舒肤佳香皂','高露洁牙膏','欧莱雅面霜','安利牙刷','沙宣护发素','多芬沐浴露','吉列剃须刀'],'家居清洁':['蓝月亮洗衣液','威猛先生','心相印纸巾','清风卷纸','滴露消毒液','金纺柔顺剂','妙洁保鲜膜','洁柔抽纸'],'休闲零食':['乐事薯片','良品铺子坚果','德芙巧克力','三只松鼠','百草味','卫龙辣条','奥利奥饼干','徐福记糖果'],'母婴用品':['飞鹤奶粉','帮宝适纸尿裤','好孩子湿巾','贝亲奶瓶','小皮米粉','惠氏启赋','尤妮佳纸尿裤','美素佳儿']};

function genProducts(){var p=[];var id=1;CATEGORIES.forEach(function(c){(NAMES[c]||[]).forEach(function(n){var cost=(Math.random()*30+5).toFixed(2);var price=(cost*1.3+Math.random()*10).toFixed(2);p.push({id:'P'+String(id).padStart(4,'0'),barcode:'690'+String(Math.floor(Math.random()*1e10)).padStart(10,'0'),name:n,category:c,cost:parseFloat(cost),price:parseFloat(price),origPrice:parseFloat(price),stock:Math.floor(Math.random()*200+10),safetyStock:Math.floor(Math.random()*30+10),shelfLife:Math.floor(Math.random()*180+30),daysLeft:Math.floor(Math.random()*60+1),sales30d:Array.from({length:30},function(){return Math.floor(Math.random()*20+1)}),priceTagSynced:Math.random()>.2,lastRestock:'2026-06-'+String(Math.floor(Math.random()*15+1)).padStart(2,'0'),activePromo:null});id++})});return p}

function genMembers(){var lv=['普通会员','银卡会员','金卡会员','钻石会员'];var nm=['王芳','李明','张伟','刘洋','陈静','赵磊','孙丽','周强','吴秀英','郑浩','冯雪','褚波','卫兰','蒋涛','沈慧','韩超','杨洁','朱军','秦敏','许鹏','何琳','吕峰','施英','马龙','唐丽华','费东','金艳','魏刚','陶蓉','万里','段磊','曹敏','袁浩','邓萍','贺军','姜雪','董波','程慧','蔡涛','丁英'];var m=[];for(var i=1;i<=40;i++){var l=lv[Math.floor(Math.random()*4)];m.push({id:'M'+String(i).padStart(4,'0'),name:nm[i-1]||'会员'+i,phone:'138'+String(Math.floor(Math.random()*1e8)).padStart(8,'0'),level:l,points:Math.floor(Math.random()*50000),totalSpent:parseFloat((Math.random()*20000+100).toFixed(2)),lastVisit:'2026-06-'+String(Math.floor(Math.random()*18+1)).padStart(2,'0'),inStore:Math.random()>.7,faceAuthorized:Math.random()>.5,coupons:0,nearby:Math.random()>.6,receptionStatus:null,receptionTime:null,assignedGuide:null})}return m}

function genCoupons(){return[{id:'C001',name:'满100减20',type:'满减',threshold:100,discount:20,validTo:'2026-07-31',used:128,total:500,category:''},{id:'C002',name:'生鲜8折券',type:'折扣',threshold:0,discount:.8,validTo:'2026-07-15',used:56,total:200,category:'生鲜果蔬'},{id:'C003',name:'新会员30减10',type:'满减',threshold:30,discount:10,validTo:'2026-08-31',used:234,total:1000,category:''},{id:'C004',name:'酒水满200减50',type:'满减',threshold:200,discount:50,validTo:'2026-07-20',used:42,total:300,category:'酒水饮料'},{id:'C005',name:'全品类9折券',type:'折扣',threshold:0,discount:.9,validTo:'2026-06-30',used:89,total:400,category:''}]}

var orderId=1;
function nextOrderId(){return 'PO'+String(orderId++).padStart(5,'0')}

var txId=1;
function nextTxId(){return 'TX'+String(txId++).padStart(6,'0')}

var state={
  currentUser:USERS[0],
  products:genProducts(),
  members:genMembers(),
  coupons:genCoupons(),
  currentPage:'dashboard',
  alerts:[
    {id:1,type:'danger',title:'库存预警',desc:'有机西兰花库存低于安全水位(8/25)',time:'2分钟前'},
    {id:2,type:'warning',title:'临期提醒',desc:'3件泰国榴莲将于3天内到期',time:'15分钟前'},
    {id:3,type:'info',title:'会员到店',desc:'钻石会员王芳已进店，请导购接待',time:'28分钟前'},
    {id:4,type:'danger',title:'防损警报',desc:'出口通道A监测到大宗商品未结账异常',time:'1小时前'},
    {id:5,type:'success',title:'价签同步',desc:'32个电子价签价格已同步完成',time:'2小时前'}
  ],
  lossEvents:[
    {id:'L001',time:'2026-06-19 14:23',camera:'出口通道A',type:'大宗未结账',status:'已处理',detail:'顾客携带2箱五粮液未结账，闸机已锁定，安保已到场',gateId:null,resolvedTime:'2026-06-19 14:35'},
    {id:'L002',time:'2026-06-19 11:05',camera:'生鲜区B',type:'异常行为',status:'已处理',detail:'顾客将商品放入个人背包，安保已跟进',gateId:null,resolvedTime:'2026-06-19 11:12'},
    {id:'L003',time:'2026-06-18 19:42',camera:'酒水区C',type:'大宗未结账',status:'监控中',detail:'检测到商品移出轨迹异常，持续跟踪',gateId:null,resolvedTime:null}
  ],
  gates:[
    {id:'G001',name:'出口通道A',status:'正常',linkedEvent:null},
    {id:'G002',name:'出口通道B',status:'正常',linkedEvent:null},
    {id:'G003',name:'员工通道',status:'正常',linkedEvent:null}
  ],
  receptions:[],
  purchaseOrders:[],
  activePromotions:[],
  checkoutCart:[],
  selectedMember:null,
  appliedCoupon:null,
  appliedCouponInstanceId:null,
  checkoutDiscount:0,
  transactions:[],
  memberCouponInstances:[],
  txFilter:{range:'today',phone:''}
};

function initMemberCoupons(){
  var mci=[];
  var cid=1;
  state.members.forEach(function(m){
    var count=Math.floor(Math.random()*4)+1;
    var pool=state.coupons.slice();
    for(var i=0;i<count&&pool.length;i++){
      var idx=Math.floor(Math.random()*pool.length);
      var c=pool.splice(idx,1)[0];
      mci.push({id:'MCI'+String(cid++).padStart(6,'0'),couponId:c.id,memberId:m.id,name:c.name,type:c.type,threshold:c.threshold,discount:c.discount,category:c.category||'',validTo:c.validTo,status:'可用'});
    }
  });
  state.memberCouponInstances=mci;
}
initMemberCoupons();

function getMemberCouponCount(memberId){return state.memberCouponInstances.filter(function(i){return i.memberId===memberId&&i.status==='可用'}).length}

App.toast=function(msg,type){type=type||'info';var c=document.getElementById('toast-container');var t=document.createElement('div');t.className='toast '+type;t.textContent=msg;c.appendChild(t);setTimeout(function(){t.remove()},3000)};
App.showModal=function(title,body,footer){document.getElementById('modal-title').textContent=title;document.getElementById('modal-body').innerHTML=body;document.getElementById('modal-footer').innerHTML=footer||'';document.getElementById('modal-overlay').classList.remove('hidden')};
App.closeModal=function(){document.getElementById('modal-overlay').classList.add('hidden')};

function fmt(n){return '¥'+Number(n).toFixed(2)}
function now(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')}
function calcRepl(p){var m=new Date().getMonth();var total=p.sales30d.reduce(function(a,b){return a+b},0);var avg=total/30;var sf=SF[p.category]?SF[p.category][m]:1;var rp=Math.ceil((avg*sf*3)+(avg*7));var sq=Math.max(0,rp-p.stock);return{avg:avg.toFixed(1),sf:sf.toFixed(2),rp:rp,sq:sq}}

function calcCatSubtotal(cart,cartItems,category){
  var s=0;
  cart.forEach(function(item){
    var prod=cartItems.find(function(p){return p.id===item.id});
    if(prod&&(!category||prod.category===category)){
      s+=item.price*item.qty;
    }
  });
  return s;
}

function calcCouponSaving(coupon,cart,cartItems){
  var total=calcCatSubtotal(cart,cartItems,coupon.category||'');
  if(total<=0)return 0;
  if(coupon.type==='满减'){
    if(total<coupon.threshold)return 0;
    return coupon.discount;
  }
  if(coupon.type==='折扣'){
    return total*(1-coupon.discount);
  }
  return 0;
}

function isCouponApplicable(coupon,cart,cartItems){
  var catTotal=calcCatSubtotal(cart,cartItems,coupon.category||'');
  if(catTotal<=0)return false;
  if(coupon.type==='满减')return catTotal>=coupon.threshold;
  return true;
}

function findBestCoupon(cart,cartItems){
  if(!state.selectedMember)return null;
  var memberCoupons=state.memberCouponInstances.filter(function(mci){
    return mci.memberId===state.selectedMember.id&&mci.status==='可用';
  }).map(function(mci){
    return state.coupons.find(function(c){return c.id===mci.couponId});
  }).filter(function(c){return c});
  var applicable=memberCoupons.filter(function(c){
    if(state.appliedCoupon&&state.appliedCoupon.id===c.id)return false;
    return isCouponApplicable(c,cart,cartItems);
  });
  if(!applicable.length)return null;
  var best=applicable[0],bestSaving=calcCouponSaving(best,cart,cartItems);
  for(var i=1;i<applicable.length;i++){
    var s=calcCouponSaving(applicable[i],cart,cartItems);
    if(s>bestSaving){best=applicable[i];bestSaving=s}
  }
  return bestSaving>0?best:null;
}

function renderAlerts(){var l=document.getElementById('alert-list');if(!l)return;l.innerHTML=state.alerts.map(function(a){return '<div class="alert-item"><div class="alert-dot '+a.type+'"></div><div class="alert-content"><div class="alert-title">'+a.title+'</div><div class="alert-desc">'+a.desc+'</div><div class="alert-time">'+a.time+'</div></div></div>'}).join('');var b=document.getElementById('alert-badge');if(b)b.textContent=state.alerts.length}

var PN={dashboard:'店长看板',inventory:'进销存管理',pricing:'电子价签',checkout:'收银台',members:'会员管理',promotions:'促销管理',lossprevention:'防损系统',finance:'财务对账',permissions:'权限管理',transactions:'交易流水'};

function hasPendingOrder(productId){
  return state.purchaseOrders.some(function(po){return po.productId===productId&&po.status==='待处理'});
}

function autoGeneratePurchaseAlerts(){
  var lowStock=state.products.filter(function(p){return p.stock<p.safetyStock});
  var createdCount=0;
  lowStock.forEach(function(p){
    if(hasPendingOrder(p.id))return;
    var gap=p.safetyStock-p.stock;
    var r=calcRepl(p);
    if(gap<=0&&r.sq<=0)return;
    var orderType=r.sq>gap?'采购':'调拨';
    var qty=orderType==='采购'?r.sq:gap;
    if(qty<=0)return;
    var order={id:nextOrderId(),type:orderType,productId:p.id,productName:p.name,category:p.category,qty:qty,price:p.price,total:qty*p.price,status:'待处理',createTime:now(),source:'自动预警'};
    state.purchaseOrders.push(order);
    createdCount++;
  });
  return createdCount;
}

function navigate(page){
  var R={dashboard:renderDashboard,inventory:renderInventory,pricing:renderPricing,checkout:renderCheckout,members:renderMembers,promotions:renderPromotions,lossprevention:renderLoss,finance:renderFinance,permissions:renderPermissions,transactions:renderTransactions};
  if(!R[page])return;
  var role=ROLES[state.currentUser.role];
  if(role.perms.indexOf(page)===-1){App.toast('您没有访问该模块的权限','warning');return}
  state.currentPage=page;
  if(page==='inventory'){
    var cnt=autoGeneratePurchaseAlerts();
    if(cnt>0){setTimeout(function(){App.toast('自动生成'+cnt+'张库存预警单据','info')},200)}
  }
  document.getElementById('page-container').innerHTML=R[page]();
  document.querySelectorAll('.nav-item').forEach(function(n){n.classList.toggle('active',n.dataset.page===page)});
  document.getElementById('breadcrumb').innerHTML='<span>首页</span><span class="sep">/</span><span>'+(PN[page]||page)+'</span>';
  if(page==='inventory')initInvTabs();
}

function initInvTabs(){var tabs=document.querySelectorAll('#inv-tabs .tab');if(!tabs.length)return;tabs.forEach(function(tab){tab.addEventListener('click',function(){tabs.forEach(function(t){t.classList.remove('active')});tab.classList.add('active');var t=tab.dataset.tab;var c=document.getElementById('inv-content');if(t==='alert'){var cnt=autoGeneratePurchaseAlerts();if(cnt>0){setTimeout(function(){App.toast('自动生成'+cnt+'张库存预警单据','info')},100)}c.innerHTML=renderInvAlert()}else if(t==='all')c.innerHTML=renderInvAll();else if(t==='inbound')c.innerHTML=renderInvInbound();else if(t==='replenish')c.innerHTML=renderInvReplenish()})})}

function updateCartUI(){
  var cartEl=document.getElementById('checkout-cart');
  var sumEl=document.getElementById('checkout-summary');
  var couponSec=document.getElementById('checkout-coupons-section');
  if(!cartEl)return;
  var cart=state.checkoutCart,cartItems=state.products;
  if(cart.length===0){
    state.appliedCoupon=null;state.appliedCouponInstanceId=null;state.checkoutDiscount=0;
    cartEl.innerHTML='<div style="text-align:center;padding:20px;color:var(--text-muted)">购物车为空，请扫码添加商品</div>';
    sumEl.innerHTML='<div style="text-align:center;padding:20px;color:var(--text-muted)">添加商品后显示结算信息</div>';
    if(couponSec)couponSec.style.display='none';return;
  }
  var subtotal=0;
  cartEl.innerHTML='<table class="data-table"><thead><tr><th>商品</th><th>单价</th><th>数量</th><th>小计</th><th></th></tr></thead><tbody>'+
    cart.map(function(item,i){
      var unitPrice=item.price;
      var sub=unitPrice*item.qty;subtotal+=sub;
      var promoLabel='';
      var prod=cartItems.find(function(p){return p.id===item.id});
      if(prod&&prod.activePromo){
        promoLabel=' <span class="badge-tag warning" style="font-size:10px">'+prod.activePromo.discountLabel+'</span>';
      }
      return '<tr><td>'+item.name+promoLabel+'</td><td>'+fmt(unitPrice)+'</td><td><button class="btn btn-sm btn-outline" onclick="App.changeQty('+i+',-1)">-</button> '+item.qty+' <button class="btn btn-sm btn-outline" onclick="App.changeQty('+i+',1)">+</button></td><td>'+fmt(sub)+'</td><td><button class="btn btn-sm btn-danger" onclick="App.removeFromCart('+i+')">删除</button></td></tr>';
    }).join('')+'</tbody></table>';

  var discount=0;
  var couponLabel='';
  if(state.appliedCoupon){
    if(isCouponApplicable(state.appliedCoupon,cart,cartItems)){
      discount=calcCouponSaving(state.appliedCoupon,cart,cartItems);
      couponLabel=state.appliedCoupon.name+(state.appliedCoupon.category?'（'+state.appliedCoupon.category+'）':'');
    }else{
      state.appliedCoupon=null;
      state.appliedCouponInstanceId=null;
    }
  }
  if(!state.appliedCoupon&&state.selectedMember){
    var best=findBestCoupon(cart,cartItems);
    if(best){
      state.appliedCoupon=best;
      var bestInst=state.memberCouponInstances.find(function(mci){return mci.memberId===state.selectedMember.id&&mci.couponId===best.id&&mci.status==='可用'});
      if(bestInst)state.appliedCouponInstanceId=bestInst.id;
      discount=calcCouponSaving(best,cart,cartItems);
      couponLabel=best.name+(best.category?'（'+best.category+'）':'')+'（自动推荐）';
    }
  }
  state.checkoutDiscount=discount;
  var finalAmount=subtotal-discount;
  var pts=Math.floor(finalAmount);

  var sumHtml='<div style="padding:8px 0">';
  sumHtml+='<div class="flex-between" style="padding:8px 0"><span>商品合计</span><span>'+fmt(subtotal)+'</span></div>';
  if(discount>0){
    sumHtml+='<div class="flex-between" style="padding:8px 0;color:var(--danger)"><span>优惠 ('+couponLabel+')</span><span>-'+fmt(discount)+'</span></div>';
  }
  if(state.selectedMember){
    sumHtml+='<div class="flex-between" style="padding:8px 0;color:var(--success)"><span>获得积分</span><span>+'+pts+'</span></div>';
  }
  sumHtml+='<div class="flex-between" style="padding:12px 0;font-size:18px;font-weight:700;border-top:2px solid var(--border);margin-top:8px"><span>应付金额</span><span style="color:var(--danger)">'+fmt(finalAmount)+'</span></div>';
  sumHtml+='</div>';
  sumHtml+='<button class="btn btn-success" style="width:100%;justify-content:center;font-size:16px;padding:12px" onclick="App.completeCheckout()">确认结算</button>';
  sumEl.innerHTML=sumHtml;

  if(state.selectedMember&&couponSec){
    var memberInstances=state.memberCouponInstances.filter(function(mci){return mci.memberId===state.selectedMember.id&&mci.status==='可用'});
    var applicableList=memberInstances.filter(function(mci){
      var tmpl=state.coupons.find(function(c){return c.id===mci.couponId});
      return tmpl&&isCouponApplicable(tmpl,cart,cartItems);
    });
    couponSec.style.display=memberInstances.length?'block':'none';
    var couponTitleEl=couponSec.querySelector('h3');
    if(couponTitleEl)couponTitleEl.textContent='会员券包';
    var cHtml='';
    memberInstances.forEach(function(mci){
      var tmpl=state.coupons.find(function(c){return c.id===mci.couponId});
      if(!tmpl)return;
      var applicable=isCouponApplicable(tmpl,cart,cartItems);
      var saving=calcCouponSaving(tmpl,cart,cartItems);
      var isApplied=state.appliedCoupon&&state.appliedCoupon.id===tmpl.id&&state.appliedCouponInstanceId===mci.id;
      var catTag=mci.category?' <span class="badge-tag info" style="font-size:10px">'+mci.category+'</span>':'';
      cHtml+='<div class="flex-between" style="padding:8px 0;border-bottom:1px solid var(--border)"><div><span style="font-weight:500">'+mci.name+'</span>'+catTag;
      if(isApplied){cHtml+=' <span class="badge-tag success" style="font-size:10px">已使用</span>'}
      if(!applicable&&!isApplied){cHtml+=' <span class="badge-tag gray" style="font-size:10px">不适用</span>'}
      if(applicable&&!isApplied){cHtml+=' <span class="badge-tag success" style="font-size:10px">可使用</span>'}
      cHtml+='<br><span style="font-size:11px;color:var(--text-muted)">';
      if(applicable){cHtml+='可省'+fmt(saving)}else{cHtml+='无适用商品或不满足条件'}
      cHtml+='</span></div>';
      if(isApplied){
        cHtml+='<span style="color:var(--success);font-size:12px;font-weight:500">已抵扣</span>';
      }else if(applicable){
        cHtml+='<button class="btn btn-sm btn-primary" onclick="App.applyCouponInstance(\''+mci.id+'\')">使用</button>';
      }else{
        cHtml+='<span style="color:var(--text-muted);font-size:12px">-</span>';
      }
      cHtml+='</div>';
    });
    document.getElementById('checkout-coupons').innerHTML=cHtml;
  }
}

App.navigate=navigate;
App.switchRole=function(role){var u=USERS.find(function(x){return x.role===role});if(!u)u=USERS[0];state.currentUser=u;document.getElementById('user-name').textContent=u.name;document.getElementById('user-role').textContent=ROLES[u.role].label;document.getElementById('user-avatar').textContent=u.avatar;navigate(state.currentPage);App.toast('已切换为'+ROLES[u.role].label+'角色','info')};

App.showInboundModal=function(){App.showModal('入库扫码','<div class="scanner-area" onclick="App.simulateScan()"><svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/></svg><h4>点击模拟扫码入库</h4><p>扫描商品条码快速入库</p></div><div id="scan-result" style="margin-top:16px"></div>','<button class="btn btn-outline" onclick="App.closeModal()">关闭</button>')};

App.simulateScan=function(){var p=state.products[Math.floor(Math.random()*state.products.length)];var qty=Math.floor(Math.random()*50+10);p.stock+=qty;p.priceTagSynced=false;var el=document.getElementById('scan-result');if(el)el.innerHTML='<div class="card"><div class="card-body"><div style="color:var(--success);font-weight:600;margin-bottom:8px">✓ 扫码成功</div><div class="grid grid-2"><div><span style="color:var(--text-secondary)">商品：</span>'+p.name+'</div><div><span style="color:var(--text-secondary)">条码：</span>'+p.barcode+'</div><div><span style="color:var(--text-secondary)">入库数量：</span><strong>'+qty+'</strong></div><div><span style="color:var(--text-secondary)">当前库存：</span><strong>'+p.stock+'</strong></div></div></div></div>';App.toast(p.name+'入库'+qty+'件','success')};

App.filterProducts=function(){var s=(document.getElementById('inv-search')?.value||'').toLowerCase();var cat=document.getElementById('inv-cat-filter')?.value||'';document.querySelectorAll('#inv-table tbody tr').forEach(function(r){var t=r.textContent.toLowerCase();r.style.display=(!s||t.indexOf(s)!==-1)&&(!cat||t.indexOf(cat)!==-1)?'':'none'})};

App.showProductDetail=function(id){var p=state.products.find(function(x){return x.id===id});if(!p)return;var r=calcRepl(p);App.showModal('商品详情 - '+p.name,'<div class="grid grid-2"><div class="form-group"><label>商品编号</label><input value="'+p.id+'" readonly></div><div class="form-group"><label>条码</label><input value="'+p.barcode+'" readonly></div><div class="form-group"><label>分类</label><input value="'+p.category+'" readonly></div><div class="form-group"><label>进价</label><input value="'+fmt(p.cost)+'" readonly></div><div class="form-group"><label>售价</label><input value="'+fmt(p.price)+'" readonly></div><div class="form-group"><label>库存</label><input value="'+p.stock+'" readonly></div><div class="form-group"><label>安全库存</label><input value="'+p.safetyStock+'" readonly></div><div class="form-group"><label>保质期剩余</label><input value="'+p.daysLeft+'天" readonly></div></div>'+(p.activePromo?'<div style="margin-top:12px;padding:10px;background:var(--warning-light);border-radius:var(--radius)"><strong>促销生效中：</strong>'+p.activePromo.discountLabel+' → '+fmt(p.activePromo.promoPrice)+'</div>':'')+'<h4 style="margin:16px 0 8px">补货建议</h4><div class="grid grid-2"><div><span style="color:var(--text-secondary)">日均销量：</span>'+r.avg+'</div><div><span style="color:var(--text-secondary)">季节因子：</span>'+r.sf+'</div><div><span style="color:var(--text-secondary)">再订货点：</span>'+r.rp+'</div><div><span style="color:var(--text-secondary)">建议补货：</span><strong style="color:var(--primary)">'+r.sq+'</strong></div></div>','<button class="btn btn-primary" onclick="App.triggerPurchase(\''+p.id+'\');App.closeModal()">立即采购</button><button class="btn btn-outline" onclick="App.closeModal()">关闭</button>')};

App.triggerPurchase=function(id){
  var p=state.products.find(function(x){return x.id===id});if(!p)return;
  if(hasPendingOrder(p.id)){
    App.toast(p.name+'已有待处理单据，无需重复生成','warning');
    if(state.currentPage==='inventory')navigate('inventory');
    return;
  }
  var r=calcRepl(p);
  if(r.sq<=0){App.toast(p.name+'暂不需要采购','warning');return}
  var order={id:nextOrderId(),type:'采购',productId:p.id,productName:p.name,category:p.category,qty:r.sq,price:p.price,total:r.sq*p.price,status:'待处理',createTime:now(),source:'手动采购'};
  state.purchaseOrders.push(order);
  App.toast('已生成采购单 '+order.id+'：'+p.name+' × '+r.sq,'success');
  if(state.currentPage==='inventory')navigate('inventory');
};

App.triggerTransfer=function(id){
  var p=state.products.find(function(x){return x.id===id});if(!p)return;
  if(hasPendingOrder(p.id)){
    App.toast(p.name+'已有待处理单据，无需重复生成','warning');
    if(state.currentPage==='inventory')navigate('inventory');
    return;
  }
  var gap=p.safetyStock-p.stock;
  if(gap<=0){App.toast(p.name+'库存充足，无需调拨','warning');return}
  var order={id:nextOrderId(),type:'调拨',productId:p.id,productName:p.name,category:p.category,qty:gap,price:p.price,total:gap*p.price,status:'待处理',createTime:now(),source:'手动调拨'};
  state.purchaseOrders.push(order);
  App.toast('已生成调拨单 '+order.id+'：'+p.name+' × '+gap,'info');
  if(state.currentPage==='inventory')navigate('inventory');
};

App.batchReplenish=function(){var items=state.products.filter(function(p){return calcRepl(p).sq>0&&!hasPendingOrder(p.id)});items.forEach(function(p){var r=calcRepl(p);state.purchaseOrders.push({id:nextOrderId(),type:'采购',productId:p.id,productName:p.name,category:p.category,qty:r.sq,price:p.price,total:r.sq*p.price,status:'待处理',createTime:now(),source:'批量补货'})});App.toast('已生成批量采购单，共'+items.length+'项商品（已跳过有未处理单据的商品）','success');if(state.currentPage==='inventory')navigate('inventory')};

App.syncAllPriceTags=function(){state.products.forEach(function(p){p.priceTagSynced=true});App.toast('全部'+state.products.length+'个电子价签已同步完成','success');navigate('pricing')};
App.syncPriceTag=function(id){var p=state.products.find(function(x){return x.id===id});if(p){p.priceTagSynced=true;App.toast(p.name+'价签已同步','success');navigate('pricing')}};
App.changePrice=function(id){var p=state.products.find(function(x){return x.id===id});if(!p)return;App.showModal('修改价格 - '+p.name,'<div class="form-group"><label>当前售价</label><input value="'+p.price+'" readonly></div><div class="form-group"><label>新售价</label><input type="number" id="new-price" value="'+p.price+'" step="0.01"></div><div style="font-size:12px;color:var(--text-muted)">改价后将自动同步至电子价签</div>','<button class="btn btn-primary" onclick="App.confirmPriceChange(\''+id+'\')">确认改价并同步</button><button class="btn btn-outline" onclick="App.closeModal()">取消</button>')};
App.confirmPriceChange=function(id){var p=state.products.find(function(x){return x.id===id});var inp=document.getElementById('new-price');if(p&&inp){var np=parseFloat(inp.value);if(isNaN(np)||np<=0){App.toast('请输入有效价格','warning');return}p.price=np;p.origPrice=np;p.priceTagSynced=true;App.closeModal();App.toast(p.name+'价格已更新为'+fmt(np)+'，价签已同步','success');navigate('pricing')}};

App.showMemberIdentify=function(){App.showModal('会员进店识别','<div class="tabs" style="margin-bottom:16px"><div class="tab active" id="tab-wifi">Wi-Fi探针</div><div class="tab" id="tab-face">人脸识别</div></div><div id="wifi-panel"><div style="padding:20px;text-align:center;background:#f8fafc;border-radius:var(--radius)"><svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg><h4 style="margin:8px 0 4px">Wi-Fi探针监测中</h4><p style="color:var(--text-secondary);font-size:13px">正在扫描附近已连接Wi-Fi的会员设备</p><button class="btn btn-primary" style="margin-top:12px" onclick="App.simulateWifiDetect()">模拟检测</button></div></div><div id="face-panel" style="display:none"><div style="text-align:center"><div class="face-scan-area"><svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 3H5a2 2 0 0 0-2 2v4"/><path d="M21 9V5a2 2 0 0 0-2-2h-4"/><path d="M3 15v4a2 2 0 0 0 2 2h4"/><path d="M15 21h4a2 2 0 0 0 2-2v-4"/><circle cx="12" cy="10" r="3"/><path d="M7 18v-1a5 5 0 0 1 10 0v1"/></svg></div><p style="color:var(--text-secondary);font-size:13px;margin-top:12px">人脸识别需会员授权</p><button class="btn btn-primary" style="margin-top:8px" onclick="App.simulateFaceDetect()">模拟识别</button></div></div>','<button class="btn btn-outline" onclick="App.closeModal()">关闭</button>');setTimeout(function(){var tw=document.getElementById('tab-wifi');var tf=document.getElementById('tab-face');if(tw&&tf){tw.onclick=function(){tw.classList.add('active');tf.classList.remove('active');document.getElementById('wifi-panel').style.display='block';document.getElementById('face-panel').style.display='none'};tf.onclick=function(){tf.classList.add('active');tw.classList.remove('active');document.getElementById('face-panel').style.display='block';document.getElementById('wifi-panel').style.display='none'}}},0)};

function createReception(member,method){
  member.inStore=true;
  member.receptionStatus='待接待';
  member.receptionTime=null;
  member.assignedGuide=null;
  var enterTime=now();
  var rec={id:'R'+String(state.receptions.length+1).padStart(4,'0'),memberId:member.id,memberName:member.name,memberLevel:member.level,method:method,status:'待接待',enterTime:enterTime,completeTime:null,createTime:enterTime,guideName:null,guideId:null,remark:null,followUp:null};
  state.receptions.push(rec);
  state.alerts.unshift({id:Date.now(),type:'info',title:'会员到店('+method+')',desc:member.level+' '+member.name+'已进店，请导购接待',time:'刚刚'});
  renderAlerts();
  return rec;
}

App.simulateWifiDetect=function(){
  var m=state.members.find(function(x){return x.nearby&&!x.inStore});
  if(m){
    var rec=createReception(m,'Wi-Fi探针');
    App.toast('Wi-Fi探针识别到会员：'+m.name+'（'+m.level+'），已生成接待提醒','success');
    if(state.currentPage==='members')navigate('members');
  }else{
    App.toast('暂未检测到新会员','info');
  }
  App.closeModal();
};

App.simulateFaceDetect=function(){
  var m=state.members.find(function(x){return x.faceAuthorized&&x.nearby&&!x.inStore});
  if(m){
    var rec=createReception(m,'人脸识别');
    App.toast('人脸识别成功：'+m.name+'（'+m.level+'），已生成接待提醒','success');
    if(state.currentPage==='members')navigate('members');
  }else{
    var any=state.members.find(function(x){return x.faceAuthorized});
    App.toast(any?'识别到：'+any.name+'，但未在附近':'未识别到已授权会员','warning');
  }
  App.closeModal();
};

App.sendGuideNotification=function(memberId){
  var m=state.members.find(function(x){return x.id===memberId});
  if(!m)return;
  var guide=GUIDES[0];
  var compTime=now();
  m.receptionStatus='已接待';
  m.receptionTime=compTime;
  m.assignedGuide=guide.name;
  var rec=state.receptions.find(function(r){return r.memberId===memberId&&r.status==='待接待'});
  if(rec){
    rec.status='已接待';
    rec.guideName=guide.name;
    rec.guideId=guide.id;
    rec.completeTime=compTime;
    rec.remark=null;
    rec.followUp=null;
  }
  App.toast('已通知'+guide.name+'接待会员：'+m.name,'success');
  if(state.currentPage==='members')navigate('members');
};

App.showMemberDetail=function(id){
  var m=state.members.find(function(x){return x.id===id});
  if(!m)return;
  var recs=state.receptions.filter(function(r){return r.memberId===m.id});
  var txs=state.transactions.filter(function(t){return t.memberId===m.id});
  var timeline=[];
  recs.forEach(function(r){timeline.push({type:'reception',time:r.enterTime,data:r})});
  txs.forEach(function(t){timeline.push({type:'transaction',time:t.time,data:t})});
  timeline.sort(function(a,b){return a.time>b.time?-1:a.time<b.time?1:0});
  var html='<div class="grid grid-2"><div class="form-group"><label>会员号</label><input value="'+m.id+'" readonly></div><div class="form-group"><label>等级</label><input value="'+m.level+'" readonly></div><div class="form-group"><label>积分</label><input value="'+m.points.toLocaleString()+'" readonly></div><div class="form-group"><label>累计消费</label><input value="'+fmt(m.totalSpent)+'" readonly></div><div class="form-group"><label>手机号</label><input value="'+m.phone+'" readonly></div><div class="form-group"><label>优惠券</label><input value="'+getMemberCouponCount(m.id)+'张" readonly></div></div>';
  if(m.receptionStatus){
    html+='<div style="margin-top:12px;padding:10px;background:#f8fafc;border-radius:var(--radius)"><strong>接待状态：</strong><span class="badge-tag '+(m.receptionStatus==='已接待'?'success':'warning')+'">'+m.receptionStatus+'</span>'+(m.assignedGuide?' · 导购：'+m.assignedGuide:'')+(m.receptionTime?' · 时间：'+m.receptionTime:'')+'</div>';
  }
  if(timeline.length>0){
    html+='<h4 style="margin:16px 0 8px">到店与接待时间线</h4>';
    html+='<div style="border-left:2px solid var(--border);margin-left:8px;padding-left:16px">';
    timeline.forEach(function(item){
      if(item.type==='reception'){
        var r=item.data;
        html+='<div style="margin-bottom:12px;position:relative"><div style="position:absolute;left:-22px;top:4px;width:10px;height:10px;border-radius:50%;background:var(--primary)"></div>';
        html+='<div style="font-size:12px;color:var(--text-muted)">'+r.enterTime+'</div>';
        html+='<div><span class="badge-tag info" style="font-size:10px">到店</span> '+r.method;
        if(r.guideName)html+=' · 导购：'+r.guideName;
        if(r.status)html+=' <span class="badge-tag '+(r.status==='已接待'?'success':'warning')+'" style="font-size:10px">'+r.status+'</span>';
        if(r.completeTime)html+=' · 接待时间：'+r.completeTime;
        if(r.remark)html+=' · 备注：'+r.remark;
        if(r.followUp)html+=' <span class="badge-tag '+(r.followUp==='需要回访'?'warning':'success')+'" style="font-size:10px">'+r.followUp+'</span>';
        html+='</div></div>';
      }else{
        var t=item.data;
        html+='<div style="margin-bottom:12px;position:relative"><div style="position:absolute;left:-22px;top:4px;width:10px;height:10px;border-radius:50%;background:var(--success)"></div>';
        html+='<div style="font-size:12px;color:var(--text-muted)">'+t.time+'</div>';
        html+='<div><span class="badge-tag success" style="font-size:10px">购物</span> 消费'+fmt(t.finalAmount);
        if(t.couponUsed)html+=' · 使用：'+t.couponUsed.name;
        html+=' <a href="javascript:void(0)" onclick="App.showTransactionDetail(\''+t.id+'\')" style="color:var(--primary);font-size:12px">查看详情</a>';
        html+='</div></div>';
      }
    });
    html+='</div>';
  }
  App.showModal('会员详情 - '+m.name,html,'<button class="btn btn-outline" onclick="App.closeModal()">关闭</button>');
};

App.showCreatePromo=function(){App.showModal('创建促销活动','<div class="form-group"><label>活动名称</label><input type="text" placeholder="输入活动名称"></div><div class="form-row"><div class="form-group"><label>活动类型</label><select><option>满减</option><option>折扣</option><option>买赠</option></select></div><div class="form-group"><label>适用分类</label><select>'+CATEGORIES.map(function(c){return '<option>'+c+'</option>'}).join('')+'</select></div></div><div class="form-row"><div class="form-group"><label>开始日期</label><input type="date" value="2026-06-20"></div><div class="form-group"><label>结束日期</label><input type="date" value="2026-07-20"></div></div>','<button class="btn btn-primary" onclick="App.toast(\'促销活动已创建\',\'success\');App.closeModal()">创建</button><button class="btn btn-outline" onclick="App.closeModal()">取消</button>')};

App.pushExpiryPromo=function(id,discount){
  var p=state.products.find(function(x){return x.id===id});if(!p)return;
  var promoPrice=parseFloat((p.origPrice*discount).toFixed(2));
  var discountLabel=(discount*10).toFixed(0)+'折';
  p.price=promoPrice;
  p.activePromo={id:'PROMO_'+p.id,type:'临期促销',discount:discount,promoPrice:promoPrice,discountLabel:discountLabel,origPrice:p.origPrice,createTime:now()};
  p.priceTagSynced=false;
  var existing=state.activePromotions.find(function(ap){return ap.productId===p.id});
  if(existing){
    existing.discount=discount;existing.promoPrice=promoPrice;existing.discountLabel=discountLabel;
  }else{
    state.activePromotions.push({id:'PROMO_'+p.id,productId:p.id,productName:p.name,category:p.category,type:'临期促销',discount:discount,promoPrice:promoPrice,discountLabel:discountLabel,origPrice:p.origPrice,createTime:now(),pushed:true});
  }
  var nb=state.members.filter(function(m){return m.nearby}).length;
  state.alerts.unshift({id:Date.now(),type:'success',title:'促销生效',desc:p.name+' '+discountLabel+'促销已生效，已推送至'+nb+'位附近会员',time:'刚刚'});
  renderAlerts();
  App.toast(p.name+' '+discountLabel+'促销已生效并推送至'+nb+'位附近会员','success');
  if(state.currentPage==='promotions')navigate('promotions');
  if(state.currentPage==='inventory')navigate('inventory');
};

App.scanCheckoutItem=function(){
  var p=state.products[Math.floor(Math.random()*state.products.length)];
  var ex=state.checkoutCart.find(function(c){return c.id===p.id});
  if(ex){ex.qty++}else{state.checkoutCart.push({id:p.id,name:p.name,price:p.price,qty:1})}
  App.toast('已添加：'+p.name+(p.activePromo?' ('+p.activePromo.discountLabel+')':''),'success');
  updateCartUI();
};

App.startSelfCheckout=function(){App.toast('自助扫码购模式已开启','info');state.checkoutCart=[];state.appliedCoupon=null;state.appliedCouponInstanceId=null;state.checkoutDiscount=0;updateCartUI()};

App.changeQty=function(i,d){if(state.checkoutCart[i]){state.checkoutCart[i].qty+=d;if(state.checkoutCart[i].qty<=0)state.checkoutCart.splice(i,1);state.appliedCoupon=null;state.appliedCouponInstanceId=null;updateCartUI()}};

App.removeFromCart=function(i){state.checkoutCart.splice(i,1);state.appliedCoupon=null;state.appliedCouponInstanceId=null;updateCartUI()};

App.clearCart=function(){state.checkoutCart=[];state.selectedMember=null;state.appliedCoupon=null;state.appliedCouponInstanceId=null;state.checkoutDiscount=0;var info=document.getElementById('checkout-member-info');if(info)info.innerHTML='';updateCartUI()};

App.checkoutIdentifyMember=function(){
  var inp=document.getElementById('checkout-member-input');if(!inp||!inp.value){App.toast('请输入会员手机号','warning');return}
  var phone=inp.value.trim();
  var m=state.members.find(function(x){return x.phone===phone});
  if(!m){
    state.selectedMember=null;state.appliedCoupon=null;state.appliedCouponInstanceId=null;
    var info=document.getElementById('checkout-member-info');
    if(info)info.innerHTML='<div style="margin-top:8px;padding:10px;background:var(--danger-light);color:var(--danger);border-radius:var(--radius)">未找到该手机号对应的会员，请确认后重试</div>';
    App.toast('未找到该手机号对应的会员','warning');
    updateCartUI();
    return;
  }
  state.selectedMember=m;state.appliedCoupon=null;state.appliedCouponInstanceId=null;
  var info=document.getElementById('checkout-member-info');
  if(info){var lc=m.level==='钻石会员'?'purple':m.level==='金卡会员'?'warning':m.level==='银卡会员'?'info':'gray';info.innerHTML='<div class="card" style="margin-top:8px"><div class="card-body" style="padding:12px"><div class="flex gap-8" style="align-items:center"><div style="width:32px;height:32px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600">'+m.name[0]+'</div><div><strong>'+m.name+'</strong> <span class="badge-tag '+lc+'">'+m.level+'</span><br><span style="font-size:12px;color:var(--text-secondary)">积分'+m.points+' · '+getMemberCouponCount(m.id)+'张优惠券</span></div></div></div></div>'}
  App.toast('会员识别成功：'+m.name+'，系统已自动推荐最优优惠券','success');
  updateCartUI();
};

App.applyCoupon=function(cid){
  var c=state.coupons.find(function(x){return x.id===cid});
  if(!c)return;
  if(!isCouponApplicable(c,state.checkoutCart,state.products)){
    App.toast(c.category?(c.category+'无适用商品或不满足条件'):'不满足优惠券使用条件','warning');
    return;
  }
  state.appliedCoupon=c;
  App.toast('已使用优惠券：'+c.name,'success');
  updateCartUI();
};

App.applyCouponInstance=function(mciId){
  var inst=state.memberCouponInstances.find(function(x){return x.id===mciId});
  if(!inst)return;
  if(!state.selectedMember||inst.memberId!==state.selectedMember.id){
    App.toast('该券不属于当前会员','warning');return;
  }
  if(inst.status!=='可用'){
    App.toast('该券已不可用','warning');return;
  }
  var tmpl=state.coupons.find(function(c){return c.id===inst.couponId});
  if(!tmpl)return;
  if(!isCouponApplicable(tmpl,state.checkoutCart,state.products)){
    App.toast(tmpl.category?(tmpl.category+'无适用商品或不满足条件'):'不满足优惠券使用条件','warning');
    return;
  }
  state.appliedCoupon=tmpl;
  state.appliedCouponInstanceId=mciId;
  App.toast('已使用优惠券：'+inst.name,'success');
  updateCartUI();
};

App.completeCheckout=function(){
  if(state.checkoutCart.length===0){App.toast('购物车为空','warning');return}
  var subtotal=state.checkoutCart.reduce(function(s,i){return s+i.price*i.qty},0);
  var discount=state.checkoutDiscount;
  var finalAmount=subtotal-discount;
  var pts=Math.floor(finalAmount);
  var couponUsed=state.appliedCoupon;
  var couponName='';
  if(couponUsed&&discount>0){
    couponName=couponUsed.name+(couponUsed.category?'（'+couponUsed.category+'）':'');
  }
  var receipt=document.getElementById('checkout-receipt');
  if(receipt){
    receipt.style.display='block';
    var rHtml='<div class="receipt"><div class="receipt-header"><h4>阳光花园店</h4><div>'+new Date().toLocaleString()+'</div></div>';
    state.checkoutCart.forEach(function(i){
      rHtml+='<div class="receipt-line"><span>'+i.name+' ×'+i.qty+'</span><span>'+fmt(i.price*i.qty)+'</span></div>';
    });
    rHtml+='<div style="border-top:1px dashed var(--border);margin:6px 0"></div>';
    rHtml+='<div class="receipt-line"><span>商品合计</span><span>'+fmt(subtotal)+'</span></div>';
    if(discount>0&&couponName){
      rHtml+='<div class="receipt-line" style="color:var(--danger)"><span>优惠('+couponName+')</span><span>-'+fmt(discount)+'</span></div>';
    }
    rHtml+='<div class="receipt-total"><div class="receipt-line"><span>应付</span><span>'+fmt(finalAmount)+'</span></div></div>';
    if(state.selectedMember){
      rHtml+='<div style="text-align:center;margin-top:8px;font-size:11px;color:var(--text-muted)">会员:'+state.selectedMember.name+' · 积分+'+pts+'</div>';
    }
    rHtml+='</div>';
    document.getElementById('receipt-body').innerHTML=rHtml;
  }
  var tx={
    id:nextTxId(),
    time:now(),
    cashierId:state.currentUser.id,
    cashierName:state.currentUser.name,
    memberId:state.selectedMember?state.selectedMember.id:null,
    memberName:state.selectedMember?state.selectedMember.name:null,
    memberPhone:state.selectedMember?state.selectedMember.phone:null,
    items:state.checkoutCart.map(function(i){return{id:i.id,name:i.name,price:i.price,qty:i.qty,subtotal:i.price*i.qty}}),
    subtotal:subtotal,
    discount:discount,
    finalAmount:finalAmount,
    pointsEarned:state.selectedMember?pts:0,
    couponUsed:couponUsed?{id:couponUsed.id,name:couponUsed.name,type:couponUsed.type,category:couponUsed.category||'',discount:discount,reason:couponUsed.type==='满减'?'满'+couponUsed.threshold+'减'+couponUsed.discount:(couponUsed.discount*10).toFixed(0)+'折'+(couponUsed.category?'，仅限'+couponUsed.category+'品类':'')}:null
  };
  state.transactions.unshift(tx);
  if(state.selectedMember){
    state.selectedMember.points+=pts;
    state.selectedMember.totalSpent+=finalAmount;
    if(state.appliedCouponInstanceId){
      var inst=state.memberCouponInstances.find(function(x){return x.id===state.appliedCouponInstanceId});
      if(inst){inst.status='已核销'}
      if(couponUsed){
        var tmpl=state.coupons.find(function(c){return c.id===couponUsed.id});
        if(tmpl){tmpl.used++}
      }
    }
    var sucMsg='结算成功！应付'+fmt(finalAmount)+'，会员获得'+pts+'积分';
    if(couponUsed&&discount>0){sucMsg+='，已使用：'+couponName}
    App.toast(sucMsg,'success');
  }else{
    App.toast('结算成功！金额：'+fmt(finalAmount),'success');
  }
  state.checkoutCart=[];state.selectedMember=null;state.appliedCoupon=null;state.appliedCouponInstanceId=null;state.checkoutDiscount=0;
  var info=document.getElementById('checkout-member-info');if(info)info.innerHTML='';
  updateCartUI();
};

App.showTransactionDetail=function(id){
  var tx=state.transactions.find(function(t){return t.id===id});
  if(!tx)return;
  var html='<div class="grid grid-2"><div class="form-group"><label>交易编号</label><input value="'+tx.id+'" readonly></div><div class="form-group"><label>交易时间</label><input value="'+tx.time+'" readonly></div><div class="form-group"><label>收银员</label><input value="'+tx.cashierName+'" readonly></div>';
  if(tx.memberName){
    html+='<div class="form-group"><label>会员</label><input value="'+tx.memberName+'（'+tx.memberPhone+'）" readonly></div>';
  }else{
    html+='<div class="form-group"><label>会员</label><input value="非会员" readonly></div>';
  }
  html+='</div>';
  html+='<h4 style="margin:16px 0 8px">商品明细</h4>';
  html+='<table class="data-table"><thead><tr><th>商品</th><th>单价</th><th>数量</th><th>小计</th></tr></thead><tbody>';
  tx.items.forEach(function(item){
    html+='<tr><td>'+item.name+'</td><td>'+fmt(item.price)+'</td><td>'+item.qty+'</td><td>'+fmt(item.subtotal)+'</td></tr>';
  });
  html+='</tbody></table>';
  html+='<div style="margin-top:12px;padding:12px;background:#f8fafc;border-radius:var(--radius)">';
  html+='<div class="flex-between" style="padding:4px 0"><span>商品合计</span><span>'+fmt(tx.subtotal)+'</span></div>';
  if(tx.discount>0){
    html+='<div class="flex-between" style="padding:4px 0;color:var(--danger)"><span>优惠</span><span>-'+fmt(tx.discount)+'</span></div>';
  }
  html+='<div class="flex-between" style="padding:4px 0;font-weight:700;font-size:16px;border-top:2px solid var(--border);margin-top:8px"><span>实付</span><span style="color:var(--danger)">'+fmt(tx.finalAmount)+'</span></div>';
  if(tx.pointsEarned>0){
    html+='<div class="flex-between" style="padding:4px 0;color:var(--success)"><span>获得积分</span><span>+'+tx.pointsEarned+'</span></div>';
  }
  html+='</div>';
  if(tx.couponUsed){
    html+='<div style="margin-top:12px;padding:10px;background:var(--warning-light);border:1px solid var(--warning);border-radius:var(--radius)"><strong>优惠券使用说明: </strong>'+tx.couponUsed.reason+'</div>';
  }
  App.showModal('交易详情 - '+tx.id,html,'<button class="btn btn-outline" onclick="App.closeModal()">关闭</button>');
};

App.filterTransactions=function(){
  var rangeEl=document.getElementById('tx-filter-range');
  var phoneEl=document.getElementById('tx-filter-phone');
  if(!state.txFilter)state.txFilter={range:'today',phone:''};
  state.txFilter.range=rangeEl?rangeEl.value:'today';
  state.txFilter.phone=phoneEl?phoneEl.value.trim():'';
  navigate('transactions');
};

App.confirmPurchaseOrder=function(id){
  var order=state.purchaseOrders.find(function(o){return o.id===id});
  if(!order){App.toast('单据不存在','warning');return}
  if(order.status!=='待处理'){App.toast('该单据已处理','warning');return}
  order.status='已完成';
  order.completeTime=now();
  var product=state.products.find(function(p){return p.id===order.productId});
  if(product){product.stock+=order.qty}
  App.toast('采购单 '+order.id+' 已确认完成，库存已更新','success');
  if(state.currentPage==='inventory')navigate('inventory');
};

App.completeReception=function(recId,followUp){
  var rec=state.receptions.find(function(r){return r.id===recId});
  if(!rec){App.toast('接待记录不存在','warning');return}
  rec.followUp=followUp;
  App.toast('已设置跟进状态：'+followUp,'success');
  navigate('members');
};

App.setReceptionRemark=function(recId,remark){
  var rec=state.receptions.find(function(r){return r.id===recId});
  if(!rec){App.toast('接待记录不存在','warning');return}
  rec.remark=remark;
  navigate('members');
};

App.emergencyLock=function(){App.showModal('紧急锁门确认','<div style="text-align:center;padding:20px"><svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="var(--danger)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><h3 style="margin:12px 0 8px;color:var(--danger)">确认锁定所有闸机？</h3><p style="color:var(--text-secondary)">此操作将锁死所有出口闸机并通知安保人员</p></div>','<button class="btn btn-danger" onclick="App.confirmEmergencyLock()">确认锁定</button><button class="btn btn-outline" onclick="App.closeModal()">取消</button>')};

App.confirmEmergencyLock=function(){state.gates.forEach(function(g){g.status='已锁定'});state.alerts.unshift({id:Date.now(),type:'danger',title:'闸机锁定',desc:'所有出口闸机已紧急锁定，安保已通知',time:'刚刚'});renderAlerts();App.toast('所有闸机已锁定，安保已通知','danger');App.closeModal();if(state.currentPage==='lossprevention')navigate('lossprevention')};

App.triggerLossAlert=function(){
  var gate=state.gates.find(function(g){return g.status==='正常'});
  if(!gate){App.toast('所有闸机已处于锁定状态','warning');return}
  var evId='L'+String(state.lossEvents.length+1).padStart(3,'0');
  var ev={id:evId,time:now(),camera:gate.name,type:'大宗未结账',status:'监控中',detail:'系统检测到商品移出轨迹异常，闸机已自动锁定',gateId:gate.id,resolvedTime:null};
  state.lossEvents.unshift(ev);
  gate.status='已锁定';gate.linkedEvent=evId;
  state.alerts.unshift({id:Date.now(),type:'danger',title:'防损警报',desc:gate.name+'监测到大宗商品未结账，闸机已自动锁定',time:'刚刚'});
  renderAlerts();
  App.toast('防损警报：'+gate.name+'已自动锁定','danger');
  if(state.currentPage==='lossprevention')navigate('lossprevention');
};

App.resolveLossEvent=function(eventId){
  var ev=state.lossEvents.find(function(e){return e.id===eventId});
  if(!ev||ev.status==='已处理'){App.toast('事件不存在或已处理','warning');return}
  ev.status='已处理';ev.resolvedTime=now();
  if(ev.gateId){
    var gate=state.gates.find(function(g){return g.id===ev.gateId});
    if(gate){gate.status='正常';gate.linkedEvent=null}
  }
  state.alerts.unshift({id:Date.now(),type:'success',title:'警报解除',desc:(ev.camera||'')+' 事件'+ev.id+'已处理，闸机已解锁',time:'刚刚'});
  renderAlerts();
  App.toast('事件'+ev.id+'已处理，关联闸机已解锁','success');
  if(state.currentPage==='lossprevention')navigate('lossprevention');
};

App.unlockGate=function(gateId){
  var gate=state.gates.find(function(g){return g.id===gateId});
  if(!gate||gate.status==='正常'){return}
  gate.status='正常';gate.linkedEvent=null;
  App.toast(gate.name+'已解锁','success');
  if(state.currentPage==='lossprevention')navigate('lossprevention');
};

App.runDailyRecon=function(){App.toast('每日对账完成，数据已对齐','success')};
App.exportFinance=function(){App.toast('毛利分析报表已导出','success')};
App.exportDashboard=function(){App.toast('看板报表已导出','success')};
App.exportTransactions=function(){App.toast('交易流水报表已导出','success')};
App.showReceptionRemarkModal=function(recId){App.showModal('添加备注','<div class="form-group"><label>备注内容</label><textarea id="reception-remark-input" rows="4" style="width:100%;padding:8px;border:1px solid var(--border);border-radius:var(--radius);resize:vertical"></textarea></div>','<button class="btn btn-primary" onclick="App.confirmReceptionRemark(\''+recId+'\')">确认</button><button class="btn btn-outline" onclick="App.closeModal()">取消</button>')};
App.confirmReceptionRemark=function(recId){var ta=document.getElementById('reception-remark-input');if(!ta||!ta.value.trim()){App.toast('请输入备注内容','warning');return}App.setReceptionRemark(recId,ta.value.trim());App.closeModal()};

window.renderDashboard=renderDashboard;
window.renderInventory=renderInventory;
window.renderPricing=renderPricing;
window.renderCheckout=renderCheckout;
window.renderMembers=renderMembers;
window.renderPromotions=renderPromotions;
window.renderLoss=renderLoss;
window.renderFinance=renderFinance;
window.renderPermissions=renderPermissions;
window.renderTransactions=renderTransactions;
window.calcRepl=calcRepl;
window.fmt=fmt;
window.state=state;
window.CATEGORIES=CATEGORIES;
window.SF=SF;
window.ROLES=ROLES;
window.USERS=USERS;
window.GUIDES=GUIDES;
window.navigate=navigate;
window.renderAlerts=renderAlerts;
window.updateCartUI=updateCartUI;
window.initInvTabs=initInvTabs;
window.calcCouponSaving=calcCouponSaving;
window.findBestCoupon=findBestCoupon;
window.getMemberCouponCount=getMemberCouponCount;
window.nextTxId=nextTxId;
window.filterTxPage=filterTxPage;
window.showReceptionRemarkModal=showReceptionRemarkModal;
window.confirmReceptionRemark=confirmReceptionRemark;

document.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('.nav-item').forEach(function(item){
    item.addEventListener('click',function(){navigate(item.dataset.page)});
  });
  document.getElementById('sidebar-toggle').addEventListener('click',function(){
    document.getElementById('sidebar').classList.toggle('collapsed');
  });
  var alertBell=document.getElementById('alert-bell');
  var alertPanel=document.getElementById('alert-panel');
  if(alertBell&&alertPanel){
    alertBell.addEventListener('click',function(e){
      e.stopPropagation();alertPanel.classList.toggle('show');
    });
    document.addEventListener('click',function(e){
      if(!alertPanel.contains(e.target)&&!alertBell.contains(e.target)){alertPanel.classList.remove('show')}
    });
  }
  var clearBtn=document.getElementById('clear-alerts');
  if(clearBtn){clearBtn.addEventListener('click',function(){state.alerts=[];renderAlerts();App.toast('所有通知已标记为已读','info')})}
  document.getElementById('modal-close').addEventListener('click',function(){App.closeModal()});
  document.getElementById('modal-overlay').addEventListener('click',function(e){if(e.target===document.getElementById('modal-overlay'))App.closeModal()});
  renderAlerts();navigate('dashboard');
  setInterval(function(){var now2=new Date();var el=document.getElementById('datetime');if(el){el.textContent=now2.getFullYear()+'-'+String(now2.getMonth()+1).padStart(2,'0')+'-'+String(now2.getDate()).padStart(2,'0')+' '+String(now2.getHours()).padStart(2,'0')+':'+String(now2.getMinutes()).padStart(2,'0')+':'+String(now2.getSeconds()).padStart(2,'0')}},1000);
  var dtEl=document.getElementById('datetime');if(dtEl){var now3=new Date();dtEl.textContent=now3.getFullYear()+'-'+String(now3.getMonth()+1).padStart(2,'0')+'-'+String(now3.getDate()).padStart(2,'0')+' '+String(now3.getHours()).padStart(2,'0')+':'+String(now3.getMinutes()).padStart(2,'0')+':'+String(now3.getSeconds()).padStart(2,'0')}
});
})();
