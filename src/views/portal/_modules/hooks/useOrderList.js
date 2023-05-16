import { getOrderList } from "@/api/order/orderList";
import { search_foggie } from "@/utils/api";
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
export default function useOrderList() {
    const store = useStore()
    const keyWord = ref("");

    const spaceList = ref([])
    const loading = ref(false)
    const deviceList = ref([])
    const email = computed(() => store.getters.userInfo?.email)
    const getSpaceList = () => {
        getOrderList({ email: email.value }).then(res => {
            if (res.code == 200) {
                spaceList.value = res.data

            }
        })
    }
    const search = async () => {
        loading.value = true;
        await getSpaceList()
        search_foggie({ email: email.value })
            .then((res) => {
                let cur_data = res.data;
                deviceList.value = cur_data.filter((el) => {
                    if (el.device_type === "space") {
                        const target = spaceList.value.find(
                            (item) => item.order_id == el.space_order_id
                        );
                        if (target) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return true;
                    }
                });
                store.dispatch("global/setDeviceList", deviceList.value);
                loading.value = false;
            })
            .finally(() => {
                loading.value = false;
            });
    };
    const list = computed(() => {
        if (!keyWord.value) {
            return deviceList.value;
        } else {
            return deviceList.value.filter((el) => {
                return (
                    el.device_name?.indexOf(keyWord.value) > -1 ||
                    el.dedicatedip?.indexOf(keyWord.value) > -1 ||
                    el.device_id?.indexOf(keyWord.value) > -1 ||
                    el.space_order_id?.indexOf(keyWord.value) > -1
                );
            });
        }
    });
    const handleProgress = (item) => {
        if (!item.device_type) {
            let created = new Date(item.created_at).getTime() / 1000;
            let now = new Date().getTime() / 1000 - created;
            let end = +item.expire - created;
            return +(now / end).toFixed(2) > 100
                ? 100
                : +(now / end).toFixed(2)
                    ? +(now / end).toFixed(2)
                    : 0;
        } else {
            let created = +item.created_at;
            let now = new Date().getTime() - created;
            let end = new Date(item.expire).getTime() - created;
            return +(now / end).toFixed(2) > 100
                ? 100
                : +(now / end).toFixed(2)
                    ? +(now / end).toFixed(2)
                    : 0;
        }
    };
    const copyLink = (text) => {
        var input = document.createElement("input");
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand("Copy");
        document.body.removeChild(input);
        // let str = `Copying  ${type} successful!`;
        // this.$message.success(str);
        proxy.$notify({
            message: "Copy succeeded",
            type: "success",
            position: "bottom-left",
        });
    };
    const handleID = (str) => {
        return (
            str.substring(0, 3) + "..." + str.substring(str.length - 3, str.length)
        );
    };

    return {
        loading,
        spaceList,
        deviceList,
        list,
        getSpaceList,
        search,
        handleProgress,
        copyLink,
        handleID
    }
}