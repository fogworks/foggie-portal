<template>
  <div>
    <video id="myVideo" class="video-js vjs-big-play-centered vjs-fluid">
      This file format is currently not supported
    </video>
    <!-- <video :src="url2" autoplay controls></video> -->
  </div>
</template>

<script setup>
import { ref, toRefs, onMounted, computed, watch, inject } from "vue";
import { useStore } from "vuex";
import { baseUrl } from "@/setting";
const props = defineProps({
  srcData: {
    type: Object,
    default: () => {},
  },
  visible: {
    type: Boolean,
    default: false,
  },
});
const { srcData, visible } = toRefs(props);
const store = useStore();
const player = ref("");
const deviceData = inject("deviceData");
const deviceType = computed(() => deviceData.device_type);
const tokenMap = computed(() => store.getters.tokenMap);
const token = computed(() => {
  if (deviceData.device_type == "space") {
    return deviceData.upload_file_token;
  } else {
    return tokenMap.value[deviceData.device_id];
  }
});
const init = () => {
  console.dir(srcData.value);
  console.log("srcData.value");
  let cid = srcData.value.cid;
  let key = srcData.value.key;

  let ip = deviceData.rpc.split(":")[0];
  let port = deviceData.rpc.split(":")[1];
  let Id = deviceData.foggie_id;
  let peerId = deviceData.peer_id;
  const url = `${baseUrl}/file_download/?cid=${cid}&key=${key}&ip=${ip}&port=${port}&Id=${Id}&peerId=${peerId}&type=${
    deviceType.value == "space" ? "space" : "foggie"
  }&token=${token.value}`;
  player.value = videojs(
    document.getElementById("myVideo"),
    {
      controls: true,

      poster: "",

      preload: "auto",

      autoplay: false,

      fluid: true,
      techOrder: ["html5"],

      language: "en",

      muted: false,

      inactivityTimeout: false,
      playbackRates: [2.0, 1.5, 1.2, 1.0, 0.7],
      notSupportedMessage: "This file format is currently not supported",
      controlBar: {
        currentTimeDisplay: true,

        timeDivider: false,

        durationDisplay: true,

        remainingTimeDisplay: false,
        playbackRateMenuButton: true,

        volumePanel: {
          inline: false,
        },

        children: [
          { name: "playToggle" },

          { name: "currentTimeDisplay" },

          { name: "progressControl" },

          { name: "durationDisplay" },

          {
            name: "playbackRateMenuButton",

            playbackRates: [2.0, 1.5, 1.2, 1.0, 0.7],
          },

          {
            name: "volumePanel",

            inline: false,
          },

          { name: "FullscreenToggle" },
        ],
      },

      sources: [
        {
          // src: srcData.value.url,
          src: url,
          type: srcData.value.type,
        },
      ],
    },
    function onPlayerReady() {
      player.value.on("seeking", function (val) {
        console.log(
          document.getElementById("myVideo").buffered,
          "bufferedbufferedbuffered "
        );
        const time =
          document.getElementsByClassName("vjs-time-tooltip")[0].innerText;
        console.log(time, "time");

        // url = `${baseUrl}/file_download/?cid=${cid}&key=${key}&ip=${ip}&port=${port}&Id=${Id}&peerId=${peerId}&type=${
        //   deviceType.value == "space" ? "space" : "foggie"
        // }&token=${token.value}`;
        // changeSrc(url);
      });
    }
  );
};
function changeSrc(data) {
  // player.value.pause();

  // player.value.src(data);

  // player.value.load(data);

  // player.value.play();
  player.value.changeVideoSrc(src);
  player.value.load();
  player.value.play();
}
onMounted(() => {
  init();
});
// watch(
//   visible,
//   (val) => {
//     if (val && player.value) {
//       player.value.play();
//     } else if (!val && player.value) {
//       player.value.pause();
//     } else {
//       init();
//     }
//   },
//   {
//     immediate: true,
//   }
// );
// watch(
//   srcData,
//   (val) => {
//     if (val) {
//       changeSrc(val);
//     }
//   },
//   {
//     deep: true,
//     immediate,
//   }
// );
</script>

<style lang="scss">
.video-js {
  font-size: 14px;
}

.video-js button {
  outline: none;
}

.video-js.vjs-fluid,
.video-js.vjs-16-9,
.video-js.vjs-4-3 {
  height: 100%;

  background-color: #161616;
}

.vjs-poster {
  background-color: #161616;
}

.video-js .vjs-big-play-button {
  font-size: 2.5em;

  line-height: 2.3em;

  height: 2.5em;

  width: 2.5em;

  -webkit-border-radius: 2.5em;

  -moz-border-radius: 2.5em;

  border-radius: 2.5em;

  background-color: rgba(115, 133, 159, 0.5);

  border-width: 0.12em;

  margin-top: -1.25em;

  margin-left: -1.75em;
}

.video-js.vjs-paused .vjs-big-play-button {
  display: block;
}

.video-js.vjs-error .vjs-big-play-button {
  display: none;
}

.vjs-loading-spinner {
  font-size: 2.5em;

  width: 2em;

  height: 2em;

  border-radius: 1em;

  margin-top: -1em;

  margin-left: -1.5em;
}

.video-js .vjs-control-bar {
  display: flex;
}

.video-js .vjs-time-control {
  display: block;
}

.video-js .vjs-remaining-time {
  display: none;
}

.vjs-button > .vjs-icon-placeholder:before {
  font-family: VideoJS;
  font-size: 22px;

  line-height: 1.9;
}

.video-js .vjs-playback-rate .vjs-playback-rate-value {
  line-height: 2.4;

  font-size: 18px;
}

.video-js .vjs-play-progress {
  color: #ffb845;

  background-color: #ffb845;
  &::before {
    font-family: VideoJS;
  }
}
.video-js .vjs-volume-level:before {
  font-family: VideoJS;
}
.video-js .vjs-progress-control .vjs-mouse-display {
  background-color: #ffb845;
}

.vjs-mouse-display .vjs-time-tooltip {
  padding-bottom: 6px;

  background-color: #ffb845;
}

.video-js .vjs-play-progress .vjs-time-tooltip {
  display: none !important;
}
</style>
