<template>
  <div
    :class="
      orderList.length === 0 ? 'order-boxs-no-order order_boxs' : 'order_boxs'
    "
  >
    <!-- <bg></bg> -->
    <!-- <top-head :activeName="activeName" :isNoAccount="isNoAccount"></top-head> -->
    <div
      :class="language_key === 'zh-CN' ? 'order_box order-box-cn' : 'order_box'"
    >
      <div class="no-order" v-if="orderList.length === 0 && getOrderData">
        <img src="@/assets/order/no_order.svg" alt="no-order" />
        <div class="no-order-p">
          <p class="p1"></p>
          <p class="p2">{{ $t("index.no_order") }}</p>
          <p class="p1"></p>
        </div>
      </div>
      <!-- <div class="box-title" v-if="orderList.length > 0">
        <label :class="`title-label title-cls-${userOrderCounts.length}`">
          <p
            class="check-p"
            v-for="(item, index) in userOrderCounts"
            :key="index"
            :type="item.type"
            @click="handleStatus(item.name, index)"
            :class="[
              currentState + '_count' === item.name ? 'mytag_active' : '',
              'count-div',
            ]"
          >
            <span type="primary" v-if="item.name === 'user_order_count'"
              >{{ $t("index.user_order_count")
              }}<font>{{ item.value }}</font></span
            >
            <span type="primary" v-if="item.name === 'activated_count'"
              >{{ $t("index.activated") }}<font>{{ item.value }}</font></span
            >
            <span type="primary" v-if="item.name === 'activation_vps_count'"
              >{{ $t("index.activated1") }}<font>{{ item.value }}</font></span
            >
            <span type="primary" v-if="item.name === 'starting_count'"
              >{{ $t("index.starting") }}<font>{{ item.value }}</font></span
            >
            <span type="primary" v-if="item.name === 'expiring_order_count'"
              >{{ $t("index.expired") }}<font>{{ item.value }}</font></span
            >
          </p>
          <span
            class="white-span"
            :style="[{ left: `calc(${white_span_left}px)` }]"
          >
          </span>
        </label>
        <el-input
          v-if="orderList.length > 0"
          :placeholder="$t('index.inputOrderID')"
          v-model="currentOrderId"
          class="searchInput"
          @change="doSearchOrder"
        >
        </el-input>
      </div> -->
      <div class="order_title" style="display: none">
        <div class="all-count-des">
          <span class="all-count-name" v-if="userOrderCounts.length > 0"
            >{{ $t("index." + currentState + "_count") }}
          </span>
          <span
            v-for="(item, index) in userOrderCounts"
            :key="index"
            :class="[
              currentState + '_count' === item.name
                ? 'all-count-value-show'
                : 'all-count-value',
            ]"
            >: {{ item.value }}
          </span>
        </div>
        <div class="all_count" v-show="userOrderCounts.length > 1">
          <div></div>
          <div
            v-for="(item, index) in userOrderCounts"
            :key="index"
            :type="item.type"
            @click="handleStatus(item.name)"
            :class="[
              currentState + '_count' === item.name ? 'mytag_active' : '',
              'count-div',
            ]"
          >
            <!-- <el-button type="primary"
                       v-if="item.name === 'user_order_count'">List All</el-button> -->
            <el-button type="primary" v-if="item.name === 'user_order_count'">{{
              $t("index.user_order_count")
            }}</el-button>
            <el-button type="primary" v-if="item.name === 'activated_count'">{{
              $t("index.activated")
            }}</el-button>
            <el-button
              type="primary"
              v-if="item.name === 'activation_vps_count'"
              >{{ $t("index.activated1") }}</el-button
            >
            <el-button type="primary" v-if="item.name === 'starting_count'">{{
              $t("index.starting")
            }}</el-button>
            <el-button
              type="primary"
              v-if="item.name === 'expiring_order_count'"
              >{{ $t("index.expired") }}</el-button
            >
            <!-- <div>
              <img v-if="item.name === 'user_order_count'"
                   :alt="item.value"
                   src="@/assets/order/all.svg" />
              <img v-if="item.name === 'activated_count'"
                   :alt="item.value"
                   src="@/assets/order/provisioned.svg" />
              <img v-if="item.name === 'activation_vps_count'"
                   :alt="item.value"
                   src="@/assets/order/acticated.svg" />
              <img v-if="item.name === 'starting_count'"
                   :alt="item.value"
                   src="@/assets/order/start.svg" />
              <img v-if="item.name === 'expiring_order_count'"
                   :alt="item.value"
                   src="@/assets/order/expired.svg" />
            </div> -->
          </div>

          <!-- <el-tag v-for="(item, index) in userOrderCounts"
                  :key="index"
                  :type="item.type"
                  @click="handleStatus(item.name)"
                  :class="[
              currentState + '_count' === item.name ? 'mytag_active' : '',
            ]">
            <span class="all_count_name">{{ $t("index." + item.name) }} </span>
            <span class="all_count_value"
                  v-if="item.name !== 'user_order_count'">: {{ item.value }}
            </span>
          </el-tag> -->
        </div>
        <el-input
          :placeholder="$t('index.inputOrderID')"
          v-model="currentOrderId"
          class="searchInput"
          @change="doSearchOrder"
        >
        </el-input>
      </div>
      <div v-for="(info, i) in orderList" :key="i">
        <p class="order-created-p">{{ info.created_at }}</p>
        <div class="order-item">
          <div
            :class="{
              'item-left': true,
              'item-left-bg1': randomClass(i, 1),
              'item-left-bg2': randomClass(i, 2),
              'item-left-bg3': randomClass(i, 3),
            }"
          >
            <div class="item-left-div">
              <div class="item-left-img">
                <div v-if="i % 3 === 0">
                  <img class="item-left-bg" src="@/assets/order/pic1.png" />
                </div>
                <div v-if="i % 3 === 1">
                  <img class="item-left-bg" src="@/assets/order/pic2.png" />
                </div>
                <div v-if="i % 3 === 2">
                  <img class="item-left-bg" src="@/assets/order/pic3.png" />
                </div>
                <div class="flag flag-left" v-if="info.sellType === 'free'">
                  FREE
                </div>
                <!-- <img v-if="info.sellType === 'free'"
                     class="item-left-free"
                     src="@/assets/order/free.svg" /> -->
              </div>
            </div>
            <div class="item-vood-id">
              <p>Foggie ID</p>
              <p class="item-vood-id-name">{{ info.vood_id }}</p>
              <img
                src="@/assets/order/copy.svg"
                class="ood-copy"
                v-if="info.vood_id !== '-'"
                @click="copyID(info.vood_id, 'vood')"
                alt="copy"
              />

              <img
                src="@/assets/order/ood_link.png"
                class="ood-link"
                v-if="info.vood_id !== '-' && oodLinkShow"
                @click="oodLink(info.vood_id)"
                alt="link"
              />
            </div>
            <div class="item-left-content"></div>
          </div>
          <div class="item-right">
            <div class="item-right-div">
              <div class="item-right-box1">
                <p class="p1">{{ $t("index.orderId") }}</p>
                <p @dblclick="copyID(info.order_sn, 'order')">
                  {{ info.order_sn }}
                </p>
                <p class="p3">{{ $t("index.wan_ip") }}</p>
                <p>{{ info.vood_ip }}</p>
              </div>
              <div class="item-right-box2">
                <p v-if="info.isExprire" class="box2-exprire-title">
                  <!-- {{ $t("index.box2_exprire") }} -->
                  {{ $t("order.expire_remove_info1") }}
                </p>
                <!-- <p v-if="info.isExprire" class="box2-exprire-date">
                  {{ $t("index.box2_exprire_date") }}{{ info.dueDate }}
                </p> -->
                <p
                  class="expire_remove_tips"
                  v-if="
                    info.expire_remove &&
                    info.expire_remove.isExpire &&
                    info.expire_remove.time > 0
                  "
                >
                  {{
                    $t("order.expire_remove_info2", {
                      day: info.expire_remove.expire_remove_d,
                      hour: info.expire_remove.expire_remove_h,
                      minute: info.expire_remove.expire_remove_m,
                      second: info.expire_remove.expire_remove_s,
                    })
                  }}
                </p>
                <p
                  v-if="!info.isExprire && info.device_status"
                  class="item-right-box2-title"
                >
                  {{ $t("index.expiry_left") }}
                </p>
                <div
                  v-if="!info.isExprire && info.device_status"
                  :id="info.order_sn"
                >
                  <div class="day clock">
                    <div class="test-aaa">
                      <div class="test-bbb">
                        <div class="clock-main">
                          <div class="display days"></div>
                          <div class="front left"></div>
                          <div
                            class="rotate left dayRotateLeft"
                            style="display: block; transform: rotate(180deg)"
                          >
                            <div class="bg left"></div>
                          </div>
                          <div
                            class="rotate right dayRotateRight"
                            style="display: block; transform: rotate(75deg)"
                          >
                            <div class="bg right"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="clock-unit">{{ $t("index.clock_day") }}</div>
                  </div>
                  <div class="hour clock">
                    <div class="test-aaa">
                      <div class="test-bbb">
                        <div class="clock-main">
                          <div class="display hours"></div>
                          <div class="front left"></div>
                          <div
                            class="rotate left hourRotateLeft"
                            style="display: block; transform: rotate(180deg)"
                          >
                            <div class="bg left"></div>
                          </div>
                          <div
                            class="rotate right hourRotateRight"
                            style="display: block; transform: rotate(75deg)"
                          >
                            <div class="bg right"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="clock-unit">{{ $t("index.clock_hour") }}</div>
                  </div>
                  <div class="minute clock">
                    <div class="test-aaa">
                      <div class="test-bbb">
                        <div class="clock-main">
                          <div class="display minuts"></div>
                          <div class="front left"></div>
                          <div
                            class="rotate left minuteRotateLeft"
                            style="display: block; transform: rotate(180deg)"
                          >
                            <div class="bg left"></div>
                          </div>
                          <div
                            class="rotate right minuteRotateRight"
                            style="display: block; transform: rotate(30deg)"
                          >
                            <div class="bg right"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="clock-unit">{{ $t("index.clock_minute") }}</div>
                  </div>
                  <div class="sceond clock">
                    <div class="test-aaa">
                      <div class="test-bbb">
                        <div class="clock-main">
                          <div class="display seconds"></div>
                          <div class="front left"></div>
                          <div
                            class="rotate left sceondRotateLeft"
                            style="display: block; transform: rotate(180deg)"
                          >
                            <div class="bg left"></div>
                          </div>
                          <div
                            class="rotate right sceondRotateRight"
                            style="display: block; transform: rotate(144deg)"
                          >
                            <div class="bg right"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="clock-unit">{{ $t("index.clock_second") }}</div>
                  </div>
                </div>
              </div>
              <div class="item-right-box3">
                <div class="item-right-status">
                  <p class="item-right-status-title">
                    {{ $t("index.voodStatus") }}
                  </p>
                  <div
                    class="item-right-status-div status-vood-initializing"
                    v-if="info.deploy_state === 'initializing'"
                  >
                    <span class="span-initializing"
                      >{{ $t("vood.initializing") }}...</span
                    >
                  </div>
                  <div
                    class="item-right-status-div status-vood-on"
                    v-else-if="info.vood_status_activated"
                  >
                    <span class="span-on">{{
                      $t("index.vood_activated")
                    }}</span>
                    <img
                      src="@/assets/order/status_vood_on.svg"
                      alt="activated"
                    />
                  </div>
                  <div class="item-right-status-div status-vood-off" v-else>
                    <span class="span-off">{{
                      $t("index.vood_inactivated")
                    }}</span>
                    <img
                      src="@/assets/order/status_vood_off.svg"
                      alt="inactivated"
                    />
                  </div>
                  <!-- <el-switch style="display: block"
                             v-if="info.vood_status_activated"
                             v-model="info.vood_status_activated"
                             disabled
                             active-color="#ff9b27"
                             inactive-color="#bbb"
                             active-text=""
                             :inactive-text="$t('index.vood_activated')">
                  </el-switch>
                  <el-switch style="display: block"
                             v-if="!info.vood_status_activated"
                             v-model="info.vood_status_activated"
                             disabled
                             active-color="#ff9b27"
                             inactive-color="#bbb"
                             active-text=""
                             :inactive-text="$t('index.vood_inactivated')">
                  </el-switch> -->
                </div>
                <div class="item-right-status">
                  <p class="item-right-status-title">
                    {{ $t("index.device_status") }}
                  </p>
                  <div
                    class="item-right-status-div status-device-on"
                    v-if="info.device_status"
                  >
                    <span class="span-on">{{ $t("index.device_online") }}</span>
                    <img
                      src="@/assets/order/status_device_on.svg"
                      alt="online"
                    />
                  </div>
                  <div class="item-right-status-div status-device-off" v-else>
                    <span class="span-off">{{
                      $t("index.device_offline")
                    }}</span>
                    <img
                      src="@/assets/order/status_device_off.svg"
                      alt="offline"
                    />
                  </div>

                  <!-- <el-switch style="display: block"
                             v-if="info.device_status"
                             v-model="info.device_status"
                             disabled
                             active-color="#ff9b27"
                             inactive-color="#bbb"
                             active-text=""
                             :inactive-text="$t('index.device_online')">
                  </el-switch>
                  <el-switch style="display: block"
                             v-if="!info.device_status"
                             v-model="info.device_status"
                             disabled
                             active-color="#ff9b27"
                             inactive-color="#bbb"
                             active-text=""
                             :inactive-text="$t('index.device_offline')">
                  </el-switch> -->
                </div>
                <div class="item-right-status">
                  <p class="item-right-status-title">
                    {{ $t("index.order_status") }}
                  </p>
                  <p
                    v-if="
                      info.main_state === 'starting' ||
                      info.main_state === 'activated' ||
                      info.main_state === 'paid'
                    "
                    class="order_status_cls order_status_cls1"
                  >
                    {{ $t(`index.${info.main_state}`) }}
                  </p>
                  <p
                    v-else-if="
                      info.main_state === 'pending_payment' ||
                      info.main_state === 'pending_start' ||
                      info.main_state === 'paying' ||
                      info.main_state === 'resetting'
                    "
                    class="order_status_cls order_status_cls2"
                  >
                    {{ $t(`index.${info.main_state}`) }}
                  </p>
                  <p
                    v-else-if="
                      info.main_state === 'cancelled' ||
                      info.main_state === 'fault' ||
                      info.main_state === 'abnormal' ||
                      info.main_state === 'paid_failed' ||
                      info.main_state === 'reset_failed'
                    "
                    class="order_status_cls order_status_cls3"
                  >
                    {{ $t(`index.${info.main_state}`) }}
                  </p>
                </div>
                <div
                  class="mem-status"
                  v-if="info.monitorData.mempercentage > 0"
                >
                  <el-progress
                    :text-inside="true"
                    :percentage="info.monitorData.mempercentage"
                    :stroke-width="14"
                  ></el-progress>
                  <span class="mem-status-span"
                    >{{ info.monitorData.user_disk }} /
                    {{ info.monitorData.total_disk }}</span
                  >
                </div>
                <starting-box
                  v-if="
                    info.main_state === 'starting' ||
                    info.deploy_state === 'initializing'
                  "
                ></starting-box>
              </div>
              <div class="item-right-box4">
                <!-- <button
                  :class="
                    info.active_click
                      ? 'subscribe-div-btn'
                      : 'subscribe-div-btn active-click-no'
                  "
                  @click="handleOpt('', info, 'Activation')"
                  v-if="
                    info.state === 'activated' &&
                    !info.vood_status_activated &&
                    info.deploy_state === 'pending_init' &&
                    !info.device_id
                  "
                >
                  <div class="subscribe-icon">
                    <div class="free_icon">
                      <img src="@/assets/order/activate.png" alt="Activation" />
                    </div>
                  </div>
                  <div class="subscribe-btn">
                    <p>{{ $t("index.activationBtn") }}</p>
                  </div>
                </button> -->

                <button
                  class="subscribe-div-btn"
                  @click="handleOpt('', info, 'pay')"
                  v-if="
                    info.state === 'paid_failed' ||
                    (info.state === 'paying' && info.is_wallet) ||
                    info.state === 'pending_payment' ||
                    (info.state === 'activated' &&
                      (info.transaction_state === 'pending_payment' ||
                        (info.transaction_state === 'paying' &&
                          info.is_wallet)))
                  "
                >
                  <div class="subscribe-icon">
                    <div class="free_icon">
                      <img src="@/assets/order/buy.png" alt="Pay" />
                    </div>
                  </div>
                  <div
                    class="subscribe-btn continue-to-pay"
                    v-if="
                      (info.state === 'activated' || info.state === 'paying') &&
                      info.transaction_state === 'paying'
                    "
                  >
                    {{ $t("index.continue_to_pay") }}
                  </div>
                  <div class="subscribe-btn" v-else>
                    <p>{{ $t("index.payBtn") }}</p>
                  </div>

                  <!-- <balloon-box
                    v-if="(info.state === 'activated' || info.state === 'paying') 
                      && info.transaction_state === 'paying'"
                  ></balloon-box> -->
                  <!-- <div class="msg-payment">
                    <i class="el-icon-chat-round"></i>
                    <span></span>
                  </div> -->
                </button>

                <button
                  class="subscribe-div-btn"
                  v-else-if="
                    info.transaction_state === 'paying' && !info.is_wallet
                  "
                >
                  <div class="subscribe-icon">
                    <div class="free_icon">
                      <img src="@/assets/order/buy.png" alt="Recharge" />
                    </div>
                  </div>
                  <div class="subscribe-btn">
                    <p>{{ $t("index.paying") }}</p>
                  </div>
                </button>

                <button
                  class="subscribe-div-btn"
                  @click="handleOpt('', info, 'recharge')"
                  v-else-if="
                    info.state !== 'paying' &&
                    info.state !== 'cancelled' &&
                    info.state !== 'pending_payment'
                  "
                >
                  <div class="subscribe-icon">
                    <div class="free_icon">
                      <img src="@/assets/order/buy.png" alt="Recharge" />
                    </div>
                  </div>
                  <div class="subscribe-btn">
                    <p>{{ $t("index.order_recharge") }}</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div
            class="item-btns-detail"
            v-if="
              (!info.isExprire && info.state === 'pending_payment') ||
              info.transaction_state === 'pending_payment' ||
              info.state === 'cancelled'
            "
            @click="handleOpt('', info, 'detail')"
          >
            <!-- <i class="el-icon-more"></i> -->
            <svg-icon icon-class="more" size="25"></svg-icon>
          </div>
        </div>
      </div>
      <el-pagination
        v-if="total > 10 && orderList.length > 0"
        background
        layout="total,sizes,prev, pager, next"
        :total="total"
        :page-size="currentPageSize"
        :page-sizes="[10, 20, 50, 100]"
        :current-page="currentPage"
        @current-change="changeTable"
        @size-change="handleSizeChange"
        class="order_page"
      >
      </el-pagination>
    </div>

    <el-dialog
      :title="$t('index.bindWallet')"
      v-model="bindWalletVisible"
      width="500px"
      :before-close="handleBindWalletClose"
      :close-on-click-modal="false"
      :show-close="lock_num === 0"
      class="bind-wallet-dialog"
    >
      <div class="bind-wallet-dialog-box">
        <i
          class="el-icon-warning"
          style="color: #e6a23c; margin: 0 20px; font-size: 24px"
        ></i>
        <div class="bind-wallet-dialog-content">
          {{ $t("index.bind_wallet_dialog_content") }}
          <p class="bind-account-click-timer" v-if="lock_num > 0">
            {{ $t("index.lock_info") }}&nbsp;{{ lock_num }}&nbsp;{{
              $t("index.seconds")
            }}
          </p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          round
          @click="createInsideAccount"
          v-if="!isInsideBindClick"
          >{{ $t("index.on_site_account_btn") }}</el-button
        >
        <el-button round class="bind-account-click" v-if="isInsideBindClick">{{
          $t("vood.bindingAccount")
        }}</el-button>
        <el-button
          type="primary"
          @click="createOutsideAccount"
          v-if="!isOutsideBindClick"
          >{{ $t("index.off_site_account_btn") }}</el-button
        >
        <el-button
          type="primary"
          class="bind-account-click"
          v-if="isOutsideBindClick"
          >{{ $t("vood.bindingAccount") }}</el-button
        >
        <!-- <el-button type="primary" @click="handleBindWalletClose">Close</el-button> -->
      </span>
    </el-dialog>

    <el-dialog
      :title="$t('index.orderDialog')"
      v-model="payVisible"
      class="p_box"
    >
      <!-- SubOrder -->
      <div v-if="payItems && payItems.order_sn" class="order_item_box">
        <div class="order_item">
          <div class="order_key">{{ $t("index.orderPrice") }}</div>
          <!-- <div class="order_value" v-if="(payItems.sellType === 'monthly')">
            {{ activeProduct.unit === "dollar" ? "$" : "￥"
            }}{{ activeProduct.last_monthly }} (Foggie NFT + 1 month Foggie rent fee)
          </div>
          <div class="order_value" v-if="payItems.sellType === 'annually'">
            {{ activeProduct.unit === "dollar" ? "$" : "￥"
            }}{{ activeProduct.last_annually }} (Foggie NFT + 1 year Foggie rent fee)
          </div> -->
          <div class="order_value" v-if="payItems.sellType === 'monthly'">
            {{ activeProduct.unit === "dollar" ? "$" : "￥"
            }}{{ activeProduct.last_monthly }}
          </div>
          <div class="order_value" v-if="payItems.sellType === 'semiannual'">
            {{ activeProduct.unit === "dollar" ? "$" : "￥"
            }}{{ activeProduct.last_semiannual }}
          </div>
          <div class="order_value" v-if="payItems.sellType === 'annually'">
            {{ activeProduct.unit === "dollar" ? "$" : "￥"
            }}{{ activeProduct.last_annually }}
          </div>
        </div>

        <div class="order_item">
          <div class="order_key">{{ $t("index.orderId") }}:</div>
          <div class="order_value">{{ payItems.order_sn }}</div>
        </div>
        <div class="p_line"></div>
      </div>

      <div class="p_buy">
        <el-radio-group v-model="payModel" size="large">
          <el-radio label="card" class="squartCard squartCard-pay">
            <img src="@/assets/card0.png" />
          </el-radio>
          <el-radio label="blockchain" class="squartCard squartCard-pay">
            {{ $t("index.digital_currency") }}
          </el-radio>
        </el-radio-group>
        <el-radio-group
          v-model="payBlockChainModel"
          v-if="payModel === 'blockchain'"
          class="blockchain-radio"
          size="large"
        >
          <!-- <el-tooltip class="item" effect="dark" content="0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" placement="top-start">
            <el-radio label="usdc"
              class="squartCard">
              <img src="@/assets/order/icon-eth-usdc.webp" />
              USDC (ETH)
            </el-radio>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="0xdAC17F958D2ee523a2206206994597C13D831ec7" placement="top-start">
            <el-radio label="usdt"
              class="squartCard">
              <img src="@/assets/order/icon-eth-usdt.webp" />
              USDT (ETH)
            </el-radio>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56" placement="bottom-start">
            <el-radio label="busd"
                    class="squartCard">
                    <img src="@/assets/order/icon-bsc-busd.webp" />
              BUSD (BSC)
            </el-radio>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="0x55d398326f99059fF775485246999027B3197955" placement="bottom-start">
            <el-radio label="bsc_usd"
                    class="squartCard">
                    <img src="@/assets/order/icon-bsc-usdt.webp" />
              USDT (BSC)
            </el-radio>
          </el-tooltip> -->
          <el-radio label="usdc" class="squartCard">
            <img src="@/assets/order/icon-eth-usdc.webp" />
            USDC (ETH)
          </el-radio>
          <el-radio label="usdt" class="squartCard">
            <img src="@/assets/order/icon-eth-usdt.webp" />
            USDT (ETH)
          </el-radio>
          <el-radio label="busd" class="squartCard">
            <img src="@/assets/order/icon-bsc-busd.webp" />
            BUSD (BSC)
          </el-radio>
          <el-radio label="bsc_usd" class="squartCard">
            <img src="@/assets/order/icon-bsc-usdt.webp" />
            USDT (BSC)
          </el-radio>
          <!-- <el-tooltip class="item" effect="dark" content="xxxx" placement="top-start">
            <el-radio label="vofo"
              class="squartCard">
              VOFO   
            </el-radio>
          </el-tooltip> -->
        </el-radio-group>
      </div>
      <el-switch
        class="coupon-pay-switch"
        v-model="is_use_coupon_pay"
        :active-text="$t('order.use_coupon_pay')"
      >
      </el-switch>
      <el-input
        class="coupon-number-input"
        v-if="is_use_coupon_pay"
        v-model="coupon_number_pay"
        @change="payCouponChange"
        :placeholder="$t('order.coupon_placeholder')"
      >
        ></el-input
      >
      <p
        class="coupon-number-error"
        v-if="is_use_coupon_pay && is_coupon_error_pay"
      >
        {{ $t("order.coupon_error") }}
      </p>
      <!-- <div class="p_buy_blockchain" v-if="payModel === 'blockchain'">
        <p>1 USDC(ETH) = {{usdcRate}} USD &nbsp; 1 USDT(ETH) = {{usdtRate}} USD &nbsp; 1 BUSD(BSC) = {{busdRate}} USD &nbsp; 1 USDT(BSC) = {{bsc_usdRate}} USD</p>
      </div> -->
      <!-- <div class="p_buy_address" v-if="payModel === 'blockchain'">
        <p @dblclick="copyPayingAddress(pay_address)">{{$t('index.payingAddress')}}{{pay_address}}</p>
        <img
            src="@/assets/order/copy.svg"
            @click="copyPayingAddress(pay_address)"
            alt="copy"
          />
      </div> -->
      <!-- <el-input v-if="payModel === 'blockchain'"
        class="p_account_address_input"
        v-model="p_account_address_input" 
        :placeholder="$t('index.p_account_address_placeholder')"
        ></el-input>
      <p v-if="payModel === 'blockchain'" class="p_account_address_input_tips">{{ $t('index.p_account_address_input_tips') }}</p>
      <div class="el-form-item__error p_account_address_input_verify" v-if="payModel === 'blockchain' && p_account_address_input_verify">
        {{$t('index.p_account_address_input_placeholder')}}
      </div> -->
      <div slot="footer" class="dialog-footer renewal-footer">
        <div class="pay-with-dmc">
          {{ $t("index.dmc_reward_tip") }}
        </div>
        <el-button @click="payVisible = false">{{
          $t("index.cancel")
        }}</el-button>
        <el-button
          type="primary"
          v-if="payModel === 'card'"
          @click="payByCard"
          >{{ $t("index.confirm") }}</el-button
        >
        <el-button
          type="primary"
          v-if="payModel === 'blockchain'"
          @click="toOrderTransaction"
          >{{ $t("index.confirm") }}</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      :title="$t('index.orderDialog')"
      v-model="blockChainPayVisible1"
      class="p_box"
    >
      <!-- SubOrder -->
      <div v-if="payItems && payItems.order_sn" class="order_item_box">
        <div class="order_item">
          <div class="order_key">{{ $t("index.orderPrice") }}</div>
          <!-- <div class="order_value" v-if="(payItems.sellType === 'monthly')">
            {{ activeProduct.unit === "dollar" ? "$" : "￥"
            }}{{ activeProduct.last_monthly }} (Foggie NFT + 1 month Foggie rent fee)
          </div>
          <div class="order_value" v-if="payItems.sellType === 'annually'">
            {{ activeProduct.unit === "dollar" ? "$" : "￥"
            }}{{ activeProduct.last_annually }} (Foggie NFT + 1 year Foggie rent fee)
          </div> -->
          <div class="order_value" v-if="payItems.sellType === 'monthly'">
            {{ activeProduct.unit === "dollar" ? "$" : "￥"
            }}{{ activeProduct.last_monthly }}
          </div>
          <div class="order_value" v-if="payItems.sellType === 'semiannual'">
            {{ activeProduct.unit === "dollar" ? "$" : "￥"
            }}{{ activeProduct.last_semiannual }}
          </div>
          <div class="order_value" v-if="payItems.sellType === 'annually'">
            {{ activeProduct.unit === "dollar" ? "$" : "￥"
            }}{{ activeProduct.last_annually }}
          </div>
        </div>

        <div class="order_item">
          <div class="order_key">{{ $t("index.orderId") }}:</div>
          <div class="order_value">{{ payItems.order_sn }}</div>
        </div>
        <div class="p_line"></div>
      </div>
      <p class="blockchain-from">
        <span>From</span> {{ p_account_address_input }}
        <img
          src="@/assets/order/copy.svg"
          @click="copyPayingAddress(p_account_address_input)"
          alt="copy"
        />
      </p>
      <p class="blockchain-to">
        <span>To</span> {{ pay_address }}
        <img
          src="@/assets/order/copy.svg"
          @click="copyPayingAddress(pay_address)"
          alt="copy"
        />
      </p>
      <div class="p_buy_blockchain">
        <p>
          1 USDC(ETH) = {{ usdcRate }} USD &nbsp; 1 USDT(ETH) =
          {{ usdtRate }} USD &nbsp; 1 BUSD(BSC) = {{ busdRate }} USD &nbsp; 1
          USDT(BSC) = {{ bsc_usdRate }} USD
        </p>
        <!-- <p>1 BUSD(BSC) = {{busdRate}} USD &nbsp;&nbsp;&nbsp; 1 USDT(BSC) = {{bsc_usdRate}} USD</p> -->
      </div>
      <el-input
        class="p_buy_address_input"
        v-model="transaction_hash"
        :placeholder="$t('index.transaction_id_placeholder3')"
      ></el-input>
      <div
        class="el-form-item__error buy_address_input_verify"
        v-if="buy_address_input_verify"
      >
        {{ $t("index.transaction_id_placeholder") }}
      </div>
      <div slot="footer" class="dialog-footer renewal-footer">
        <div class="pay-with-dmc">
          <!-- <el-checkbox disabled></el-checkbox>Pay with DMC (1 DMC = $1.0) -->
          {{ $t("index.dmc_reward_tip") }}
        </div>
        <el-button @click="blockChainPayVisible1 = false">{{
          $t("index.cancel")
        }}</el-button>
        <el-button type="primary" @click="payByBlockChain">{{
          $t("index.confirm")
        }}</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="$t('index.orderDialog')"
      v-model="renewalVisible"
      class="p_box"
    >
      <!-- SubOrder -->
      <div
        v-if="activeOrderItems && activeOrderItems.order_sn"
        class="order_item_box"
      >
        <div class="order_item">
          <div class="order_key">{{ $t("index.orderPrice") }}</div>
          <!-- <div class="order_value" v-if="(buyType === 'month')">
            {{ activeProduct.unit === "dollar" ? "$" : "￥"
            }}{{ activeProduct.last_monthly }} (Foggie NFT + 1 month Foggie rent fee)
          </div>
          <div class="order_value" v-if="buyType === 'year'">
            {{ activeProduct.unit === "dollar" ? "$" : "￥"
            }}{{ activeProduct.last_annually }} (Foggie NFT + 1 year Foggie rent fee)
          </div> -->
          <div class="order_value" v-if="buyType === 'month'">
            {{ activeProduct.unit === "dollar" ? "$" : "￥"
            }}{{ activeProduct.last_monthly }}
          </div>
          <div class="order_value" v-if="buyType === 'semiannual'">
            {{ activeProduct.unit === "dollar" ? "$" : "￥"
            }}{{ activeProduct.last_semiannual }}
          </div>
          <div class="order_value" v-if="buyType === 'year'">
            {{ activeProduct.unit === "dollar" ? "$" : "￥"
            }}{{ activeProduct.last_annually }}
          </div>
        </div>
        <div class="order_item">
          <div class="order_key">{{ $t("index.orderId") }}:</div>
          <div class="order_value">{{ activeOrderItems.order_sn }}</div>
        </div>
        <div class="order_item">
          <div class="order_key">{{ $t("index.expire") }}</div>
          <div class="order_value">{{ activeOrderItems.dueDate }}</div>
        </div>
        <div class="order_item" v-if="activeOrderItems.vps_info.length">
          <div class="order_key">{{ $t("index.wan_ip") }}:</div>
          <div class="order_value">
            {{
              activeOrderItems.vps_info.length &&
              activeOrderItems.vps_info[0].dedicatedip
            }}
          </div>
        </div>
        <div class="p_line"></div>
      </div>

      <div class="p_choose">
        <el-radio-group v-model="buyType" size="large">
          <el-radio label="month">{{ $t("index.monthrent") }}</el-radio>
          <el-radio label="month">{{ $t("index.semiannualrent") }}</el-radio>
          <el-radio label="year">{{ $t("index.yearrent") }}</el-radio>
        </el-radio-group>
      </div>

      <div class="p_buy">
        <el-radio-group v-model="buyModel" size="large">
          <el-radio label="card" class="squartCard squartCard-pay">
            <img src="@/assets/card0.png" />
          </el-radio>
          <el-radio label="blockchain" class="squartCard squartCard-pay">
            {{ $t("index.digital_currency") }}
          </el-radio>
        </el-radio-group>
        <el-radio-group
          v-model="buyBlockChainModel"
          v-if="buyModel === 'blockchain'"
          class="blockchain-radio"
          size="large"
        >
          <!-- <el-tooltip class="item" effect="dark" content="0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" placement="top-start">
            <el-radio label="usdc"
              class="squartCard">
              <img src="@/assets/order/icon-eth-usdc.webp" />
              USDC (ETH)
            </el-radio>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="0xdAC17F958D2ee523a2206206994597C13D831ec7" placement="top-start">
            <el-radio label="usdt"
              class="squartCard">
              <img src="@/assets/order/icon-eth-usdt.webp" />
              USDT (ETH)
            </el-radio>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56" placement="bottom-start">
            <el-radio label="busd"
                    class="squartCard">
                    <img src="@/assets/order/icon-bsc-busd.webp" />
              BUSD (BSC)
            </el-radio>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="0x55d398326f99059fF775485246999027B3197955" placement="bottom-start">
            <el-radio label="bsc_usd"
                    class="squartCard">
                    <img src="@/assets/order/icon-bsc-usdt.webp" />
              USDT (BSC)
            </el-radio>
          </el-tooltip> -->
          <el-radio label="usdc" class="squartCard">
            <img src="@/assets/order/icon-eth-usdc.webp" />
            USDC (ETH)
          </el-radio>
          <el-radio label="usdt" class="squartCard">
            <img src="@/assets/order/icon-eth-usdt.webp" />
            USDT (ETH)
          </el-radio>
          <el-radio label="busd" class="squartCard">
            <img src="@/assets/order/icon-bsc-busd.webp" />
            BUSD (BSC)
          </el-radio>
          <el-radio label="bsc_usd" class="squartCard">
            <img src="@/assets/order/icon-bsc-usdt.webp" />
            USDT (BSC)
          </el-radio>
        </el-radio-group>
      </div>
      <el-switch
        class="coupon-recharge-switch"
        v-model="is_use_coupon_recharge"
        :active-text="$t('order.use_coupon_pay')"
      >
      </el-switch>
      <el-input
        class="coupon-number-input"
        v-if="is_use_coupon_recharge"
        v-model="coupon_number_recharge"
        @change="rechargeCouponChange"
        :placeholder="$t('order.coupon_placeholder')"
      >
        ></el-input
      >
      <p
        class="coupon-number-error"
        v-if="is_use_coupon_recharge && is_coupon_error_recharge"
      >
        {{ $t("order.coupon_error") }}
      </p>
      <!-- <div class="p_buy_blockchain" v-if="buyModel === 'blockchain'">
        <p>1 USDC(ETH) = {{usdcRate}} USD &nbsp; 1 USDT(ETH) = {{usdtRate}} USD &nbsp;1 BUSD(BSC) = {{busdRate}} USD &nbsp; 1 USDT(BSC) = {{bsc_usdRate}} USD</p>
      </div> -->
      <!-- <div class="p_buy_address" v-if="buyModel === 'blockchain'">
        <p @dblclick="copyPayingAddress(pay_address)">{{$t('index.payingAddress')}}{{pay_address}}</p>
        <img
            src="@/assets/order/copy.svg"
            @click="copyPayingAddress(pay_address)"
            alt="copy"
          />
      </div> -->
      <!-- <el-input v-if="buyModel === 'blockchain'"
        class="p_account_address_input"
        v-model="p_account_address_input"
        :placeholder="$t('index.p_account_address_placeholder')"
        ></el-input>
      <p v-if="buyModel === 'blockchain'" class="p_account_address_input_tips">{{ $t('index.p_account_address_input_tips') }}</p>
      <div class="el-form-item__error p_account_address_input_verify" v-if="buyModel === 'blockchain' && p_account_address_input_verify">
        {{$t('index.p_account_address_input_placeholder')}}
      </div> -->
      <div slot="footer" class="dialog-footer renewal-footer">
        <div class="pay-with-dmc">
          <!-- <el-checkbox disabled></el-checkbox>Pay with DMC (1 DMC = $1.0) -->
          {{ $t("index.dmc_reward_tip") }}
        </div>
        <el-button @click="renewalVisible = false">{{
          $t("index.cancel")
        }}</el-button>
        <el-button type="primary" :loading="loading" @click="rechargPay">{{
          $t("index.confirm")
        }}</el-button>
      </div>
    </el-dialog>

    <block-chain-box
      :blockChainData="blockChainData"
      :blockChainPayVisible="blockChainPayVisible"
      @closeBlockChain="closeBlockChain"
      @cancelBlockChain="cancelBlockChain"
    ></block-chain-box>
    <payment-cloud
      :amount="payment_cloud_amount"
      :payment_cloud_show="payment_cloud_show"
      :payment_cloud_trans_id="payment_cloud_trans_id"
      :referer_name="referer_name"
      @closePaymentCloud="closePaymentCloud"
    >
    </payment-cloud>
  </div>
