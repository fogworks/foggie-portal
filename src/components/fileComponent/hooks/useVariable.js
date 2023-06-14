import { ref, reactive, computed, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
export default function useVariable() {
    const store = useStore()
    const { proxy } = getCurrentInstance();

    const shareRefContent = reactive({});
    const copyContent = ref("");
    const pinData = reactive({
        item: {},
    });
    const tokenMap = computed(() => store.getters.tokenMap);
    const ipfsDialogShow = ref(false)
    return {
        shareRefContent,
        copyContent,
        pinData,
        tokenMap,
        store,
        ipfsDialogShow,
        proxy
    }
}