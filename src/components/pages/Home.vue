<template>
    <div id="home">
        <section class="jumbotron" @mouseover="mouseover" @mouseout="mouseout" @mousemove="mousemove" style="display:none;">
            <div>
                <img src="@/assets/img/leaf1.png" class="jumbotron-plant-2">
                <img src="@/assets/img/main.png" class="jumbotron-main">
                <img src="@/assets/img/plant.png" class="jumbotron-plant-1">
                <img src="@/assets/img/man.png" class="jumbotron-figure-1">
                <img src="@/assets/img/women.png" class="jumbotron-figure-2">
            </div>
            <div class="cloud">
                <img src="@/assets/img/yun.png" class="jumbotron-cloud-1">
                <img src="@/assets/img/yun1.png" class="jumbotron-cloud-2">
            </div>
            <div class="compo">
                <img src="@/assets/img/dialog.png" class="jumbotron-compo-1">
                <img src="@/assets/img/dialog1.png" class="jumbotron-compo-2">
                <img src="@/assets/img/dialog2.png" class="jumbotron-compo-3">
            </div>
        </section>
        <section class="welcome">
            <el-row :gutter="20">
                <el-col :span="10" :offset="1">
                    <img src="@/assets/svg/undraw_wall.svg">
                </el-col>
                <el-col :span="9" :offset="2">
                    <div class="saying">
                        <a>Knowledge is a treasure, <br>but practice is the key to get it.</a>
                    </div>
                </el-col>
            </el-row>
        </section>
        <section class="explained">
            <el-row :gutter="20">
                <el-col :span="20" :offset="2">
                    <div class="title">
                        <a>小目标：采用无服务架构构建一个高可用的网站</a>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="10" :offset="1">
                    <div class="info">
                        <h1 style="text-align:left;font-size:50px;margin:0;">”</h1>
                        <h6>无服务器架构是基于互联网的系统，其中应用开发不使用常规的服务进程。相反，它们仅依赖于第三方服务（例如AWS Lambda服务），客户端逻辑和服务托管远程过程调用的组合。</h6>
                        <h1 style="text-align:right;font-size:50px;margin:5px 0 0;">”</h1>
                    </div>
                </el-col>
                <el-col :span="10" :offset="2">
                    <img src="/static/img/serverless.png">
                </el-col>
            </el-row>
        </section>
        <section class="serverless">
            <el-row :gutter="20">
                <el-col :span="10" :offset="7">
                    <div class="title">
                        <h5>网站目前使用到的部分服务</h5>
                        <a>以下服务均来自阿里云</a>
                    </div>
                </el-col>
            </el-row>
            <div class="serverless-info">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <div class="product">
                            <img src="@/assets/svg/lambda.svg">
                            <h6>函数计算</h6>
                            <ul>
                                <li class="append-list">&nbsp;无需运维</li>
                                <span class="append-list">&nbsp;|&nbsp;</span>
                                <li class="append-list">按需付费</li>
                                <br>
                                <li class="append-list">弹性伸缩</li>
                                <span class="append-list">&nbsp;|&nbsp;</span>
                                <li class="append-list">便捷灵活</li>
                            </ul>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="product">
                            <img src="@/assets/svg/apigateway.svg">
                            <h6>API 网关</h6>
                            <ul>
                                <li class="append-list">解放生产力</li>
                                <span class="append-list">&nbsp;|&nbsp;</span>
                                <li class="append-list">只为实际服务付费</li>
                                <br>
                                <li class="append-list">大规模、高性能</li>
                                <span class="append-list">&nbsp;|&nbsp;</span>
                                <li class="append-list">安全稳定</li>
                            </ul>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="product">
                            <img src="@/assets/svg/oss.svg">
                            <h6>对象存储</h6>
                            <ul>
                                <li class="append-list">&nbsp;易用性</li>
                                <span class="append-list">&nbsp;|&nbsp;</span>
                                <li class="append-list">高可靠</li>
                                <br>
                                <li class="append-list">强安全</li>
                                <span class="append-list">&nbsp;|&nbsp;</span>
                                <li class="append-list">低成本</li>
                            </ul>
                        </div>
                    </el-col>
                    <!-- <el-col :span="8">
                        <div class="product">
                            <img src="@/assets/svg/ots.svg">
                            <h6>表格存储</h6>
                            <ul>
                                <li class="append-list">&nbsp;高可靠</li>
                                <span class="append-list">&nbsp;|&nbsp;</span>
                                <li class="append-list">低成本</li>
                                <br>
                                <li class="append-list">强扩展</li>
                                <span class="append-list">&nbsp;|&nbsp;</span>
                                <li class="append-list">便分析</li>
                            </ul>
                        </div>
                    </el-col> -->
                </el-row>
            </div>
        </section>
    </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      x: 0,
      y: 0,
      isIn: false,
      isFirstMove: false,
      transition: 'transition: 500ms cubic-bezier(0.03, 0.98, 0.52, 0.99);'
    }
  },
  mounted: function() {
    this.amplitude.getInstance().logEvent('Viewed Home Page')
  },
  methods: {
    mouseover(event) {
      this.isIn = true
      this.isFirstMove = true
    },
    mouseout(event) {
      this.isIn = false
      document
        .getElementsByClassName('jumbotron')[0]
        .setAttribute(
          'style',
          'transform:perspective(700px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
        )
      document
        .getElementsByClassName('cloud')[0]
        .setAttribute(
          'style',
          this.transition + 'transform: matrix(1, 0, 0, 1, 0, 0);'
        )
      document
        .getElementsByClassName('compo')[0]
        .setAttribute(
          'style',
          this.transition + 'transform: matrix(1, 0, 0, 1, 0, 0);'
        )
    },
    mousemove(event) {
      if (!this.isIn) {
        console.log(this.isIn)
        return
      }
      var rect = document
        .getElementsByClassName('jumbotron')[0]
        .getBoundingClientRect()
      var top =
        rect.top +
        (window.pageYOffset || document.documentElement.scrollTop) -
        (document.documentElement.clientTop || 0)
      var left =
        rect.left +
        (window.pageXOffset || document.documentElement.scrollLeft) -
        (document.documentElement.clientLeft || 0)
      this.x = event.pageX - left
      this.y = event.pageY - top
      let rotateX = this.x * 3.0 / 890.0 - 1.5
      let rotateY = 1.5 - this.y * 3.0 / 456.0
      document
        .getElementsByClassName('jumbotron')[0]
        .setAttribute(
          'style',
          this.isFirstMove
            ? this.transition
            : '' +
              'transform:perspective(700px) rotateX(' +
              -rotateY.toFixed(2) +
              'deg) rotateY(' +
              -rotateX.toFixed(2) +
              'deg) scale3d(1, 1, 1)'
        )
      document
        .getElementsByClassName('cloud')[0]
        .setAttribute(
          'style',
          this.isFirstMove
            ? this.transition
            : '' +
              'transform: matrix(1, 0, 0, 1, ' +
              (rotateX.toFixed(1) / 3 * 10).toFixed(0) +
              ', ' +
              (rotateY.toFixed(1) / 15 * 20).toFixed(0) +
              ');'
        )
      document
        .getElementsByClassName('compo')[0]
        .setAttribute(
          'style',
          this.isFirstMove
            ? this.transition
            : '' +
              'transform: matrix(1, 0, 0, 1, ' +
              (rotateX.toFixed(1) / 3 * 20).toFixed(0) +
              ', ' +
              (rotateY.toFixed(1) / 15 * 40).toFixed(0) +
              ');'
        )
      var self = this
      if (this.isFirstMove) {
        this.isIn = false
        setTimeout(function() {
          self.isIn = true
        }, 10)
        this.isFirstMove = false
      }
    }
  }
}
</script>
