# ldscroll

library for visibility and position tracking.


## Usage

    s = new ldscroll({root: ...});
    s.add([...]);
    s.on("change", function(list) { ... });


## Options

 - root - root element where ldscroll works. Can be either selector or a DOM node.
 - nodes - Array of elements / nodes to watch. Item can be selector or DOM node.
 - trackOutsideView - should nodes being tracking when outside viewport. default true.


## API

 - getVisible() - get data for all visible nodes.
 - add(list) - add elements in list to ldscroll. format the same as option `nodes`.
 - on(name, cb) - watch event `name` and handle it with callback function `cb`. Available names as follow:
  - `change` - when ldscroll data for some elements are changed. changed ldscroll objects passed as callback param.

## ldscroll data

ldscroll data passed in `change` event is as follow:

 - node: owner element
 - yt: distance from top of the screen, for top edge of node. 0 = top, 1 = bottom.
 - yb: distance from top of the screen, for bottom edge of node. 0 = top, 1 = bottom.


## License

MIT

# ldscroll

this is the repo for considering making a IntersectionObserver for both visibility checking and parallex effect. Not sure if we have to do this since there are already lots of parallex lib, and visibility check is just an one liner.

 * visible ( event )
  (new IntersectionObserver (-> if it.0 and it.0.isVisible => ... ), {}).observe(node)

 * scrolling ( percent )  for parallex 
   - intersectionObserver -> visible? -> add onScroll monitor
                          -> invisible? -> remove onScroll monitor
