import { getOrderList } from "@/api/order/orderList";
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
export default function useOrderList() {
    const store = useStore()
    const spaceList = ref([])
    const email = computed(() => store.getters.userInfo?.email)
    const getSpaceList = () => {
        getOrderList({ email: email.value }).then(res => {
            if (res.code == 200) {
                spaceList.value = res.data

            }
        })
    }
    return {
        spaceList,
        getSpaceList
    }
}