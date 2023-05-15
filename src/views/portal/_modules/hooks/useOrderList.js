import { getOrderList } from "@/api/order/orderList";
import { ref } from 'vue'
export default function useOrderList() {
    const spaceList = ref([])
    const getSpaceList = () => {
        getOrderList().then(res => {
            if (res.code == 200) {
                spaceList.value = res.list

            }
        })
    }
    return {
        spaceList,
        getSpaceList
    }
}