<template>
  <div>
    <el-dialog
      class="withdraw-dialog"
      :model-value="visible"
      :title="title"
      width="900px"
      @close="close"
    >
      <div class="card-box">
        <el-table
          class="table-box"
          v-loading="loading"
          :data="rowList"
          style="width: 100%"
        >
          <el-table-column width="200" label="Time">
            <template #default="{ row }">
              {{ transferUTCTime(row.latest_settlement_date) }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="150"
            prop="id"
            label="Order ID"
          >
          </el-table-column>

          <el-table-column
            width="300"
            prop="estimated"
            label="Estimated Income(DMC)"
            align="center"
          >
            <template #default="{ row }"
              ><span class="income"> {{ row.estimated }}</span>
            </template>
          </el-table-column>
          <el-table-column width="180" label="Action">
            <template #default="{ row }">
              <el-button
                class="collect-btn"
                :disabled="!+row.settlement_pledge_amount > 0"
                style="width: unset; height: unset; border-radius: 99px"
                type="primary"
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
          layout="total, prev, pager, next, jumper"
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
import { transferUTCTime } from "@/utils/util";
import { useStore } from "vuex";
import { dividend_list, claim_order } from "@/api/common.js";
const emits = defineEmits(["update:visible", "reload"]);
const store = useStore();
const loading = ref(false);
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
  loading.value = true;
  dividend_list({
    email: email.value,
    pageNo: pageNo.value,
    pageSize: 10,
  }).then((res) => {
    rowList.value = res.data.list;
    loading.value = false;
    total.value = res.data.count;
    console.log(res, "res");
  });
};
const collect = (row) => {
  loading.value = true;
  claim_order({
    email: email.value,
    chainId: chainId.value,
    orderId: row.id,
  })
    .then((res) => {
      if (res.code == 200) {
        proxy.$notify({
          customClass: "notify-success",
          message: "Collect successfully",
          position: "bottom-left",
        });
        emits("reload");
        emits("update:visible", false);

        // setTimeout(() => {
        //   dividendList();
        // }, 1000);
      } else {
        loading.value = false;
      }
    })
    .catch(() => {
      loading.value = false;
    });
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
  .collect-btn {
    &.is-disabled {
      color: unset;
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
