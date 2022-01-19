(function(){
  var ldscroll;
  ldscroll = function(opt){
    var root, this$ = this;
    opt == null && (opt = {});
    this.opt = opt;
    root = opt.root;
    this.root = root = typeof root === 'string'
      ? document.querySelector(root)
      : root ? root : null;
    this.evtHandler = {};
    this.io = new IntersectionObserver(function(){
      var args, res$, i$, to$;
      res$ = [];
      for (i$ = 0, to$ = arguments.length; i$ < to$; ++i$) {
        res$.push(arguments[i$]);
      }
      args = res$;
      return this$.handler.apply(this$, args);
    }, {
      root: this.root
    });
    this.tov = opt.trackOutsideView != null ? opt.trackOutsideView : true;
    this.map = typeof WeakMap != 'undefined' && WeakMap !== null
      ? new WeakMap()
      : new Map();
    this.nodes = [];
    this.data = [];
    this.visible = [];
    this.trackee = [];
    this.add(opt.nodes);
    this.root.addEventListener('scroll', function(){
      var list;
      list = this$.tov
        ? this$.data
        : this$.trackee;
      list.map(function(d, i){
        var b;
        b = d.node.getBoundingClientRect();
        d.yb = (b.y + b.height) / window.innerHeight;
        d.yt = b.y / window.innerHeight;
        d.yp = d.yt / (1 - (d.yb - d.yt));
        return d.progress = d.yp < 0
          ? -d.yt
          : d.yp > 1
            ? 2 - d.yb
            : d.yp;
      });
      return this$.fire('change', list);
    });
    return this;
  };
  ldscroll.prototype = import$(Object.create(Object.prototype), {
    on: function(n, cb){
      var ref$;
      return ((ref$ = this.evtHandler)[n] || (ref$[n] = [])).push(cb);
    },
    fire: function(n){
      var v, res$, i$, to$, ref$, len$, cb, results$ = [];
      res$ = [];
      for (i$ = 1, to$ = arguments.length; i$ < to$; ++i$) {
        res$.push(arguments[i$]);
      }
      v = res$;
      for (i$ = 0, len$ = (ref$ = this.evtHandler[n] || []).length; i$ < len$; ++i$) {
        cb = ref$[i$];
        results$.push(cb.apply(this, v));
      }
      return results$;
    },
    getVisible: function(){
      return this.visible;
    },
    add: function(ns, tov){
      var h, ret, this$ = this;
      tov == null && (tov = this.tov);
      this.nodes = this.nodes.concat((Array.isArray(ns)
        ? ns
        : [ns]).map(function(it){
        if (typeof it === 'string') {
          return Array.from(document.querySelectorAll(it));
        } else {
          return it;
        }
      }).reduce(function(a, b){
        return a.concat(b);
      }, []));
      h = window.innerHeight;
      ret = this.nodes.map(function(it, i){
        var b, d;
        b = it.getBoundingClientRect();
        this$.map.set(it, d = {
          node: it,
          tov: tov,
          yt: b.y / h,
          yb: (b.y + b.height) / h
        });
        d.yp = d.yt / (1 - (d.yb - d.yt));
        d.progress = d.yp < 0
          ? -d.yt
          : d.yp > 1
            ? 2 - d.yb
            : d.yp;
        this$.io.observe(it);
        return d;
      });
      this.data = this.data.concat(ret);
      return this.trackee = this.trackee.concat(ret.filter(function(it){
        return it.tov;
      }));
    },
    handler: function(entries){
      var ret, this$ = this;
      ret = entries.map(function(entry){
        var d;
        if (d = this$.map.get(entry.target)) {
          d.entry = entry;
        }
        return d;
      }).filter(function(d){
        var v, ref$, inVisible, inTrackee;
        if (!d || d.visible === d.entry.isIntersecting) {
          return false;
        }
        v = d.visible = d.entry.isIntersecting;
        ref$ = [in$(d, this$.visible), in$(d, this$.trackee)], inVisible = ref$[0], inTrackee = ref$[1];
        if (v && !inVisible) {
          this$.visible.push(d);
        }
        if (!v && inVisible) {
          this$.visible.splice(this$.visible.indexOf(d), 1);
        }
        if (!d.tov) {
          if (v && !inTrackee) {
            this$.trackee.push(d);
          }
          if (!v && inTrackee) {
            this$.trackee.splice(this$.trackee.indexOf(d), 1);
          }
        }
        return true;
      });
      if (ret.length) {
        return this.fire('change', ret);
      }
    }
  });
  if (typeof module != 'undefined' && module !== null) {
    module.exports = ldscroll;
  } else {
    window.ldscroll = ldscroll;
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
  function in$(x, xs){
    var i = -1, l = xs.length >>> 0;
    while (++i < l) if (x === xs[i]) return true;
    return false;
  }
}).call(this);
