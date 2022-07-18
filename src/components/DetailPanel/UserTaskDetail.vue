<template>
    <div :data-clazz="model.clazz">
        <div class="panelTitle">{{$t('userTask')}}</div>
        <div class="panelBody">
            <DefaultDetail :model="model" :onChange="onChange" :readOnly="readOnly" />
            <div class="panelRow">
                <div>{{$t('userTask.assignType')}}：</div>
                <el-select style="width:90%; font-size: 12px"
                           :placeholder="$t('userTask.assignType.placeholder')"
                           v-model="model.assignType"
                           :disabled="readOnly"
                           @change="(e) => { onChange('assignValue', []);onChange('assignType', e) }">
                    <el-option key="assignee" value="assignee" :label="$t('userTask.assignType.assignee')"/>
                    <el-option key="person" value="person" :label="$t('userTask.assignType.person')"/>
                    <el-option key="persongroup" value="persongroup" :label="$t('userTask.assignType.persongroup')"/>
                </el-select>
            </div>
            <div v-if="model.assignType === 'assignee'" class="panelRow">
                <div>{{$t('userTask.assignType.assignee.title')}}：</div>
                <el-select style="width:90%; font-size:12px"
                           :placeholder="$t('userTask.assignType.assignee.placeholder')"
                           :disabled="readOnly"
                           v-model="model.assignValue"
                           :multiple="true"
                           :multiple-limit="1"
                           allow-create
                           :filterable="true"
                           :filter-method="filterUsers"
                           @change="(e) => onChange('assignValue', e)">
                    <el-option v-for="user in usersCopy" :key="user.id" :label="user.name" :value="user.id" />
                </el-select>
            </div>
            <div v-if="model.assignType === 'person'" class="panelRow">
                <div>{{$t('userTask.assignType.person.title')}}：</div>
                <el-select style="width:90%; font-size:12px"
                           :placeholder="$t('userTask.assignType.person.placeholder')"
                           :disabled="readOnly"
                           v-model="model.assignValue"
                           :multiple="true"
                           allow-create
                           :filterable="true"
                           :filter-method="filterUsers"
                           @change="(e) => onChange('assignValue', e)">
                    <el-option v-for="user in usersCopy" :key="user.id" :label="user.name" :value="user.id" />
                </el-select>
            </div>
            <div v-else-if="model.assignType === 'persongroup'" class="panelRow">
                <div>{{$t('userTask.assignType.persongroup.title')}}：</div>
                <el-select style="width:90%; font-size:12px"
                           :placeholder="$t('userTask.assignType.persongroup.placeholder')"
                           v-model="model.assignValue"
                           :disabled="readOnly"
                           :multiple="true"
                           allow-create
                           :filterable="true"
                           :filter-method="filterGroups"
                           @change="(e) => onChange('assignValue', e)">
                    <el-option v-for="group in groupsCopy" :key="group.id" :label="group.name" :value="group.id" />
                </el-select>
            </div>
            <div class="panelRow">
                <div style="display:inline">{{$t('userTask.dueDate')}}：</div>
                <el-date-picker type="datetime"
                                style="width:90%; min-width:unset"
                                :placeholder="$t('userTask.dueDate.placeholder')"
                                :disabled="readOnly"
                                v-model="model.dueDate"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                @input="(value) => onChange('dueDate', value)" />
            </div>
            <div class="panelRow">
                <el-checkbox @change="(value) => onChange('isSequential', value)"
                             :disabled="readOnly"
                             v-model="model.isSequential">{{$t('userTask.counterSign')}}</el-checkbox>
            </div>
        </div>
    </div>
</template>
<script setup>
  import DefaultDetail from "./DefaultDetail.vue";
  import {reactive, toRefs} from "vue";
 const props =  defineProps( {
        model: {
          type:Object,
          default: ()=>({}),
        },
        users: {
          type: Array,
          default: ()=>([]),
        },
        groups: {
          type: Array,
          default: ()=>([]),
        },
        onChange: {
          type: Function,
          default: ()=>{}
        },
        readOnly:{
          type: Boolean,
          default: false,
        }
      })
  const state = reactive( {
    usersCopy: props.users,
    groupsCopy: props.groups,
  })
  const {usersCopy,groupsCopy} = toRefs(state)

  const filterUsers = (input)=> {
    if (input) {
      this.usersCopy = this.users.filter((item) => {
        if (!!~item.name.indexOf(input) || !!~item.name.toLowerCase().indexOf(input.toLowerCase())) {
          return true
        }
      })
    } else {
      this.usersCopy = this.users;
    }
  }
  const filterGroups = (input) =>{
    if (input) {
      this.groupsCopy = this.groups.filter((item) => {
        if (!!~item.name.indexOf(input) || !!~item.name.toLowerCase().indexOf(input.toLowerCase())) {
          return true
        }
      })
    } else {
      this.groupsCopy = this.groups;
    }
  }

</script>
