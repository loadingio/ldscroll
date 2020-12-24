main = (opt={}) ->
  @opt = opt
  root = opt.root
  @root = root = if typeof(root) == \string => document.querySelector(root) else if root => root else null
  @io = new IntersectionObserver ((...args) ~> @handler.apply @, args), {root: @root}
  @nodes = []
  @data = []
  @visible = []
  @add opt.nodes
  @evt-handler = {}
  window.addEventListener \scroll, ~>
    @data.map (it,i) ~>
      b = it.node.getBoundingClientRect!
      it.yb = (b.y + b.height) / window.innerHeight
      it.yt = b.y / window.innerHeight
    @fire \change, @data
  @

main.prototype = Object.create(Object.prototype) <<< do
  on: (n, cb) -> @evt-handler.[][n].push cb
  fire: (n, ...v) -> for cb in (@evt-handler[n] or []) => cb.apply @, v
  add: (ns) ->
    @nodes ++= (if Array.isArray(ns) => ns else [ns])
      .map -> if typeof(it) == \string => Array.from(document.querySelectorAll(it)) else it
      .reduce(((a,b) -> a ++ b), [])
    @nodes.forEach (it,i) ~>
      b = it.getBoundingClientRect!
      it._ldscroll = do
        node: it
        yt: b.y / window.innerHeight
        yb: (b.y + b.height) / window.innerHeight
      @io.observe it
    @data ++= @nodes.map -> it._ldscroll
  handler: (entries) ->
    ret = entries
      .filter (entry) ~>
        d = entry.target._ldscroll
        if d.visible != entry.isIntersecting =>
          d.visible = entry.isIntersecting
          if d.visible and !(d in @visible) => @visible.push d
          if !d.visible and d in @visible => @visible.splice(@visible.indexOf(d), 1)
          return true
        return false
    ret = ret.map ->
      d = it.target._ldscroll
      d.entry = it
      d

    if ret.length => @fire \change, ret

if window? => window.ldscroll = main