</template>

<script>
import {
  userOrderListPage,
  delOrder,
  cancelOrder,
  getOrderSn,
  userOrderCount,
  userOrderStatus,
  oodActive,
  payStripe,
  orderRecharge,
  getHardwareIP,
  getOrder,
  user,
  didUpdate,
  dmcBind,
  updateUser,
  updateVoodDmc,
  updateVoodGateway,
  dmcFreeRegister,
  DMCAccountCreate,
  bindtask,
  getExchangeRate,
  getWalletAccounts,
  orderTransaction,
  transactions,
  getOrderTransaction,
  updatePeopleInfo,
  deployVoodGateway,
  check_coupon_number,
} from "@/api/shop";
import { transferTime, handleTimeStamp, handleTime } from "@/utils/util.js";
import { getToken } from "@/utils/auth.js";
import countDown from "@/components/countDown.vue";
// import TopHead from "../../components/topHead.vue";
// import { Message } from "element-plus";
import QRCode from "qrcodejs2";
// import drawer from "./detail";
import startingBox from "@/components/foggieOrder/startingBox.vue";
import { createDID, activeVOOD } from "@/utils/did.js";
import BlockChainBox from "@/components/foggieOrder/blockChainBox.vue";
import balloonBox from "@/components/foggieOrder/balloonBox.vue";
import paymentCloud from "@/components/payment/paymentCloud.vue";

