<script setup>
import ItemPanel from './ItemPanel.vue'
import DetailPanel from './DetailPanel/index.vue'
import ToolbarPanel from './ToolbarPanel.vue'
import {onMounted, ref,reactive } from 'vue'
import G6 from "@antv/g6";
import Command from "../plugins/command";
import Toolbar from "../plugins/toolbar";
import AddItemPanel from "../plugins/addItemPanel";
import CanvasPanel from "../plugins/canvasPanel";
import {exportImg, exportXML} from "../util/bpmn";
import {getShapeName} from "../util/clazz";
import registerShape from '../shape'
import registerBehavior from '../behavior'
registerShape(G6);
registerBehavior(G6);
const props = defineProps({
  isView: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: "edit"
  },
  height: {
    type: Number,
    default: 800,
  },
  lang: {
    type: String,
    default: "zh"
  },
  data: {
    type: Object,
    default: () => ({nodes:[],edges:[]})
  },
  users: {
    type: Array,
    default: () => ([])
  },
  groups: {
    type: Array,
    default: () => ([])
  },
  categorys: {
    type: Array,
    default: () => ([])
  }
})

const canvasRef = ref(null)
const toolbarRef = ref(null)
const addItemPanelRef = ref(null)
const detailPanelRef = ref(null)
const graphInstance = ref({})
const state = reactive({
  resizeFunc: ()=>{},
  selectedModel: {},
  processModel: {
    id: '',
    name: '',
    category: '',
    clazz: 'process',
    dataObjs: [],
    signalDefs: [],
    messageDefs: [],
  },
  graph:null,
  cmdPlugin: null,
  height:800
})
onMounted(() => {
  init()
})
const init = ()=>{
  let plugins = [];
  const cmdPlugin = new Command();
  const toolbar = new Toolbar({container:toolbarRef.value.$el});
  const addItemPanel = new AddItemPanel({container:addItemPanelRef.value.$el});
  const canvasPanel = new CanvasPanel({container:canvasRef.value});
  console.log('canvasRef.value',canvasRef.value)
  const grid = new G6.Grid({img:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuXzAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjEiIGhlaWdodD0iMSIgcng9IjEiIHJ5PSIxIiBmaWxsPSIjYWFhYWFhIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm5fMCkiLz48L3N2Zz4="});
  plugins = [ cmdPlugin,toolbar,addItemPanel,canvasPanel,grid ];
  const width = canvasRef.value.offsetWidth;
  const graph = new G6.Graph({
    plugins: plugins,
    grid:true,
    container: canvasRef.value,
    height: 800,
    width: width,
    modes: {
      default: ['drag-canvas','drag-node'],
      view: [ ],
      edit: [ 'drag-canvas', 'hoverNodeActived','hoverAnchorActived','dragNode','dragEdge',
        'dragPanelItemAddNode','clickSelected','deleteItem','itemAlign','dragPoint','brush-select'],
    },
    defaultNode:{
      type:'ty-start-node'
    },
    defaultEdge: {
      type: 'flow-polyline-round',
    },
  });
  graph.saveXML = (createFile = true) => exportXML(graph.save(),state.processModel,createFile);
  graph.saveImg = (createFile = true) => exportImg(canvasRef.value,state.processModel.name,createFile);
  graphInstance.value = graph
  graph.setMode(props.mode);
  graph.data(initShape(props.data));
  graph.render();
  initEvents();
}
const initShape = (data)=>{
  if(data && data.nodes){
    return {
      nodes: data.nodes.map(node => {
        return {
          type: getShapeName(node.clazz),
          ...node,
        }
      }),
      edges: data.edges
    }
  }
  return data;
}


const initEvents = ()=>{
  graphInstance.value.on('afteritemselected',(items)=>{

    if(items && items.length > 0) {
      let item = graphInstance.value.findById(items[0]);
      if(!item){
        item = getNodeInSubProcess(items[0])
      }
      console.log('afteritemselected',item)
      state.selectedModel = {...item.getModel()};
    } else {
      state.selectedModel = state.processModel;
    }
  });
  const page =canvasRef.value;
  const height = state.height-1;
  state.resizeFunc = ()=>{
    graphInstance.value.changeSize(page.offsetWidth,height);
  };
  window.addEventListener("resize", state.resizeFunc);
}
const getNodeInSubProcess = (itemId) =>{
  const subProcess = graphInstance.value.find('node', (node) => {
    if (node.get('model')) {
      const clazz = node.get('model').clazz;
      if (clazz === 'subProcess') {
        const containerGroup = node.getContainer();
        const subGroup = containerGroup.subGroup;
        const item = subGroup.findById(itemId);
        return subGroup.contain(item);
      } else {
        return false;
      }
    } else {
      return false;
    }
  });
  if(subProcess) {
    const group = subProcess.getContainer();
    return group.getItem(subProcess, itemId);
  }
  return null;
}
const  onItemCfgChange =(key,value)=>{
  console.log('onItemCfgChange',key,value)
  const items =  graphInstance.value.get('selectedItems');
  if(items && items.length > 0){
    let item =  graphInstance.value.findById(items[0]);
    if(!item){
      item = getNodeInSubProcess(items[0])
    }
    if( graphInstance.value.executeCommand) {
      graphInstance.value.executeCommand('update', {
        itemId: items[0],
        updateModel: {[key]: value}
      });
    }else {
      graphInstance.value.updateItem(item, {[key]: value});
    }
    state.selectedModel = {...item.getModel()};
  } else {
    const canvasModel = { ...state.processModel, [key]: value};
    state.selectedModel = canvasModel;
    state.processModel = canvasModel;
  }
}
</script>

<template>
 <div>
   <ToolbarPanel ref="toolbarRef"></ToolbarPanel>
   <div class="row">
     <div class="col col-4">
       <ItemPanel ref="addItemPanelRef"></ItemPanel>
     </div>
     <div class="col col-16">
       <div id="container" ref="canvasRef"/>
     </div>
     <div class="col col-4">
       <DetailPanel ref="detailPanelRef"
                    v-if="!props.isView"
                    :height="props.height"
                    :model="state.selectedModel"
                    :readOnly="props.mode !== 'edit'"
                    :users="props.users"
                    :groups="props.groups"
                    :categorys="props.categorys"
                    :signalDefs="state.processModel.signalDefs"
                    :messageDefs="state.processModel.messageDefs"
                    :onChange="(key,val)=>{onItemCfgChange(key,val)}" />
     </div>
   </div>
 </div>

</template>

<style scoped>
.row {
  display: flex;
  align-items: flex-start;
  width: 100%;
  height: 100%;
}
.col{
  height: 100%;
}
.col-4 {
  flex: 4;
}

.col-16 {
  flex: 16;
}

.col-4 {
  flex: 4;
}
.card{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding-top: 20px;
}
</style>
