<template>
    <modal
      class="mu-dialog type1 mu-fix-foot"
      name="example-adaptive"
      transition="nice-modal-fade"
      :min-width="styleObj.minWidth"
      :min-height="styleObj.minHeight"
      :delay="100"
      :adaptive="true"
      @before-close="beforeClose">

      <div
        class="vld-parent"
        ref="modalLoaderWrap"
       :class="modalBodyClass + ' custom-modal-wrapper'">
        <component 
            ref="modalSub" 
            v-bind:is="modalSubComponent" 
            v-bind:params="params"
            v-bind:modalType="styleObj.modalType"
            v-bind:wrapType="wrapType"
            ></component>

        <div :class="(wrapType == 'dialog') ? 'mu-alert-foot' : 'modal-footer mu-dialog-foot'">

            <!-- 초기화 -->
            <button 
            v-if="useResetBtn"
            type="button" 
            :class="'mu-btn ' + ((wrapType == 'dialog') ? 'mu-btn-icon' : '')" 
            @click="reset()">초기화</button>

            <!-- 취소 -->
            <button 
            v-if="useCancelBtn"
            type="button" 
            :class="'mu-btn ' + ((wrapType == 'dialog') ? 'mu-btn-icon' : 'fl')" 
            mu-dialog-close="alarm.item-config"
            @click="cancel()">{{cancelBtn}}</button>
            <!-- 적용 -->
            <button 
            v-if="useSaveBtn"
            type="button"
            :class="'mu-btn ' + ((wrapType == 'dialog') ? 'mu-btn-icon' : ' fr')" 
            @click="confirm()">{{okBtn}}</button>
        </div>
      </div>
            


      <!-- <div class="text-center modal-footer uk-clearfix ">
        <v-btn @click="cancel()" color="error">
          <v-icon left>mdi-close</v-icon>{{cancelBtn}}
        </v-btn>
        <v-btn @click="confirm()" color="primary">
          <v-icon left>mdi-plus</v-icon>{{okBtn}}
        </v-btn>
      </div> -->
  </modal>
</template>
<script>
const modalId = 'example-adaptive';

export default {
  name: 'Modal_Adaptive',
  data() {
    return {
      modalOpen : false,
      modalSubComponent : null,
      params : {},
      styleObj : {},
      modalBodyClass : '',
      okBtn : '확인',
      cancelBtn : '취소',
      useSaveBtn : true,
      useCancelBtn : true,
      useResetBtn : false,
      wrapType : '',
      loader : null
    }
  },
  created() {
    // 외부에서 popup창을 띄우고 싶을때, setSampleTrackModal을 호출한 뒤 띄울 component를 전달하면,
    // 해당 컴포넌트가 popup창으로 띄워진다.
    this.EventBus.$on('setModalComponent', this.setModalComponent);
    this.EventBus.$on('modalClose', this.cancel);
    this.EventBus.$on('showModalLoader', this.showModalLoader);
    this.EventBus.$on('hideModalLoader', this.hideModalLoader);
  },
  beforeDestroy(){
    this.EventBus.$off('setModalComponent');
    this.EventBus.$off('modalClose');
    this.EventBus.$off('showModalLoader');
    this.EventBus.$off('hideModalLoader');
  },
  mounted() {
  },
  methods : {
    showModalLoader() {
      this.loader = this.showLoader(this, this.$refs.modalLoaderWrap);
    },
    hideModalLoader() {
      this.loader.hide();
    },
    /**
     * componentObj {
     *  component : component,
     *  param : {id:id, key:key...}
     * }
     */
    setModalComponent(componentObj) {
      // TEST CODE
      // modal-footer height를 css로 지정하는 방법을 알지 못해서 수동으로 지정
      this.wrapType = componentObj.wrapType;
      if (this.wrapType == 'dialog') {
        this.modalBodyClass = 'mu-alert etc'
      } else {
        this.modalBodyClass = 'modal-body'
      }
      this.styleObj = componentObj.styleObj;
      this.params = componentObj.params;

      // btn title customized
      this.okBtn = componentObj.btnName.ok
      this.cancelBtn = componentObj.btnName.cancel

      // 사용하지 않는 경우만 값을 보냄.
      this.useSaveBtn = componentObj.btnName.useSaveBtn == undefined ? true : componentObj.btnName.useSaveBtn
      this.useCancelBtn = componentObj.btnName.useCancelBtn == undefined ? true : componentObj.btnName.useCancelBtn

      // 사용하는 경우만 값을 보냄
      this.useResetBtn = componentObj.btnName.useResetBtn == undefined ? false : componentObj.btnName.useResetBtn

      this.modalSubComponent = componentObj.component;

      // popup open
      this.modalOpen = true
      this.$modal.show(modalId)
    },
    cancel() {
      // popup close
      this.modalOpen = false
      this.$modal.hide(modalId);
    },
    confirm() {
      // 호출하고, eventbus에서 해제해준다.
      const result = this.$refs.modalSub.confirm();
      if (result == true) {
        this.modalOpen = false
        this.$modal.hide(modalId);
      }
    },
    reset() {
      this.$refs.modalSub.reset();
    },
    beforeClose(evt) {
      if (this.modalOpen) {
        evt.stop()
      }
    }
  }
}
</script>

<style scoped>
.custom-modal-wrapper {
  width : 100%;
}
</style>