export default {
  components: {
    countDown,
    // TopHead,
    // drawer,
    startingBox,
    BlockChainBox,
    balloonBox,
    paymentCloud,
  },
  data() {
    return {
      activeName: "Order",
      orderList: [],
      transferTime,
      handleTimeStamp,
      handleTime,
      tableData: [],
      percentage: 20,
      loading: false,
      pastDate: 0,
      currentOrderId: "",
      currentPage: 1,
      currentPageSize: 10,
      total: 0,
      userOrderCounts: [],
      currentState: "user_order",
      showMore: false,

      activeVisible: false,
      activeCreateAndActivateVisible: false,
      isDIDCreating: true,
      activatedVoodSucccess: false, // 自动创建did成功后，点击激活vood成功
      // count: 3, // 激活vood成功后倒计时3秒
      count: 30,
      timmer: null, // 倒计时定时器
      oodToken: {},
      base64Text: "",
      cyberVisible: false,
      cyber: {},
      currentItem: {},
      cyfsBrowser: false,
      loading: false,

      //       VOOD ID
      // VOOD IP
      // VOOD Status
      // Order ID
      // Expiration Time

      gridArr: [
        // { key: "VOOD ID", value: "vood_id" },
        { key: "index.voodStatus", value: "vood_status" },
        { key: "index.device_status", value: "device_status" },
        { key: "index.order_status", value: "main_status" },
        { key: "index.orderId", value: "order_sn" },
        { key: "index.dueDate", value: "dueDate" },
        { key: "index.wan_ip", value: "vood_ip" },
        // { key: this.$t('index.Params'), value: 'params' },
        // { key: this.$t('index.orderPrice'), value: 'Price' },
        // { key: this.$t('index.orderPayment'), value: 'payment_method' },
        // { key: this.$t('index.orderRentType'), value: 'sellType' },
        // { key: this.$t('index.order_status'), value: 'status' },
        // { key: this.$t('index.created_at'), value: 'created_at' },
      ],
      display: false,
      drawerWidth: "1000px",
      detailData: {},
      white_span_left: 0,
      timerOder: "",
      language_key: "en",
      buyModel: "card",
      // buyModel: "blockchain",
      payModel: "card",
      // payModel: 'blockchain',
      payBlockChainModel: "usdc",
      buyBlockChainModel: "usdc",
      buyType: "month",
      renewalVisible: false,
      activeOrderItems: {},
      oodLinkShow: false,
      bindInfo: {},
      vpsId: 0,
      currentDID: "",
      getOrderData: false,
      dmcAccount: "",
      userId: "",
      activateVoodLoading: false,
      payVisible: false,
      payItems: {},
      usdcRate: 1,
      usdtRate: 1,
      busdRate: 1,
      bsc_usdRate: 1,
      vofoRate: 1,
      addressArr: [],
      pay_address: "",
      transaction_hash: "",
      isPayBlockChain: false,
      recharge_address_input_verify: false,
      buy_address_input_verify: false,
      isHaveDMC: false,
      p_account_address_input: "",
      p_account_address_input_verify: false,
      // isOrderTransaction: false,
      blockChainPayVisible: false,
      blockChainPayVisible1: false,
      activeProduct: {},
      blockChainModel: "usdc",
      bindWalletVisible: false,
      isHaveDiD: false,
      people_id: "",
      master_vood_id: "",
      isShowCyberChat: false,
      isInsideBindClick: false,
      isOutsideBindClick: false,
      lock_num: 0,
      currentDmc: "",
      account_email: "",
      // activeBoxShow: true,
      isNoAccount: false,
      isActivateClick: false,
      blockChainData: {},
      activeOrderSn: "",
      // coupon_number: '',
      coupon_number_recharge: "",
      coupon_number_pay: "",
      // is_coupon_num: false,
      is_coupon_error_pay: false,
      is_coupon_error_recharge: false,
      // coupon_num_check: false,
      timer_expire_remove: 0,
      recharge_click: false,
      is_use_coupon_recharge: false,
      is_use_coupon_pay: false,
      payment_cloud_show: false,
      payment_cloud_trans_id: 0,
      payment_cloud_amount: 0,
      referer_name: "",
    };
  },
  created() {
    this.testEth();
    this.initOrder();
    this.timeOutFn();
    this.language_key = localStorage.getItem("language_key");
    window.addEventListener("setItem", (e) => {
      console.log(e);
      this.language_key = localStorage.getItem("language_key");
    });
    this.getUserInfo();
    // setTimeout(()=>{
    //   this.initOrder();
    //   this.timeOutFn();
    //   this.language_key = localStorage.getItem("language_key");
    //   window.addEventListener("setItem", (e) => {
    //     console.log(e);
    //     this.language_key = localStorage.getItem("language_key");
    //   });
    //   this.getUserInfo();
    // },500);
    // this.timer_expire_remove = setInterval(this.expireCountDown, 5000);
  },
  unmounted() {
    // clearInterval(this.timer_expire_remove);
  },
  methods: {
    expireCountDown() {
      for (let i = 0; i < this.orderList.length; i++) {
        if (
          this.orderList[i].expire_remove &&
          this.orderList[i].expire_remove.order_expire
        ) {
          this.orderList.expire_remove = this.getExpireRemove(
            this.orderList[i].expire_remove.order_expire
          );
        }
      }
    },
    payCouponChange(text) {
      console.log("verify coupon", text);
      const reg = /^[a-zA-Z\d]{12}$/;
      if (!reg.test(text)) {
        // 提示不匹配
        this.is_coupon_error_pay = true;
        return;
      } else {
        this.is_coupon_error_pay = false;
      }
      // ajax 匹配是否被使用
      check_coupon_number(text).then((res) => {
        console.log("verify coupon", res);
        if (res.code !== 200) {
          this.is_coupon_error_pay = true;
        }
      });
    },
    rechargeCouponChange(text) {
      console.log("verify coupon", text);
      const reg = /^[a-zA-Z\d]{12}$/;
      if (!reg.test(text)) {
        // 提示不匹配
        this.is_coupon_error_recharge = true;
        return;
      } else {
        this.is_coupon_error_recharge = false;
      }
      // ajax 匹配是否被使用
      check_coupon_number(text).then((res) => {
        console.log("verify coupon", res);
        if (res.code !== 200) {
          this.is_coupon_error_recharge = true;
        }
      });
    },
    isCreateClick(flag) {
      this.isActivateClick = flag;
    },

    getUserInfo() {
      user().then((res) => {
        if (res.data && res.data.dmc) {
          this.currentDmc = res.data.dmc;
          this.dmcAccount = res.data.dmc;
          this.oodLinkShow = true;
        } else if (res.data && res.data.email) {
          // const base58 = require("base58-encode");
          // this.dmcAccount = base58(res.data.email);
          this.dmcAccount = res.data.email;
        }
        this.userId = res.data.id;
      });
    },
    timeOutFn() {
      const that = this;
      that.timerOder = setInterval(() => {
        if (location.href.indexOf("#/order") > -1) {
          if (that.currentOrderId) {
            that.doSearchOrder();
          } else {
            if (this.currentState === "user_order") {
              this.initOrder();
            } else {
              this.searchStatusOrder();
            }
          }
        } else {
          clearInterval(that.timerOder);
        }
      }, 1000 * 60);
    },
    randomClass(i, j) {
      return i % 3 === j;
      // return Math.floor(Math.random() * 4) === j;
      // return 'item-left' + Math.floor(Math.random() * 4);
    },
    changeWidth() {
      this.display = true;
      // this.drawerWidth = (this.drawerWidth === '500px') ? '800px' : '500px'
    },
    doShowMore() {
      this.showMore = !this.showMore;
    },
    handleStatus(key, index) {
      // let total = this.userOrderCounts.length;
      this.white_span_left = 110 * index;
      this.currentOrderId = "";
      if (key === "user_order_count") {
        this.currentPage = 1;
        this.currentPageSize = 10;
        this.currentState = "user_order";
        this.initOrder();
        // this.searchStatusOrder();
      } else {
        let status = key.split("_count")[0];
        this.currentPage = 1;
        this.currentPageSize = 10;
        this.currentState = status;
        this.searchStatusOrder();
      }
    },
    async searchStatusOrder() {
      this.loading = true;
      let data = {
        pn: this.currentPage,
        ps: this.currentPageSize,
        status: this.currentState,
      };
      let res = await userOrderStatus(data);
      this.total = res.count;
      this.loading = false;
      this.initOrderItem(res.data);
    },
    handleOpt(index, row, type) {
      const that = this;
      // console.log(index, row, type);
      if (type === "detail") {
        if (
          row.state === "pending_payment" ||
          row.transaction_state === "pending_payment"
        ) {
          that.CancelOrder(row);
        } else if (
          row.state === "pending_payment" ||
          row.state === "cancelled"
        ) {
          that.DeleteOrder(row);
        } else {
          window.localStorage.setItem("detailItem", JSON.stringify(row));
          this.detailData = row;
          // that.gotoDetail(row);
          that.changeWidth(row);
        }
      } else if (type === "delete") {
        that.DeleteOrder(row);
      } else if (type === "cancel") {
        that.CancelOrder(row);
      } else if (type === "pay") {
        // click购买
        // gtag("event", "buy_clicked");
        that.toPay(row);
      } else if (type === "progress") {
        that.OpenProgress(row);
      } else if (type === "recharge") {
        that.rechargeOrder(row);
      }
    },
    //ood激活操作

    getActiveData() {
      user().then((res) => {
        if (res.data && res.data.dmc) {
          this.isHaveDMC = true;
          this.dmcAccount = res.data.dmc;
        }
        if (
          res.data &&
          res.data.people_id &&
          res.data.status === "active_finish"
        ) {
          // this.isHaveDiD = true;
        }
      });
    },

    async getHaveDMC() {
      user().then((res) => {
        if (res.data && res.data.dmc) {
          return true;
        } else {
          return false;
        }
      });
    },
    handleTokenCode() {
      const that = this;
      // that.activeVisible = true;
      setTimeout(() => {
        that.$refs.qrCodeUrl.innerHTML = "";
        var qrcode = new QRCode(that.$refs.qrCodeUrl, {
          text: JSON.stringify(that.oodToken), // 需要转换为二维码的内容
          width: 150,
          height: 150,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.L,
        });
        let canvas = qrcode._el.querySelector("canvas"); //获取生成二维码中的canvas，并将canvas转换成base64
        this.base64Text = canvas.toDataURL("image/png");

        // that.$refs.qrCodeUrl1.innerHTML = "";
        // var qrcode1 = new QRCode(that.$refs.qrCodeUrl1, {
        //   text: JSON.stringify(that.oodToken), // 需要转换为二维码的内容
        //   width: 150,
        //   height: 150,
        //   colorDark: "#000000",
        //   colorLight: "#ffffff",
        //   correctLevel: QRCode.CorrectLevel.L,
        // });
        // let canvas1 = qrcode1._el.querySelector("canvas"); //获取生成二维码中的canvas，并将canvas转换成base64
        // this.base64Text = canvas1.toDataURL("image/png");

        // console.log(this.base64Text, "this.base64Text");
      }, 0);
    },

    downldImg() {
      var oA = document.createElement("a");
      oA.download = "ActivationCode"; // 设置下载的文件名，默认是'下载'
      oA.href = this.base64Text;
      document.body.appendChild(oA);
      oA.click();
      oA.remove(); // 下载之后把创建的元素删除
    },

    handleBindWalletClose() {
      if (!this.isInsideBindClick && !this.isOutsideBindClick) {
        this.bindWalletVisible = false;
      }
    },
    rechargeOrder(item) {
      this.recharge_address_input_verify = false;
      this.is_coupon_error_recharge = false;
      this.coupon_number_recharge = "";
      this.renewalVisible = true;
      // this.currentTitle = "Order Renewal";
      // this.showChangeBox = true;
      let activeProduct = item.product;
      window.localStorage.setItem("activeOrderItems", JSON.stringify(item));
      window.localStorage.setItem(
        "activeProduct",
        JSON.stringify(activeProduct)
      );
      window.localStorage.setItem("order_id", item.id);
      this.activeOrderItems = item;
      this.activeProduct = activeProduct;
      this.p_account_address_input = "";
      // this.testEth();
      // this.$router.push("/comfirmOrder");
    },
    rechargPay() {
      if (this.is_use_coupon_recharge && !this.coupon_number_recharge) {
        this.is_coupon_error_recharge = true;
        return;
      }
      if (this.is_use_coupon_recharge && this.is_coupon_error_recharge) {
        return;
      }
      if (this.recharge_click) {
        return;
      }
      this.recharge_click = true;

      // let reg1 = /^[0-9A-Za-z]{25,50}$/;
      // if (this.buyModel !== 'card' && !reg1.test(this.p_account_address_input)) {
      //   this.p_account_address_input_verify = true;
      //   return;
      // }
      // let reg2 = /^[0-9A-Za-z]{40,90}$/;
      // if (this.buyModel !== 'card' && !reg2.test(this.transaction_hash)) {
      //   this.recharge_address_input_verify = true;
      //   return;
      // }
      let total_price = "";
      let rent = "";
      if (this.buyType === "month") {
        if (this.buyModel === "card") {
          total_price =
            Number(this.activeProduct.monthPrice) -
            Number(this.activeProduct.monthly_discounted);
        } else if (
          this.buyModel === "blockchain" &&
          this.buyBlockChainModel === "usdc"
        ) {
          total_price = this.activeProduct.usdc_monthly;
        } else if (
          this.buyModel === "blockchain" &&
          this.buyBlockChainModel === "busd"
        ) {
          total_price = this.activeProduct.busd_monthly;
        } else if (
          this.buyModel === "blockchain" &&
          this.buyBlockChainModel === "usdt"
        ) {
          total_price = this.activeProduct.usdt_monthly;
        } else if (
          this.buyModel === "blockchain" &&
          this.buyBlockChainModel === "bsc_usd"
        ) {
          total_price = this.activeProduct.bsc_usd_monthly;
        } else if (
          this.buyModel === "blockchain" &&
          this.buyBlockChainModel === "vofo"
        ) {
          total_price = this.activeProduct.vofo_monthly;
        }

        rent = "monthly";
      } else if (this.buyType === "year") {
        if (this.buyModel === "card") {
          total_price =
            Number(this.activeProduct.yeaPrice) -
            Number(this.activeProduct.annually_discounted);
        } else if (
          this.buyModel === "blockchain" &&
          this.buyBlockChainModel === "usdc"
        ) {
          total_price = this.activeProduct.usdc_annually;
        } else if (
          this.buyModel === "blockchain" &&
          this.buyBlockChainModel === "busd"
        ) {
          total_price = this.activeProduct.busd_annually;
        } else if (
          this.buyModel === "blockchain" &&
          this.buyBlockChainModel === "usdt"
        ) {
          total_price = this.activeProduct.usdt_annually;
        } else if (
          this.buyModel === "blockchain" &&
          this.buyBlockChainModel === "bsc_usd"
        ) {
          total_price = this.activeProduct.bsc_usd_annually;
        } else if (
          this.buyModel === "blockchain" &&
          this.buyBlockChainModel === "vofo"
        ) {
          total_price = this.activeProduct.vofo_annually;
        }
        rent = "annually";
      } else if (this.buyType === "semiannual") {
        if (this.buyModel === "card") {
          total_price =
            Number(this.activeProduct.semiannualPrice) -
            Number(this.activeProduct.semiannual_discounted);
        } else if (
          this.buyModel === "blockchain" &&
          this.buyBlockChainModel === "usdc"
        ) {
          total_price = this.activeProduct.usdc_semiannual;
        } else if (
          this.buyModel === "blockchain" &&
          this.buyBlockChainModel === "busd"
        ) {
          total_price = this.activeProduct.busd_semiannual;
        } else if (
          this.buyModel === "blockchain" &&
          this.buyBlockChainModel === "usdt"
        ) {
          total_price = this.activeProduct.usdt_semiannual;
        } else if (
          this.buyModel === "blockchain" &&
          this.buyBlockChainModel === "bsc_usd"
        ) {
          total_price = this.activeProduct.bsc_usd_semiannual;
        } else if (
          this.buyModel === "blockchain" &&
          this.buyBlockChainModel === "vofo"
        ) {
          total_price = this.activeProduct.vofo_semiannual;
        }
        rent = "semiannual";
      }
      let data = {
        rent: rent,
        payment_method:
          this.buyModel === "card" ? "card" : this.buyBlockChainModel,
        total_price: total_price,
        order_id: this.activeOrderItems.id,
      };
      let currentComfirmItem = {
        total_price: total_price,
        payment_method:
          this.buyModel === "card" ? "card" : this.buyBlockChainModel,
        buyType: this.buyType,
      };
      window.sessionStorage.setItem(
        "currentComfirmItem",
        JSON.stringify(currentComfirmItem)
      );
      this.currentComfirmItem = currentComfirmItem;
      this.loading = true;
      orderRecharge(data)
        .then((res) => {
          if (!res.data) {
            return;
          }
          this.handleResponse(res);
        })
        .finally(() => {
          this.recharge_click = false;
        });
    },
    handleResponse(res) {
      let id = res.data.id;
      window.localStorage.setItem("order_id", id);
      let len = res.data.order_transaction.length - 1;
      let trans_id =
        res.data.order_transaction && res.data.order_transaction[len].id;
      // let w_url = window.location.origin + "/api/oms/pay_callback/" + trans_id;
      // this.$router.push("/payOrder");

      if (this.buyModel === "stripe") {
        let success_url = window.location.origin + `/#/order`;
        let cancel_url = window.location.origin + `/#/order`;
        let postData = {
          line_items: [
            {
              quantity: 1,
              price_data: {
                currency: "usd",
                product_data: {
                  name: this.activeProduct.name,
                  images: ["https://vfoggie.fogworks.io/favicon_ood.png"], //""https://i.imgur.com/EHyR2nP.png
                },
                // unit_amount: Number(this.currentComfirmItem.total_price) * 100, //50
                unit_amount: this.numMulti(
                  Number(this.currentComfirmItem.total_price),
                  100
                ),
                // unit_amount: 50, //50
              },
            },
          ],
          mode: "payment",
          payment_method_types: ["card"],
          success_url: success_url,
          cancel_url: cancel_url,
          trans_id: trans_id,
          isRenewal: true,
        };
        payStripe(postData)
          .then((res) => {
            if (res && res.data && res.data.url) {
              window.location.href = res.data.url;
            }
          })
          .finally(() => {
            this.loading = false;
          });
      } else if (this.buyModel === "card") {
        this.payment_cloud_trans_id = trans_id;
        this.renewalVisible = false;
        this.payment_cloud_show = true;
        this.referer_name = "recharge";
        this.payment_cloud_amount = this.coupon_number_recharge
          ? Number(this.currentComfirmItem.total_price) * 0.9
          : Number(this.currentComfirmItem.total_price);
        this.loading = false;
      } else {
        // let reg1 = /^[0-9A-Za-z]{25,50}$/;
        // if (!reg1.test(this.p_account_address_input)) {
        //   this.p_account_address_input_verify = true;
        //   return;
        // }

        // let data = {
        //   transaction_id: trans_id,
        //   order_id: id,
        //   user_sender: this.p_account_address_input,
        //   user_receiver: this.pay_address,
        // };
        // orderTransaction(data).then(()=>{
        //   this.blockChainPayVisible = true;
        //   this.renewalVisible = false;
        //   this.p_account_address_input_verify = false;
        //   this.payItems = this.activeOrderItems;
        //   this.blockChainModel = this.buyBlockChainModel;
        //   // this.renewalVisible = false;
        //   // this.initOrder();
        // });

        let pay_item = this.activeOrderItems;
        let price =
          this.buyType === "month"
            ? this.activeProduct.last_monthly
            : this.buyType === "semiannual"
            ? this.activeProduct.last_semiannual
            : this.activeProduct.last_annually;
        // let price_text = this.buyType === 'month' ?
        //   `$ ${this.activeProduct.last_monthly} (Foggie NFT + 1 month Foggie rent fee)`
        //   : `$ ${this.activeProduct.last_annually} (Foggie NFT + 1 year Foggie rent fee)`;
        let price_text =
          this.buyType === "month"
            ? `$ ${this.activeProduct.last_monthly}`
            : this.buyType === "semiannual"
            ? `$ ${this.activeProduct.last_semiannual}`
            : `$ ${this.activeProduct.last_annually}`;
        let coupon_number = this.coupon_number_recharge;
        this.blockChainData = {
          pay_item,
          trans_id,
          price,
          price_text,
          coupon_number,
          couponRate: coupon_number ? 0.9 : 1,
        };
        this.loading = false;
        this.blockChainPayVisible = true;
        this.renewalVisible = false;
      }
    },
    closePaymentCloud(type) {
      this.payment_cloud_show = false;
      if (type === "pay") {
        this.payVisible = true;
      } else {
        this.renewalVisible = true;
      }
    },
    toPay(item) {
      console.log(item.state, "item");
      this.payItems = item;
      let activeProduct = item.product;
      this.activeProduct = activeProduct;
      let order_id = item.id;
      let transaction_id =
        item.order_transaction[item.order_transaction.length - 1].id;
      if (item.state === "paid_failed") {
        this.buy_address_input_verify = false;
        this.p_account_address_input = "";

        this.is_coupon_error_pay = false;
        this.coupon_number_pay = "";
        // this.payVisible = true;
        this.blockChainPayVisible = false;

        this.payVisible = false;
        this.rechargeOrder(item);
      } else {
        getOrderTransaction(order_id, transaction_id).then((res) => {
          if (
            res &&
            res.data &&
            res.data &&
            res.data.length > 0 &&
            res.data[res.data.length - 1].user_sender &&
            res.data[res.data.length - 1].user_receiver
          ) {
            this.transaction_hash = "";
            this.blockChainPayVisible = true;
            this.payVisible = false;
            this.p_account_address_input =
              res.data[res.data.length - 1].user_sender;
            this.pay_address = res.data[res.data.length - 1].user_receiver;

            let pay_item = this.payItems;
            let trans_id =
              pay_item.order_transaction[pay_item.order_transaction.length - 1]
                .id;

            let price =
              pay_item.sellType === "monthly"
                ? this.activeProduct.last_monthly
                : pay_item.sellType === "semiannual"
                ? this.activeProduct.last_semiannual
                : this.activeProduct.last_annually;

            // let price_text = pay_item.sellType === 'monthly' ?
            //   `$ ${this.activeProduct.last_monthly} (Foggie NFT + 1 month Foggie rent fee)`
            //   : `$ ${this.activeProduct.last_annually} (Foggie NFT + 1 year Foggie rent fee)`;
            let price_text =
              pay_item.sellType === "monthly"
                ? `$ ${this.activeProduct.last_monthly}`
                : pay_item.sellType === "semiannual"
                ? `$ ${this.activeProduct.last_semiannual}}`
                : `$ ${this.activeProduct.last_annually}`;
            let user_sender = res.data[res.data.length - 1].user_sender;
            let user_receiver = res.data[res.data.length - 1].user_receiver;
            let created_at = res.data[res.data.length - 1].created_at;
            let uuid = res.data[res.data.length - 1].uuid;
            let exchange_rate = res.data[res.data.length - 1].exchange_rate;
            let actual_price = res.data[res.data.length - 1].actual_price;
            let payable_price = res.data[res.data.length - 1].payable_price;
            let payment_method = res.data[res.data.length - 1].payment_method;
            let couponRate = Number(payable_price) / Number(price);
            this.blockChainData = {
              pay_item,
              trans_id,
              price,
              price_text,
              user_sender,
              user_receiver,
              created_at,
              uuid,
              exchange_rate,
              actual_price,
              payable_price,
              payment_method,
              couponRate,
            };

            this.blockChainPayVisible = true;
            this.payVisible = false;
          } else {
            this.buy_address_input_verify = false;
            this.p_account_address_input = "";
            this.is_coupon_error_pay = false;
            this.coupon_number_pay = "";
            this.payVisible = true;
            this.blockChainPayVisible = false;
          }
        });
      }
    },
    closeBlockChain() {
      this.blockChainPayVisible = false;
    },
    cancelBlockChain() {
      this.blockChainPayVisible = false;
      this.payVisible = true;
    },
    toOrderTransaction() {
      if (this.is_use_coupon_pay && !this.coupon_number_pay) {
        this.is_coupon_error_pay = true;
        return;
      }
      if (this.is_use_coupon_pay && this.is_coupon_error_pay) {
        return;
      }
      let pay_item = this.payItems;
      let trans_id =
        pay_item.order_transaction[pay_item.order_transaction.length - 1].id;
      let price =
        pay_item.sellType === "monthly"
          ? this.activeProduct.last_monthly
          : pay_item.sellType === "semiannual"
          ? this.activeProduct.last_semiannual
          : this.activeProduct.last_annually;
      // let price_text = pay_item.sellType === 'monthly' ?
      //         `$ ${this.activeProduct.last_monthly} (Foggie NFT + 1 month Foggie rent fee)`
      //         : `$ ${this.activeProduct.last_annually} (Foggie NFT + 1 year Foggie rent fee)`;
      let price_text =
        pay_item.sellType === "monthly"
          ? `$ ${this.activeProduct.last_monthly}`
          : pay_item.sellType === "semiannual"
          ? `$ ${this.activeProduct.last_semiannual}`
          : `$ ${this.activeProduct.last_annually}`;
      let coupon_number = this.coupon_number_pay;
      this.blockChainData = {
        pay_item,
        trans_id,
        price,
        price_text,
        coupon_number,
        couponRate: coupon_number ? 0.9 : 1,
      };
      this.blockChainPayVisible = true;
      this.payVisible = false;
    },
    toOrderTransaction1() {
      let reg1 = /^[0-9A-Za-z]{25,50}$/;
      if (!reg1.test(this.p_account_address_input)) {
        this.p_account_address_input_verify = true;
        return;
      }
      let item = this.payItems;
      let trans_id =
        item.order_transaction[item.order_transaction.length - 1].id;

      let data = {
        transaction_id: trans_id,
        order_id: item.id,
        user_sender: this.p_account_address_input,
        user_receiver: this.pay_address,
      };
      orderTransaction(data).then(() => {
        this.blockChainPayVisible = true;
        this.payVisible = false;
        this.blockChainModel = this.payBlockChainModel;
      });
    },
    payByBlockChain() {
      let reg2 = /^[0-9A-Za-z]{40,90}$/;
      if (!reg2.test(this.transaction_hash)) {
        this.buy_address_input_verify = true;
        return;
      }
      let item = this.payItems;
      let trans_id =
        item.order_transaction[item.order_transaction.length - 1].id;
      let data = {
        transaction_id: trans_id,
        order_id: item.id,
        transaction_hash: this.transaction_hash,
      };
      orderTransaction(data).then((res) => {
        if (res && res.data) {
          this.payVisible = false;
          this.blockChainPayVisible = false;
          let trans_data = {
            transactions_id: trans_id,
            uuid: this.transaction_hash,
            payment_method: this.blockChainModel,
            pay_address: this.p_account_address_input,
          };
          transactions(trans_data).then(() => {});
        }
      });
    },
    async testEth() {
      let walletAccount = await getWalletAccounts();
      // this.addressArr = walletAccount.data[0];
      this.pay_address = walletAccount.data[0].address;
      this.getExchange("USDC");
      this.getExchange("USDT");
      this.getExchange("BUSD");
      this.getExchange("BSC_USD");
    },
    async getExchange(type) {
      await getExchangeRate(type).then((res) => {
        let str = "";
        if (res && res.data && res.data.length > 0) {
          let len = res.data.length;
          str = res.data[len - 1] && res.data[len - 1][`${type}/USD`];
        }
        // console.log(str);
        if (type === "USDC") {
          this.usdcRate = Number(str).toFixed(4);
          this.upDateList("USDC");
        } else if (type === "BUSD") {
          this.busdRate = Number(str).toFixed(4);
          this.upDateList("BUSD");
        } else if (type === "USDT") {
          this.usdtRate = Number(str).toFixed(4);
          this.upDateList("USDT");
        } else if (type === "BSC_USD") {
          this.bsc_usdRate = Number(str).toFixed(4);
          this.upDateList("BSC_USD");
        }
      });
    },
    payByCard() {
      if (this.is_use_coupon_pay && !this.coupon_number_pay) {
        this.is_coupon_error_pay = true;
        return;
      }
      if (this.is_use_coupon_pay && this.is_coupon_error_pay) {
        return;
      }

      let item = this.payItems;
      // let activeProduct = item.product;

      let trans_id =
        item.order_transaction[item.order_transaction.length - 1].id;
      // let success_url = window.location.origin + `/#/order`;
      // let cancel_url = window.location.origin + `/#/order`;
      // let postData = {
      //   line_items: [
      //     {
      //       quantity: 1,
      //       price_data: {
      //         currency: "usd",
      //         product_data: {
      //           name: activeProduct.name,
      //           images: ["https://vfoggie.fogworks.io/favicon_ood.png"], //""https://i.imgur.com/EHyR2nP.png
      //         },
      //         // unit_amount: Number(item.lastTotal_price) * 100, //50
      //         unit_amount: this.numMulti(Number(item.lastTotal_price), 100),
      //         // unit_amount: 50, //50
      //       },
      //     },
      //   ],
      //   mode: "payment",
      //   payment_method_types: ["card"],
      //   success_url: success_url,
      //   cancel_url: cancel_url,
      //   trans_id: trans_id,
      //   isRenewal: false,
      // };
      // payStripe(postData).then((res) => {
      //   if (res && res.data && res.data.url) {
      //     window.location.href = res.data.url;
      //   }
      // });

      this.payment_cloud_trans_id = trans_id;
      this.payment_cloud_show = true;
      this.payVisible = false;
      this.referer_name = "pay";
      this.payment_cloud_amount = this.coupon_number_pay
        ? Number(item.lastTotal_price) * 0.9
        : Number(item.lastTotal_price);
    },

    numMulti(num1, num2) {
      let baseNum = 0;
      try {
        baseNum += num1.toString().split(".")[1].length;
      } catch (e) {
        // console.log(e);
      }
      try {
        baseNum += num2.toString().split(".")[1].length;
      } catch (e) {
        // console.log(e);
      }
      return (
        (Number(num1.toString().replace(".", "")) *
          Number(num2.toString().replace(".", ""))) /
        Math.pow(10, baseNum)
      );
    },
    OpenProgress() {
      this.$router.push("/openOrder");
    },
    CancelOrder(item) {
      const that = this;
      this.$alert(this.$t("index.cancelTips"), this.$t("index.dialogTips"), {
        confirmButtonText: this.$t("index.confirm"),
        callback: (action) => {
          if (action === "confirm") {
            let data = {
              orderid: item.id,
              transaction_id: item.transaction_id,
              action: "CancelOrder",
            };
            cancelOrder(data).then(() => {
              that.initChangeTable();
            });
          }
        },
      });
    },
    DeleteOrder(item) {
      const that = this;
      this.$alert(this.$t("index.deleteTips"), this.$t("index.dialogTips"), {
        confirmButtonText: this.$t("index.confirm"),
        callback: (action) => {
          if (action === "confirm") {
            delOrder(item.id).then(() => {
              that.initChangeTable();
            });
          }
        },
      });
    },
    gotoDetail(item) {
      window.localStorage.setItem("detailItem", JSON.stringify(item));
      this.$router.push("/orderDetail");
    },
    filterTag(value, row) {
      return row.state === value;
    },
    doSearchOrder() {
      const that = this;
      that.currentState = "user_order";
      that.white_span_left = 0;
      if (this.currentOrderId) {
        var ipReg =
          /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/;
        if (ipReg.test(this.currentOrderId)) {
          getOrderSn(this.currentOrderId, "ip").then((res) => {
            let data = res.data;
            this.total = data.length;
            that.initOrderItem(data);
          });
        } else {
          getOrderSn(this.currentOrderId).then((res) => {
            let data = res.data;
            this.total = data.length;
            that.initOrderItem(data);
          });
        }
      } else {
        that.initOrder();
      }
    },
    doSearchClear() {
      if (this.currentOrderId === "") {
        return;
      }
      this.currentState = "user_order";
      this.currentOrderId = "";
      this.doSearchOrder();
    },
    doRefresh() {
      this.initOrder();
    },
    handleClick() {
      if (this.activeName === "Order") {
        this.$router.push("/order");
      } else if (this.activeName === "index") {
        this.$router.push("/index");
      } else if (this.activeName === "User") {
        this.$router.push("/User");
      } else if (this.activeName === "Billing") {
        this.$router.push("/Billing");
      } else if (this.activeName === "vood") {
        this.$router.push("/vood");
      }
    },
    handleTotal(data) {
      let total_price = 0;
      if (data.length > 1) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].state === "activated") {
            total_price = total_price + Number(data[i].total_price);
          }
        }
      } else if (data.length === 1) {
        total_price = total_price + Number(data[0].total_price);
      }
      return total_price;
    },
    handleProduct(data) {
      data = [data];
      const that = this;
      let icons = ["light", "normal", "store", "qstore"];
      that.dataList = [];
      for (let i = 0; i < data.length; i++) {
        let pricing = data[i].pricing.trim().replace(/'/g, '"');
        pricing = JSON.parse(pricing);
        let params = data[i].product_customField;
        let str = [];
        let s1 = "",
          s2 = "",
          s3 = "",
          s4 = "",
          s5 = "";
        for (let a = 0; a < params.length; a++) {
          // let s1 = "";
          if (params[a].field_key === "cpu") {
            s1 = params[a].field_value + that.$t("index.cpu");
          } else if (params[a].field_key === "memory") {
            s2 = params[a].field_value + "G RAM";
          } else if (params[a].field_key === "disk_type") {
            s3 = params[a].field_value.toUpperCase();
          } else if (params[a].field_key === "bandwidth") {
            s4 = params[a].field_value + "M";
          } else if (params[a].field_key === "disk_size") {
            s5 = params[a].field_value + "G";
          }
          // str.push(s1);
        }
        str = [s1, s2, s5, s3, s4];
        let discounnt =
          Number(pricing.monthly_discounted) * 12 -
          Number(pricing.annually_discounted);

        let last_annually =
          Number(pricing.annually) - Number(pricing.annually_discounted);
        // last_annually = Math.floor(last_annually * 100) / 100;
        last_annually = this.numMulti(last_annually, 100) / 100;
        let last_monthly =
          Number(pricing.monthly) - Number(pricing.monthly_discounted);
        // last_monthly = Math.floor(last_monthly * 100) / 100;
        last_monthly = this.numMulti(last_monthly, 100) / 100;
        let last_semiannual =
          Number(pricing.semiannual) - Number(pricing.semiannual_discounted);
        last_semiannual = this.numMulti(last_semiannual, 100) / 100;

        let item = {
          name: data[i].name,
          unit: data[i].piece_unit,
          monthPrice: pricing.monthly,
          yeaPrice: pricing.annually,
          semiannualPrice: pricing.semiannual,
          monthly_discounted: pricing.monthly_discounted,
          semiannual_discounted: pricing.semiannual_discounted,
          last_monthly: last_monthly,
          last_annually: last_annually,
          last_semiannual: last_semiannual,
          eth_monthly: pricing.eth_monthly,
          eth_annually: pricing.eth_annually,
          eth_semiannual: pricing.eth_semiannual,
          bnb_annually: pricing.bnb_annually,
          bnb_monthly: pricing.bnb_monthly,
          bnb_semiannual: pricing.bnb_semiannual,
          usdc_annually: (last_annually / this.usdcRate).toFixed(4),
          usdc_monthly: (last_monthly / this.usdcRate).toFixed(4),
          usdc_semiannual: (last_semiannual / this.usdcRate).toFixed(4),
          usdt_annually: (last_annually / this.usdtRate).toFixed(4),
          usdt_monthly: (last_monthly / this.usdtRate).toFixed(4),
          usdt_semiannual: (last_semiannual / this.usdtRate).toFixed(4),
          busd_annually: (last_annually / this.busdRate).toFixed(4),
          busd_monthly: (last_monthly / this.busdRate).toFixed(4),
          busd_semiannual: (last_semiannual / this.busdRate).toFixed(4),
          bsc_usd_annually: (last_annually / this.bsc_usdRate).toFixed(4),
          bsc_usd_monthly: (last_monthly / this.bsc_usdRate).toFixed(4),
          bsc_usd_semiannual: (last_semiannual / this.bsc_usdRate).toFixed(4),
          vofo_annually: (last_annually / this.vofoRate).toFixed(4),
          vofo_monthly: (last_monthly / this.vofoRate).toFixed(4),
          vofo_semiannual: (last_semiannual / this.vofoRate).toFixed(4),
          annually_discounted: pricing.annually_discounted,
          number:
            data[i].product_category && data[i].product_category.product_count,
          params: str.join(" + "),
          list_icon: icons[i % 4],
          id: data[i].id,
          publish_status: data[i].publish_status,
          category: data[i].product_category.name,
          remark: data[i].remark,
          product_category_id: data[i].product_category.id,
          paramsList: str,
          discounnt: discounnt,
        };
        return item;
      }
    },
    bytesToSize(bytes) {
      if (bytes === 0) return "0 KB";
      var k = 1024, // or 1024
        sizes = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        i = Math.floor(Math.log(bytes) / Math.log(k));

      // return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
      return Math.floor(bytes / Math.pow(k, i)) + " " + sizes[i];
    },
    async getHardware(postData, index, ips) {
      let data = await getHardwareIP(postData);
      if (data.data && data.data.value && data.data.value[postData.ips]) {
        let free_mem = data.data.value[postData.ips].mem_free_byte
          ? data.data.value[postData.ips].mem_free_bytes[0].value
          : 0;
        let user_mem = data.data.value[postData.ips].mem_used_bytes
          ? data.data.value[postData.ips].mem_used_bytes[0].value
          : 0;
        let total = Number(free_mem) + Number(user_mem);
        // let percentage = Number((Number(user_mem / total) * 100).toFixed(0));
        let hostData = data.data.value[postData.ips];
        let free_disk = 0;
        let total_disk = 0;
        for (let key in hostData) {
          if (key.indexOf("sdb") > -1) {
            if (
              hostData[key].disk_free_space &&
              hostData[key].disk_free_space[0] &&
              hostData[key].disk_free_space[0].value
            ) {
              free_disk += Number(hostData[key].disk_free_space[0].value);
            }
            if (
              hostData[key].disk_allocated_space &&
              hostData[key].disk_allocated_space[0] &&
              hostData[key].disk_allocated_space[0].value
            ) {
              total_disk += Number(hostData[key].disk_allocated_space[0].value);
            }
          } else if (key.indexOf("sda") > -1) {
            if (
              hostData[key].disk_free_space &&
              hostData[key].disk_free_space[0] &&
              hostData[key].disk_free_space[0].value
            ) {
              free_disk += Number(hostData[key].disk_free_space[0].value);
            }
            if (
              hostData[key].disk_allocated_space &&
              hostData[key].disk_allocated_space[0] &&
              hostData[key].disk_allocated_space[0].value
            ) {
              total_disk += Number(hostData[key].disk_allocated_space[0].value);
            }
          }
        }
        let user_disk = total_disk - free_disk;
        let percentage = Number(
          (Number(user_disk / total_disk) * 100).toFixed(0)
        );
        return {
          ips: ips,
          index: index,
          free_mem: free_mem || 0,
          user_mem: this.bytesToSize(user_mem) || 0,
          total: this.bytesToSize(total) || 0,
          free_disk: this.bytesToSize(free_disk) || 0,
          user_disk: this.bytesToSize(user_disk) || 0,
          total_disk: this.bytesToSize(total_disk) || 0,
          mempercentage: percentage || 0,
        };
      }
    },
    async initOrderItem(data) {
      // 创建过的订单的id
      let create_order_trans_id = localStorage.getItem("create-order");

      let arr = [];
      for (let i = 0; i < data.length; i++) {
        // if (data[i].is_delete === 0) {
        let order_transaction = data[i].order_transaction;
        let total_Prices = this.handleTotal(order_transaction);
        let len = data[i].order_transaction.length - 1;
        let status = data[i].state; //data[i].order_transaction[0].state
        let order = data[i].order_product_detail[0];
        let ips =
          data[i].vps_info &&
          data[i].vps_info[0] &&
          data[i].vps_info[0].dedicatedip;
        let monitorData = {
          ips: ips,
          index: i,
          free_mem: 0,
          user_mem: 0,
          total: 0,
          free_disk: 0,
          user_disk: 0,
          total_disk: 0,
          mempercentage: 0,
        };
        if (ips) {
          let postData = {
            size: 1,
            field_value: `{"gt":"now-10m"}`,
            only_host: true,
            ips: ips,
          };
          let hardData = await this.getHardware(postData, i, ips);
          if (hardData) {
            if (ips === hardData.ips) {
              monitorData = hardData;
              // this.orderList[monitorData.index] = { monitorData };
            }
          }
        }

        if (order) {
          let rent = order.new_rent || "";
          let type =
            order.rent === "free"
              ? this.$t("index.free")
              : this.$t("index.standard");
          let timestamp = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
          let showClock = false;
          let haveExpire = false;
          if (order.expire && Number(order.expire) * 1000 < timestamp) {
            showClock = true;
          } else {
            showClock = false;
          }
          if (
            order.expire &&
            Number(order.expire) * 1000 < new Date().getTime()
          ) {
            haveExpire = true;
          }
          let expire_remove = this.getExpireRemove(order.expire);
          let exprire = this.handleTimeStamp(order.expire);
          let product = order.product;
          product = this.handleProduct(product);
          // this.orderExpire = data[i].order_transaction[len].expire;
          let orderExpire = data[i].order_transaction[len].expire;

          var date = new Date();
          var now = date.getTime();
          var pastDate = 0;
          pastDate = now + orderExpire * 1000;
          let ssh = "";
          if (data[i].vps_info && data[i].vps_info[0]) {
            ssh = `sshpass -p "${data[i].vps_info[0].password}" ssh -o StrictHostKeyChecking=no -p ${data[i].vps_info[0].port} ${data[i].vps_info[0].username}@${data[i].vps_info[0].dedicatedip}`;
          }

          let total_price_detail = 0;
          if (rent !== "free") {
            let order_transaction_data =
              data[i]["order_transaction"][
                data[i]["order_transaction"].length - 1
              ];
            let rent_detail =
              rent === "monthly"
                ? this.$t("index.month")
                : rent === "semiannual"
                ? this.$t("index.semiannual")
                : this.$t("index.year");

            if (order_transaction_data.payment_method === "card") {
              total_price_detail =
                "$" + order_transaction_data.total_price + "/" + rent_detail;
            } else {
              let pricing =
                data[i].order_product_detail &&
                data[i].order_product_detail[0].product &&
                data[i].order_product_detail[0].product.pricing &&
                JSON.parse(
                  data[i].order_product_detail[0].product.pricing
                    .trim()
                    .replace(/'/g, '"')
                );
              let total_Prices = "-";
              if (pricing) {
                if (
                  order_transaction_data.payment_method === "eth" &&
                  rent === "monthly"
                ) {
                  total_Prices = pricing.eth_monthly;
                } else if (
                  order_transaction_data.payment_method === "eth" &&
                  rent === "annually"
                ) {
                  total_Prices = pricing.eth_annually;
                } else if (
                  order_transaction_data.payment_method === "eth" &&
                  rent === "semiannual"
                ) {
                  total_Prices = pricing.eth_semiannual;
                } else if (
                  order_transaction_data.payment_method === "bnb" &&
                  rent === "monthly"
                ) {
                  total_Prices = pricing.bnb_monthly;
                } else if (
                  order_transaction_data.payment_method === "bnb" &&
                  rent === "annually"
                ) {
                  total_Prices = pricing.bnb_annually;
                } else if (
                  order_transaction_data.payment_method === "bnb" &&
                  rent === "semiannual"
                ) {
                  total_Prices = pricing.bnb_semiannual;
                } else if (
                  order_transaction_data.payment_method === "usdc" &&
                  rent === "monthly"
                ) {
                  total_Prices = pricing.usdc_monthly;
                } else if (
                  order_transaction_data.payment_method === "usdc" &&
                  rent === "annually"
                ) {
                  total_Prices = pricing.usdc_annually;
                } else if (
                  order_transaction_data.payment_method === "usdc" &&
                  rent === "semiannual"
                ) {
                  total_Prices = pricing.usdc_semiannual;
                } else if (
                  order_transaction_data.payment_method === "usdt" &&
                  rent === "monthly"
                ) {
                  total_Prices = pricing.usdt_monthly;
                } else if (
                  order_transaction_data.payment_method === "usdt" &&
                  rent === "annually"
                ) {
                  total_Prices = pricing.usdt_annually;
                } else if (
                  order_transaction_data.payment_method === "usdt" &&
                  rent === "semiannual"
                ) {
                  total_Prices = pricing.usdt_semiannual;
                } else if (
                  order_transaction_data.payment_method === "busd" &&
                  rent === "monthly"
                ) {
                  total_Prices = pricing.busd_monthly;
                } else if (
                  order_transaction_data.payment_method === "busd" &&
                  rent === "annually"
                ) {
                  total_Prices = pricing.busd_annually;
                } else if (
                  order_transaction_data.payment_method === "busd" &&
                  rent === "semiannual"
                ) {
                  total_Prices = pricing.busd_semiannual;
                } else if (
                  order_transaction_data.payment_method === "bsc_usd" &&
                  rent === "monthly"
                ) {
                  total_Prices = pricing.bsc_usd_monthly;
                } else if (
                  order_transaction_data.payment_method === "bsc_usd" &&
                  rent === "annually"
                ) {
                  total_Prices = pricing.bsc_usd_annually;
                } else if (
                  order_transaction_data.payment_method === "bsc_usd" &&
                  rent === "semiannual"
                ) {
                  total_Prices = pricing.bsc_usd_semiannual;
                } else if (
                  order_transaction_data.payment_method === "vofo" &&
                  rent === "monthly"
                ) {
                  total_Prices = pricing.vofo_monthly;
                } else if (
                  order_transaction_data.payment_method === "vofo" &&
                  rent === "annually"
                ) {
                  total_Prices = pricing.vofo_annually;
                } else if (
                  order_transaction_data.payment_method === "vofo" &&
                  rent === "semiannual"
                ) {
                  total_Prices = pricing.vofo_semiannual;
                }
              }
              total_price_detail =
                order_transaction_data.payment_method.toUpperCase() +
                " " +
                total_Prices +
                "/" +
                rent_detail;
            }
            // total_price_detail = `$${order_transaction_data.total_price}(Foggie NFT + 1 ${rent === 'monthly'? 'month':'year'} Foggie rent fee)`;
            total_price_detail = `$${order_transaction_data.total_price}`;
          }

          // 从 localStorage 拿出标记的订单, 如果匹配到这个订单已经paid, 就上报事件
          let order_paid =
            status == "paid" ||
            status == "pending_start" ||
            status == "starting" ||
            status == "activated";
          if (create_order_trans_id != null && order_paid) {
            let transaction_id = data[i].order_transaction[len].id;
            if (transaction_id == create_order_trans_id) {
              // gtag("event", "purchase", {
              //   transaction_id: transaction_id,
              //   value: total_Prices,
              //   currency: "USD",
              //   payment_method: data[i]["order_transaction"][0].payment_method,
              //   type: type,
              // });
              // 上报完之后， 删除掉标记
              localStorage.removeItem("create-order");
            }
          }

          let deploy_state = "";
          if (
            data[i].vps_info &&
            data[i].vps_info[0] &&
            data[i].vps_info[0].deploy_cbs_gateway_state
          ) {
            deploy_state = data[i].vps_info[0].deploy_cbs_gateway_state;
          }
          let payment_method = data[i].order_transaction[len].payment_method;
          let is_wallet = false;
          if (
            payment_method === "usdc" ||
            payment_method === "usdt" ||
            payment_method === "busd" ||
            payment_method === "bsc_usd"
          ) {
            is_wallet = true;
          }

          let item = {
            id: data[i].id,
            transaction_id: data[i].order_transaction[len].id,
            orderExpire: this.orderExpire,
            created_at: this.transferTime(data[i].created_at),
            payment_method: data[i]["order_transaction"][0].payment_method,
            total_price: total_Prices,
            showClock: showClock,
            haveExpire: haveExpire,
            Price: total_price_detail,
            type: type, //+ " - " + product.name
            params: product.params,
            product: product,
            monthly_discounted: product.monthly_discounted,
            annually_discounted: product.annually_discounted,
            semiannual_discounted: product.semiannual_discounted,
            name: product.name,
            sellType: order.new_rent,
            dueDate: exprire,
            expire_remove: expire_remove,
            order_sn: data[i].order_sn, //data[i].order_sn.split("order_")[1]
            status: this.$t("index." + status),
            // leftTime: leftTime,
            state: status,
            vps_info: data[i].vps_info,
            ssh: ssh,
            main_state: data[i].state,
            // main_state: 'starting',
            deploy_state: deploy_state,
            main_status: this.$t("index." + data[i].state),
            transaction_state: data[i].order_transaction[len].state,
            is_wallet,
            transaction_status: this.$t(
              "index." + data[i].order_transaction[len].state
            ),
            order_transaction: data[i].order_transaction,
            isShowTransaction: data[i].order_transaction.length > 1,
            monitorData: monitorData,
            // useMem: (monitorData && monitorData.user_mem) || 0,
            // mempercentage: (monitorData && monitorData.percentage) || 0,
            // totalMem: (monitorData && monitorData.total) || 0,
            lastTotal_price: data[i].order_transaction[len].total_price,
            timeLast: pastDate,
            vood_ip:
              (data[i].vps_info &&
                data[i].vps_info[0] &&
                data[i].vps_info[0].dedicatedip) ||
              "-",
            vood_id:
              (data[i].vps_info &&
                data[i].vps_info[0] &&
                data[i].vps_info[0].device_id) ||
              "-",
            // free_mem: monitorData.free_mem (monitorData && monitorData.total) || 0,
            vood_status:
              data[i].vps_info[0] && data[i].vps_info[0].activation
                ? "Activated"
                : "Inactivated",
            device_status: data[i].vps_info[0] && data[i].vps_info[0].is_active,
            vood_status_activated:
              data[i].vps_info[0] && data[i].vps_info[0].activation
                ? true
                : false,
            deploy_vood_gateway_state:
              data[i].vps_info[0] &&
              data[i].vps_info[0].deploy_vood_gateway_state,
            isExprire: false,
            active_click: true,
          };
          arr.push(item);
        }
        // }
      }
      this.orderList = arr;
      this.getOrderData = true;
      this.updateDetail();
      this.ui();
    },
    getExpireRemove(time) {
      let expire_remove_d = 0;
      let expire_remove_h = 0;
      let expire_remove_m = 0;
      let expire_remove_s = 0;
      let cur_tiem = new Date().getTime();
      let isExpire = cur_tiem - time * 1000 > 0;
      let expire_remove = time * 1000 + 7 * 24 * 3600 * 1000 - cur_tiem;
      if (expire_remove > 0) {
        expire_remove_d = Math.floor(expire_remove / (24 * 3600 * 1000));
        expire_remove_h = Math.floor(expire_remove / (3600 * 1000)) % 24;
        expire_remove_m = Math.floor(expire_remove / (60 * 1000)) % 60;
        expire_remove_s = Math.floor(expire_remove / 1000) % 60;
      } else {
        expire_remove = -1;
      }

      return {
        isExpire,
        order_expire: time,
        time: expire_remove,
        expire_remove_d,
        expire_remove_h,
        expire_remove_m,
        expire_remove_s,
      };
    },

    initChangeTable() {
      this.currentPage = 1;
      if (
        this.currentState &&
        this.currentState !== "user_order_count" &&
        this.currentState !== "user_order"
      ) {
        this.searchStatusOrder();
      } else {
        this.initOrder();
      }
    },
    changeTable(currentPage) {
      this.currentPage = currentPage;
      if (
        this.currentState &&
        this.currentState !== "user_order_count" &&
        this.currentState !== "user_order"
      ) {
        this.searchStatusOrder();
      } else {
        this.initOrder();
      }
    },
    handleSizeChange(currentSize) {
      this.currentPageSize = currentSize;
      if (
        this.currentState &&
        this.currentState !== "user_order_count" &&
        this.currentState !== "user_order"
      ) {
        this.searchStatusOrder();
      } else {
        this.initOrder();
      }
    },
    async initOrder() {
      this.loading = true;
      let data = {
        pn: this.currentPage,
        ps: this.currentPageSize,
      };
      let res = await userOrderListPage(data);
      this.total = res.count;
      this.loading = false;
      this.initOrderItem(res.data);
      // this.userOrderCounts = [];
      let userOrderCounts = await userOrderCount();
      if (userOrderCounts && userOrderCounts.data) {
        let data = userOrderCounts.data;
        // let arr = ["success", "warning", "primary", "danger", "info"];
        let arr = ["info", "info", "info", "info", "info"];
        let i = -1;
        this.userOrderCounts = [];
        for (let key in data) {
          if (
            data[key] > 0 &&
            (key === "activated_count" ||
              key === "user_order_count" ||
              key === "activation_vps_count" ||
              key === "starting_count" ||
              key === "expiring_order_count")
          ) {
            i = i + 1;
            let item = {
              name: key,
              value: data[key],
              type: arr[i % 5],
            };
            this.userOrderCounts.push(item);
          }
        }
      }
    },
    updateDetail() {
      if (this.detailData && this.detailData.order_sn) {
        for (let i = 0; i < this.orderList.length; i++) {
          if (this.detailData.order_sn === this.orderList[i].order_sn) {
            this.detailData = this.orderList[i];
          }
        }
      }
    },
    copyID(text, type) {
      var input = document.createElement("input"); // 创建input对象
      input.value = text; // 设置复制内容
      document.body.appendChild(input); // 添加临时实例
      input.select(); // 选择实例内容
      document.execCommand("Copy"); // 执行复制
      document.body.removeChild(input); // 删除临时实例
      let msg = type === "vood" ? "Copying  Foggie ID!" : "Copying  Order ID!";
      this.$message.success(msg);
    },
    copyPayingAddress(address) {
      var input = document.createElement("input"); // 创建input对象
      input.value = address; // 设置复制内容
      document.body.appendChild(input); // 添加临时实例
      input.select(); // 选择实例内容
      document.execCommand("Copy"); // 执行复制
      document.body.removeChild(input); // 删除临时实例
      let msg = "Copying  Paying Address!";
      this.$message.success(msg);
    },
    oodLink(oodID) {
      console.log(oodID);
      window.localStorage.setItem(
        "voodItem",
        JSON.stringify({ device_id: oodID })
      );
      this.activeName = "vood";
      this.$router.push("/voodDetail");
    },
    initTable() {
      this.initChangeTable();
    },

    // css (o, key) {
    //   return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o, false)[key];
    // },
    zero(n, top) {
      (n = parseInt(n, 10)), (top = top || "00");
      if (n > 0) {
        if (n <= 9) {
          n = "0" + n;
        }
        return String(n);
      } else {
        return top.toString();
      }
    },
    angle(v, total) {
      var scale = v / total,
        offsetx = 0,
        offsety = 0,
        an;
      var angle = scale * 360; //当前角度值
      //IE矩阵角度值计算
      var m11 = Math.cos(((Math.PI * 2) / 360) * angle);
      var m21 = Math.sin(((Math.PI * 2) / 360) * angle);
      if (angle > 90) {
        an = angle - 90;
      } else {
        an = angle;
      }
      offsety = offsetx =
        (50 -
          50 * Math.sqrt(2) * Math.cos((Math.PI / 180) * Math.abs(an - 45))) /
        2;
      return {
        trans: "rotate(" + angle + "deg)",
        ie:
          "progid:DXImageTransform.Microsoft.Matrix(M11=" +
          m11 +
          ",M12=-" +
          m21 +
          ",M21=" +
          m21 +
          ",M22=" +
          m11 +
          ",SizingMethod='auto expand',FilterType='nearest neighbor')",
        offset: {
          x: offsetx,
          y: offsety,
        },
      };
    },
    cartoon(l, r, v, part) {
      var total = part * 2,
        angleV,
        anglePart;
      if (v <= part && v > 0) {
        angleV = this.angle(v, total);
        l.style.display = "block";
        l.style.filter = angleV.ie;
        l.style.MozTransform =
          l.style.WebkitTransform =
          l.style.transform =
            angleV.trans;
        r.style.display = "none";
        //ie 旋转非居中旋转的修复
        if (document.all) {
          l.style.left = angleV.offset.x + "px";
          l.style.top = angleV.offset.y + "px";
        }
      } else {
        v = Math.abs(v - part);
        angleV = this.angle(v, total);
        anglePart = this.angle(part, total);
        l.style.display = "block";
        l.style.filter = anglePart.ie;
        l.style.MozTransform =
          l.style.WebkitTransform =
          l.style.transform =
            anglePart.trans;
        r.style.display = "block";
        r.style.filter = angleV.ie;
        r.style.MozTransform =
          r.style.WebkitTransform =
          r.style.transform =
            angleV.trans;
        if (document.all) {
          r.style.left = angleV.offset.x + "px";
          r.style.top = angleV.offset.x + "px";
        }
      }
    },
    ui() {
      let $q = function (param) {
        return document.querySelector(param);
      };
      for (let i = 0; i < this.orderList.length; i++) {
        if (this.orderList[i] && this.orderList[i].order_sn) {
          let o = {
            day: $q(`#${this.orderList[i].order_sn} .days`),
            hour: $q(`#${this.orderList[i].order_sn} .hours`),
            minu: $q(`#${this.orderList[i].order_sn} .minuts`),
            sec: $q(`#${this.orderList[i].order_sn} .seconds`),
            dayl: $q(`#${this.orderList[i].order_sn} .dayRotateLeft`),
            dayr: $q(`#${this.orderList[i].order_sn} .dayRotateRight`),
            hourl: $q(`#${this.orderList[i].order_sn} .hourRotateLeft`),
            hourr: $q(`#${this.orderList[i].order_sn} .hourRotateRight`),
            minutel: $q(`#${this.orderList[i].order_sn} .minuteRotateLeft`),
            minuter: $q(`#${this.orderList[i].order_sn} .minuteRotateRight`),
            sceondl: $q(`#${this.orderList[i].order_sn} .sceondRotateLeft`),
            sceondr: $q(`#${this.orderList[i].order_sn} .sceondRotateRight`),
          };
          if (o.hour) {
            let dt = new Date();
            dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
            let mytime = dt.getTime();
            let dueDate = new Date(this.orderList[i].dueDate).getTime();
            let exprire = dueDate - mytime;
            // exprire = exprire < 0 ? 0 : exprire;
            if (exprire <= 0) {
              exprire = 0;
              this.orderList[i].isExprire = true;
            } else {
              let d = Math.floor(exprire / (24 * 3600 * 1000));
              let h = Math.floor(
                (exprire % (24 * 3600 * 1000)) / (3600 * 1000)
              );
              let m = Math.floor((exprire % (3600 * 1000)) / 60000);
              let s = Math.floor((exprire % 60000) / 1000);
              o.day.innerHTML = this.zero(d);
              o.hour.innerHTML = this.zero(h);
              o.minu.innerHTML = this.zero(m);
              o.sec.innerHTML = this.zero(s);
              this.cartoon(o.dayl, o.dayr, h, 5);
              this.cartoon(o.hourl, o.hourr, h, 12);
              this.cartoon(o.minutel, o.minuter, m, 30);
              this.cartoon(o.sceondl, o.sceondr, s, 30);
            }
          }
        }
      }
      setTimeout(this.ui, 1000);
    },

    upDatePeople() {
      let data = {
        user_id: this.userId,
        people_id: this.bindInfo.owner,
        // master_vood_id: this.bindInfo.device_id,
        status: "active_pending",
      };
      updatePeopleInfo(data).then((res) => {
        console.log("updatePeopleInfo", res);
      });
    },
    async createInsideAccount() {
      // this.isInsideBindClick = true;
      if (this.isOutsideBindClick) {
        return;
      }
      this.lockBind("in");
      const isCreated = await this.createDMCAccount();
      console.log(`createDMCAccount result: ${isCreated}`);
      if (isCreated) {
        this.bindDMCAccount();
        // const isBinded = await this.bindDMCAccount();
        // if (!isBinded) {
        //   Message({
        //     message:
        //       "Failed to bind DMC account automatically, please bind DMC wallet manually.",
        //     type: "warning",
        //     duration: 3 * 1000,
        //   });
        //   // this.isInsideBindClick = false;
        //   this.unLockBind();
        // } else {
        //   location.reload();
        // }
      } else {
        Message({
          message:
            "Failed to create DMC account automatically, please bind DMC wallet manually.",
          type: "warning",
          duration: 3 * 1000,
        });
        // this.isInsideBindClick = false;
        this.unLockBind();
      }
    },
    lockBind(type) {
      if (type === "out") {
        this.isOutsideBindClick = true;
      } else {
        this.isInsideBindClick = false;
      }
      // this.isBindClick = true;
      if (this.lock_num > 0) {
        clearInterval(this.lock_timer);
      }
      this.lock_num = 20;
      this.lock_timer = setInterval(() => {
        if (
          this.lock_num === 0 ||
          (!this.isOutsideBindClick && type === "out") ||
          (!this.isInsideBindClick && type === "in")
        ) {
          this.unLockBind();
          clearInterval(this.lock_timer);
        } else {
          this.lock_num -= 1;
        }
      }, 1000);
    },
    unLockBind() {
      this.lock_num = 0;
      this.isOutsideBindClick = false;
      this.isInsideBindClick = false;
      this.activeCreateAndActivateVisible = false;
      this.bindWalletVisible = true;
    },
    createOutsideAccount() {
      if (this.isInsideBindClick) {
        return;
      }
      this.lockBind("out");
      this.bindDMCAccount();

      // const chainId =
      //   "03803e416d091426198bfc490b6122b684ffecd4894d98fb8e2631758c716f47";
      // const dmcNetwork = {
      //   blockchain: "dmc",
      //   protocol: window.location.protocol === "https:" ? "https" : "http",
      //   chainId,
      //   // host: "154.39.158.47", //154.22.122.40
      //   host: "154.22.122.40", //154.22.122.40
      //   port: 8801,
      // };

      // this.lockBind('out');

      // if (window.dmcironman) {
      //   window.dmcironman
      //     .getIdentity({
      //       accounts: [dmcNetwork],
      //     })
      //     .then(async (identity) => {
      //       if (identity.name) {
      //         this.dmcAccount = identity.name.split("@")[0];
      //         this.lockBind('out');
      //         this.bindDMCAccount();
      //         // const isBinded = await this.bindDMCAccount();
      //         // if (!isBinded) {
      //         //   Message({
      //         //     message:
      //         //       "Failed to bind DMC wallet.",
      //         //     type: "warning",
      //         //     duration: 3 * 1000,
      //         //   });
      //         //   this.unLockBind();
      //         //   // this.isOutsideBindClick = false;
      //         // } else {
      //         //   this.bindWalletVisible = false;
      //         //   location.reload();
      //         // }
      //       }
      //     })
      //     .catch((e) => {
      //       console.log(e, "111111");
      //     });
      // } else {
      //   // this.unLockBind();
      //   // this.isOutsideBindClick = false;
      //   console.log("dmcNetwork: ", dmcNetwork);
      //   this.$alert(`<p>${this.$t("index.wallet_tips1")}</p><a class="dmc-wallet-download" href="https://dmctech.io/index.php?c=category&id=11#id11" target="_blank">${this.$t("index.download_address")}</a>`,
      //     this.$t("index.dialogTips"), {
      //     dangerouslyUseHTMLString: true,
      //   });
      // }
    },
    // 创建DMC账户
    async createDMCAccount() {
      const currentToken = getToken();
      console.log(`currentToken is: ${currentToken}`);
      // const currentToken = "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NzAwMzI3ODUsInVzZXJuYW1lIjoiVkY2NTE0NjE1NDcxOTI1NSIsImVtYWlsIjoicnhnZnppYmxAYmNjdG8uY2MiLCJBdXRob3JpemVkIjp0cnVlfQ.Kb8qL0Xyle46CHh66aYp1Yk01-OKblaUNQBITYXFPAc";
      if (!currentToken) {
        Message({
          message: this.$t("vood.tokenNotExist"),
          type: "warning",
          duration: 2 * 1000,
        });
        return false;
      }
      try {
        const r = await DMCAccountCreate(currentToken);
        // const retData = await r.json();
        if (r.result.dmc_account) {
          const dmcAccount = r.result.dmc_account;
          this.dmcAccount = dmcAccount;
          console.log("retData>>", JSON.stringify(r));
          return true;
        }
        return false;
      } catch (error) {
        console.error(`DMCAccountCreate failed: ${error}`);
        return false;
      }
    },
    // 绑定DMC账户
    async bindDMCAccount() {
      const that = this;
      //vood 绑定账户
      const postData = {
        account: this.dmcAccount,
        ood_id: this.bindInfo.device_id,
        owner_id: this.dmcAccount, //⼀定和account ⼀致，后期考虑分开
        signature: "xxx",
      };
      try {
        if (this.currentDmc) {
          dmcBind(postData).then(
            () => {
              const voodData = {
                device_id: that.bindInfo.device_id,
                bind_dmc: true,
              };
              that.updateVoodList(voodData, postData, that.vpsId); //更新vood列表接口
            },
            (err) => {
              let error =
                err &&
                err.response &&
                err.response.data &&
                err.response.data.error;
              Message({
                message: error || `this device already bind`,
                type: "warning",
                duration: 5 * 1000,
              });
              let _postData = {
                account: "",
                ood_id: that.bindInfo.device_id,
                owner_id: "", //⼀定和account ⼀致，后期考虑分开
                signature: "",
              };
              dmcFreeRegister(_postData);
              this.unLockBind();
            }
          );
        } else {
          const update_user = await that.updateUserInfo();
          if (update_user) {
            dmcBind(postData).then(
              () => {
                let voodData = {
                  device_id: that.bindInfo.device_id,
                  bind_dmc: true,
                };
                that.updateVoodList(voodData, postData, that.vpsId); //更新vood列表接口
              },
              (err) => {
                let error =
                  err &&
                  err.response &&
                  err.response.data &&
                  err.response.data.error;
                Message({
                  message: error || `this device already bind`,
                  type: "warning",
                  duration: 5 * 1000,
                });
                let _postData = {
                  account: "",
                  ood_id: that.bindInfo.device_id,
                  owner_id: "", //⼀定和account ⼀致，后期考虑分开
                  signature: "",
                };
                dmcFreeRegister(_postData).then(() => {});
                this.unLockBind();
              }
            );
          } else {
            this.unLockBind();
          }
        }
      } catch (err) {
        let error =
          err && err.response && err.response.data && err.response.data.error;
        Message({
          message: error || `this device already bind`,
          type: "warning",
          duration: 5 * 1000,
        });
        let _postData = {
          account: "",
          ood_id: that.bindInfo.device_id,
          owner_id: "", //⼀定和account ⼀致，后期考虑分开
          signature: "",
        };
        dmcFreeRegister(_postData);
        // return false;
      }
    },
    //更新用户信息
    async updateUserInfo() {
      let postdata = {
        dmc: this.dmcAccount,
        wallet_type: "wallet",
      };
      await updateUser(this.userId, postdata);
      return true;
    },
    //更新vood列表信息
    async updateVoodList(voodData, postData, vps_id) {
      const that = this;
      updateVoodDmc(voodData).then((res) => {
        if (res.code === 200) {
          let vpsData = {
            vps_ids: [vps_id],
          };
          that.updateVoodGateway(vpsData, postData);
        } else {
          that.freeRegister(postData);
        }
      }),
        () => {
          that.freeRegister(postData);
        };
    },

    //开始部署网关
    async updateVoodGateway(vpsData, postData) {
      const that = this;
      updateVoodGateway(vpsData).then(
        (res) => {
          if (res.code === 200) {
            // that.getAward();
            let data = {
              ood_id: this.bindInfo.device_id,
              owner_id: this.dmcAccount,
            };
            Message({
              // message: `Bind ${that.dmcAccount} success`,
              message: "Bind Account success",
              type: "success",
              duration: 5 * 1000,
            });
            bindtask(data).finally(() => {
              location.reload();
            });

            // let items = {
            //   page: 1,
            //   size: this.currentPageSize,
            // };
            // this.$emit("changes", items);
          } else {
            that.freeRegister(postData);
          }
        },
        () => {
          that.freeRegister(postData);
        }
      ); //调用部署接口
    },

    //绑定激活后完成用户首次任务，可领取积分
    async getAward() {
      let data = {
        ood_id: this.bindInfo.device_id,
        owner_id: this.dmcAccount,
      };
      bindtask(data);
    },
    //若失败，则解绑账户
    async freeRegister(postData) {
      let _postData = {
        account: "",
        ood_id: postData.ood_id,
        owner_id: "", //⼀定和account ⼀致，后期考虑分开
        signature: "",
      };
      await dmcFreeRegister(_postData);
    },
    upDateList(type) {
      for (let i = 0; i < this.orderList.length; i++) {
        if (
          this.orderList[i].product.last_monthly &&
          this.orderList[i].product.last_annually &&
          this.orderList[i].product.last_semiannual
        ) {
          if (type === "USDC") {
            this.orderList[i].product.usdc_monthly = (
              this.orderList[i].product.last_monthly / this.usdcRate
            ).toFixed(4);
            this.orderList[i].product.usdc_annually = (
              this.orderList[i].product.last_annually / this.usdcRate
            ).toFixed(4);
            this.orderList[i].product.usdc_semiannual = (
              this.orderList[i].product.last_semiannual / this.usdcRate
            ).toFixed(4);
          } else if (type === "USDT") {
            this.orderList[i].product.usdt_monthly = (
              this.orderList[i].product.last_monthly / this.usdtRate
            ).toFixed(4);
            this.orderList[i].product.usdt_annually = (
              this.orderList[i].product.last_annually / this.usdtRate
            ).toFixed(4);
            this.orderList[i].product.usdt_semiannual = (
              this.orderList[i].product.last_semiannual / this.usdtRate
            ).toFixed(4);
          } else if (type === "BUSD") {
            this.orderList[i].product.busd_monthly = (
              this.orderList[i].product.last_monthly / this.busdRate
            ).toFixed(4);
            this.orderList[i].product.busd_annually = (
              this.orderList[i].product.last_annually / this.busdRate
            ).toFixed(4);
            this.orderList[i].product.busd_semiannual = (
              this.orderList[i].product.last_semiannual / this.busdRate
            ).toFixed(4);
          } else if (type === "BSC_USD") {
            this.orderList[i].product.bsc_usd_monthly = (
              this.orderList[i].product.last_monthly / this.bsc_usdRate
            ).toFixed(4);
            this.orderList[i].product.bsc_usd_annually = (
              this.orderList[i].product.last_annually / this.bsc_usdRate
            ).toFixed(4);
            this.orderList[i].product.bsc_usd_semiannual = (
              this.orderList[i].product.last_semiannual / this.bsc_usdRate
            ).toFixed(4);
          }
        }
      }
    },
  },
};
</script>

