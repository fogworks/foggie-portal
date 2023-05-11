<template>
  <div>
    <el-dialog
      class="withdraw-dialog"
      :model-value="visible"
      :title="title"
      width="1000px"
      @close="close"
    >
      <div class="card-box">
        <el-table class="table-box" :data="rowList" style="width: 100%">
          <el-table-column width="200" label="Time">
            <template #default="{ row }">
              {{ transferTime(row.created_time) }}
            </template>
          </el-table-column>
          <el-table-column width="150" prop="id" label="Order ID">
          </el-table-column>
          <el-table-column width="200" label="Account" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row.user.id }}
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            prop="estimated"
            label="Estimated Income(DMC)"
          >
          </el-table-column>
          <el-table-column width="180" label="Action">
            <template #default="{ row }">
              <el-button
                class="collect-btn"
                :disabled="checkDisabled(row)"
                style="width: unset; height: unset; border-radius: 99px"
                type="primary"
                link
                @click="collect(row)"
                >Collect</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:current-page="pageNo"
          :background="false"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="total"
          @current-change="dividendList"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  toRefs,
  watch,
  computed,
  getCurrentInstance,
} from "vue";
import { transferTime } from "@/utils/util";
import { useStore } from "vuex";
import { dividend_list, claim_order } from "@/api/common.js";
import RippleInk from "@/components/rippleInk";
const emits = defineEmits(["update:visible"]);
const store = useStore();

const props = defineProps({
  title: {
    type: String,
    default: "Rewards",
  },
  visible: {
    type: Boolean,
    default: false,
  },
});
const { proxy } = getCurrentInstance();
const close = () => {
  emits("update:visible", false);
};
const { visible, title } = toRefs(props);
let rowList = ref([]);
const email = computed(() => store.getters["token/currentUser"]);
const chainId = computed(() => store.getters.ChainId);
const total = ref(0);
const pageNo = ref(1);
const dividendList = () => {
  dividend_list({
    email: email.value,
    pageNo: pageNo.value,
    pageSize: 10,
  }).then((res) => {
    rowList.value = res.data.list;
    total.value = res.data.count;
    console.log(res, "res");
  });
};
const collect = (row) => {
  claim_order({
    email: email.value,
    chainId: chainId.value,
    orderId: row.id,
  }).then((res) => {
    if (res.code == 200) {
      proxy.$notify({
        type: "success",
        message: "Collect successfully",
        position: "bottom-left",
      });
      dividendList();
    }
  });
};
const checkDisabled = (row) => {
  //false is extractable
  if (row.state == 1 && row.challenge.state == 1) {
    return false;
  }
  if (row.state == 1 && row.challenge.state == 6) {
    return false;
  }
  if (row.state == 4 && row.challenge.state == 7) {
    return false;
  }
  return true;
};
watch(
  email,
  (data) => {
    // initTaskList();
    dividendList();
  },
  {
    immediate: true,
    deep: true,
  }
);
// onMounted(initTaskList);
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
}
.justify-between {
  justify-content: space-between;
}
.items-center {
  align-items: center;
}
.collect-btn {
  font-size: 18px;
  font-weight: 400;
  &.is-disabled {
    color: #d8d8d8;
  }
}
.card-box {
  width: 100%;
  @include card-box;

  margin: 24px 0 100px 0;
  padding: 0;
  color: #000;
  box-shadow: none;
  border: none;

  .title {
    color: #000;
    font-size: 30px;
    font-weight: 700;
  }

  .title-img {
    width: 32px;
    margin-right: 12px;
    object-fit: contain;
  }
  .status-box {
    margin: 36px 0 64px 0;
  }
  .status {
    font-size: 24px;
    margin-right: 40px;
  }
  :deep {
    .el-pagination {
      float: right;
      button {
        background-color: transparent;
      }
      .el-pager {
        li {
          background-color: transparent;
        }
      }
    }
  }
}
</style>
<!-- <style lang="scss">
.withdraw-dialog {
  position: relative;
  backdrop-filter: blur(40px);
  background: rgba(255, 255, 255, 0.6);
  .table-box {
    min-height: 430px;
    margin-bottom: 40px;
    background: transparent;
    --el-table-tr-bg-color: transparent;
    tr {
      background: transparent;
    }

    .el-table__cell {
      background: transparent !important;
      border-bottom: 1px solid #e4e4e4 !important;
    }
    .el-table__inner-wrapper::before {
      z-index: 1;
      background-color: #e4e4e4;
    }
  }
  .link_txt {
    text-decoration: underline;
    cursor: pointer;
    &:hover {
      transform: scale(1.1);
    }
  }
}
</style> -->
