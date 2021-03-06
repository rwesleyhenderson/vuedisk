! function(t, e) {
	"object" == typeof module && "object" == typeof exports ? module["export"] = e() : "function" == typeof define && define.amd ? define([], e) : t.httpVueLoader = e()
   }(this, function() {
	"use strict";

	function t(t, e) {
	 this.component = t, this.elt = e
	}

	function e(t, e) {
	 this.component = t, this.elt = e, this.module = {
	  exports: {}
	 }
	}

	function n(t, e) {
	 this.component = t, this.elt = e
	}

	function i(t) {
	 this.name = t, this.template = null, this.script = null, this.styles = [], this._scopeId = ""
	}

	function o(t) {
	 return t
	}

	function s(t) {
	 var e = t.match(/(.*?)([^\/]+?)\/?(\.vue)?(\?.*|#.*|$)/);
	 return {
	  name: e[2],
	  url: t
	 }
	}

	function r(t, e) {
	 return "./" === e.substr(0, 2) || "../" === e.substr(0, 3) ? t + e : e
	}

	function u(t, e) {
	 var n = s(t);
	 return u.load(n.url, e)
	}
	var l = 0;
	return t.prototype = {
	 withBase: function(t) {
	  var e;
	  if (this.component.baseURI) {
	   e = document.createElement("base"), e.href = this.component.baseURI;
	   var n = this.component.getHead();
	   n.insertBefore(e, n.firstChild)
	  }
	  t.call(this), e && this.component.getHead().removeChild(e)
	 },
	 scopeStyles: function(t, e) {
	  function n() {
	   for (var n = t.sheet, i = n.cssRules, o = 0; o < i.length; ++o) {
		var s = i[o];
		if (1 === s.type) {
		 var r = [];
		 s.selectorText.split(/\s*,\s*/).forEach(function(t) {
		  r.push(e + " " + t);
		  var n = t.match(/([^ :]+)(.+)?/);
		  r.push(n[1] + e + (n[2] || ""))
		 });
		 var u = r.join(",") + s.cssText.substr(s.selectorText.length);
		 n.deleteRule(o), n.insertRule(u, o)
		}
	   }
	  }
	  try {
	   n()
	  } catch (i) {
	   if (i instanceof DOMException && i.code === DOMException.INVALID_ACCESS_ERR) return t.sheet.disabled = !0, void t.addEventListener("load", function o() {
		t.removeEventListener("load", o), setTimeout(function() {
		 n(), t.sheet.disabled = !1
		})
	   });
	   throw i
	  }
	 },
	 compile: function() {
	  var t = null !== this.template,
	   e = this.elt.hasAttribute("scoped");
	  if (e) {
	   if (!t) return;
	   this.elt.removeAttribute("scoped")
	  }
	  return this.withBase(function() {
	   this.component.getHead().appendChild(this.elt)
	  }), e && this.scopeStyles(this.elt, "[" + this.component.getScopeId() + "]"), Promise.resolve()
	 },
	 getContent: function() {
	  return this.elt.textContent
	 },
	 setContent: function(t) {
	  this.withBase(function() {
	   this.elt.textContent = t
	  })
	 }
	}, e.prototype = {
	 getContent: function() {
	  return this.elt.textContent
	 },
	 setContent: function(t) {
	  this.elt.textContent = t
	 },
	 compile: function(t) {
	  var e = function(t) {
		return u.require(r(this.component.baseURI, t))
	   }.bind(this),
	   n = function(t, e) {
		return u(r(this.component.baseURI, t), e)
	   }.bind(this);
	  try {
	   Function("exports", "require", "httpVueLoader", "module", this.getContent()).call(this.module.exports, this.module.exports, e, n, this.module)
	  } catch (i) {
	   if (!("lineNumber" in i)) return Promise.reject(i);
	   var o = responseText.replace(/\r?\n/g, "\n"),
		s = o.substr(0, o.indexOf(script)).split("\n").length + i.lineNumber - 1;
	   throw new i.constructor(i.message, url, s)
	  }
	  return Promise.resolve(this.module.exports)
	 }
	}, n.prototype = {
	 getContent: function() {
	  return this.elt.innerHTML
	 },
	 setContent: function(t) {
	  this.elt.innerHTML = t
	 },
	 getRootElt: function() {
	  var t = this.elt.content || this.elt;
	  if ("firstElementChild" in t) return t.firstElementChild;
	  for (t = t.firstChild; null !== t; t = t.nextSibling)
	   if (t.nodeType === Node.ELEMENT_NODE) return t;
	  return null
	 },
	 compile: function() {
	  return Promise.resolve()
	 }
	}, i.prototype = {
	 getHead: function() {
	  return document.head || document.getElementsByTagName("head")[0]
	 },
	 getScopeId: function() {
	  return "" === this._scopeId && (this._scopeId = "data-s-" + (l++).toString(36), this.template.getRootElt().setAttribute(this._scopeId, "")), this._scopeId
	 },
	 load: function(i) {
	  return u.httpRequest(i).then(function(o) {
	   this.baseURI = i.substr(0, i.lastIndexOf("/") + 1);
	   var s = document.implementation.createHTMLDocument("");
	   s.body.innerHTML = (this.baseURI ? '<base href="' + this.baseURI + '">' : "") + o;
	   for (var r = s.body.firstChild; r; r = r.nextSibling) switch (r.nodeName) {
		case "TEMPLATE":
		 this.template = new n(this, r);
		 break;
		case "SCRIPT":
		 this.script = new e(this, r);
		 break;
		case "STYLE":
		 this.styles.push(new t(this, r))
	   }
	   return this
	  }.bind(this))
	 },
	 _normalizeSection: function(t) {
	  var e;
	  return e = null !== t && t.elt.hasAttribute("src") ? u.httpRequest(t.elt.getAttribute("src")).then(function(e) {
	   return t.elt.removeAttribute("src"), e
	  }) : Promise.resolve(null), e.then(function(e) {
	   if (null !== t && t.elt.hasAttribute("lang")) {
		var n = t.elt.getAttribute("lang");
		return t.elt.removeAttribute("lang"), u.langProcessor[n.toLowerCase()](null === e ? t.getContent() : e)
	   }
	   return e
	  }).then(function(e) {
	   null !== e && t.setContent(e)
	  })
	 },
	 normalize: function() {
	  return Promise.all(Array.prototype.concat(this._normalizeSection(this.template), this._normalizeSection(this.script), this.styles.map(this._normalizeSection))).then(function() {
	   return this
	  }.bind(this))
	 },
	 compile: function() {
	  return Promise.all(Array.prototype.concat(this.template && this.template.compile(), this.script && this.script.compile(), this.styles.map(function(t) {
	   return t.compile()
	  }))).then(function() {
	   return this
	  }.bind(this))
	 }
	}, u.load = function(t, e) {
	 return function() {
	  return new i(e).load(t).then(function(t) {
	   return t.normalize()
	  }).then(function(t) {
	   return t.compile()
	  }).then(function(t) {
	   var e = null !== t.script ? t.script.module.exports : {};
	   return null !== t.template && (e.template = t.template.getContent()), void 0 === e.name && void 0 !== t.name && (e.name = t.name), e._baseURI = t.baseURI, e
	  })
	 }
	}, u.register = function(t, e) {
	 var n = s(e);
	 t.component(n.name, u.load(n.url))
	}, u.install = function(t) {
	 t.mixin({
	  beforeCreate: function() {
	   var e = this.$options.components;
	   for (var n in e)
		if ("string" == typeof e[n] && "url:" === e[n].substr(0, 4)) {
		 var i = s(e[n].substr(4)),
		  o = "_baseURI" in this.$options ? r(this.$options._baseURI, i.url) : i.url;
		 isNaN(n) ? e[n] = u.load(o, n) : e[n] = t.component(i.name, u.load(o, i.name))
		}
	  }
	 })
	}, u.require = function(t) {
	 return window[t]
	}, u.httpRequest = function(t) {
	 return new Promise(function(e, n) {
	  var i = new XMLHttpRequest;
	  i.open("GET", t), i.onreadystatechange = function() {
	   4 === i.readyState && (i.status >= 200 && i.status < 300 ? e(i.responseText) : n(i.status))
	  }, i.send(null)
	 })
	}, u.langProcessor = {
	 html: o,
	 js: o,
	 css: o
	}, u
   });