<template>
    <div id="blog-parent">
        <transition name="custom-fade">
            <keep-alive include="BlogList">
                <router-view />
            </keep-alive>
        </transition>
    </div>
</template>

<script>
export default {}
</script>

<style>
.custom-fade-enter-active {
  transition: all .8s cubic-bezier(1, 0.5, 0.8, 1);
}
.custom-fade-leave-active {
  transition: all 0s cubic-bezier(1, 0.5, 0.8, 1);
}
.custom-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  /* transform: translateY(10px); */
  opacity: 0;
}
.custom-fade-enter {
  /* transform: translateY(-10px); */
  opacity: 0;
}
</style>
