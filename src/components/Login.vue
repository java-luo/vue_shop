<template>
        <div class="login_container" >
            <div class="login_box">
                <div class="avatar_box">
                    <img src="../assets/logo.png" altloginFormRul="avatar" />
                </div>
                <el-form ref="loginFormRef" label-width="0px" :model="loginForm" :rules="loginFormRules" class="login_form" >
                    <el-form-item prop="username">
                        <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
                    </el-form-item>

                    <el-form-item prop="password">
                        <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
                    </el-form-item>

                    <el-form-item class="btns">
                         <el-button type="primary" @click="login">登陆</el-button>
                        <el-button type="info" @click="resetLoginForm">清空</el-button>
                    </el-form-item>
                </el-form>

            </div>
        </div>
</template>
<script>
    export default {
        name: "Login",
        data(){
            return {
                loginForm:{
                    username:"admin",
                    password:"123456"
                },
                loginFormRules:{
                    username:[
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 8, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 3, max: 8, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            resetLoginForm(){
                this.$refs.loginFormRef.resetFields()
            },
            login(){
                this.$refs.loginFormRef.validate(async valid => {
                    if(!valid){return}
                    const result=await this.$http.post("login",this.loginForm)
                    status=result.data.meta.status
                    if(status==200){
                        var token=result.data.data.token;
                        window.sessionStorage.setItem("token",token)
                        this.$message.success("登陆成功")
                        this.$router.push("/home")
                    }else{
                        this.$message.error("登陆失败")
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    /* // lang="less" 支持less格式
   // scoped vue的指令，只在当前组件生效 */
    .login_container {
        background-color: #2b4b6b;
        height: 100%;
    }
    .login_box {
        width: 450px;
        height: 360px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        -webkit-transform: translate(-50%, -50%);
        background-color: #fff;

        .avatar_box {
            width: 130px;
            height: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;
            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
    }
    .login_form {
        position: absolute;
        bottom: 60px;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
    .btns {
        display: flex;
        justify-content: center;
    }
    .info {
        font-size: 13px;
        margin: 10px 15px;
    }


</style>