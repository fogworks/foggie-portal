<template>
  <div>
    <p class="welcome">Device</p>
    <ul class="deviceList">
      <li
        class="card"
        v-for="(item, index) in deviceList.list"
        @click="toGuide(item)"
      >
        <span>
          {{ item.device_name }}
        </span>
        <el-dropdown
          popper-class="more-popper"
          @visible-change="visibleChange"
          @command="handleCommand"
        >
          <span>
            <svg-icon
              @click.stop="showClick"
              icon-class="more"
              class="more"
              style="color: #000; font-size: 20px"
            ></svg-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :command="{ flag: 'edit', data: item }">
                <svg-icon
                  style="margin-right: 5px"
                  icon-class="edit"
                ></svg-icon>
                Edit
              </el-dropdown-item>
              <el-dropdown-item :command="{ flag: 'delete', data: index }">
                <svg-icon
                  icon-class="delete"
                  style="margin-right: 5px"
                ></svg-icon>
                Delete
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </li>
    </ul>
    <IPFrom v-model:visible="visible"></IPFrom>
    <!-- <AssociatedAccount v-model:visible="accountVisible"></AssociatedAccount>
    <el-dialog
      class="account-dialog"
      title="Associated account"
      width="500px"
      v-model="chooseAssociated"
    >
      <span> Is it related to Foggie account? </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="skip">Skip</el-button>
          <el-button
            type="primary"
            @click="
              chooseAssociated = false;
              accountVisible = true;
            "
          >
            YES
          </el-button>
        </span>
      </template>
    </el-dialog> -->
  </div>
</template>

<script setup>
import { ref, reactive, computed, defineEmits, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import IPFrom from "./ipForm";
import { search_foggie } from "@/utils/api";
import AssociatedAccount from "./associatedAccount";
import { useStore } from "vuex";
const store = useStore();
const router = useRouter();
const { proxy } = getCurrentInstance();
const deviceList = reactive({
  list: [
    // {
    //   name: "xx",
    //   url: "dasdas",
    // },
  ],
});
const visible = ref(false);
const chooseAssociated = ref(false);
const accountVisible = ref(false);
const emit = defineEmits(["next"]);
const goEdit = () => {};
const userInfo = computed(() => store.getters.userInfo);
const toGuide = (item) => {
  // if (userInfo.email) {
  // 绑定且登录
  const url = `http://${item.dedicatedip}:8080`;
  window.location.href = url;
  // } else {
  // chooseAssociated.value = true;
  // }
};
const handleCommand = ({ flag, data }) => {
  console.log(flag, data);
  if (flag === "edit") {
    visible.value = true;
    console.log(visible.value);
  } else if (flag === "delete") {
    proxy
      .$confirm("Are you sure to delete this device record?", "Warning", {
        confirmButtonText: "YES",
        cancelButtonText: "NO",
        type: "warning",
      })
      .then(() => {
        deviceList.list.splice(data, 1);
        proxy.$notify({
          type: "success",
          message: "Successfully deleted",
          position: "bottom-left",
        });
      })
      .catch(() => {});
  }
};
const skip = () => {
  chooseAssociated.value = false;
  router.push({
    name: "Welcome",
  });
};
const dropMenuRef = ref(null);
const dropMenuShow = ref(false);
const visibleChange = (val) => {
  dropMenuShow.value = val;
};
const showClick = () => {
  // if (dropMenuShow.value) {
  //   dropMenuRef.value.handleClose();
  // } else {
  //   dropMenuRef.value.handleOpen();
  // }
};
const email = computed(() => store.getters["token/currentUser"]);
search_foggie({ email: email.value }).then((res) => {
  console.log(res, "res");
  deviceList.list = res.data;
});
</script>

<style lang="less" scoped>
.welcome {
  display: flex;
  align-items: center;
  text-align: left;
  font-weight: 700;
  font-size: 24px;
  color: #fff;
}

.deviceList {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  margin: 20px;
  padding: 0;
  list-style: none;
  li {
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
    width: 200px;
    height: 180px;
    margin: 20px;
    background: rgba(251, 251, 251, 0.58);
    border: 1px solid white;
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.22);
    backdrop-filter: blur(6px);
    border-radius: 17px;
    text-align: center;
    cursor: pointer;
    transition: all 0.5s;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    font-weight: bolder;
    color: black;
    cursor: pointer;
    > span {
      z-index: 10;
    }
    :deep {
      .el-dropdown {
        position: absolute;
        top: 10px;
        right: 10px;
        border: none !important;
        z-index: 10;
      }
    }
    // .more {
    //   position: absolute;
    //   top: 10px;
    //   right: 10px;
    // }
  }
  .card::before {
    content: "";
    position: absolute;
    width: 100px;
    background-image: linear-gradient(
      180deg,
      rgb(0, 183, 255),
      rgb(255, 48, 255)
    );
    height: 150%;
    animation: rotBGimg 3s linear infinite;
    transition: all 0.2s linear;
    display: none;
  }

  @keyframes rotBGimg {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .card::after {
    content: "";
    position: absolute;
    background: transparent;
    inset: 5px;
    border-radius: 15px;
  }
  .card:hover {
    background: #fff;
    transform: translateY(-5px);
    transition: all 0.5s ease-in-out;
    &::before {
      display: inline-block;
    }
    &::after {
      background-color: #fff;
    }
  }
}
</style>
<style lang="less">
.more-popper {
  background: transparent !important;
  .el-popper__arrow {
    display: none;
  }
  .el-dropdown-menu {
    // background: rgb(242, 246, 255);
    background: rgba(251, 251, 251, 0.58) !important;
  }
  .el-dropdown-menu__item {
    color: #000;
    background: transparent !important;

    // color: #000;
    // & + .el-dropdown-menu__item {
    //   border-top: 1px solid #e5e7eb;
    // }
  }
}
.account-dialog {
  .el-dialog__body {
    padding: 20px 0;
    color: #000;
  }
  .dialog-footer {
    .el-button {
      border-radius: 50px;
    }
  }
}
</style>
