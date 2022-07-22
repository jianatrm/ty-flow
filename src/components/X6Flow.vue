<template>
 <div style="width: 100%;height: 100%;display: flex">
   <div id="container">
     <div class="tool-bar">
       <div class="bar-item">
         <ZoomInOutlined :style="{fontSize: '16px'}"/>
       </div>
       <div class="bar-item">
         <ZoomOutOutlined :style="{fontSize: '16px'}"/>
       </div>
       <div class="bar-item">
         <SyncOutlined :style="{fontSize: '16px'}"/>
       </div>
     </div>
   </div>
   <div class="detail-panel" v-if="formModel">
     <div class="detail-panel-title">{{translateFormTitle(formModel.type)}}</div>
     <div class="detail-panel-content">
       <a-form layout="vertical" :model="formModel" :rules="rules">
         <a-form-item label="节点名称" name="text" v-if="formModel.type !== 'edge'">
           <a-input v-model:value="formModel.text" placeholder="请输入" @blur="handleInput"/>
         </a-form-item>
         <a-form-item label="是否会签" name="sign" v-if="formModel.type === 'approve'">
           <a-radio-group v-model:value="formModel.sign">
             <a-radio :value="1">是</a-radio>
             <a-radio :value="2">否</a-radio>
           </a-radio-group>
         </a-form-item>
         <a-form-item label="选择审批人" name="approver" v-if="formModel.type === 'approve'">
           <a-cascader
               v-model:value="formModel.approver"
               style="width: 100%"
               multiple
               max-tag-count="responsive"
               :options="options"
               placeholder="请选择"
           ></a-cascader>
         </a-form-item>
         <a-form-item label="选择处理人" name="handler" v-if="formModel.type === 'task'">
           <a-cascader
               v-model:value="formModel.handler"
               style="width: 100%"
               multiple
               max-tag-count="responsive"
               :options="options"
               placeholder="请选择"
           ></a-cascader>
         </a-form-item>
         <a-form-item label="选择处理表单" name="formFields" v-if="formModel.type === 'task'">
           <a-select
               ref="select"
               v-model:value="formModel.formFields"
               placeholder="请选择"
               style="width: 100%">
             <a-select-option value="jack">处置阶段表单</a-select-option>
             <a-select-option value="lucy">恢复阶段表单</a-select-option>
             <a-select-option value="disabled">事后处理阶段表单</a-select-option>
           </a-select>
         </a-form-item>
         <a-form-item label="属性" name="attr" v-if="formModel.type === 'edge'">
           <a-select v-model:value="formModel.attr" placeholder="请选择" @change="handleAttrChange">
             <a-select-option value="通过">通过</a-select-option>
             <a-select-option value="不通过">不通过</a-select-option>
             <a-select-option value="其他">其他</a-select-option>
           </a-select>
         </a-form-item>
       </a-form>
     </div>
   </div>
 </div>

  <a-button @click="submit">提交</a-button>
</template>

<script setup>
import {ZoomInOutlined, ZoomOutOutlined, SyncOutlined} from "@q/icons-vue"
import {onMounted, reactive, ref, toRefs} from "vue";
import {Graph, Shape, Addon} from '@antv/x6'
import _ from "lodash";

const selectModel = ref(null)

const options = [
  {
    label: 'Light',
    value: 'light',
    children: new Array(20)
        .fill(null)
        .map((_, index) => ({ label: `Number ${index}`, value: index })),
  },
  {
    label: 'Bamboo',
    value: 'bamboo',
    children: [
      {
        label: 'Little',
        value: 'little',
        children: [
          {
            label: 'Toy Fish',
            value: 'fish',
          },
          {
            label: 'Toy Cards',
            value: 'cards',
          },
          {
            label: 'Toy Bird',
            value: 'bird',
          },
        ],
      },
    ],
  },
]

const state = reactive({
  formModel: null,
  rules: {
    text: [{required: true, message: '请输入节点名称', trigger: 'blur'}],
    sign: [{required: true, message: '请选择是否会签'}],
    approver: [{required: true, message: '请选择审批人'}],
    handler: [{required: true, message: '请选择处理人'}],
    formFields: [{required: true, message: '请选择处理表单'}],
  },
  edge: null,
  graphInstance: null
})

