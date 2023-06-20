<template>
  <div>
    <!-- <div class="topBox">
      <div class="bg">
        <div class="title">Pool Details</div>
        <div class="userdetail">
          <div>
            <svg-icon icon="tubiao-" size="36"></svg-icon>
            <span class="userName">Foggie</span>
          </div>
          <div>
            <svg-icon icon="shenfenzheng1" size="40"></svg-icon>
            <span style="
                    vertical-align: super;
                    color: #dbdbdb;
                    font-size: 22px;
                    margin-left: 10px;
                  ">Foggie</span>
          </div>
        </div>
      </div>

      <div class="bg mt-8 three">
        <div class="first">
          <div class="title">Balance</div>
          <div style="text-align: center">
            <svg-icon icon="pingheng" size="36" style="margin-top: 8px"></svg-icon>
            <div style="font-size: 20px">15.2341</div>
          </div>
        </div>
        <div class="tow">
          <div style="line-height: 100px; text-align: center">
            <svg-icon icon="liwu2" size="36" style="margin-top: 8px"></svg-icon>
          </div>
          <div>
            <div>Order</div>
            <div>14.111</div>
          </div>
          <div>
            <div>Reward</div>
            <div>1.111</div>
          </div>
          <div>
            <div>Other</div>
            <div>0.111</div>
          </div>
        </div>
        <div class="one">
          <div style="line-height: 100px; text-align: center">
            <svg-icon icon="-qiandai" size="36" style="margin-top: 8px"></svg-icon>
          </div>
          <div>
            <div>Total</div>
            <div>500 DMC</div>
          </div>
          <div>
            <div>Count</div>
            <div>14</div>
          </div>
        </div>
      </div>
      <div class="bg mt-8 three" style="height: 80px">
        <div class="first">
          <div class="title">Power</div>
          <div style="font-size: 22px; text-align: center; margin-top: 20px">
            1.3/2.0PiB
          </div>
        </div>
        <div class="one">
          <div style="flex: 2 0">
            <div>Matched</div>
            <div>300</div>
          </div>
          <div>
            <div>UnMatched</div>
            <div>12</div>
          </div>
        </div>
        <div class="one">
          <div style="flex: 2 0">
            <div>Orders</div>
            <div>300</div>
          </div>
          <div>
            <div>Works</div>
            <div>3</div>
          </div>
        </div>
      </div>
    </div> -->

    <el-row :gutter="20">
      <el-col :span="12">
        <div class="bodyBox Rewards">
          <div
            style="
              font-weight: 600;
              font-size: 36px;
              margin-top: 40px;
              margin-left: 20px;
            "
          >
            Storage
            <el-button type="primary">Expansion</el-button>
          </div>
          <div class="RewardsBox">
            <div>
              <div class="RewardsBox_div">
                <div>
                  <span style="font-size: 30px">15.2341</span>
                  <span style="font-size: 16px">DMC</span>
                </div>
                <div>
                  <div>day</div>
                  <div>eaming</div>
                </div>
              </div>
              <div></div>
            </div>
            <div>
              <div class="RewardsBox_div">
                <div>
                  <span style="font-size: 30px">15.2341</span>
                  <span style="font-size: 16px">DMC</span>
                </div>
                <div style="color: #589ea5">
                  <div>week</div>
                  <div>eaming</div>
                </div>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="bodyBox Orders">
          <el-row class="bodyBox_right">
            <el-col :span="16">
              <el-row>
                <el-col :span="8">
                  <div style="font-size: 32px; font-weight: 600">Orders</div>
                  <div
                    style="
                      font-weight: 600;
                      font-size: 28px;
                      margin: 15px 0px 0px 15px;
                    "
                  >
                    15PST
                  </div>
                </el-col>
                <el-col :span="16" class="Summery_col">
                  <div
                    style="
                      text-align: center;
                      line-height: 25px;
                      font-weight: 600;
                    "
                  >
                    Order Summery
                  </div>
                  <el-row class="Summery">
                    <el-col :span="8">
                      <div>Total</div>
                      <div>15</div>
                    </el-col>
                    <el-col :span="8">
                      <div>Comming</div>
                      <div>15</div>
                    </el-col>
                    <el-col :span="8">
                      <div>Finised</div>
                      <div>4</div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8" style="text-align: center">
              <svg-icon icon="naozhong" size="36"></svg-icon>
              <div style="display: flex">
                <div style="flex: 1">
                  <div>New Add</div>
                  <div style="line-height: 30px">1</div>
                </div>
                <div style="flex: 1">
                  <div>New Finised</div>
                  <div style="line-height: 30px">1</div>
                </div>
              </div>
            </el-col>
          </el-row>
          <div class="bodyBox_botoom">
            <el-row class="bodyBox_botoom_row">
              <el-col :span="7">
                <div
                  style="
                    display: flex;
                    align-items: center;
                    height: 50px;
                    justify-content: center;
                  "
                >
                  <span class="circle"></span>
                  <span style="color: #696a6d">order failed</span>
                </div>
                <div
                  style="
                    color: red;
                    font-size: 20px;
                    line-height: 25px;
                    text-align: center;
                  "
                >
                  2
                </div>
              </el-col>
              <el-col :span="7">
                <div
                  style="
                    display: flex;
                    align-items: center;
                    height: 50px;
                    justify-content: center;
                  "
                >
                  <span class="circle" style="background-color: #3afefe"></span>
                  <span style="color: #696a6d">order failed</span>
                </div>
                <div
                  style="
                    color: #3afefe;
                    font-size: 20px;
                    line-height: 25px;
                    text-align: center;
                  "
                >
                  12
                </div>
              </el-col>
              <el-col :span="10">
                <div
                  style="
                    display: flex;
                    align-items: center;
                    height: 50px;
                    justify-content: center;
                  "
                >
                  <span class="circle" style="background-color: #14e648"></span>
                  <span style="color: #696a6d">Successfulled</span>
                </div>
                <div
                  style="font-size: 20px; line-height: 25px; text-align: center"
                >
                  100
                </div>
              </el-col>
            </el-row>

            <el-row class="bodyBox_botoom_row" style="margin-top: 20px">
              <el-col :span="7">
                <div class="changeTitle">Order challenge</div>
                <div
                  class="changeBox"
                  style="display: flex; justify-content: space-around"
                >
                  <div>
                    <div>Failed</div>
                    <div style="color: red; font-size: 20px">2</div>
                  </div>
                  <div>
                    <div>Total</div>
                    <div style="color: #fff; font-size: 20px">2</div>
                  </div>
                </div>
              </el-col>
              <el-col :span="7">
                <div class="changeTitle">Chain challenge</div>
                <div
                  class="changeBox"
                  style="display: flex; justify-content: space-around"
                >
                  <div>
                    <div>Failed</div>
                    <div style="color: #fff; font-size: 20px">2</div>
                  </div>
                  <div>
                    <div>Total</div>
                    <div style="color: #fff; font-size: 20px">2</div>
                  </div>
                </div>
              </el-col>
              <el-col :span="10">
                <div class="changeTitle">Pool challenge</div>
                <div
                  class="changeBox"
                  style="display: flex; justify-content: space-around"
                >
                  <div>
                    <div>Failed</div>
                    <div style="color: #fff; font-size: 20px">2</div>
                  </div>
                  <div>
                    <div>Total</div>
                    <div style="color: #fff; font-size: 20px">2</div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- <el-row :gutter="20">
      <el-col :span="12">
        <div class="bodyBox Storage">
          <el-row class="bodyBox_right">
            <el-col :span="10">
              <el-row>
                <el-col :span="16">
                  <div style="font-size: 32px; font-weight: 600">Storage</div>
                  <div style="font-weight: 600; font-size: 28px; margin-top: 20px">
                    1.3P/2.0P
                  </div>
                </el-col>
                <el-col :span="8" class="Summery_col">
                  <div style="
                          text-align: center;
                          line-height: 35px;
                          font-weight: 600;
                           color: rgb(49 55 76);
                        ">
                    Foggies
                  </div>
                  <div style="
                          text-align: center;
                          line-height: 35px;
                          font-weight: 600;
                           color: rgb(49 55 76);
                        ">
                    Total
                  </div>
                  <div style="
                          text-align: center;
                          line-height: 35px;
                          font-weight: 600;
                        ">
                    120
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="7" style="text-align: center">
              <div style="color: rgb(49 55 76)">PST</div>
              <div style="display: flex">
                <div style="flex: 1">
                  <div style="font-size: 14px;  color: rgb(49 55 76); margin-top: 20px">
                    Matched
                  </div>
                  <div style="line-height: 30px; margin-top: 10px">1290</div>
                </div>
                <div style="flex: 1">
                  <div style="font-size: 14px;  color: rgb(49 55 76); margin-top: 20px">
                    UnMatched
                  </div>
                  <div style="line-height: 30px; margin-top: 10px">1290</div>
                </div>
              </div>
            </el-col>
            <el-col :span="7" style="text-align: center">
              <svg-icon icon="shijiandian" size="36"></svg-icon>
              <div style="display: flex">
                <div style="flex: 1">
                  <div style="color: rgb(49 55 76)">Period Lasted</div>
                  <div style="line-height: 30px; margin-top: 12px">1 days</div>
                </div>
                <div style="flex: 1">
                  <div style="color: rgb(49 55 76)">Data Lasted</div>
                  <div style="line-height: 30px; margin-top: 12px">39min</div>
                </div>
              </div>
            </el-col>
          </el-row>

          <div class="bodyBox_botoom">
            <el-row class="bodyBox_botoom_row">
              <el-col :span="7">
                <div style="
                        display: flex;
                        align-items: center;
                        height: 50px;
                        justify-content: center;
                      ">
                  <span class="circle"></span>
                  <span style="color: #696a6d">order failed</span>
                </div>
                <div style="
                        color: red;
                        font-size: 20px;
                        line-height: 25px;
                        text-align: center;
                      ">
                  2
                </div>
              </el-col>
              <el-col :span="7">
                <div style="
                        display: flex;
                        align-items: center;
                        height: 50px;
                        justify-content: center;
                      ">
                  <span class="circle" style="background-color: #3afefe"></span>
                  <span style="color: #696a6d">order failed</span>
                </div>
                <div style="
                        color: #3afefe;
                        font-size: 20px;
                        line-height: 25px;
                        text-align: center;
                      ">
                  12
                </div>
              </el-col>
              <el-col :span="10">
                <div style="
                        display: flex;
                        align-items: center;
                        height: 50px;
                        justify-content: center;
                      ">
                  <span class="circle" style="background-color: #14e648"></span>
                  <span style="color: #696a6d">Successfulled</span>
                </div>
                <div style="font-size: 20px; line-height: 25px; text-align: center">
                  100
                </div>
              </el-col>
            </el-row>

            <el-row class="bodyBox_botoom_row" style="margin-top: 20px">
              <el-col :span="7">
                <div class="changeTitle">Order challenge</div>
                <div class="changeBox" style="display: flex; justify-content: space-around">
                  <div>
                    <div>Failed</div>
                    <div style="color: red; font-size: 20px">2</div>
                  </div>
                  <div>
                    <div>Total</div>
                    <div style="color: #fff; font-size: 20px">2</div>
                  </div>
                </div>
              </el-col>
              <el-col :span="7">
                <div class="changeTitle">Chain challenge</div>
                <div class="changeBox" style="display: flex; justify-content: space-around">
                  <div>
                    <div>Failed</div>
                    <div style="color: #fff; font-size: 20px">2</div>
                  </div>
                  <div>
                    <div>Total</div>
                    <div style="color: #fff; font-size: 20px">2</div>
                  </div>
                </div>
              </el-col>
              <el-col :span="10">
                <div class="changeTitle">Pool challenge</div>
                <div class="changeBox" style="display: flex; justify-content: space-around">
                  <div>
                    <div>Failed</div>
                    <div style="color: #fff; font-size: 20px">2</div>
                  </div>
                  <div>
                    <div>Total</div>
                    <div style="color: #fff; font-size: 20px">2</div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>

      <el-col :span="12" class="Miner_bottom_last">
        <div class="bodyBox Miner_Works">
          <div>
            <span style="font-size: 32px; margin-left: 10px; font-weight: 600">Works
            </span>
            <span>123</span>
          </div>
          <div class="workcontent">
            <el-row class="worksList" align="middle">
              <el-col :span="3">Work1</el-col>
              <el-col :span="21" class="worksBox">
                <el-row :gutter="20">
                  <el-col :span="3" style="font-size: 14px">
                    <div style="text-align: start">GPU</div>
                    <div style="margin-top: 20px">
                      <span class="circle"></span>
                      <span style="font-size: 14px">Used</span>
                    </div>
                  </el-col>
                  <el-col :span="7">
                    <div style="display: flex; justify-content: space-between">
                      <span>CPU</span>
                      <span>25%</span>
                    </div>
                    <el-progress style="margin-top: 17px" color="#7660FD" :show-text="false" :stroke-width="12"
                      :percentage="60" />
                  </el-col>
                  <el-col :span="7">
                    <div style="display: flex; justify-content: space-between">
                      <span>CPU</span>
                      <span>45%</span>
                    </div>
                    <el-progress style="margin-top: 17px" color="#77E4E8" :show-text="false" :stroke-width="12"
                      :percentage="45" />
                  </el-col>
                  <el-col :span="7">
                    <div style="display: flex; justify-content: space-between">
                      <span>CPU</span>
                      <span>51%</span>
                    </div>
                    <el-progress style="margin-top: 17px" color="#3A6DCC" :show-text="false" :stroke-width="12"
                      :percentage="51" />
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row class="worksList" align="middle">
              <el-col :span="3">Work1</el-col>
              <el-col :span="21" class="worksBox">
                <el-row :gutter="20">
                  <el-col :span="3" style="font-size: 14px">
                    <div style="text-align: start">GPU</div>
                    <div style="margin-top: 20px">
                      <span class="circle"></span>
                      <span style="font-size: 14px">Used</span>
                    </div>
                  </el-col>
                  <el-col :span="7">
                    <div style="display: flex; justify-content: space-between">
                      <span>CPU</span>
                      <span>25%</span>
                    </div>
                    <el-progress style="margin-top: 17px" color="#7660FD" :show-text="false" :stroke-width="12"
                      :percentage="60" />
                  </el-col>
                  <el-col :span="7">
                    <div style="display: flex; justify-content: space-between">
                      <span>CPU</span>
                      <span>45%</span>
                    </div>
                    <el-progress style="margin-top: 17px" color="#77E4E8" :show-text="false" :stroke-width="12"
                      :percentage="45" />
                  </el-col>
                  <el-col :span="7">
                    <div style="display: flex; justify-content: space-between">
                      <span>CPU</span>
                      <span>51%</span>
                    </div>
                    <el-progress style="margin-top: 17px" color="#3A6DCC" :show-text="false" :stroke-width="12"
                      :percentage="51" />
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row class="worksList" align="middle">
              <el-col :span="3">Work1</el-col>
              <el-col :span="21" class="worksBox">
                <el-row :gutter="20">
                  <el-col :span="3" style="font-size: 14px">
                    <div style="text-align: start">GPU</div>
                    <div style="margin-top: 20px">
                      <span class="circle"></span>
                      <span style="font-size: 14px">Used</span>
                    </div>
                  </el-col>
                  <el-col :span="7">
                    <div style="display: flex; justify-content: space-between">
                      <span>CPU</span>
                      <span>25%</span>
                    </div>
                    <el-progress style="margin-top: 17px" color="#7660FD" :show-text="false" :stroke-width="12"
                      :percentage="60" />
                  </el-col>
                  <el-col :span="7">
                    <div style="display: flex; justify-content: space-between">
                      <span>CPU</span>
                      <span>45%</span>
                    </div>
                    <el-progress style="margin-top: 17px" color="#77E4E8" :show-text="false" :stroke-width="12"
                      :percentage="45" />
                  </el-col>
                  <el-col :span="7">
                    <div style="display: flex; justify-content: space-between">
                      <span>CPU</span>
                      <span>51%</span>
                    </div>
                    <el-progress style="margin-top: 17px" color="#3A6DCC" :show-text="false" :stroke-width="12"
                      :percentage="51" />
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row class="worksList" align="middle">
              <el-col :span="3">Work1</el-col>
              <el-col :span="21" class="worksBox">
                <el-row :gutter="20">
                  <el-col :span="3" style="font-size: 14px">
                    <div style="text-align: start">GPU</div>
                    <div style="margin-top: 20px">
                      <span class="circle"></span>
                      <span style="font-size: 14px">Used</span>
                    </div>
                  </el-col>
                  <el-col :span="7">
                    <div style="display: flex; justify-content: space-between">
                      <span>CPU</span>
                      <span>25%</span>
                    </div>
                    <el-progress style="margin-top: 17px" color="#7660FD" :show-text="false" :stroke-width="12"
                      :percentage="60" />
                  </el-col>
                  <el-col :span="7">
                    <div style="display: flex; justify-content: space-between">
                      <span>CPU</span>
                      <span>45%</span>
                    </div>
                    <el-progress style="margin-top: 17px" color="#77E4E8" :show-text="false" :stroke-width="12"
                      :percentage="45" />
                  </el-col>
                  <el-col :span="7">
                    <div style="display: flex; justify-content: space-between">
                      <span>CPU</span>
                      <span>51%</span>
                    </div>
                    <el-progress style="margin-top: 17px" color="#3A6DCC" :show-text="false" :stroke-width="12"
                      :percentage="51" />
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row> -->
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.topBox {
  width: 100%;
  margin-top: 20px;
  background-color: rgb(82, 92, 97, 0.7);
  // background: linear-gradient(rgba(0, 0, 0, 0.1) 0%,
  //     rgba(20, 131, 215, 0.4) 100%),
  //   linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(155, 53, 140, 0.1) 10%),
  //   linear-gradient(209.21deg, rgb(23, 23, 27) 1.57%, rgb(119, 63, 211) 98.38%);
  padding: 20px;
}

