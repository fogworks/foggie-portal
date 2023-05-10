<template>
  <div class="g-remove-check-code">
    <div
      class="g-remove-check-code_content"
      @keyup="fnCheckCodeKeyup"
      @keydown="fnCheckCodeKeydown"
      @paste="fnCheckCodeKeyPaste"
      @input="fnCheckCodeInputEvent"
    >
      <input
        :class="{ 'g-code-input_color': aCheckCodeInputComputed[0] !== '' }"
        max="9"
        min="0"
        maxlength="1"
        data-index="0"
        v-model.trim.number="aCheckCodeInputComputed[0]"
        type="number"
        ref="firstInputRef"
      />
      <input
        :class="{ 'g-code-input_color': aCheckCodeInputComputed[1] !== '' }"
        max="9"
        min="0"
        maxlength="1"
        data-index="1"
        v-model.trim.number="aCheckCodeInputComputed[1]"
        type="number"
      />
      <input
        :class="{ 'g-code-input_color': aCheckCodeInputComputed[2] !== '' }"
        max="9"
        min="0"
        maxlength="1"
        data-index="2"
        v-model.trim.number="aCheckCodeInputComputed[2]"
        type="number"
      />
      <input
        :class="{ 'g-code-input_color': aCheckCodeInputComputed[3] !== '' }"
        max="9"
        min="0"
        maxlength="1"
        data-index="3"
        v-model.trim.number="aCheckCodeInputComputed[3]"
        type="number"
      />
      <input
        :class="{ 'g-code-input_color': aCheckCodeInputComputed[4] !== '' }"
        max="9"
        min="0"
        maxlength="1"
        data-index="4"
        v-model.trim.number="aCheckCodeInputComputed[4]"
        type="number"
      />
      <input
        :class="{ 'g-code-input_color': aCheckCodeInputComputed[5] !== '' }"
        max="9"
        min="0"
        maxlength="1"
        data-index="5"
        v-model.trim.number="aCheckCodeInputComputed[5]"
        type="number"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "VerificationCode",
  props: {
    authInput: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      aCheckCodeInput: ["", "", "", "", "", ""], 
      aCheckCodePasteResult: [],
    };
  },
  watch: {
    aCheckCodeInput: {
      handler(val) {
        this.$emit("update:authInput", val.join(""));
      },
      deep: true,
    },
  },
  computed: {
    aCheckCodeInputComputed() {
      if (this.aCheckCodePasteResult.length === 6) {
        return this.aCheckCodePasteResult;
      } else if (
        this.aCheckCodeInput &&
        Array.isArray(this.aCheckCodeInput) &&
        this.aCheckCodeInput.length === 6
      ) {
        return this.aCheckCodeInput;
      } else if (/^\d{6}$/.test(this.aCheckCodeInput.toString())) {
        return this.aCheckCodeInput.toString().split("");
      } else {
        return new Array(6);
      }
    },
  },
  methods: {
    fnCheckCodeKeyup(e) {
      let index = e.target.dataset.index * 1;
      let el = e.target;
      el.value = el.value.replace(/Digit|Numpad/i, "").slice(0, 1);
      if (/Digit|Numpad/i.test(e.code)) {
        this.aCheckCodeInput.splice(
          index,
          1,
          e.code.replace(/Digit|Numpad/i, "")
        );
        el.nextElementSibling && el.nextElementSibling.focus();
        if (index === 5) {
          if (this.aCheckCodeInput.join("").length === 6)
            document.activeElement.blur();
        }
      }
    },
    fnCheckCodeKeydown(e) {
      let index = e.target.dataset.index * 1;
      let el = e.target;
      if (e.key === "Backspace") {
        if (this.aCheckCodeInput[index].length > 0) {
          this.aCheckCodeInput.splice(index, 1, "");
        } else {
          if (el.previousElementSibling) {
            el.previousElementSibling.focus();
            this.aCheckCodeInput[index - 1] = "";
          }
        }
      } else if (e.key === "Delete") {
        if (this.aCheckCodeInput[index].length > 0) {
          this.aCheckCodeInput.splice(index, 1, "");
        } else {
          if (el.nextElementSibling) {
            el.nextElementSibling.focus();
            this.aCheckCodeInput[++index] = "";
          }
        }
      } else if (e.key === "Home") {
        el.parentElement.children[0] && el.parentElement.children[0].focus();
      } else if (e.key === "End") {
        el.parentElement.children[this.aCheckCodeInput.length - 1] &&
          el.parentElement.children[this.aCheckCodeInput.length - 1].focus();
      } else if (e.key === "ArrowLeft") {
        if (el.previousElementSibling) el.previousElementSibling.focus();
      } else if (e.key === "ArrowRight") {
        if (el.nextElementSibling) el.nextElementSibling.focus();
      }
    },
    fnCheckCodeInputEvent(e) {
      let index = e.target.dataset.index * 1;
      let el = e.target;
      el.value = el.value.replace(/Digit|Numpad/i, "").slice(0, 1);
      this.aCheckCodeInput[index] = el.value;
    },
    fnCheckCodeKeyPaste(e) {
      e.clipboardData.items[0].getAsString((str) => {
        if (str.toString().length === 6) {
          this.aCheckCodePasteResult = str.split("");
          document.activeElement.blur();
          this.aCheckCodeInput = this.aCheckCodeInputComputed;
          this.aCheckCodePasteResult = [];
        } else {
          this.aCheckCodeInput = ["", "", "", "", "", ""];
        }
      });
    },
  },
};
</script>
<style>
.g-remove-check-code {
  width: 100%;
}

.g-remove-check-code .g-remove-check-code_title {
  font-size: 14px;
  color: #666;
}

.g-remove-check-code .g-remove-check-code_content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 300px;
  padding: 5px 0 5px 0;
  margin-left: 35px;
}

.g-remove-check-code .g-remove-check-code_content input {
  width: 35px;
  height: 40px;
  font-size: 30px;
  text-align: center;
  border: none;
  outline: none;
  border: solid 1px rgba(187, 187, 187, 100);
  border-radius: 4px;
  -moz-appearance: textfield;
}

.g-remove-check-code .g-remove-check-code_content input.g-code-input_color {
  border-color: #5290ff;
}

.g-remove-check-code
  .g-remove-check-code_content
  input::-webkit-outer-spin-button,
.g-remove-check-code
  .g-remove-check-code_content
  input::-webkit-inner-spin-button {
  appearance: none;
  margin: 0;
}

.g-remove-check-code .g-remove-check-code_tip {
  font-size: 14px;
  color: #999;
  text-align: center;
}
</style>
