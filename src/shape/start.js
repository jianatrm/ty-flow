import Anchor from "../item/anchor";
import editorStyle from "../util/defaultStyle";

const ICON_MAP = {
    a: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxjaXJjbGUgaWQ9ImIiIGN4PSIzNiIgY3k9IjM2IiByPSIzNiIvPjxmaWx0ZXIgeD0iLTkuNyUiIHk9Ii02LjklIiB3aWR0aD0iMTE5LjQlIiBoZWlnaHQ9IjExOS40JSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiBpZD0iYSI+PGZlT2Zmc2V0IGR5PSIyIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMiIgaW49InNoYWRvd09mZnNldE91dGVyMSIgcmVzdWx0PSJzaGFkb3dCbHVyT3V0ZXIxIi8+PGZlQ29tcG9zaXRlIGluPSJzaGFkb3dCbHVyT3V0ZXIxIiBpbjI9IlNvdXJjZUFscGhhIiBvcGVyYXRvcj0ib3V0IiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiLz48ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMDQgMCIgaW49InNoYWRvd0JsdXJPdXRlcjEiLz48L2ZpbHRlcj48L2RlZnM+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0IDIpIj48dXNlIGZpbGw9IiMwMDAiIGZpbHRlcj0idXJsKCNhKSIgeGxpbms6aHJlZj0iI2IiLz48dXNlIGZpbGwtb3BhY2l0eT0iLjkyIiBmaWxsPSIjRkZGMkU4IiB4bGluazpocmVmPSIjYiIvPjxjaXJjbGUgc3Ryb2tlPSIjRkZDMDY5IiBjeD0iMzYiIGN5PSIzNiIgcj0iMzUuNSIvPjwvZz48dGV4dCBmb250LWZhbWlseT0iUGluZ0ZhbmdTQy1SZWd1bGFyLCBQaW5nRmFuZyBTQyIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIuNjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQgMikiPjx0c3BhbiB4PSIyMyIgeT0iNDEiPlN0YXJ0PC90c3Bhbj48L3RleHQ+PC9nPjwvc3ZnPg==',
    b: 'https://gw.alipayobjects.com/mdn/rms_8fd2eb/afts/img/A*sxK0RJ1UhNkAAAAAAAAAAABkARQnAQ',
};

const nodeDefinition = {
    options: {
        icon: null,
        iconStyle: {
            width: 14,
            height: 14,
            left: 0,
            top: 0,
        },
        style: {
            fill: '#f9f9f9',
            stroke: '#bbb',
            cursor: 'default',
        },
        stateStyles: {
            selected: {
                fill: '#eee',
            },
            hover: {
                cursor: editorStyle.cursor.hoverNode,
            }
        }
    },
    drawShape: function drawShape(cfg, group) {
        let style = this.getShapeStyle(cfg);
        const shape = group.addShape('circle', {
            attrs: {
                x: 0,
                y: 0,
                r:40,
                stroke: '#F5C277',
                fill:'#FDF3EB',
            },

            name: 'circle-node',
        });
        group.addShape('text', {
            attrs: {
                x: 0, // 居中
                y: 0,
                textAlign: 'center',
                textBaseline: 'middle',
                text: cfg.text,
                fill: '#585552',
                fontSize:12
            },
            name: 'text-shape',
        });
        this.initAnchor(group);
        return shape;
    },
    setState(name, value, item) {
        const group = item.getContainer();
        if (name === 'show-anchor') {
            if (value) {
                group.showAnchor();
            } else {
                group.clearAnchor();
            }
        } else if (name === 'selected') {
            const rect = group.getChildByIndex(0);
            if (value) {
                rect.attr('fill', this.options.stateStyles.selected.fill);
            } else {
                rect.attr('fill', this.options.style.fill);
            }
        } else if (name === 'hover') {
            const rect = group.getChildByIndex(0);
            const text = group.getChildByIndex(1);
            if (value) {
                rect.attr('cursor', this.options.stateStyles.hover.cursor);
                if(text)
                    text.attr('cursor', this.options.stateStyles.hover.cursor);
            } else {
                rect.attr('cursor', this.options.style.cursor);
                if(text)
                    text.attr('cursor', this.options.style.cursor);
            }
        }
        this.setCustomState(name, value, item);
    },
    setCustomState(name, value, item){

    },
    getAnchorPoints() {
        return [
            [0.5, 0], // top
            [1, 0.5], // right
            [0.5, 1], // bottom
            [0, 0.5], // left
        ]
    },
    drawAnchor(group) {
        const bbox = group.get('children')[0].getBBox();
        this.getAnchorPoints().forEach((p, i) => {
            const anchorContainer = group.addGroup();
            const anchor = new Anchor({
                group: anchorContainer,
                index: i,
                model: {
                    style: {
                        x: bbox.minX + bbox.width * p[0],
                        y: bbox.minY + bbox.height * p[1]
                    }
                }
            });
            group.anchorShapes.push(anchorContainer);
        });
    },
    initAnchor(group) {
        group.anchorShapes = [];
        group.showAnchor = () => {
            this.drawAnchor(group);
        };
        group.getAllAnchors = () => {
            return group.anchorShapes.map(c => {
                c.filter(a => a.isAnchor)
            })
        };
        group.getAnchor = (i) => {
            return group.anchorShapes.filter(a => a.get('index') === i)
        };
        group.clearAnchor = () => {
            group.anchorShapes && group.anchorShapes.forEach(a => a.remove());
            group.anchorShapes = [];
            console.log('anchorShapes',group.anchorShapes)
        };
        group.clearHotpotActived = () => {
            group.anchorShapes && group.anchorShapes.forEach(a => {
                if (a.isAnchor)
                    a.setHotspotActived(false);
            });
        };
    },
}

export default function (G6) {
    G6.registerNode('ty-start-node', nodeDefinition, 'circle');
}