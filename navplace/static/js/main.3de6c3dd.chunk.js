(this["webpackJsonpmap-app"]=this["webpackJsonpmap-app"]||[]).push([[0],{403:function(e,t,n){},566:function(e,t,n){"use strict";n.r(t);var a=n(24),c=n(0),o=n.n(c),s=n(17),d=n.n(s),r=(n(403),n(49)),i=n(39),l=n(73),u=n(364),f=n(11),b=n(365),j=n(363),v=n(361),p=n(52),m=n(297),O=n(295),h=n(27),g=n(616),x=n(613),w=n(614),R=n(615),y=n(646),k=n(125);function z(e){console.log(e.manifests),console.log(e.windows);var t=Object(x.a)(),n=Object(c.useState)([]),o=Object(h.a)(n,2),s=o[0],d=o[1],r=e.manifests,i=e.windows;return Object(c.useEffect)((function(){if(Object.values(r).length>0){var n=Object.values(r).filter((function(e){return!e.isFetching})).filter((function(e){var t;return null===e||void 0===e||null===(t=e.json)||void 0===t?void 0:t.navPlace})),c=n.filter((function(e){return e.json.navPlace})),o=n.map((function(e){return e.json.navPlace}));console.log(o);var s=o,l=[];if(Object.values(i).length>0&&(l=Object.values(i).map((function(e){return e.manifestId}))),l.length>0)s=n.filter((function(e){return l.includes(e.id)})).filter((function(e){return e.json.navPlace})).map((function(e){return e.json.navPlace}));if(o.length>0){var u=o.map((function(t,n){return Object(a.jsx)(w.a,{data:t,eventHandlers:{click:function(){return t=c[n].id,void(Object.values(i).map((function(e){return e.manifestId})).includes(t)||e.addWindow({manifestId:t}));var t}},children:Object(a.jsx)(R.a,{children:c[n].json.label.en})},t.id)}));if(console.log(u),e.zoom)if(s.length>0){var f=s.map((function(e){return Object(k.bboxPolygon)(Object(k.bbox)(e))}));console.log(f);var b=Object(k.bbox)(Object(k.featureCollection)(f));console.log(b),t.fitBounds([[b[1],b[0]],[b[3],b[2]]])}else t.fitWorld();e.setNeedsUpdate(!0),d(u)}}}),[e.manifests,e.windows]),Object(a.jsxs)(a.Fragment,{children:[Object(a.jsx)(y.a,{attribution:'\xa9 <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',url:"https://tile.openstreetmap.org/{z}/{x}/{y}.png"}),s]})}function F(e){window.location.origin;return Object(a.jsx)("div",{className:"leaflet-top leaflet-right",children:Object(a.jsxs)("div",{className:"leaflet-control leaflet-bar",style:{backgroundColor:"#FFFFFF",padding:"0.5em"},children:[Object(a.jsx)("input",{type:"checkbox",onChange:function(t){console.log(t.target.checked),e.setZoom(!e.zoom),t.preventDefault()},checked:e.zoom}),"Zoom to Items"]})})}var M=n(149),P=n(150);var S={addResource:M.a,addWindow:P.a},W=Object(f.b)((function(e){return{manifests:e.manifests,windows:e.windows}}),S)((function(e){var t=Object(c.useState)(!1),n=Object(h.a)(t,2),o=(n[0],n[1]),s=Object(c.useState)(!0),d=Object(h.a)(s,2),r=d[0],i=d[1],l=window.location.origin,u="https://figgy.princeton.edu/manifests/";return Object(c.useEffect)((function(){e.addResource(l+"/navplace/manifests/50aeeb68.json"),e.addResource(l+"/navplace/manifests/3386ca56.json"),e.addResource(l+"/navplace/manifests/c4edf252.json"),e.addResource(l+"/navplace/manifests/c9df4fd8.json"),e.addResource(l+"/navplace/manifests/e438a1e3.json"),e.addResource(l+"/navplace/manifests/fbc43e41.json"),e.addResource(u+"32146ff6-c93d-4b14-b198-6fb518b44042/v3"),e.addResource(u+"723b0cc9-918c-42e1-80ec-d989ea011f35/v3"),e.addResource(u+"310dcfd3-d44b-4979-943a-e4d748fb6d4d/v3"),e.addResource(u+"a07eca8a-f425-461b-8b91-3fe75f84258f/v3"),e.addResource(u+"3c76c5a1-7555-4602-aa36-1c5b0271321e/v3"),e.addResource(u+"87c2f5fa-0418-446d-a152-8c6aafd16271/v3"),e.addResource(u+"4bf8b692-db42-47d1-b722-cddaf88627ce/v3"),e.addResource(u+"c7e11cfe-8c7d-4a65-ae39-9b769a86bf45/v3"),e.addResource(u+"77dd894e-a2c6-4294-97d4-8bd275a47600/v3"),e.addResource(u+"c3f5da55-5d97-4abc-b8f1-442e350a36cb/v3")})),Object(a.jsxs)(g.a,{center:[0,0],zoom:1,children:[Object(a.jsx)(z,{manifests:e.manifests,windows:e.windows,addWindow:e.addWindow,setNeedsUpdate:o,zoom:r}),Object(a.jsx)(F,{zoom:r,setZoom:i,addManifest:e.addResource})]})})),C=Object(c.lazy)((function(){return n.e(3).then(n.bind(null,771))})),I=function(e){Object(l.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(r.a)(this,n),(a=t.call(this,e)).state={},a}return Object(i.a)(n,[{key:"componentWillMount",value:function(){var e=Object(v.a)();p.a.theme.palette.type="dark",e.dispatch(m.c(p.a)),e.dispatch(O.a(!0)),this.setState({store:e})}},{key:"render",value:function(){var e=this.props,t=e.dndManager,n=e.plugins;return Object(a.jsx)("div",{children:Object(a.jsxs)(f.a,{store:this.state.store,styleClass:"mirador",children:[Object(a.jsx)(b.a,{plugins:n,children:Object(a.jsx)(j.a,{dndManager:t,children:Object(a.jsx)(c.Suspense,{fallback:Object(a.jsx)("div",{}),children:Object(a.jsx)(C,{})})})}),Object(a.jsx)(W,{})]})})}}]),n}(c.Component);I.defaultProps={dndManager:void 0,plugins:[]};var N=I;d.a.render(Object(a.jsx)(o.a.StrictMode,{children:Object(a.jsx)(N,{})}),document.getElementById("root"))}},[[566,1,2]]]);
//# sourceMappingURL=main.3de6c3dd.chunk.js.map