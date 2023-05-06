<template>
  <div>
    <h1><svg-icon icon-class="LINK"></svg-icon> Foggie</h1>
    <h2 style="margin-bottom: 20px">
      Lightning fast reads from the IPFS/CYFS network
    </h2>
    <p style="width: 900px; margin: 0 auto; font-size: 20px">
      Read data available on the public IPFS/CYFS network with Foggie (at
      https://foggie.fogworks.io),Add your content ID (CID) below to try it out.
    </p>
    <el-input class="search-input" v-model="keyWord" placeholder="cid...">
      <template #prepend>
        <el-select v-model="checked" placeholder="Select" style="width: 115px">
          <el-option label="ipfs://" value="ipfs" />
          <el-option label="foggie://" value="foggie" />
          <el-option label="cyfs://" value="cyfs" disabled />
        </el-select>
      </template>
      <template #suffix>
        <el-button type="primary" @click="download">GO</el-button>
      </template>
    </el-input>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
const keyWord = ref("");
const { proxy } = getCurrentInstance();
const checked = ref("ipfs");
const download = () => {
  if (keyWord.value) {
    let downloadUrl = `https://w3s.link/ipfs/${keyWord.value}`;
    var oA = document.createElement("a");
    oA.download = name; // 设置下载的文件名，默认是'下载'
    oA.href = downloadUrl;
    document.body.appendChild(oA);
    oA.click();
    oA.remove(); // 下载之后把创建的元素删除
  } else {
    proxy.$notify({
      type: "warning",
      message: "Please enter the cid",
      position: "bottom-left",
    });
  }
};
</script>

<style lang="scss" scoped>
.search-input {
  width: 900px;
  margin-top: 50px;
  :deep {
    .el-input-group__prepend {
      border-radius: 50px 0 0 50px;
      background: linear-gradient(120deg, #3913b8 0%, #75e0e6 100%);
      color: #fff;
      box-shadow: none;
      .el-input__inner {
        color: #fff;
        font-size: 16px;
        text-align: center;
      }
      .el-input__suffix {
        .el-icon {
          color: #fff;
        }
      }
    }
  }
  .el-button {
    width: unset;
    height: 35px;
    border-radius: 99px;
  }
}
</style>
