import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import {
    getUserLoginStatus,
    setImportPrivateKey,
    getDmcUsername
} from "@/api/common";
import { updateUser } from '@/utils/api'
import { ElMessageBox, ElNotification } from 'element-plus'
export default function usePrivateKey() {
    const store = useStore()
    const email = computed(() => store.getters.userInfo.email)
    const dmc = computed(() => store.getters.userInfo.dmc)
    const userId = computed(() => store.getters.userInfo?.id || "")
    const passwordIsExist = ref(false)
    function loadUserLoginStatus() {
        return new Promise((resolve, reject) => {
            let params = {
                email: email.value
                // username: props.userInfo.dmc,
            };
            getUserLoginStatus(params).then((res) => {
                if (res.code == 10001) {
                    passwordIsExist.value = false;
                    reject(false)
                } else if (res.code == 10002) {
                    passwordIsExist.value = true;
                    resolve(true)
                } else if (res.code == 10007) {
                    importPrivateKey();
                }
            });
        })

    }
    async function importPrivateKey() {
        ElMessageBox.prompt("Please enter the private key", "Tip", {
            "show-close": false,
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            inputPlaceholder: "Please enter the private key",
            inputType: 'password',
            // inputPattern:
            //   /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
            // inputErrorMessage: 'Invalid Email',
            beforeClose: (action, instance, done) => {
                if (action === "confirm") {
                    getDmcUsername({ privateKey: instance.inputValue }).then(
                        (res) => {
                            if (res.code == 200) {
                                if (res.data === dmc.value) {
                                    setImportPrivateKey({
                                        privateKey: instance.inputValue,
                                        email: email.value,
                                    }).then((res) => {
                                        if (res.code == 200) {
                                            ElNotification({
                                                type: "success",
                                                message: "Successfully imported private key",
                                                position: "bottom-left",
                                            });
                                            passwordIsExist.value = true;
                                            // store.commit('global/SAVE_USERNAME', res.data)
                                            done();
                                        }
                                    });
                                } else if (!dmc.value && res.data) {
                                    let postData = {
                                        dmc: res.data,
                                        wallet_type: "wallet",
                                    };
                                    updateUser(userId.value, postData).then((res) => {
                                        if (res && res.data && res.data.dmc) {
                                            setImportPrivateKey({
                                                privateKey: instance.inputValue,
                                                email: email.value,
                                            }).then((res) => {
                                                if (res.code == 200) {
                                                    ElNotification({
                                                        type: "success",
                                                        message: "Successfully imported private key",
                                                        position: "bottom-left",
                                                    });
                                                    passwordIsExist.value = true;
                                                    // store.commit('global/SAVE_USERNAME', res.data)
                                                    done();
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    ElNotification({
                                        type: "error",
                                        message: "Incorrect private key filling",
                                        position: "bottom-left",
                                    });
                                }
                            } else {
                                ElNotification({
                                    type: "error",
                                    message: "Incorrect private key filling",
                                    position: "bottom-left",
                                });
                            }
                        }
                    );
                } else {
                    done();
                }
            }
        })
            .then(({ value }) => { })
            .catch(() => { });
    }
    return {
        passwordIsExist,
        loadUserLoginStatus
    }

}