<style lang="scss">
@import "@/static/style/order.scss";
$fontColor: #03040a;
.order_box {
  width: 100%;
  height: 100vh;
  // min-height: 800px;
  .no-order {
    width: 1000px;
    height: 750px;
    margin: 0 auto;
    border-radius: 36px;
    background: rgba(255, 255, 255, 0.1);
    text-align: center;
    img {
      margin-top: 50px;
    }
    .no-order-p {
      display: flex;
      flex-flow: row;
      width: 360px;
      height: 30px;
      margin: 40px auto 30px auto;
      .p1 {
        width: 100px;
        height: 1px;
        background: #fff;
      }
      .p2 {
        margin: 0px;
        width: 160px;
        height: 30px;
        line-height: 30px;
        font-size: 16px;
        color: #fff;
      }
    }
    .no-order-btn {
      margin-top: -50px;
      width: 120px;
    }
  }
  .order_title {
    margin: 0 auto 60px;
    max-width: 1040px;
    height: 70px;
    color: #fff;
    font-size: 36px;
    font-weight: bolder;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    position: relative;
    align-items: baseline;
    justify-content: flex-end;
    // flex-direction: row-reverse;
    // margin-bottom: 60px;
    .search_clear {
      background: transparent;
      border: none;
      font-size: 20px;
      &:hover {
        transform: scale(1.2);
      }
    }
    .el-icon-search {
      font-size: 20px;
    }
    .el-input__inner {
      width: 300px;
      height: 30px;
      font-size: 12px;
      margin-left: 60px;
      background: transparent;
      color: #fff;
      // border-radius: 20px 0 0 20px;
      border-radius: 20px;
    }
    .el-input-group__append {
      background: transparent;
      border-radius: 0 20px 20px 0;
      .el-button {
        color: #fff;
      }
    }
    .el-input-group {
      width: auto;
    }
    .el-input {
      width: 320px !important;
    }
  }
  .order_refresh {
    // background-color: #ff9b3d;
    background-color: $fontColor;
    border: none;
    height: 36px;
    margin-left: 20px;
    position: absolute;
    right: 0;
    &:hover {
      transform: scale(1.2);
    }
  }
  .order_table {
    min-height: 500px;
    .el-table__empty-text {
      color: #fff;
    }
  }
  .order_list {
    .el-table thead .cell {
      // color: #fff;
      // color: rgba(255, 255, 255, 0.8);
      color: #03040a;
    }
    .cell {
      display: flex;
    }
    .rowTimeLast {
      color: #fff;
      height: 30px;
      text-align: center;
      line-height: 30px;
      cursor: pointer;
      font-size: 20px;
      // color: #ff9b3d;
      color: $fontColor;
      margin-left: 10px;
      width: 86px;
      &:hover {
        transform: scale(1.2);
      }
    }
    .successBtn {
      background: #55b99f;
      border: none;
      color: #fff;
    }
    .warnBtn {
      // background: #ff9b3d;
      // border: none;
      // color: #fff;
      background: transparent;
      color: #e5dede;
      border-radius: 20px;
      cursor: pointer;
      // background: #ff9b3d;
      background: $fontColor;
      color: #fff;
      border: none;
    }
    .normalBtn {
      background: #7c3ecd;
      border: none;
      color: #fff;
    }
    // padding: 20px;
    .demo-table-expand {
      font-size: 0;
    }
    .demo-table-expand label {
      width: 90px;
      color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
    .el-table {
      color: #eee;
    }
    .el-table,
    .el-table tr,
    .el-table th.el-table__cell {
      background: transparent;
    }
    .el-table--border::after,
    .el-table--group::after,
    .el-table::before {
      background: transparent;
    }
    .el-table td.el-table__cell {
      // border: none;
      // border-color: #3f3d3d;
    }
    .el-table__body-wrapper .cell {
      font-size: 14px;
      cursor: pointer;
      color: rgba(255, 255, 255, 0.6);
      color: #03040a;
      // background-image: -webkit-linear-gradient(left, #55b99f, #7c3ecd);
      // -webkit-background-clip: text;
      // -webkit-text-fill-color: transparent;
    }
    .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
      background-color: #4b525c;
      background: rgba(245, 244, 242, 0.6);
      cursor: pointer;
      color: rgba(0, 0, 0, 0.5);
    }
    .el-table--enable-row-hover
      .el-table__body
      tr:hover
      > td.el-table__cell
      .cell {
      color: rgba(0, 0, 0, 0.5);
    }
    .el-table--enable-row-hover
      .el-table__body
      tr:hover
      > td.el-table__expanded-cell {
      color: #99a9bf;
      color: #eee;
      // background: #f5f4f2;
    }
    .el-table__expand-icon {
      .el-icon-arrow-right {
        color: #fff;
        // -webkit-text-fill-color: #ff9b3d;
        -webkit-text-fill-color: $fontColor;
        font-size: 20px;
        margin-top: -10px;
      }
    }

    .el-table__expanded-cell {
      background-color: #282525;
      padding: 0 20px;
      color: #fff;
      box-shadow: 1px 0 6px rgb(0 0 0 / 10%);
      background: rgba(117, 122, 155, 0.15);
      // border: 0.0625rem solid rgba(255, 255, 255, 0.5) !important;
      // border-radius: 10px;
      .el-form-item__label {
        width: 150px;
        color: #fff;
      }
    }
  }
  .order_page {
    // margin-top: 20px;
    margin: 20px auto;
    background-color: rgba(83, 172, 208, 0.2) !important;
    -webkit-backdrop-filter: blur(20px) saturate(100%);
    backdrop-filter: blur(20px) saturate(100%);
    padding: 20px 10px;
    max-width: 1000px;
  }
}
.right_search {
  height: 40px;
}
.all_count {
  display: flex;
  height: 70px;
  min-width: 200px;
  .el-tag {
    // margin-right: 20px;
    border-radius: 0;
    clear: both;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    margin-bottom: 10px;
    background: transparent;
    padding: 0 14px;
    cursor: pointer;
    // border: 1px solid #ff9b3d;
    // color: #fff;
    border: 1px solid #5f4fd5;
    color: #5f4fd5;
    // &:hover {
    //   transform: scale(1.1);
    // }
  }

  .all_count_name {
    // margin-right: 8px;
  }
  .all_count_value {
    font-size: 16px;
  }
  .see_More {
    text-decoration: underline;
    cursor: pointer;
    display: inline-block;
    &:hover {
      transform: scale(1.1);
    }
  }
  .count-div {
    // width: 50px;
    // height: 70px;
    margin-right: 10px;
    > div {
      position: relative;
      margin-right: 10px;
      top: 15px;
      width: 40px;
      height: 40px;
      border-radius: 30px;
      background: $fontColor;
      cursor: pointer;
      img {
        position: absolute;
        top: 6px;
        left: 6px;
        width: 28px;
        height: 28px;
      }
    }
    button {
      color: #fff;
    }
  }
  .mytag_active {
    // margin-right: 10px;
    // button {
    //   background: #bf6100;
    // }
    // > div {
    //   // background: #ff9b3d;
    //   color: #fff;
    //   // border: #ff9b3d;
    //   background: $fontColor;
    //   // border: $fontColor;
    //   width: 50px;
    //   height: 50px;
    //   margin-top: -5px;
    //   img {
    //     width: 34px;
    //     height: 34px;
    //     top: 8px;
    //     left: 8px;
    //   }
    // }
  }
}
// .searchInput {
//   height: 70px;
//   input {
//     float: right;
//     margin-top: 20px;
//   }
// }

