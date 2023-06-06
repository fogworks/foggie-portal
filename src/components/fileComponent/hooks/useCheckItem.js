import { ref, reactive } from 'vue'

export default function useCheckItem() {
    const checkedData = ref([])
    const imgCheckedData = reactive({})
    return {
        checkedData,
        imgCheckedData
    }
}