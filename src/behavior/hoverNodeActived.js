import { Marker } from '@antv/g-canvas/lib/shape';
export default function(G6){
  G6.registerBehavior('hoverNodeActived', {
    getEvents() {
      return {
        'node:mouseenter': 'onNodeEnter',
        'node:mouseleave': 'onNodeLeave',
        'anchor:mouseleave': 'onAnchorLeave',
      }
    },
    onAnchorLeave(e){
      console.log('hoverNodeActived:onAnchorLeave',e.item.getContainer().getParent())
      let node = e.item.getContainer().getParent();
      if(node && !this.graph.get('edgeDragging')) {
        this.graph.setItemState(node.get('item'), 'show-anchor', false);
      }
    },
    onNodeEnter(e){
      console.log('hoverNodeActived:onNodeEnter')
      const clazz = e.item.getModel().clazz;
      if(clazz !== 'endEvent' && !this.graph.get('edgeDragging')){
        this.graph.setItemState(e.item, 'show-anchor', true);
      }
    },
    onNodeLeave(e){
      console.log('hoverNodeActived:onNodeLeave',e.item.shapeName)
      if(!(e.item.getType() == 'node') && !this.graph.get('edgeDragging')) {
        this.graph.setItemState(e.item, 'show-anchor', false);
      }
    },
  });
}
