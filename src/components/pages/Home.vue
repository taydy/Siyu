<template>
    <div id="home">
        <section class="welcome">
            <el-row :gutter="20">
                <el-col :span="10" :offset="1">
                    <img src="@/assets/svg/create.svg">
                </el-col>
                <el-col :span="9" :offset="2">
                    <div class="saying">
                        <h3>Knowledge is a treasure, <br>but practice is the key to get it.</h3>
                    </div>
                </el-col>
            </el-row>
        </section>
        <section class="explained">
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
                    <h5>网站目前使用到的服务</h5>
                    <a>以下服务均来自阿里云</a>
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
                    <el-col :span="8">
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
                    </el-col>
                </el-row>
            </div>
        </section>
    </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {}
  }
}
</script>
