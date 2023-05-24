import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import {
    getUserLoginStatus,
    setImportPrivateKey,
} from "@/api/common";
import { ElMessageBox } from 'element-plus'
export default function usePrivateKey() {
    const store = useStore()
    const email = computed(() => store.getters.userInfo.email)
    const passwordIsExist = ref(false)
    function loadUserLoginStatus() {
        let params = {
            email: email.value
            // username: props.userInfo.dmc,
        };

        getUserLoginStatus(params).then((res) => {
            if (res.code == 10001) {
                passwordIsExist.value = false;
            } else if (res.code == 10002) {
                passwordIsExist.value = true;
            } else if (res.code == 10007) {
                importPrivateKey();
            }
        });
    }
    async function importPrivateKey() {
        ElMessageBox.prompt("Please enter the private key", "Tip", {
            "show-close": false,
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            inputPlaceholder: "Please enter the private key",
            // inputPattern:
            //   /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
            // inputErrorMessage: 'Invalid Email',
            beforeClose: (action, instance, done) => {
                if (action === "confirm") {
                    setImportPrivateKey({
                        privateKey: instance.inputValue,
                        email: email.value,
                    }).then((res) => {
                        if (res.code == 200) {
                            passwordIsExist.value = true;
                            // store.commit('global/SAVE_USERNAME', res.data)
                            done();
                        }
                    });
                } else {
                    done();
                }
            },
        })
            .then(({ value }) => { })
            .catch(() => { });
    }
    return {
        passwordIsExist,
        loadUserLoginStatus
    }

}