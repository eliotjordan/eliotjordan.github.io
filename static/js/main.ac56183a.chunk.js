(this["webpackJsonpmap-app"]=this["webpackJsonpmap-app"]||[]).push([[0],{403:function(e,t,n){},566:function(e,t,n){"use strict";n.r(t);var a=n(24),o=n(0),s=n.n(o),c=n(17),i=n.n(c),r=(n(403),n(49)),l=n(39),d=n(73),u=n(364),j=n(11),f=n(365),b=n(363),p=n(361),O=n(52),m=n(297),v=n(295),h=n(27),g=n(616),x=n(613),w=n(614),k=n(615),y=n(646),z=n(125);function F(e){console.log(e.manifests),console.log(e.windows);var t=Object(x.a)(),n=Object(o.useState)([]),s=Object(h.a)(n,2),c=s[0],i=s[1],r=e.manifests,l=e.windows;return Object(o.useEffect)((function(){if(Object.values(r).length>0){var n=Object.values(r).filter((function(e){return!e.isFetching})).filter((function(e){var t;return null===e||void 0===e||null===(t=e.json)||void 0===t?void 0:t.navPlace})),o=n.filter((function(e){return e.json.navPlace})),s=n.map((function(e){return e.json.navPlace}));console.log(s);var c=s,d=[];if(Object.values(l).length>0&&(d=Object.values(l).map((function(e){return e.manifestId}))),d.length>0)c=n.filter((function(e){return d.includes(e.id)})).filter((function(e){return e.json.navPlace})).map((function(e){return e.json.navPlace}));if(s.length>0){var u=s.map((function(t,n){return Object(a.jsx)(w.a,{data:t,eventHandlers:{click:function(){return t=o[n].id,void(Object.values(l).map((function(e){return e.manifestId})).includes(t)||e.addWindow({manifestId:t}));var t}},children:Object(a.jsx)(k.a,{children:o[n].json.label.en})},t.id)}));if(console.log(u),e.zoom)if(c.length>0){var j=c.map((function(e){return Object(z.bboxPolygon)(Object(z.bbox)(e))}));console.log(j);var f=Object(z.bbox)(Object(z.featureCollection)(j));console.log(f),t.fitBounds([[f[1],f[0]],[f[3],f[2]]])}else t.fitWorld();e.setNeedsUpdate(!0),i(u)}}}),[e.manifests,e.windows]),Object(a.jsxs)(a.Fragment,{children:[Object(a.jsx)(y.a,{attribution:'\xa9 <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',url:"https://tile.openstreetmap.org/{z}/{x}/{y}.png"}),c]})}function M(e){window.location.origin;return Object(a.jsx)("div",{className:"leaflet-top leaflet-right",children:Object(a.jsxs)("div",{className:"leaflet-control leaflet-bar",style:{backgroundColor:"#FFFFFF",padding:"0.5em"},children:[Object(a.jsx)("input",{type:"checkbox",onChange:function(t){console.log(t.target.checked),e.setZoom(!e.zoom),t.preventDefault()},checked:e.zoom}),"Zoom to Items"]})})}var P=n(149),R=n(150);var S={addResource:P.a,addWindow:R.a},W=Object(j.b)((function(e){return{manifests:e.manifests,windows:e.windows}}),S)((function(e){var t=Object(o.useState)(!1),n=Object(h.a)(t,2),s=(n[0],n[1]),c=Object(o.useState)(!0),i=Object(h.a)(c,2),r=i[0],l=i[1],d=window.location.origin;return Object(o.useEffect)((function(){e.addResource(d+"/manifests/navplace.json"),e.addResource(d+"/manifests/recipe.json"),e.addResource(d+"/manifests/1012.json"),e.addResource(d+"/manifests/501.json"),e.addResource(d+"/manifests/1011.json")})),Object(a.jsxs)(g.a,{center:[0,0],zoom:1,children:[Object(a.jsx)(F,{manifests:e.manifests,windows:e.windows,addWindow:e.addWindow,setNeedsUpdate:s,zoom:r}),Object(a.jsx)(M,{zoom:r,setZoom:l,addManifest:e.addResource})]})})),C=Object(o.lazy)((function(){return n.e(3).then(n.bind(null,771))})),I=function(e){Object(d.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(r.a)(this,n),(a=t.call(this,e)).state={},a}return Object(l.a)(n,[{key:"componentWillMount",value:function(){var e=Object(p.a)();O.a.theme.palette.type="dark",e.dispatch(m.c(O.a)),e.dispatch(v.a(!0)),this.setState({store:e})}},{key:"render",value:function(){var e=this.props,t=e.dndManager,n=e.plugins;return Object(a.jsx)("div",{children:Object(a.jsxs)(j.a,{store:this.state.store,styleClass:"mirador",children:[Object(a.jsx)(f.a,{plugins:n,children:Object(a.jsx)(b.a,{dndManager:t,children:Object(a.jsx)(o.Suspense,{fallback:Object(a.jsx)("div",{}),children:Object(a.jsx)(C,{})})})}),Object(a.jsx)(W,{})]})})}}]),n}(o.Component);I.defaultProps={dndManager:void 0,plugins:[]};var N=I;i.a.render(Object(a.jsx)(s.a.StrictMode,{children:Object(a.jsx)(N,{})}),document.getElementById("root"))}},[[566,1,2]]]);
//# sourceMappingURL=main.ac56183a.chunk.js.map