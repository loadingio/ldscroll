var bezier, state, view, s;
bezier = new cubic.Bezier([0.5, 0, 0.5, 1]);
state = {};
view = new ldView({
  root: document.body,
  handler: {
    marker: function(arg$){
      var node, id, s, a, ref$, ref1$, b, y, x$;
      node = arg$.node;
      id = node.getAttribute('data-id');
      s = state[id] || {};
      a = 255 * ((ref$ = (ref1$ = s.yt) > 0 ? ref1$ : 0) < 1 ? ref$ : 1);
      b = 255 - a;
      y = (ref$ = (ref1$ = s.yt) > 0 ? ref1$ : 0) < 1 ? ref$ : 1;
      y = bezier.y(bezier.t(y));
      x$ = node.style;
      x$.background = "rgba(" + a + ",0," + b + ",1)";
      x$.left = y * 1008 + "px";
      return x$;
    },
    base: function(arg$){
      var node, s;
      node = arg$.node;
      return s = state.x || {};
    },
    light: function(arg$){
      var node, id, s;
      node = arg$.node;
      id = node.getAttribute('data-id');
      s = state[id] || {};
      node.classList.toggle('bg-success', s.visible);
      return node.classList.toggle('bg-danger', !s.visible);
    },
    percent: function(arg$){
      var node, id, s, y, ref$, ref1$;
      node = arg$.node;
      id = node.getAttribute('data-id');
      s = state[id] || {};
      y = (ref$ = (ref1$ = s.yt || 0) > 0 ? ref1$ : 0) < 1 ? ref$ : 1;
      return node.style.background = "rgba(0,0,0," + y + ")";
    }
  }
});
s = new ldscroll({
  root: document,
  nodes: view.getAll('marker').concat(view.getAll('base')),
  trackOutsideView: true
});
s.on('change', function(list){
  list.map(function(it){
    var id;
    id = it.node.getAttribute('data-id');
    return state[id] = it;
  });
  return view.render();
});