<template>
 <div style="width: 100%;height: 100%;display: flex">
   <div id="container"></div>
   <div  v-if="formModel" class="detailPannel" style="width: 300px;height: 100%;background-color: #f2f3f5">
    <div>{{formModel.type}}</div>

     <el-form
         label-position="top"
         label-width="100px"
         :model="formModel"
         style="max-width: 460px"
     >
       <el-form-item label="标题">
         <el-input :model-value="formModel.text" @input="handleInput"></el-input>
       </el-form-item>
       <el-form-item label="顺序">
         <el-input v-model="formModel.region" />
       </el-form-item>
       <el-form-item label="Activity form">
         <el-input v-model="formModel.type" />
       </el-form-item>
     </el-form>
   </div>
 </div>
</template>

<script setup>
import {onMounted, reactive, ref, toRefs} from "vue";
import {Graph, Shape, Addon} from '@antv/x6'
const selectModel = ref(null)
const state = reactive({
  formModel:null
})
const { formModel } =  toRefs(state)
onMounted(() => {
  preWork()

// #region 初始化画布
  const graph = new Graph({
    container: document.getElementById('graph-container'),
    grid: true,
    mousewheel: {
      enabled: true,
      zoomAtMousePosition: true,
      modifiers: 'ctrl',
      minScale: 0.5,
      maxScale: 3,
    },
    connecting: {
      router: {
        name: 'manhattan',
        args: {
          padding: 1,
        },
      },
      connector: {
        name: 'rounded',
        args: {
          radius: 8,
        },
      },
      anchor: 'center',
      connectionPoint: 'anchor',
      allowBlank: false,
      snap: {
        radius: 20,
      },
      createEdge() {
        return new Shape.Edge({
          attrs: {
            line: {
              stroke: '#A2B1C3',
              strokeWidth: 2,
              targetMarker: {
                name: 'block',
                width: 12,
                height: 8,
              },
            },
          },
          zIndex: 0,
        })
      },
      validateConnection({targetMagnet}) {
        return !!targetMagnet
      },
    },
    highlighting: {
      magnetAdsorbed: {
        name: 'stroke',
        args: {
          attrs: {
            fill: '#ffffff',
            stroke: '#8eb3a6',
            'stroke-width': 8,
          },
        },
      },
    },
    resizing: false,
    rotating: false,
    selecting: {
      enabled: true,
      className: 'my-selecting',
    },
    snapline: true,
    keyboard: true,
    clipboard: true,
    history: true,
    panning: true,
    allowRubberband: () => false,
  })
// #endregion

// #region 初始化 stencil
  const stencil = new Addon.Stencil({
    title: '常规节点',
    target: graph,
    stencilGraphWidth: 80,
    stencilGraphHeight: 800,
    collapsable: false,
    groups: [
      {
        title: '',
        name: 'group1',
        graphHeight: 400,
      },
    ],
    layoutOptions: {
      columns: 1,
      columnWidth: 60,
      rowHeight: 80,
    },
    getDragNode(node) {
      console.log('node',node)
      // 这里返回一个新的节点作为拖拽节点
      let map = {
        start:{
          label:'开始',
          url:new URL('../assets/x6/start.svg', import.meta.url).href
        },
        approve:{
          label:'审批节点',
          url:new URL('../assets/x6/approve.svg', import.meta.url).href
        },
        task:{
          label:'处理节点',
          url:new URL('../assets/x6/task.svg', import.meta.url).href
        },
        end:{
          label:'结束',
          url:new URL('../assets/x6/end.svg', import.meta.url).href
        }
      }
      return graph.createNode({
        width: node.attrs.width,
        height: 48,
        shape: 'rect',
        label: map[node.attrs.type].label,
        attrs: {
          type:node.attrs.type,
          body: {
            rx: 20,
            ry: 26,
            stroke: '#c9ccd1',
            strokeWidth: 1,
            fill: '#ffffff',
            refWidth: 1,
            refHeight: 1,
          },
          label:{
            refX: '100%',
            refX2: -16,
            refY: 0.5,
            textAnchor: 'end',
            textVerticalAnchor: 'middle',
          },
          image: {
            'xlink:href':map[node.attrs.type].url,
            width: 32,
            height: 32,
            x: 8,
            y: 8,
          }
        },
        markup: [
          {
            tagName: 'rect',
            selector: 'body',
          },
          {
            tagName: 'image',
            selector: 'image',
          },

          {
            tagName: 'text',
            selector: 'label',
          },
        ],
        ports: {...ports},
      })
    }
  })
  document.getElementById('stencil').appendChild(stencil.container)
// #endregion

// #region 快捷键与事件
// copy cut paste
  graph.bindKey(['meta+c', 'ctrl+c'], () => {
    const cells = graph.getSelectedCells()
    if (cells.length) {
      graph.copy(cells)
    }
    return false
  })
  graph.bindKey(['meta+x', 'ctrl+x'], () => {
    const cells = graph.getSelectedCells()
    if (cells.length) {
      graph.cut(cells)
    }
    return false
  })
  graph.bindKey(['meta+v', 'ctrl+v'], () => {
    if (!graph.isClipboardEmpty()) {
      const cells = graph.paste({offset: 32})
      graph.cleanSelection()
      graph.select(cells)
    }
    return false
  })

//undo redo
  graph.bindKey(['meta+z', 'ctrl+z'], () => {
    if (graph.history.canUndo()) {
      graph.history.undo()
    }
    return false
  })
  graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
    if (graph.history.canRedo()) {
      graph.history.redo()
    }
    return false
  })

