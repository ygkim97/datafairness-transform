<template>
  <div>
    <!-- Modals -->
    <modal-test></modal-test>

    <customized-dialog></customized-dialog>
  </div>
</template>

<script>
import ModalTest from "./modals/Modal_Adaptive.vue";
import Dialog from "./modals/Dialog.vue";

export default {
  components: {
    ModalTest,
    "customized-dialog": Dialog
  },
  data() {
    return {
    };
  },
  mounted() {
    this.EventBus.$on("modalAlert", this.modalAlert);
    this.EventBus.$on("modalConfirm", this.modalConfirm);
  },
  methods: {
    /**
     * obj : {
     *  text : '',
     *  title : '',
     *  okTitle : '',
     *  okRes : function() {},
     * }
     */
    modalAlert(obj) {
      this.$modal.show("dialog", {
        markType: obj.markType === undefined ? "etc" : obj.markType, // 'success, etc, error'
        title: obj.title,
        text: obj.text,
        clickToClose: false,
        buttons: [
          {
            title: obj.okTitle,
            default: false,
            handler: () => {
              this.$modal.hide("dialog");
              if (
                Object.prototype.hasOwnProperty.call(obj, "okRes") &&
                obj.okRes !== undefined
              ) {
                obj.okRes();
              }
            }
          }
        ]
      });
    },
    modalConfirm(obj) {
      /**
       * obj : {
       *  text : '',
       *  title : '',
       *  okTitle : '',
       *  okRes : function() {},
       *  cancelRes : function() {}
       * }
       */
      this.$modal.show("dialog", {
        markType: obj.markType === undefined ? "etc" : obj.markType, // 'success, etc, error'
        title: obj.title,
        text: obj.text,
        clickToClose: false,
        buttons: [
          {
            title: obj.okTitle,
            default: false,
            handler: () => {
              this.$modal.hide("dialog");
              if (
                Object.prototype.hasOwnProperty.call(obj, "okRes") &&
                obj.okRes !== undefined
              ) {
                obj.okRes();
              }
            }
          },
          {
            title: obj.cancelTitle,
            default: false,
            handler: () => {
              this.$modal.hide("dialog");
              if (
                Object.prototype.hasOwnProperty.call(obj, "cancelRes") &&
                obj.cancelRes !== undefined
              ) {
                obj.cancelRes();
              }
            }
          }
        ]
      });
    }
  }
};
</script>

<style></style>
