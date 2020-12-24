# ldscroll

library for visibility and position tracking.


## Usage

    s = new ldscroll({root: ...});
    s.add([...]);
    s.on("change", function(list) { ... });


## Options

 - `root` - root element where ldscroll works. Can be either selector or a DOM node.
 - `nodes` - Array of elements / nodes to watch. Item can be selector or DOM node.
 - `trackOutsideView` - should nodes being tracking when outside viewport. default true.


## API

 - `getVisible()` - get data for all visible nodes.
 - `add(list)` - add elements in list to ldscroll. format the same as option `nodes`.
 - `on(name, cb)` - watch event `name` and handle it with callback function `cb`. Available names as follow:
  - `change` - when ldscroll data for some elements are changed. changed ldscroll objects passed as callback param.

## ldscroll data

ldscroll data passed in `change` event is as follow:

 - `node`: owner element
 - `yt`: distance from top of the screen, for top edge of node. 0 = top, 1 = bottom.
 - `yb`: distance from top of the screen, for bottom edge of node. 0 = top, 1 = bottom.
 - `yp`: percentage going through the whole block.
   - 0: block top align with viewport top
   - 1: block bottom align with viewport bottom
   - values proportional to block height when `yp` < 0 or `yp` > 1 ( 3 = 300% )
 - `progress`: similar to `yp`, but also handle boundary condition:
   - -1: block top align with viewport bottom ( entering )
   - 0: block top align with viewport top ( entered )
   - 1: block bottom align with viewport bottom (exiting )
   - 2: block bottom align with viewport top ( exited )
   - for `progress` > 2 or < -1, values are proportional to viewport. ( 3 = 3vh )

These values are a little complicated but just memorize them with these rules for `progress`:

                    1vh         0%       100%       1vh
    before entering  / entering / entered / exiting / after exiting
    ........        -1          0         1         2     .........


## License

MIT

# ldscroll

this is the repo for considering making a IntersectionObserver for both visibility checking and parallex effect. Not sure if we have to do this since there are already lots of parallex lib, and visibility check is just an one liner.

 * visible ( event )
  (new IntersectionObserver (-> if it.0 and it.0.isVisible => ... ), {}).observe(node)

 * scrolling ( percent )  for parallex 
   - intersectionObserver -> visible? -> add onScroll monitor
                          -> invisible? -> remove onScroll monitor
