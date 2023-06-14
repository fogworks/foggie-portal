<template>
  <div class="light-box">
    <div class="card-box">
      <div class="flex justify-between">
        <div
          class="flex items-center"
          style="width: 100%; justify-content: space-between"
        >
          <div class="flex items-center">
            <img class="title-img" src="@/assets/assets-title.png" alt="" />
            <span class="title">Assets</span>
          </div>

          <svg-icon
            v-if="!isJoin"
            class="join-pool"
            size="32"
            @click="PoolDialogVisible = true"
            icon-class="joinPool"
          ></svg-icon>
        </div>
        <!-- <a
          class="flex items-center records"
          @click.prevent="recordsVisible = true"
        >
          <div>Records</div>

          <img class="list-img" src="@/assets/assets-more-list.png" alt="" />
        </a> -->
      </div>
      <div class="today-grid" style="border: none; padding: 0">
        <div class="sub-title">
          Rewards
          <svg-icon
            class="detail"
            size="30"
            icon-class="Details"
            @click="assetsRewardsVisible = true"
          >
          </svg-icon>
        </div>
        <!-- <div class="sub-title last-week">Miner Records</div> -->
        <div></div>
      </div>
      <div class="today-grid">
        <div class="flex items-center">
          <div class="plus-icon">+</div>
          <div class="plus-num-today">
            <el-tooltip
              class="plus-num-tips"
              effect="dark"
              content="Total Reward"
              placement="top"
              :append-to-body="false"
            >
              {{ totalNum }}
            </el-tooltip>
            /
          </div>
          <div class="dmc">DMC</div>
        </div>
        <div
          class="flex items-center"
          style="cursor: pointer; justify-content: flex-end"
        >
          <div @click="minerRecordsVisible = true">Miner Records &nbsp;></div>
          <!-- <div class="plus-icon">+</div> -->

          <!-- {{  lastweekCount }} -->
          <!-- <div class="dmc">DMC</div> -->
        </div>
        <!-- <div class="flex today-right">
          <div @click="rewardsVisible = true">Earn More &nbsp;></div>
        </div> -->
      </div>
      <div class="sub-title">Expiration time</div>
      <div class="today-grid Balance-grid">
        <template v-if="!deviceData.device_type">
          <div class="flex items-center">
            <div class="plus-num">{{ handleTimeStamp(deviceData.expire) }}</div>
          </div>

          <!-- <div class="flex today-right">
            <div class="color-box">
              <el-button @click="rechargeOrder">
                <RippleInk></RippleInk>
                Renew</el-button
              >
            </div>
          </div> -->
        </template>
        <template v-else>
          <div class="flex items-center">
            <div class="plus-num">
              {{ getfilesize(deviceData.used_space) || 0 }}/{{
                getfilesize(deviceData.total_space) || 0
              }}
            </div>
          </div>
        </template>
      </div>

      <MinerRecords
        v-if="minerRecordsVisible"
        v-model:isJoin="isJoin"
        v-model:visible="minerRecordsVisible"
      >
      </MinerRecords>
      <AssetsRewards
        v-if="assetsRewardsVisible"
        v-model:visible="assetsRewardsVisible"
      >
      </AssetsRewards>
      <ReNew ref="reNewRef"></ReNew>
      <AddPoolDialog
        v-if="PoolDialogVisible"
        v-model:visible="PoolDialogVisible"
        :expire="deviceData.expire"
      ></AddPoolDialog>
    </div>
  </div>
</template>

