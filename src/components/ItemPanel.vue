<template>
  <div class="itemPanel" :style="{'height': props.height+'px'}">
    <div class="title">常规节点</div>
    <div class="el-collapse">
      <div class="el-collapse-item">
        <img data-item="{clazz:'start',size:'30*30',label:''}"
             :src="getUrl('../assets/flow/start.svg')" style="width:42px;height:42px"/>
        <div>{{ $t('startEvent') }}</div>
      </div>
      <div class="el-collapse-item">
        <img data-item="{clazz:'end',size:'30*30',label:''}"
             :src="getUrl('../assets/flow/end.svg')" style="width:42px;height:42px"/>
        <div>{{ $t('endEvent') }}</div>
      </div>
      <div class="el-collapse-item">
        <img :data-item="userTaskData"
             :src="getUrl('../assets/flow/user-task.svg')" style="width:80px;height:44px"/>
        <div>{{ $t('userTask') }}</div>
      </div>
      <div class="el-collapse-item">
        <img :data-item="receiveTaskData"
             :src="getUrl('../assets/flow/receive-task.svg')" style="width:80px;height:44px"/>
        <div>{{ $t('receiveTask') }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {reactive, toRefs} from "vue";
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
const props = defineProps({
  height: {
    type: Number,
    default: 800,
  },
})
const getUrl = (name) => {
  return new URL(`../assets/${name}`, import.meta.url).href
}
const state = reactive({
  activeNames: [],
  userTaskData: "{clazz:'userTask',size:'80*44',label:'" + t('userTask') + "'}",
  receiveTaskData: "{clazz:'receiveTask',size:'80*44',label:'" + t('receiveTask') + "'}",
})
const {userTaskData, receiveTaskData} = toRefs(state)
</script>

<style lang="less" scoped>
.itemPanel {
  float: left;
  width: 100%;
  background: #f0f2f5;
  overflow-y: auto;
  border-left: 1px solid #E9E9E9;
  border-bottom: 1px solid #E9E9E9;

  .title {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  img {
    width: 92px;
    height: 96px;
    padding: 4px;
    border: 1px solid rgba(0, 0, 0, 0);
    border-radius: 2px;
  }

  .el-collapse {
    width: 100%;
    border: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .el-collapse-item {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      &:active {
        background-color: #ffffff;
      }
    }
  }

}
</style>
