import useVariable from './useVariable'
import { ref, toRefs, inject, nextTick, computed } from 'vue'
import {
    file_delete,
} from "@/utils/api.js";
export default function useDelete(tableLoading, refresh) {
    const { store, tokenMap, proxy } = useVariable()
    const deviceData = inject('deviceData')
    const deleteItem = (item) => {
        tableLoading.value = true;
        const token = computed(() => {
            if (deviceData.device_type == "space") {
                return deviceData.upload_file_token;
            } else {
                return tokenMap.value[deviceData.device_id];
            }
        });
        file_delete(token.value, item, deviceData).then((res) => {
            if (res && res.data) {
                proxy.$notify({
                    type: "success",
                    message: "Delete succeeded",
                    position: "bottom-left",
                });
                tableLoading.value = false;
                let arr = [];
                if (store.getters.uploadFileList && deviceData.device_id) {
                    arr = store.getters.uploadFileList[deviceData.device_id];
                    if (arr && arr.length > 0) {
                        store.getters.uploadFileList[deviceData.device_id] = arr.filter(
                            (val) => {
                                return val.urlFileName !== item.key;
                            }
                        );
                    }
                }
                nextTick(() => {
                    refresh();
                });
            } else {
                tableLoading.value = false;
                proxy.$notify({
                    type: "error",
                    message: "Delete Failed",
                    position: "bottom-left",
                });
            }
        });
    };
    return {
        deleteItem
    }
}