<script>
import {
  ref,
  reactive,
  onMounted,
  watchEffect,
  toRefs,
  inject,
  nextTick,
} from "vue";
import ReNew from "./reNew";
import AddPoolDialog from "./addPoolDialog";
import MinerRecords from "./minerRecords";
import BigNumber from "bignumber.js";
import AssetsRewards from "./assetsRewards";
import { handleTimeStamp, getfilesize } from "@/utils/util";
import {
  user,
  ydaReward,
  dmcSwap,
  OwnerBills,
  get_miner_reward,
  check_join_mp,
} from "@/utils/api.js";
import RippleInk from "@/components/rippleInk";
export default {
  components: {
    RippleInk,
    ReNew,
    AddPoolDialog,
    MinerRecords,
    AssetsRewards,
  },
  props: {
    currentOODItem: {
      type: Object,
      default: false,
    },
  },
  setup(props, { emit }) {
    const deviceData = inject("deviceData");
    const { currentOODItem } = toRefs(props);
    const totalNum = ref(0);
    // const visible = ref(false);
    const PoolDialogVisible = ref(false);
    const minerRecordsVisible = ref(false);
    const assetsRewardsVisible = ref(false);
    const isJoin = ref(false);
    const reNewRef = ref(null);

    const rechargeOrder = () => {
      reNewRef.value.rechargeOrder();
    };
    // const estimateDMC = ref(0);
    const adminCategoriesListInit = async () => {
      // initYesterdayScore();
      // initBills();
      checkJoinMp();
      getMinerReward();
    };
    const checkJoinMp = () => {
      check_join_mp(deviceData).then((res) => {
        isJoin.value = res?.result?.join_miner_pool;
      });
    };
    const getMinerReward = () => {
      get_miner_reward({
        peer_id: deviceData.peer_id,
      }).then((res) => {
        totalNum.value = res.result.reward_total;
      });
    };

    const reload = () => {
      setTimeout(() => {
        adminCategoriesListInit();
      }, 3000);
    };
    watch(PoolDialogVisible, (val) => {
      if (!val) {
        nextTick(() => {
          checkJoinMp();
        });
      }
    });
    onMounted(adminCategoriesListInit);
    return {
      totalNum,
      isJoin,
      // visible,
      currentOODItem,
      deviceData,
      reNewRef,
      PoolDialogVisible,
      minerRecordsVisible,
      assetsRewardsVisible,
      adminCategoriesListInit,
      reload,
      handleTimeStamp,
      rechargeOrder,
    };
  },
};
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
.light-box {
  position: relative;
  flex: 1;
  height: 350px;
  padding: 0;
  // .vip-card();
  overflow: hidden;
  min-width: 500px;
  @include vip-card;
  &::before {
    content: "";
    position: absolute;
    z-index: 1;
    left: -20%;
    width: 70%;
    height: 100%;
    transform: skewX(-35deg);
    background: linear-gradient(
      200deg,
      rgba(244, 244, 244, 0.15) 0%,
      rgba(244, 244, 244, 0) 50%
    );
  }
}
.card-box {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 350px;
  color: #fff !important;

  z-index: 2;
  // .card-box();
  box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 20%),
    rgb(0 0 0 / 10%) 0px 0px 0px 0.5px inset;
  @include card-box;
  .join-pool {
    cursor: pointer;
    &:hover {
      color: $light_blue;
    }
  }
  .detail {
    color: #fff;
    cursor: pointer;
    &:hover {
      color: $light_blue;
    }
  }
  .records {
    cursor: pointer;
  }

  .title {
    font-size: 30px;
  }

  .title-img {
    width: 32px;
    margin-right: 10px;
    object-fit: contain;
  }
  .list-img {
    width: 16px;
    margin-left: 4px;
    object-fit: contain;
  }
  .sub-title {
    margin-top: 20px;
    margin-bottom: 8px;
    font-size: 24px;
    text-align: left;
  }
  .last-week {
    text-align: center;
  }
  .today-grid {
    display: grid;
    align-items: center;
    grid-template-columns: 3fr 2fr;
    padding-bottom: 15px;
    border-bottom: 1px solid #fff3;

    .PST {
      justify-content: center;
      cursor: pointer;
    }
    .plus-icon {
      margin-right: 8px;
      font-size: 24px;
    }
    .plus-num {
      margin-right: 8px;
      font-size: 20px;
      letter-spacing: 2px;
      font-family: Farrington7B !important;
    }
    .plus-num-today .el-only-child__content {
      margin: 0 4px;
      font-size: 14px;
      letter-spacing: 2px;
      font-family: Farrington7B !important;
    }
    .dmc {
      margin-left: 2px;
      font-size: 16px;
    }
    .nft {
      text-decoration: underline;
    }
    .today-right {
      justify-content: flex-end;
      cursor: pointer;
      .color-box {
        // .color-box();
        @include color-box;

        .ripple-ink {
          border-radius: 45px;
        }
      }
      .el-button {
        position: relative;
        width: 135px;
        color: #fff;
        border: none;
        border-radius: 45px;
        box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 20%);
        background: var(--btn-gradient);
      }
    }
  }
  .Balance-grid {
    grid-template-columns: 450px 1fr;

    border-bottom: none;
  }
}
</style>
<style lang="scss">
.plus-num-today {
  // margin: 0 4px;
  // letter-spacing: 2px;
  // font-family: Farrington7B !important;
  > span {
    margin: 0;
    font-size: 14px;
    letter-spacing: 1px;
    font-family: Farrington7B !important;
  }
}
</style>