.bg {
  border-radius: 5px;
  background-color: #171a21;
  width: 100%;
  padding: 3px 15px;
  box-sizing: border-box;
}

.title {
  color: #fdfdfd;
  font-size: 20px;
  font-weight: bold;
  margin-top: 10px;
}

.userdetail {
  display: flex;
  align-items: center;

  & > div {
    flex: 1 0 auto;
    text-align: center;
  }
}

.userName {
  color: #acacac;
  font-size: 24px;
  margin-left: 10px;
  vertical-align: text-bottom;
}

.mt-8 {
  margin-top: 5px;
}

.three {
  display: flex;

  & > div {
    position: relative;
    height: 80px;
    box-sizing: border-box;
  }

  & > div:first-child {
    flex: 2 0;
    overflow: hidden;
  }

  & > div:not(:first-child) {
    flex: 3 0;
    overflow: hidden;
  }

  & > div:not(:last-child)::after {
    content: "";
    position: absolute;
    height: 70%;
    width: 1px;
    right: 0px;
    top: 47%;
    transform: translateY(-50%);
    background-color: #5a627e;
  }
}

.first {
  // padding-right: 10px;
  display: flex;
  justify-content: space-between;

  & > div:last-child {
    margin-right: 30px;
    line-height: 30px;
    font-size: 18px;
    color: #ffffff;
    font-weight: 600;
  }
}