.all-count-des {
  display: none;
  margin-right: 20px;
  color: rgba(255, 255, 255, 0.8);
  .all-count-name {
    font-size: 16px;
  }
  .all-count-value {
    display: none;
  }
  .all-count-value-show {
    font-size: 16px;
  }
}
.is_deadline {
  color: red;
  font-weight: bolder;
}
.el-table {
  .el-tag {
    background: transparent !important;
    border-radius: 20px;
    // color: #fff;
    border: 1px solid #ff9b3d;
    color: #ff9b3d;
    border: 1px solid #5f4fd5;
    color: #5f4fd5;
  }
}
.active_box {
  width: 65%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  .active_qrcode {
    margin: 20px auto;
    width: 165px;
    height: 165px;
    border: 1px dashed #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .active_tips {
    margin-top: 30px;
    margin-bottom: 10px;
    // background-image: -webkit-linear-gradient(left, #36303b, #0f337c);
    -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
    white-space: pre-wrap;
    color: #fff;
  }
  .active_btn {
    background-image: -webkit-linear-gradient(left, #9190dd, #0f337c);
    color: rgba(255, 255, 255, 0.6);
    border: none;
  }
  .active_create_did {
    // margin-top: 30px;
    margin: 0 auto 20px auto;
    display: block !important;
  }
  .active-item {
    padding: 30px 20px;
    border: 1px solid;
    border-radius: 25px;
    width: 420px;
    .active-item-des {
      padding-left: 5px;
      height: 60px;
      // font-family: Heiti SC,  Hiragino Sans GB, "Microsoft Yahei";
      .active-item-des1 {
        width: 25px;
        float: left;
        font-size: 18px;
        height: 30px;
        line-height: 30px;
        font-family: Heiti SC, Hiragino Sans GB, "Microsoft Yahei";
      }
      .active-item-des2 {
        float: left;
        width: 380px;
        word-break: break-word;
      }
    }
  }
  .active-item-hide {
    display: none;
  }
  .active-or {
    margin: 10px auto;
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 24px;
    font-family: Heiti SC, Hiragino Sans GB, "Microsoft Yahei";
  }
  .active-bottom {
    position: relative;
    margin-top: 25px;
    width: 100%;
    .what-did {
      position: absolute;
    }
    .cyfs-download {
      position: absolute;
      right: 0;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
.create-did-dialog .el-dialog__footer {
  text-align: center;
  .create-did-footer {
    text-align: center;
    button {
      width: 150px;
      border-radius: 10px;
    }
  }
}
.create-did-dialog > .el-dialog {
  min-width: 600px;
}

.did-tip {
  width: 300px;
  word-break: break-word;
}
.create-loading {
  height: 465px;
  .el-loading-mask {
    background: transparent !important;
  }
}
.active_vfoggie_box {
  width: 100%;
  height: 465px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  .active_vood {
    margin-top: 30px;
  }
  .active-ok-logo {
    width: 82px;
    height: 64px;
    margin-top: 42px;
  }
  .active-ok-tip {
    font-size: 18px;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 500;
    color: #ffffff;
    margin-top: 42px;
  }
  .active-ok-did {
    font-size: 14px;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.71);
    margin-top: 38px;
    margin-bottom: 90px;
  }
}
.active_vfoggie_box_success {
  width: 100%;
  height: 465px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  .active-ok-logo {
    width: 82px;
    height: 64px;
    margin-top: 42px;
  }
  .active-ok-tip {
    font-size: 18px;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 500;
    color: #ffffff;
    margin-top: 42px;
  }
  .active-ok-tip2 {
    font-size: 14px;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.71);
    margin-top: 38px;
    margin-bottom: 90px;
    display: flex;
    align-items: center;
    .count-number {
      color: white;
      font-size: 25px;
    }
  }
}
.order-created-p {
  max-width: 800px;
  height: 40px;
  line-height: 40px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 auto;
  font-size: 14px;
}

.order-item {
  position: relative;
  // max-width: 1000px;
  max-width: 800px;
  width: 100%;
  // height: 320px;
  display: grid;
  grid-template-columns: 240px auto;
  gap: 20px;
  padding: 20px;
  // backdrop-filter: blur(40px) saturate(120%) brightness(120%);
  border-radius: 20px;
  // background: rgb(169 168 198 / 30%);
  box-shadow: rgb(0 0 0 / 10%) 0px 0px 0px 0.5px inset;
  margin: 0 auto 40px auto;
  background-color: rgb(83 172 208 / 20%) !important;
  background-color: var(--bg-color) !important;
  color: var(--text-color);
  backdrop-filter: blur(20px) saturate(100%);
  .item-left,
  .item-left * {
    transition: all 0.8s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
  }
  .item-left {
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    // min-width: 200px;
    width: 220px;
    height: 320px;
    // margin-left: 5px;
    border-radius: 20px;
    background: linear-gradient(
      209.21deg,
      rgb(139 45 154) 13.57%,
      rgb(191 107 221) 98.38%
    );
    box-shadow: rgb(225 29 69 / 30%) 0px 20px 40px, rgb(0 0 0 / 5%) 0px 1px 3px;
    // padding: 20px;
    .item-left-div {
      // box-shadow: rgb(225 29 69 / 30%) 0px 20px 40px, rgb(0 0 0 / 5%) 0px 1px 3px;
      .item-left-img {
        position: relative;
        display: grid;
        -webkit-box-pack: center;
        justify-content: center;
        justify-items: center;
        height: 150px;
        overflow: hidden;
        .item-left-bg {
          max-width: 200px;
          width: 100%;
          height: 150px;
          margin: 0px;
          // opacity: 0;
          animation: 1s ease 0s 1 normal forwards running;
          margin-top: 20px;
        }
        .item-left-free {
          position: absolute;
          left: -10px;
          top: -10px;
          width: 50px;
          height: 50px;
        }
        .flag {
          position: absolute;
          height: 20px;
          line-height: 20px;
          text-align: center;
          width: 85px;
          background-color: #ff5722;
          color: #fff;
          color: var(--text-color);
        }
        .flag-left {
          -moz-transform: rotate(-45deg);
          -ms-transform: rotate(-45deg);
          -o-transform: rotate(-45deg);
          -webkit-transform: rotate(-45deg);
          transform: rotate(-45deg);
          left: -19px;
          top: 11px;
          font-size: 12px;
          i {
            -moz-transform: rotate(-45deg);
            -ms-transform: rotate(-45deg);
            -o-transform: rotate(-45deg);
            -webkit-transform: rotate(-45deg);
            transform: rotate(-45deg);
          }
        }
      }
    }
    .item-vood-id {
      position: relative;
      margin-top: 50px;
      width: 100%;
      height: 70px;
      color: #fff;
      color: var(--text-color);

      p {
        padding-left: 20px;
        margin: 0;
        width: 145px;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
      }
      .item-vood-id-name {
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      img {
        position: absolute;
        top: 22px;

        width: 14px;
        height: 14px;
        cursor: pointer;
      }
      .ood-copy {
        right: 35px;
      }
      .ood-link {
        right: 15px;
        width: 15px;
        height: 11px;
        top: 23px;
      }
    }
    .item-left-content {
      position: relative;
      padding-top: 10px;
      display: grid;
      grid-template-columns: auto auto;
      box-sizing: border-box;
      padding: 10px 6px;
      height: 85px;
      .order-icon {
        display: grid;
        margin-left: 5px;
        grid-template-columns: auto auto;
        z-index: 1;
        perspective: 3000px;
        perspective-origin: left bottom;
        width: 96px;
        height: 40px;
        border-radius: 20px;
        border: none;
        background: rgba(0, 0, 0, 0.2);
        box-shadow: rgb(92 103 153 / 20%) 0px 20px 40px,
          rgb(0 0 0 / 5%) 0px 1px 3px, rgb(0 0 0 / 30%) 0px 0px 0px 0.5px inset;
        backdrop-filter: blur(40px);
        border-radius: 30px;
        cursor: pointer;
        box-shadow: rgb(0 0 0 / 20%) 0px 20px 40px, rgb(0 0 0 / 5%) 0px 1px 3px,
          rgb(255 255 255 / 20%) 0px 0px 0px 0.5px inset;
        transition: all 2s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
        > div {
          display: flex;
          width: 86px;
          height: 30px;
          line-height: 30px;
          font-size: 12px;
          color: #fff;
          color: var(--text-color);

          margin: 5px;
          border-radius: 15px;
          background: rgba(51, 3, 3, 0.8);
          border: 0px solid;
          box-sizing: border-box;
          transition: all 2s cubic-bezier(0.075, 0.82, 0.165, 1) 0s;
          justify-content: center;
          img {
            padding: 0;
            margin: 10px 4px;
            width: 12px;
            height: 12px;
          }
        }
      }
      .order-icon-delete div p {
        color: #ff3c41;
      }
      .order-icon:hover {
        // background: rgba(0, 0, 0, 0.3);
        // > div {
        //   margin-top: 9px;
        //   font-size: 14px;
        //   img {
        //     margin: 9px 3px;
        //     width: 14px;
        //     height: 14px;
        //   }
        // }
      }
    }
  }
  .item-left:hover {
    // margin: -10px;
    // width: 220px;
    // height: 380px;
  }
  .item-left-bg1 {
    background: linear-gradient(
      209.21deg,
      rgb(67, 22, 219) 13.57%,
      rgb(144, 118, 231) 98.38%
    );
  }

  .item-left-bg2 {
    background: linear-gradient(
      209.21deg,
      rgb(27, 36, 99) 13.57%,
      rgb(16, 81, 169) 98.38%
    );
  }

  .item-left-bg3 {
    background: linear-gradient(
      209.21deg,
      rgb(13, 15, 53) 13.57%,
      rgb(28, 28, 86) 98.38%
    );
  }

  .item-right {
    position: relative;
    max-width: 638px;
    // margin-left: 20px;
    .item-right-list {
      position: relative;
      display: grid;
      height: 335px;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      justify-items: center;
      align-content: start;
      margin-top: 8px;
      overflow-y: auto;
      -webkit-mask-image: linear-gradient(
        rgb(255, 255, 255) 80%,
        rgba(255, 255, 255, 0) 100%
      );
      .item-right-li {
        display: grid;
        gap: 8px;
        align-self: center;
        position: relative;
        display: grid;
        grid-template-columns: auto;
        gap: 10px;
        width: 100%;
        min-width: 220px;
        max-width: 320px;
        padding: 10px;
        border-radius: 10px;
        .item-right-li-title {
          font-style: normal;
          font-size: 15px;
          line-height: 28px;
          max-width: 160px;
          font-weight: 600;
          // color: #03040a;
          color: #fff;
          color: var(--text-color);

          margin: 0px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          padding-right: 40px;
        }
        .item-right-li-content {
          font-style: normal;
          font-size: 15px;
          line-height: 18px;
          font-weight: normal;
          // color: rgba(3, 4, 10, 0.7);
          // color: #03040a;
          color: #fff;
          color: var(--text-color);

          margin: 0px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          padding-right: 20px;
          word-break: break-all;
          .order-status-starting {
            display: none;
          }
        }
      }
      .item-right-li::-webkit-scrollbar {
        display: none;
      }
    }
    .item-right-div {
      position: relative;
      height: 335px;
      align-content: start;
      margin-top: 8px;
      -webkit-mask-image: linear-gradient(
        rgb(255, 255, 255) 80%,
        rgba(255, 255, 255, 0) 100%
      );
      color: #fff;
      color: var(--text-color);

      .item-right-box1 {
        position: absolute;
        top: 0;
        left: 0;
        width: 170px;
        height: 110px;
        font-size: 12px;
        p {
          margin: 0;
          padding: 0;
          height: 22px;
          line-height: 22px;
        }
        .p1 {
          // margin-top: 10px;
        }
        .p3 {
          margin-top: 10px;
        }
      }
      .item-right-box2 {
        position: absolute;
        top: 0;
        left: 170px;
        width: 320px;
        height: 110px;
        font-size: 12px;
        .item-right-box2-title {
          margin: 0 0 5px 0;
          height: 22px;
          line-height: 22px;
        }
        .box2-exprire-title {
          color: #e33b57;
          font-size: 14px;
        }
        .box2-exprire-date {
          color: #e33b57;
        }
        .expire_remove_tips {
          color: #e33b57;
          font-size: 14px;
        }
      }
      .item-right-box3 {
        position: absolute;
        top: 120px;
        left: 0;
        width: 530px;
        height: 110px;
        border-top: 0.5px solid rgba(255, 255, 255, 0.2);
        border-bottom: 0.5px solid rgba(255, 255, 255, 0.2);
        .item-right-status {
          float: left;
          // margin-top: 15px;
          width: 170px;
          font-size: 12px;
          .item-right-status-title {
            margin: 6px 0;
          }
          .item-right-status-div {
            height: 30px;
            .span-on {
              float: left;
              display: block;
              height: 30px;
              color: #fff;
              color: var(--text-color);

              line-height: 30px;
              font-size: 14px;
            }
            .span-off {
              float: left;
              display: block;
              height: 30px;
              color: #cdcdcd;
              color: var(--text-color);

              line-height: 30px;
              font-size: 14px;
            }
            img {
              margin-top: 3px;
              margin-left: 10px;
              display: inline-block;
              width: 24px;
              height: 24px;
            }
          }
          .status-device-on .span-on {
            color: #39c743;
          }
          .status-vood-initializing .span-initializing {
            color: #39c743;
            height: 30px;
            display: inline-block;
            line-height: 30px;
            font-size: 14px;
          }
          .status-device-off .span-off {
            color: #c44483;
          }
          .el-switch.is-disabled {
            opacity: 1;
          }
          .el-switch.is-disabled .el-switch__core,
          .el-switch.is-disabled .el-switch__label {
            cursor: default;
          }
          .el-switch__label {
            color: #000;
          }
          .el-switch__label--left {
            color: #ff9b27;
          }
          .el-switch__label--left.is-active {
            color: #bbb;
          }
          .order_status_cls {
            margin: 0;
            height: 30px;
            line-height: 30px;
            font-size: 14px;
            font-weight: 700;
          }
          .order_status_cls1 {
            color: #39c743;
          }
          .order_status_cls2 {
            color: #000;
          }
          .order_status_cls3 {
            color: #e33b57;
          }
        }
        .mem-status {
          position: absolute;
          top: 70px;
          left: 0;
          width: 100%;
          height: 30px;
          .el-progress {
            width: 360px;
            .el-progress-bar__innerText {
              display: block;
              line-height: 14px;
            }
          }
          .mem-status-span {
            display: block;
            width: 160px;
            height: 14px;
            line-height: 14px;
            font-size: 12px;
            position: absolute;
            left: 370px;
            top: 3px;
          }
        }
      }

      .item-right-box4 {
        position: absolute;
        top: 240px;
        left: 0;
        width: 500px;
        display: grid;
        grid-template-columns: auto auto;
        box-sizing: border-box;
        padding: 10px 6px;
        height: 85px;
        .subscribe-div-btn {
          position: relative;
          background: linear-gradient(
            rgb(255, 255, 255) 0%,
            rgb(217, 223, 255) 100%
          );
          background: var(--btn-gradient);
          margin: 3px auto 0;
          border: 0.5px solid rgba(255, 255, 255, 0.5);
          box-sizing: border-box;
          box-shadow: rgb(0 0 0 / 10%) 0px 1px 3px,
            rgb(23 0 102 / 20%) 0px 20px 40px;
          border-radius: 20px;
          display: flex;
          padding: 4px;
          width: 169px !important;
          cursor: pointer;
          animation: 0.3s ease 0s 1 normal forwards running widther;
          height: 50px;
          box-sizing: border-box;
          .subscribe-icon {
            background: rgba(68, 66, 178, 0.1);
            box-shadow: rgb(0 0 0 / 10%) 0px 0px 0px 0.5px inset;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;

            > div {
              background: linear-gradient(to bottom, #b2f8ff, #5b2eff);
              box-shadow: rgb(0 0 0 / 10%) 0px 0px 0px 0.5px inset;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              img {
                width: 20px;
                height: 20px;
                margin: 0px;
                padding: 0;
                margin: 0;
              }
            }
            // .free_icon {
            //   background: linear-gradient(to bottom, #b2f8ff, #ff3636);
            // }
          }
          .subscribe-btn {
            display: grid;
            grid-template-columns: 1fr;
            row-gap: 4px;
            margin: auto auto auto 16px;
            text-align: left;
            p {
              margin: 0px;
              // width: 50px;
              line-height: 22px;
              font-style: normal;
              font-weight: normal;
              color: rgb(0, 0, 0);
              color: var(--text-color);
              font-size: 14px;
            }
          }
          .continue-to-pay {
            margin-left: 8px;
            p {
              width: 110px;
            }
          }
        }
      }
    }
  }
  .item-btns {
    position: absolute;
    top: 10px;
    right: 20px;
    width: 80px;
    .item-btns-div {
      position: relative;
      padding-right: 16px;
      width: 60px;
      height: 24px;
      line-height: 24px;
      font-size: 12px;
      color: #e6a23c;
      cursor: pointer;
      letter-spacing: 3px;
      font-weight: 800;
      text-align: right;
      text-decoration: underline;
      text-underline-offset: 3px;
      img {
        position: absolute;
        right: 0;
        top: 4px;
        width: 14px;
        height: 14px;
      }
    }
    .item-delete-btn {
      color: #ff3c41;
    }
  }
  .item-btns-detail {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    width: 36px;
    height: 36px;
    line-height: 36px;
    font-size: 16px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    cursor: pointer;
    // box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px,
    //   rgba(0, 0, 0, 0.22) 0px 10px 10px;
    &:hover {
      transform: scale(1.1);
    }
    i {
      color: #fff;
      color: var(--text-color);
    }
  }
}
.box-title {
  position: relative;
  margin: 0 auto;
  width: 1100px;
  .searchInput {
    position: absolute;
    top: 0;
    right: 0;
    width: 240px;
    height: 40px;
    input {
      // float: right;
      margin-top: 8px;
      height: 30px;
      background: transparent;
      // color: #03040a;
      color: #fff;
      color: var(--text-color);

      // font-weight: bold;
      border-radius: 20px;
    }
    input::-webkit-input-placeholder {
      color: #fff;
      color: var(--text-color);
    }
    /* 火狐 Mozilla Firefox 4 to 18 */
    input:-moz-placeholder {
      color: #fff;
      color: var(--text-color);
    }
    /* 火狐 Mozilla Firefox 19+ */
    input::-moz-placeholder {
      color: #fff;
      color: var(--text-color);
    }
    /* Internet Explorer 10+ */
    input:-ms-input-placeholder {
      color: #fff;
      color: var(--text-color);
    }
    .el-input-group__append {
      background: transparent;
    }
    .el-icon-search {
      font-size: 18px;
      color: #fff;
      color: var(--text-color);

      &:hover {
        transform: scale(1.1);
      }
    }
    .el-input.is-active .el-input__inner,
    .el-input__inner:focus {
      border-color: #54abd0;
    }
  }
  .searchInput .el-input.is-active .el-input__inner,
  .searchInput .el-input__inner:focus {
    border-color: #fff !important;
  }
}
.order_box .box-title .title-label {
  position: relative;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
  cursor: pointer;
  // width: 213px;
  height: 43px;
  background: linear-gradient(
    rgba(24, 32, 79, 0.4) 0%,
    rgba(24, 32, 79, 0.25) 100%
  );
  border-radius: 30px;
  border: none;
  box-sizing: border-box;
  box-shadow: rgb(0 0 0 / 15%) 0px 20px 40px,
    rgb(0 0 0 / 30%) 0px 0px 0px 0.5px inset;
  transition: all 0.5s ease-in-out 0s;
  margin: 0px auto 20px auto;
  // padding: 12.5px 24px;
  .bgksWO {
    font-style: normal;
    font-weight: normal;
    font-size: 17px;
    line-height: 20px;
    color: rgb(0, 0, 0);
    transition: all 0.3s ease-in-out 0s;
    text-align: center;
    margin: 0px;
    z-index: 2;
  }
  .iRosYZ {
    font-style: normal;
    font-weight: normal;
    font-size: 17px;
    line-height: 20px;
    color: rgb(255, 255, 255);
    color: var(--text-color);

    transition: all 0.3s ease-in-out 0s;
    text-align: center;
    margin: 0px;
    z-index: 2;
  }
  .check-p {
    // position: relative;
    font-style: normal;
    font-weight: normal;
    font-size: 17px;
    line-height: 20px;
    transition: all 0.3s ease-in-out 0s;
    text-align: center;
    margin: 0px;
    z-index: 2;
    color: #fff;
    color: var(--text-color);

    width: 120px;
    justify-content: center;
    font {
      display: none;
      // position: absolute;
      // right: 3px;
      // bottom: 1px;
      margin-left: 3px;
      font-size: 8px;
      color: red;
    }
  }
  .check-p.mytag_active {
    color: #000;
  }
  // .check-month {
  //   color: #000;
  // }
  // .check-year {
  //   color: #fff;
  // }
  .white-span {
    position: absolute;
    left: 4px;
    right: 4px;
    width: 110px;
    height: 35px;
    box-sizing: border-box;
    background: rgb(255, 255, 255);

    border-radius: 30px;
    transition: all 0.5s ease-in-out 0s;
  }
}
.title-cls-0 {
  width: 0;
  .white-span {
    display: none;
  }
}
.title-cls-1 {
  width: 110px;
}
.title-cls-2 {
  width: 220px;
}
.title-cls-3 {
  width: 330px;
}
.title-cls-4 {
  width: 440px;
}
.title-cls-5 {
  width: 550px;
}
.title-cls-6 {
  width: 660px;
}
.title-label-check {
  .white-span {
    // left: calc(100% - 2px);
    // transform: translateX(-100%);
    transition: all 0.5s ease-in-out 0s;
  }
  // .check-month {
  //   color: #fff;
  // }
  // .check-year {
  //   color: #000;
  // }
}

.item-left-content .subscribe-div-btn {
  background: linear-gradient(rgb(255, 255, 255) 0%, rgb(217, 223, 255) 100%);
  margin: 7px auto 0;
  border: 0.5px solid rgba(255, 255, 255, 0.5);
  box-sizing: border-box;
  box-shadow: rgb(0 0 0 / 10%) 0px 1px 3px, rgb(23 0 102 / 20%) 0px 20px 40px;
  border-radius: 14px;
  display: flex;
  padding: 4px;
  width: 100px !important;
  cursor: pointer;
  animation: 0.3s ease 0s 1 normal forwards running widther;
  height: 36px;
  box-sizing: border-box;
  .subscribe-icon {
    background: rgba(68, 66, 178, 0.1);
    box-shadow: rgb(0 0 0 / 10%) 0px 0px 0px 0.5px inset;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    > div {
      background: linear-gradient(to bottom, #b2f8ff, #5b2eff);
      box-shadow: rgb(0 0 0 / 10%) 0px 0px 0px 0.5px inset;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 14px;
        height: 14px;
        margin: 0px;
        padding: 0;
        margin: 0;
      }
    }
    .free_icon {
      background: linear-gradient(to bottom #b2f8ff, #ff3636);
    }
  }
  .subscribe-btn {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 4px;
    margin: auto auto auto 3px;
    text-align: left;
    p {
      margin: 0px;
      width: 50px;
      line-height: 22px;
      font-style: normal;
      font-weight: normal;
      color: rgb(0, 0, 0);
      font-size: 14px;
    }
  }
}
.subscribe-div-btn:hover {
  box-shadow: rgb(0 0 0 / 10%) 0px 5px 15px, rgb(23 0 102 / 30%) 0px 15px 30px;
  transform: translateY(-1px) scale(1.1);
}

.item-right-li-content-status {
  animation: bian 5s infinite;
  -webkit-animation: bian 0.5s infinite;
  animation-direction: alternate;
  font-weight: 600;
  background-image: -webkit-linear-gradient(bottom, #c91452, #fd8403, #d8f413);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
@keyframes bian {
  from {
    font-size: 20px;
  }
  to {
    font-size: 24px;
  }
}
@-webkit-keyframes bian {
  from {
    font-size: 20px;
  }
  to {
    font-size: 24px;
  }
}
.item-right-li-content-dueDate {
  background-image: -webkit-linear-gradient(bottom, #d53b0d, #fd8403);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.order-box-cn .subscribe-btn p {
  width: 55px;
  text-align: center;
  letter-spacing: 1px;
}

.p_box {
  min-width: 500px;
  // width: 80%;
  margin: 0 auto;
  margin-top: 100px;
  // padding: 0 30px;
  .p_choose,
  .p_buy {
    .squartCard {
      margin-top: 14px;
      img {
        height: 30px;
      }
    }
    .squartCard-pay {
      height: 33px;
    }
    padding-left: 20px;
    margin-bottom: 10px;
    .el-radio-group {
      width: 100%;
    }

    .el-radio__label {
      font-size: 18px;
    }

    .el-radio__input.is-checked + .el-radio__label {
      // color: #ff9b3d;
      // border-color: #ff9b3d;
      color: #03040a;
      border-color: #03040a;
    }
    .el-radio__input.is-checked .el-radio__inner {
      // border-color: #ff9b3d;
      border-color: #03040a;
    }
    .el-radio__inner {
      // border-color: #ff9b3d;
      // background: #ff9b3d;
      border-color: #03040a;
      background: #03040a;
      background: transparent;
      width: 20px;
      height: 20px;
    }
    .el-radio {
      display: flex;
      float: left;
      align-items: center;
      // color: #a4a0a0;
      // color: #c0c4cc;
      width: 200px;
    }
    .el-radio__inner::after {
      width: 6px;
      height: 6px;
      // background: #ff9b3d;
      background: #03040a;
    }
  }
  .p_buy {
    img {
      height: 20px;
      overflow: hidden;
    }
  }

  .p_btc {
    .el-collapse-item__header,
    .el-collapse-item__wrap {
      background: transparent;
      color: #fff;
      border-bottom: none !important;
    }

    .el-collapse,
    .el-collapse-item__header {
      border-bottom: none !important;
      border-top: none !important;
      font-size: 14px;
    }

    .el-collapse-item__content {
      padding-bottom: 10px;
    }

    .bitcoin_payItem {
      // color: #a4a0a0;
      color: #c0c4cc;
      font-size: 12px;
      // text-align: center;
      margin-top: 20px;
      font-weight: bolder;
      cursor: pointer;
      margin-left: 30px;
    }

    .provider_url {
      margin-top: 0;
      text-decoration: underline;
    }
    .btc_group {
      .el-radio-group {
        // background: #726e6e;
        padding: 10px;
      }
    }
  }
  .order_item_box {
    padding-left: 20px;
    margin-bottom: 10px;
    font-size: 14px;
    .order_item_title {
      text-align: center;
      color: #ff9b3d;
      font-size: 20px;
      margin-bottom: 8px;
      margin-top: -10px;
    }
    .order_item {
      display: flex;
      line-height: 36px;
      color: #03040a;
      .order_key {
        width: 180px;
      }
    }
  }
}

.clock {
  // background-color: #252525;
  // background-color: rgba(83, 172, 208, 0.2) !important;
  // -webkit-backdrop-filter: blur(20px) saturate(100%);
  // backdrop-filter: blur(20px) saturate(100%);
  width: 60px;
  height: 80px;
  position: relative;
  overflow: hidden;
  float: left;
  margin-right: 10px;
  .clock-main {
    position: absolute;
    width: 50px;
    height: 50px;
    // background-color: #252525;
    background-color: #191e4f;
    margin: 3px;
  }
}

.clock .rotate {
  position: absolute;
  width: 50px;
  height: 50px;
  top: 0;
  left: 0;
}

.rotate.right {
  display: none;
  z-index: 11;
}

.clock .bg,
.clock .front {
  width: 25px;
  height: 50px;
  // background-color: #252525;
  background-color: #191e4f;
  position: absolute;
  top: 0;
}

.clock .display {
  position: absolute;
  width: 50px;
  font-family: "Lucida Sans Unicode", "Lucida Grande", sans-serif;
  z-index: 20;
  color: #f5f5f5;
  font-size: 15px;
  text-align: center;
  top: 14px;
  left: 0;
  // text-shadow: 4px 4px 5px #333333;
}

.clock-unit {
  position: absolute;
  top: 55px;
  left: 0;
  width: 50px;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  color: #fff;
  color: var(--text-color);
  text-align: center;
}

.clock .bg.left {
  left: 0;
}

.day .bg.left {
  background: url("./../../../../../assets/order/bg_day.svg") no-repeat left top;
  background-size: 50px;
}
.hour .bg.left {
  background: url("./../../../../../assets/order/bg_hour.svg") no-repeat left
    top;
  background-size: 50px;
}
.sceond .bg.left {
  background: url("./../../../../../assets/order/bg_second.svg") no-repeat left
    top;
  background-size: 50px;
}
.minute .bg.left {
  background: url("./../../../../../assets/order/bg_minute.svg") no-repeat left
    top;
  background-size: 50px;
}

.clock .bg.right {
  left: 25px;
}

.day .bg.right {
  background: url("./../../../../../assets/order/bg_day.svg") no-repeat right
    top;
  background-size: 50px;
}
.hour .bg.right {
  background: url("./../../../../../assets/order/bg_hour.svg") no-repeat right
    top;
  background-size: 50px;
}
.sceond .bg.right {
  background: url("./../../../../../assets/order/bg_second.svg") no-repeat right
    top;
  background-size: 50px;
}
.minute .bg.right {
  background: url("./../../../../../assets/order/bg_minute.svg") no-repeat right
    top;
  background-size: 50px;
}

.clock .front.left {
  left: 0;
  z-index: 10;
}
.test-aaa {
  width: 56px;
  height: 56px;
  background: #191e4f;
}
.test-bbb {
  width: 56px;
  height: 56px;
  // background: rgba(68, 66, 178, 0.1);
  background: rgb(25, 30, 79, 0.9);
  box-shadow: rgb(0 0 0 / 10%) 0px 0px 0px 0.5px inset;
}
.goto-vood {
  text-align: center;
  .span2 {
    text-decoration: underline;
    text-underline-offset: 2px;
    cursor: pointer;
  }
}
@media (max-width: 1200px) {
  .order_box {
    .box-title {
      width: 100% !important;
      height: 60px;
      .searchInput {
        top: 50px;
      }
    }
    .item-right-box3 {
      .mem-status {
        .el-progress {
          width: 300px !important;
        }
        .mem-status-span {
          left: 310px !important;
        }
      }
    }
    .item-right-box4 {
      width: 100% !important;
    }
    .order_box .drawer .main-show {
      width: 600px !important;
    }
  }
}
.order-boxs-no-order .order_box {
  margin-top: 0px;
  height: 800px;
}
.renewal-footer {
  position: relative;
  .pay-with-dmc {
    position: unset;
    margin-bottom: 10px;
    // top: 10px;
    // left: 20px;
    color: #d9d9d9;
    font-size: 14px;
    label {
      margin-right: 10px;
      .el-checkbox__inner {
        background-color: #a5a5a5;
        border-color: #787878;
      }
    }
  }
}

.p_buy_address_input {
  display: none;
  margin-left: 20px;
  width: 600px;
}
.p_buy_blockchain {
  display: none;
  padding-left: 20px;
  p {
    margin: 10px 0 0 0;
    font-size: 12px;
    color: #f99b3d;
  }
}
.p_buy_address {
  padding-left: 20px;
  position: relative;
  .p_buy_address_item {
    margin: 0;
    padding: 5px;
  }
  img {
    position: absolute;
    top: 0;
    right: 100px;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
}
.recharge_address_input_verify {
  position: relative !important;
  margin-left: 20px;
}
.buy_address_input_verify {
  display: none;
  position: relative !important;
  margin-left: 20px;
}
.blockchain-radio {
  display: none;
  width: 80% !important;
  margin-left: 80px;
  .el-radio__inner {
    width: 18px !important;
    height: 18px !important;
  }
  .el-radio__label {
    position: relative;
    padding-left: 33px;
    height: 20px;
    line-height: 20px;
    font-size: 14px !important;
    img {
      position: absolute;
      display: inline-block;
      height: 20px !important;
      left: 10px;
    }
  }
}
.blockchain-from,
.blockchain-to {
  position: relative;
  margin-left: 20px;
  span {
    display: inline-block;
    width: 50px;
    color: orange;
  }
  img {
    position: absolute;
    top: 0;
    right: 100px;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
}
.bind-wallet-dialog {
  .bind-wallet-dialog-box {
    position: relative;
    width: 100%;
    height: 80px;
    i.el-icon-warning {
      position: absolute;
      margin: 0px 20px;
      color: rgb(230, 162, 60);
      font-size: 24px;
    }
    .bind-wallet-dialog-content {
      position: absolute;
      width: calc(100% - 50px);
      left: 50px;
      word-break: break-word;
      line-height: 26px;
    }
  }
  .el-dialog__footer {
    padding: 0 20px !important;
  }
}
.dmc-wallet-download {
  color: #fff;
}
.useCyberChat {
  margin-top: 10px;
  font-size: 12px;
  cursor: pointer;
}
.bind-account-click {
  cursor: not-allowed;
}
.bind-account-click-timer {
  padding: 0;
  margin: 0;
}

.active-click-no {
  background: rgba(0, 0, 0, 0.1) !important;
  cursor: not-allowed !important;
  box-shadow: none !important;
  color: rgba(0, 0, 0, 0.1) !important;
  border: none !important;
  .subscribe-icon > div {
    background: rgba(0, 0, 0, 0.1) !important;
  }
  .subscribe-btn p {
    color: rgba(0, 0, 0, 0.3) !important;
  }
}
.p_account_address_input_tips {
  display: none;
  padding: 0;
  margin: 10px 20px;
  font-size: 12px;
  color: #d9d9d9;
}
.p_account_address_input {
  // display: none;
}

.el-dialog__body .coupon-number-input {
  margin: 10px 20px;
  width: 600px;
}
.el-dialog__body .coupon-number-error {
  padding-left: 20px;
  margin: 0;
  color: #f56c6c;
  font-size: 12px;
}
.el-dialog__body .coupon-recharge-switch,
.el-dialog__body .coupon-pay-switch {
  margin: 10px 0 10px 20px;
}
</style>