// select all
  graph.bindKey(['meta+a', 'ctrl+a'], () => {
    const nodes = graph.getNodes()
    if (nodes) {
      graph.select(nodes)
    }
  })

//delete
  graph.bindKey('backspace', () => {
    const cells = graph.getSelectedCells()
    if (cells.length) {
      graph.removeCells(cells)
    }
  })

// zoom
  graph.bindKey(['ctrl+1', 'meta+1'], () => {
    const zoom = graph.zoom()
    if (zoom < 1.5) {
      graph.zoom(0.1)
    }
  })
  graph.bindKey(['ctrl+2', 'meta+2'], () => {
    const zoom = graph.zoom()
    if (zoom > 0.5) {
      graph.zoom(-0.1)
    }
  })

// 控制连接桩显示/隐藏
  const showPorts = (ports, show) => {
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      ports[i].style.visibility = show ? 'visible' : 'hidden'
    }
  }
  graph.on('node:mouseenter', (e) => {
    console.log('e',e.node.getPorts())
    // const container = document.getElementById('graph-container')
    // const ports = container.querySelectorAll(
    //     '.x6-port-body',
    // )
    // showPorts(ports, true)
    e.node.getPorts().forEach(item=>{
      e.node.setPortProp(item.id, 'attrs/circle', { style: {
          visibility: 'inherit',
        }, })
    })

  })
  graph.on('node:mouseleave', (e) => {
    // const container = document.getElementById('graph-container')
    // const ports = container.querySelectorAll(
    //     '.x6-port-body',
    // )
    // showPorts(ports, false)
    e.node.getPorts().forEach(item=>{
      e.node.setPortProp(item.id, 'attrs/circle', {style: {
          visibility: 'hidden',
        }, })
    })
  })
  graph.on('edge:change:arrowheadMarkup',r=>{
    console.log('change:target',r)
  })

  graph.on('node:selected', ({ node, e }) => {
    console.log('node:selected',node)
    selectModel.value = node
    state.formModel = {
      type:node.attrs.type,
      text:node.attrs.text.text
    }
  })
  graph.on('edge:click', ({ edge, e }) => {
    console.log('edge:click',edge)
    edge.setLabels('123')
    // selectModel.value = node
    // state.formModel = {
    //   type:node.attrs.type,
    //   text:node.attrs.text.text
    // }
  })
// #endregion

