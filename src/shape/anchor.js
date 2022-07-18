import editorStyle from "../util/defaultStyle";
import { shapeBase } from '@antv/g6-core/lib/element/shapeBase';
import Shape from '@antv/g6-core/lib/element/shape';

export default function(G6){
  console.log('Shape',Shape)
  Shape.registerFactory('anchor', {
    defaultShapeType: 'marker',
    getShape:(type)=> {
      const shapeObj = Object.assign({}, shapeBase,{
        type: 'Marker',
        itemType: type,
        drawShape(cfg, group) {
          const style = this.getShapeStyle(cfg);
          const shape = group.addShape('marker', {
            attrs: style,
            name: 'anchor-shape',
            draggable: true,
          });
          return shape;
        },
        setState(name, value, item) {
          if(name === 'active-anchor') {
            if(value) {
              this.update({style: {...editorStyle.anchorPointHoverStyle}}, item);
            }else{
              this.update({style: {...editorStyle.anchorPointStyle}}, item);
            }
          }
        }
      });
      return shapeObj;
    },
  });
}
