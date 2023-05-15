import {
    getUserLoginStatus,
    setImportPrivateKey,
    getValidatePassword,
    setresetPassword,
    getDmcUsername
} from '@/api/common'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { ElNotification, ElMessageBox } from 'element-plus'

export default function getUserPrivateKey() {
    const passwordIsExist = ref(false);
    const store = useStore()
    const email = computed(() => store.getters.userInfo?.email)
    const dmc = computed(() => store.getters.userInfo?.dmc)
    const importPrivateKey = async () => {
        ElMessageBox.prompt("Please enter the private key", "Tip", {
            "show-close": false,
            'show-cancel-button': false,
            'close-on-click-modal': false,
            'close-on-press-escape': false,
            confirmButtonText: "OK",
            inputPlaceholder: "Please enter the private key",
            // inputPattern:
            //   /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
            // inputErrorMessage: 'Invalid Email',
            beforeClose: (action, instance, done) => {
                if (action === "confirm") {
                    getDmcUsername({ privateKey: instance.inputValue, }).then(res => {
                        if (res.code == 200) {
                            if (res.data === dmc.value) {
                                setImportPrivateKey({
                                    privateKey: instance.inputValue,
                                    email: email.value,
                                }).then((res) => {
                                    if (res.code == 200) {
                                        // store.commit('global/SAVE_USERNAME', res.data)
                                        done();
                                    }
                                });
                            } else {
                                ElNotification({
                                    type: 'error',
                                    message: 'Incorrect private key filling',
                                    position: 'bottom-left'
                                })
                            }
                        }

                    })


                } else {
                    done();
                }
            },
        })
            .then(({ value }) => { })
            .catch(() => { });
    }

    const loadUserLoginStatus = () => {
        let params = {
            email: email.value,
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
    return {
        passwordIsExist,
        loadUserLoginStatus
    }
}