const { formModel, rules } =  toRefs(state)

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
            stroke: '#cbe5dc',
            'stroke-width': 8,
          },
        },
      },
    },
    resizing: true,
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
        data: {label: map[node.attrs.type].label},
        attrs: {
          type:node.attrs.type,
          body: {
            rx: 20,
            ry: 26,
            stroke: '#c9ccd1',
            strokeWidth: 1,
            fill: '#ffffff',
            refWidth: 1,
            refHeight: 1
          },
          label:{
            refX: '100%',
            refX2: -25,
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

  graph.on('node:click', ({ node, e }) => {
    console.log('node:selected',node)
    selectModel.value = node
    state.formModel = {
      type:node.attrs.type,
      text:node.attrs.text.text,
      ...node.getData()
    }
    console.log("all nodes is",  graph.getNodes())
    console.log("all edges is",  graph.getEdges())
  })
  graph.on('edge:click', ({ edge, e }) => {
    console.log('edge:click',edge)
    state.edge = edge
    state.formModel = {
      type: edge.shape,
      text: '连接线',
      // ...edge.getData()
    }
    // edge.setLabels('123')
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
      width: 106,
      type: 'start',
      label: {
        text: '开始节点',
        fill: '#525966',
        refX: 0.5,
        refY: 50,
        refY2: 4,
        textAnchor: 'middle',
        textVerticalAnchor: 'top',
      },
    },
    width: 40,
    height: 40,
    imageUrl:new URL('../assets/x6/start.svg', import.meta.url).href,
  })
  const r2 = graph.createNode({
    shape: 'image',
    x: 320,
    y: 120,
    width: 40,
    height: 40,
    imageUrl:new URL('../assets/x6/approve.svg', import.meta.url).href,
    attrs: {
      width: 138,
      type:'approve',
      label: {
        text: '审批节点',
        fill: '#525966',
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
    width: 40,
    height: 40,
    imageUrl:new URL('../assets/x6/task.svg', import.meta.url).href,
    attrs: {
      width: 138,
      type:'task',
      label: {
        text: '处理节点',
        fill: '#525966',
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
    width: 40,
    height: 40,
    imageUrl:new URL('../assets/x6/end.svg', import.meta.url).href,
    attrs: {
      width: 106,
      type:'end',
      label: {
        text: '结束节点',
        fill: '#525966',
        refX: 0.5,
        refY: 50,
        refY2: 4,
        textAnchor: 'middle',
        textVerticalAnchor: 'top',
      },
    },
  })
  stencil.load([r1,r2,r3,r4], 'group1')

  state.graphInstance = graph

  console.log("localStorage",localStorage.getItem('dataSource'))
  if(localStorage.getItem('dataSource')) {
    graph.fromJSON(JSON.parse(localStorage.getItem('dataSource')))
  }

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

const translateFormTitle = (title) => {
  if(title === 'start') return '开始节点'
  if(title === 'approve') return '审批节点'
  if(title === 'task') return '处理节点'
  if(title === 'end') return '结束节点'
  if(title === 'edge') return '连接线'
}

const handleInput = (e)=> {
  console.log(e, "e is ")
  selectModel.value.attr('text/text', e.target._value)
  state.formModel.text = e.target._value
  // _.debounce(() => {
  //   selectModel.value.attr('text/text', e.target._value)
  //   state.formModel.text = e.target._value
  // }, 500)
}

const handleAttrChange = (val) => {
  if(val !== '其他') state.edge.setLabels(val)
}

const submit = () => {
  console.log("当前所有节点", state.graphInstance.getNodes())
  console.log("当前所有连接线", state.graphInstance.getEdges())
  let data = state.graphInstance.toJSON(state.graphInstance.getNodes())
  let data1 = state.graphInstance.toJSON(state.graphInstance.getEdges())
  console.log(data)
  console.log(data1)
  localStorage.setItem('dataSource', JSON.stringify(data))
}
</script>

<style lang="less">
#container {
  display: flex;
  border: 1px solid #dfe3e8;
  height: 100%;
  position: relative;
  z-index: 98;
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
  font-family: PingFang SC;
  font-size: 14px;
  color: #525966;
}

.x6-widget-stencil-title {
  background-color: #f2f3f5 !important;
  height: 54px;
  line-height: 54px;
  text-align: center;
  font-family: PingFang SC;
  font-size: 14px;
  color: #242933;
  font-weight: 500;
}

.x6-widget-stencil-content {
  top: 40px
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

.tool-bar {
  cursor: pointer;
  position: absolute;
  top: 17px;
  right: 17px;

  .bar-item {
    display: inline-block;
    background: #ffffff;
    padding: 8px;
    border: 1px solid #dfe1e6;
    border-left: unset;
    z-index: 99;
    cursor: pointer;
  }

  .bar-item:first-child {
    border-left: 1px solid #dfe1e6;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }

  .bar-item:last-child {
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
  }

  .bar-active {
    border: 1px solid #00AB7A!important;
    color: #00AB7A;
  }
}

.detail-panel {
  width: 300px;
  height: 100%;
  background-color: #f2f3f5;

  .detail-panel-title {
    padding: 10px 24px;
    border-bottom: 1px solid #dfe1e6;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 500;
    color: #242933;
  }

  .detail-panel-content {
    padding: 20px 24px;
  }
}
</style>
