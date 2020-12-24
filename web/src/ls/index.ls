bezier = new cubic.Bezier([0.5,0,0.5,1])
state = {}
view = new ldView do
  root: document.body
  handler:
    marker: ({node}) ->
      id = node.getAttribute(\data-id)
      s = (state[id] or {})
      a = 255 * (s.yt >? 0 <? 1)
      b = 255 - a
      y = s.yt >? 0 <? 1
      y = bezier.y bezier.t y

      node.style
        ..background = "rgba(#a,0,#b,1)"
        ..left = "#{y * 1008}px"
    base: ({node}) ->
      s = state.x or {}
      console.log ">", s.progress#s.yt, s.yb, s.progress
    light: ({node}) ->
      id = node.getAttribute(\data-id)
      s = (state[id] or {})
      node.classList.toggle \bg-success, s.visible
      node.classList.toggle \bg-danger, !s.visible
    percent: ({node}) ->
      id = node.getAttribute(\data-id)
      s = (state[id] or {})
      y = (s.yt or 0) >? 0 <? 1
      node.style.background = "rgba(0,0,0,#{y})"
s = new ldscroll do
  root: document
  nodes: view.getAll('marker') ++ view.getAll('base')
  track-outside-view: true
s.on \change, (list) -> 
  list.map ->
    id = it.node.getAttribute(\data-id)
    state[id] = it
  view.render!
