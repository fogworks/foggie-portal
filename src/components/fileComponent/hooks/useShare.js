import useVariable from './useVariable'
import { ref, toRefs, inject } from 'vue'
import {
    publishPin,
} from "@/utils/api.js";
export default function useShare() {
    const { store, shareRefContent, copyContent, pinData, tokenMap, ipfsDialogShow } = useVariable()
    const deviceData = inject('deviceData')
    const showShareDialog = ref(false)
    const ipfsPin = (checked) => {
        const item = pinData.item;
        let ip_address = deviceData.rpc.split(":")[0];
        let port = deviceData.rpc.split(":")[1];
        let peerId = deviceData.peer_id;
        let token = tokenMap.value[deviceData.device_id];

        let data = {
            ip_address,
            port,
            token,
            // peerId: deviceData.value.peer_id,
            peerId,
            Id: deviceData.foggie_id,
            exp: 3 * 24 * 3600,
            stype: "ipfs",
            pin: true,
            key: item.pubkey,
            isDir: item.isDir,
        };
        publishPin(data).then((res) => {
            if (res) {
                ipfsDialogShow.value = false;
            }
        });
    };
    let shareCopyContent = "";
    const doShare = async (item) => {
        pinData.item = item
        let key = item.key;
        if (item) {
            ipfsPin(item);
        }
        if (key) {
            let user = store.getters["global/userInfo"].dmc;
            let ood_id_cyfs = deviceData.device_id_real ? deviceData.device_id_real : deviceData.device_id;
            let peer_id = deviceData.peer_id;
            let httpStr = `foggie://${peer_id}/${deviceData.order_id}/${item.cid}`;
            let cyfsStr = item.file_id ? `cyfs://o/${ood_id_cyfs}/${item.file_id}` : "";
            let ipfsStr = item.cid ? `ipfs://${item.cid}` : "";

            shareCopyContent = `${user} publish ${key} to Web3` + "\n";
            shareRefContent.user = `${user} publish ${key} to Web3`;
            let myQrcode = window.sessionStorage.getItem("myQrcode");
            let code = `http://foggie.fogworks.io/?pcode=${myQrcode}`;
            let shareStr = `The Web3 content I publish with Foggie is my digital asset and cannot be tampered with or deleted without my permission. It can also help us earn $DMC crypto rewards. Let's Web3-to-Earn together! Use my invite link ${code} to adopt a Foggie so we can all earn $DMC and grow Web3 together.Thanks!`;
            shareCopyContent = shareCopyContent + " " + " \n ";
            shareCopyContent = shareCopyContent + httpStr + " \n";
            shareCopyContent = shareCopyContent + " " + " \n ";
            shareRefContent.httpStr = httpStr;
            shareCopyContent = shareCopyContent + ipfsStr + " \n";
            shareCopyContent = shareCopyContent + " " + " \n ";
            shareRefContent.ipfsStr = ipfsStr;
            // shareRefContent.httpStr = shareRefContent.httpStr + `&ipfsStr=${ipfsStr}`;

            shareCopyContent = shareCopyContent + cyfsStr + " \n";
            shareCopyContent = shareCopyContent + " " + " \n ";
            shareRefContent.cyfsStr = cyfsStr;
            // shareRefContent.httpStr = shareRefContent.httpStr + `&cyfsStr=${cyfsStr}`;

            shareCopyContent = shareCopyContent + shareStr + " \n";
            shareRefContent.shareStr = shareStr;
            copyContent.value = shareCopyContent;
            // shareRefContent.value=shareCopyContent
            showShareDialog.value = true;
            // this.shareBoxShow = true;
        }
    };
    return {
        doShare,
        shareRefContent,
        copyContent,
        showShareDialog,
        ipfsDialogShow
    }
}