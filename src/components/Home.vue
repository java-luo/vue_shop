<template>
        <el-container class="home-container">
            <el-header>
                <div>
                    <img src="../assets/heima.png" alt />
                    <span>电商后台管理系统</span>
                </div>
                <el-button @click="logout"> 退出</el-button>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu
                            background-color="#333744"
                            text-color="#fff"
                            active-text-color="#409EFF"
                            unique-opened
                            router
                            :default-active="activePath" >
                        <el-submenu :index="'/'+item.id"  v-for="item in menuList" :key="item.id" >
                            <template slot="title">
                                <i class="el-icon-s-unfold"></i>
                                <span>{{item.authName}}</span>
                            </template>

                            <el-menu-item :index="'/'+ subItem.path"
                                          v-for="subItem in item.children"
                                          :key="subItem.id"
                                          @click="saveNavState('/' +subItem.path)">
                                <template slot="title">
                                    <!-- 图标 -->
                                    <i class="el-icon-menu"></i>
                                    <!-- 文本 -->
                                    <span>{{subItem.authName}}</span>
                                </template>
                            </el-menu-item>
                        </el-submenu>

                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
</template>
<script>
    export default {
        name: "Home",
        data(){
            return {
                menuList:[],
                activePath:sessionStorage.getItem("activePath")
            }
        },
        methods:{
            logout(){
                window.sessionStorage.removeItem("token");
                this.$router.push("/login")
            },
          async  getMenuList(){
              const {data: res} = await this.$http.get("menus")
              this.menuList=res.data
          },
            saveNavState(activePath){
                sessionStorage.setItem("activePath",activePath)
                this.activePath=activePath
            }
        },created() {
            this.getMenuList()
        }
    }


</script>

<style lang="less" scoped>
    .home-container {
        height: 100%;
    }
    .el-header {
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        padding-left: 0;
        align-items: center;
        color: #fff;
        font-size: 20px;
        > div {
            display: flex;
            align-items: center;
            span {
                margin-left: 15px;
            }
        }
    }

    .el-aside {
        background-color: #333744;
        .el-menu {
            border-right: none;
        }
    }

    .el-main {
        background-color: #eaedf1;
    }

    .iconfont {
        margin-right: 10px;
    }

    .toggle-button {
        background-color: #4a5064;
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
</style>