.tow {
  display: flex;
  align-items: center;

  & > div {
    flex: 2 0;
    height: 100%;
    text-align: center;

    & > div:first-child {
      line-height: 40px;
      color: #1e6fa0;
      font-weight: 600;
      font-size: 22px;
    }

    & > div:last-child {
      line-height: 30px;
      color: #ffffff;
      font-weight: 600;
      font-size: 22px;
    }
  }

  & > div:first-child {
    flex: 1 0;
  }
}

.one {
  display: flex;
  align-items: center;

  & > div {
    flex: 1 0;
    height: 100%;
    text-align: center;

    & > div:first-child {
      line-height: 40px;
      color: #1e6fa0;
      font-weight: 600;
      font-size: 22px;
    }

    & > div:last-child {
      line-height: 30px;
      color: #ffffff;
      font-weight: 600;
      font-size: 22px;
    }
  }

  & > div:nth-of-type(2) {
    flex: 4 0;
  }
}

.bodyBox {
  border-radius: 30px;
  height: 400px;
  padding: 20px 10px;
  margin-top: 45px;

  .RewardsBox {
    background-color: rgba(34, 38, 48, 0.8);
    backdrop-filter: blur(20px);
    height: 260px;
    box-sizing: border-box;
    border-radius: 20px;
    margin-top: 15px;
    display: flex;

    & > div {
      width: 50%;
      flex: 0 0 auto;
      position: relative;
      height: 100%;
      word-wrap: break-word;
      word-break: normal;
      padding: 15px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      overflow: hidden;
    }

    & > div:first-child::after {
      content: "";
      position: absolute;
      right: 1px;
      height: 75%;
      width: 2px;
      background-color: #515257;
      z-index: 1;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .RewardsBox_div {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;

    & > div:first-child {
      font-weight: bold;
    }

    & > div:last-child {
      margin-left: 15px;
      font-size: 16px;
      color: #5b56a2;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
        Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
        sans-serif;
    }
  }

  .bodyBox_right > div {
    height: 140px;
    position: relative;
    box-sizing: border-box;
    padding: 15px;
  }

  .bodyBox_right > div:not(:last-child)::after {
    content: "";
    position: absolute;
    right: 1px;
    height: 80%;
    width: 1px;
    background-color: #515257;
    z-index: 1;
    top: 40%;
    transform: translateY(-50%);
  }

  .Summery_col {
    .Summery {
      text-align: center;
      line-height: 30px;
    }
  }

  .bodyBox_botoom {
    border-radius: 20px;
    background-color: rgb(38, 47, 69, 0.7);
    height: 217px;
    padding: 20px 15px 10px;
  }

  .bodyBox_botoom_row {
    background-color: rgb(41, 44, 54, 0.1);
    height: 80px;
    border-radius: 15px;

    & > div:not(:last-child) {
      position: relative;
    }

    & > div:not(:last-child)::after {
      content: "";
      position: absolute;
      right: 1px;
      height: 80%;
      width: 1px;
      background-color: #515257;
      z-index: 1;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .circle {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: red;
    margin-right: 15px;
  }

  .changeTitle {
    color: rgb(105, 106, 109);
    text-align: center;
    line-height: 25px;
    font-weight: 600;
    font-size: 15px;
  }

  .changeBox {
    & > div {
      text-align: center;
      line-height: 25px;
      color: rgb(105, 106, 109);
    }
  }

  .Miner_bottom_last {
    border-radius: 30px;
    height: 400px;
    padding: 20px 10px;
    margin-top: 45px;
  }

  .workcontent {
    height: 320px;

    overflow-y: auto;
  }

  .workcontent::-webkit-scrollbar {
    display: none;
  }

  .worksList {
    margin-top: 20px;

    & > div {
      text-align: center;
    }

    .worksBox {
      background-color: rgb(30, 32, 38, 0.8);
      height: 80px;
      padding: 10px 5px;
      box-sizing: border-box;
      border-radius: 10px;

      ::v-deep {
        .el-progress-bar__outer {
          background-color: #3b3d47;
        }
      }

      .circle {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #35a47c;
        display: inline-block;
        margin-right: 10px;
      }
    }
  }
}

.Rewards {
  background: radial-gradient(
    218.51% 281.09% at 100% 100%,
    rgba(253, 63, 51, 0.6) 0%,
    rgba(76, 0, 200, 0.6) 45.83%,
    rgba(76, 0, 200, 0.6) 100%
  );
  box-shadow: rgb(39 77 153 / 20%) 0px 30px 60px,
    rgb(255 255 255 / 30%) 0px 0px 0px 0.5px inset;
  cursor: pointer;
  border-radius: 30px;
  backdrop-filter: blur(20px);
  -webkit-box-pack: justify;

  padding: 20px;
}

.bodyBox.Orders {
  background: radial-gradient(
    100% 128.38% at 100% 100%,
    rgba(51, 168, 253, 0.9) 0%,
    rgba(76, 0, 200, 0.2) 100%
  );
  box-shadow: rgb(39 77 153 / 20%) 0px 30px 60px,
    rgb(0 0 0 / 20%) 0px 0px 0px 0.5px inset;
}

.bodyBox.Storage {
  background: radial-gradient(
    180% 154.37% at 100% 90%,
    rgba(62, 101, 99, 0.7) 0%,
    rgba(224, 157, 81, 0.75) 160%
  );
  box-shadow: rgb(39 77 153 / 20%) 0px 30px 60px,
    rgb(0 0 0 / 20%) 0px 0px 0px 0.5px inset;
}

.bodyBox.Miner_Works {
  background: linear-gradient(
    rgb(117, 224, 230, 0.4) 0%,
    rgb(57, 19, 184, 0.7) 100%
  );
  box-shadow: rgb(39 77 153 / 20%) 0px 30px 60px,
    rgb(0 0 0 / 20%) 0px 0px 0px 0.5px inset;
}
</style>
