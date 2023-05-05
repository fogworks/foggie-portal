<template>
  <div>
    <h2>w3link</h2>
    <h1>Lightning fast reads from the IPFS network</h1>
    <p style="width: 900px; margin: 0 auto; font-size: 20px">
      Read data available on the public IPFS network with w3link using an HTTP
      endpoint (at https://w3s.link), no additional software necessary. Add your
      content ID (CID) below to try it out.
    </p>
    <el-input
      clearable
      class="search-input"
      v-model="keyWord"
      placeholder="cid..."
    >
      <template #prepend>https://w3s.link/ipfs/</template>
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
    }
  }
  .el-button {
    width: unset;
    height: 35px;
    border-radius: 99px;
  }
}
</style>