// #region 初始化图形
  const ports = {
    groups: {
      top: {
        position: 'top',
        attrs: {
          circle: {
            r: 8,
            magnet: true,
            stroke: '#cbe5dc',
            strokeWidth: 8,
            fill: '#fff',
            style: {
              visibility: 'hidden',
            },
          },
        },
      },
      right: {
        position: 'right',
        attrs: {
          circle: {
            r: 8,
            magnet: true,
            stroke: '#cbe5dc',
            strokeWidth: 8,
            fill: '#fff',
            style: {
              visibility: 'hidden',
            },
          },
        },
      },
      bottom: {
        position: 'bottom',
        attrs: {
          circle: {
            r: 8,
            magnet: true,
            stroke: '#cbe5dc',
            strokeWidth: 8,
            fill: '#fff',
            style: {
              visibility: 'hidden',
            },
          },
        },
      },
      left: {
        position: 'left',
        attrs: {
          circle: {
            r: 8,
            magnet: true,
            stroke: '#cbe5dc',
            strokeWidth: 8,
            fill: '#fff',
            style: {
              visibility: 'hidden',
            },
          },
        },
      },
    },
    items: [
      {
        group: 'top',
      },
      {
        group: 'right',
      },
      {
        group: 'bottom',
      },
      {
        group: 'left',
      },
    ],
  }
  const r1 = graph.createNode({
    shape: 'image',
    attrs: {
      width:104,
      type:'start',
      label: {
        text: '开始节点',
        fill: '#000000',
        refX: 0.5,
        refY: 50,
        refY2: 4,
        textAnchor: 'middle',
        textVerticalAnchor: 'top',
      },
    },
    width: 80,
    height: 40,
    imageUrl:new URL('../assets/x6/start.svg', import.meta.url).href,
  })
  const r2 = graph.createNode({
    shape: 'image',
    x: 320,
    y: 120,
    width: 80,
    height: 40,
    imageUrl:new URL('../assets/x6/approve.svg', import.meta.url).href,
    attrs: {
      width:120,
      type:'approve',
      label: {
        text: '审批节点',
        fill: '#000000',
        refX: 0.5,
        refY: 50,
        refY2: 4,
        textAnchor: 'middle',
        textVerticalAnchor: 'top',
      },
    },
  })
  const r3 = graph.createNode({
    shape: 'image',
    x: 320,
    y: 120,
    width: 80,
    height: 40,
    imageUrl:new URL('../assets/x6/task.svg', import.meta.url).href,
    attrs: {
      width:120,
      type:'task',
      label: {
        text: '处理节点',
        fill: '#000000',
        refX: 0.5,
        refY: 50,
        refY2: 4,
        textAnchor: 'middle',
        textVerticalAnchor: 'top',
      },
    },
  })

  const r4 = graph.createNode({
    shape: 'image',
    x: 320,
    y: 120,
    width: 80,
    height: 40,
    imageUrl:new URL('../assets/x6/end.svg', import.meta.url).href,
    attrs: {
      width:104,
      type:'end',
      label: {
        text: '结束节点',
        fill: '#000000',
        refX: 0.5,
        refY: 50,
        refY2: 4,
        textAnchor: 'middle',
        textVerticalAnchor: 'top',
      },
    },
  })
  stencil.load([r1,r2,r3,r4], 'group1')

// #endregion

  function preWork() {
    // 这里协助演示的代码，在实际项目中根据实际情况进行调整
    const container = document.getElementById('container')
    const stencilContainer = document.createElement('div')
    stencilContainer.id = 'stencil'
    const graphContainer = document.createElement('div')
    graphContainer.id = 'graph-container'
    container.appendChild(stencilContainer)
    container.appendChild(graphContainer)
  }
})





const handleInput = (e)=>{
  selectModel.value.attr('text/text', e)
  state.formModel.text = e
}
</script>

<style lang="less">
#container {
  display: flex;
  border: 1px solid #dfe3e8;
  height: 100%
}

#stencil {
  width: 80px !important;
  height: 100%;
  position: relative;
  border-right: 1px solid #eee;
  background-color: #f2f3f5 !important;
}

#graph-container {
  width: calc(100% - 80px) !important;
  height: 100%;
}

.x6-widget-stencil {
  background-color: #f2f3f5 !important;
}

.x6-widget-stencil-title {
  background-color: #f2f3f5 !important;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
.x6-widget-stencil-content{
  top:30px
}

.x6-widget-stencil-group-title {
  background-color: #fff !important;
}

.x6-widget-transform {
  margin: -1px 0 0 -1px;
  padding: 0px;
  border: 1px solid #239edd;
}

.x6-widget-transform > div {
  border: 1px solid #239edd;
}

.x6-widget-transform > div:hover {
  background-color: #3dafe4;
}

.x6-widget-transform-active-handle {
  background-color: #3dafe4;
}

.x6-widget-transform-resize {
  border-radius: 0;
}

.x6-widget-selection-inner {
  border: 1px solid #239edd;
}

.x6-widget-selection-box {
  opacity: 0;
}
.x6-node.x6-node-immovable {
  cursor: pointer;
}
.x6-node.x6-node-immovable:hover {
  background-color: #ffffff;
}
.x6-widget-selection-selected{
  background-color:#cbe5dc ;

}
</style>