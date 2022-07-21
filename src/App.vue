<template>

  <div style="width: 1300px;height: 800px; margin: 40px auto">
    <X6Flow></X6Flow>
  </div>
</template>

<script setup>
import {reactive, toRefs} from "vue";
import X6Flow from "./components/X6Flow.vue";

const state = reactive({
  lang: "zh",
  // demoData: {
  //   nodes: [{ id: 'startNode1', x: 50, y: 200, label: '', clazz: 'start', },
  //     { id: 'startNode2', x: 50, y: 320, label: '', clazz: 'timerStart', },
  //     { id: 'taskNode1', x: 200, y: 200, label: '主任审批', clazz: 'userTask',  },
  //     { id: 'taskNode2', x: 400, y: 200, label: '经理审批', clazz: 'scriptTask',  },
  //     { id: 'gatewayNode', x: 400, y: 320, label: '金额大于1000', clazz: 'inclusiveGateway',  },
  //     { id: 'taskNode3', x: 400, y: 450, label: '董事长审批', clazz: 'receiveTask', },
  //     { id: 'catchNode1', x: 600, y: 200, label: '等待结束', clazz: 'signalCatch', },
  //     { id: 'endNode', x: 600, y: 320, label: '', clazz: 'end', }],
  //   edges: [{ source: 'startNode1', target: 'taskNode1', sourceAnchor:1, targetAnchor:3, clazz: 'flow' },
  //     { source: 'startNode2', target: 'gatewayNode', sourceAnchor:1, targetAnchor:3, clazz: 'flow' },
  //     { source: 'taskNode1', target: 'catchNode1', sourceAnchor:0, targetAnchor:0, clazz: 'flow' },
  //     { source: 'taskNode1', target: 'taskNode2', sourceAnchor:1, targetAnchor:3, clazz: 'flow' },
  //     { source: 'taskNode2', target: 'gatewayNode', sourceAnchor:1, targetAnchor:0, clazz: 'flow' },
  //     { source: 'taskNode2', target: 'taskNode1', sourceAnchor:2, targetAnchor:2, clazz: 'flow' },
  //     { source: 'gatewayNode', target: 'taskNode3', sourceAnchor:2, targetAnchor:0, clazz: 'flow' },
  //     { source: 'gatewayNode', target: 'endNode', sourceAnchor:1, targetAnchor:2, clazz: 'flow'},
  //     { source: 'taskNode3', target: 'endNode', sourceAnchor:1, targetAnchor:1, clazz: 'flow' },
  //     { source: 'catchNode1', target: 'endNode', sourceAnchor:1, targetAnchor:0, clazz: 'flow' }]
  // },
  candidateUsers: [{id:'1',name:'Tom'},{id:'2',name:'Steven'},{id:'3',name:'Andy'}],
  candidateGroups: [{id:'1',name:'Manager'},{id:'2',name:'Security'},{id:'3',name:'OA'}],
  categorys: [{id:'1',name:'Common'},{id:'2',name:'Subsidy'},{id:'3',name:'Maintain'}],
})
const {demoData,lang,candidateUsers,candidateGroups,categorys} = toRefs(state)
</script>


<style>
#app{
  width: 100%;
  height: 100vh;
}
#container {
  width: 100%;
  height: 100%;
  display: flex;
  border: 1px solid #dfe3e8;
}

#stencil {
  width: 180px;
  height: 100%;
  position: relative;
  border-right: 1px solid #dfe3e8;
}

#graph-container {
  width: calc(100% - 180px);
  height: 100%;
}

.x6-widget-stencil {
  background-color: #fff;
}

.x6-widget-stencil-title {
  background-color: #fff;
}

.x6-widget-stencil-group-title {
  background-color: #fff !important;
  display: none;
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
</style>
