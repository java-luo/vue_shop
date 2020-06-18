<template>
    <el-card >
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 栅格布局-->
        <el-row :gutter="30">
            <el-col :span="8">
                <el-input placeholder="请输入内容" @clear="getUserList" class="input-with-select" v-model="queryInfo.query" clearable >

                    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                </el-input>
            </el-col>
            <el-col :span="6"><el-button type="primary" @click="addDialogVisible=true">添加用户</el-button></el-col>
        </el-row>
        <el-table
                :data="userList"
                style="width: 100%">
            <el-table-column type="index" label="#"> </el-table-column>

            <el-table-column prop="username" label="用户名" width="150"></el-table-column>

            <el-table-column  prop="email" label="邮箱"  width="150"></el-table-column>

            <el-table-column prop="mobile"  label="电话" width="150"></el-table-column>

            <el-table-column prop="role_name" label="角色" width="150"></el-table-column>

            <el-table-column  label="状态" width="150">
                <template v-slot="scope">
                    <el-switch v-model="scope.row.mg_state" @change="updateUserStatus(scope.row)"> </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" v-slot="scope">
                    <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="removeUserById(scope.row.id)"></el-button>
                    <el-tooltip class="item" effect="dark" content="赋予角色" placement="top">
                        <el-button type="warning" icon="el-icon-setting"></el-button>
                    </el-tooltip>
            </el-table-column>
        </el-table>
        <div class="block">
            <div class="block">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-sizes="[1, 2, 3, 5]"
                        :page-size=queryInfo.pagesize
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </div>
        <!--对话框-->
        <el-dialog
                title="添加用户"
                :visible.sync="addDialogVisible"
                @close="addDialogClose"
                width="45%">
            <el-form :status-icon="true"
                     :model="addForm"
                     :rules="addRules"
                     ref="addFormRef"
                     label-width="100px"
                     class="demo-ruleForm">

                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>

                <el-form-item label="用户密码" prop="password">
                    <el-input v-model="addForm.password" type="password"></el-input>
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>

                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
        </el-dialog>
        <el-dialog
                title="修改用户"
                :visible.sync="editDialogVisible"
                width="45%">
            <!-- 用户编辑表单-->
        <el-form :model="editForm" :rules="addRules" ref="editForm" label-width="100px" >
            <el-form-item label="用户名" prop="username"  >
                <el-input v-model="editForm.username" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editFormClick">确 定</el-button>
        </span>
        </el-dialog>

    </el-card>
</template>

<script>
    export default {
        name: "Users",
        data(){
            var checkMobile=(rule, value, callback)=>{
             const regMobile  =/^1[3-9]\d{9}$/;
                if(regMobile.test(value)){
                   return  callback()
                }
                callback(new Error("电话格式不对哦"))
            }

            return {
                queryInfo:{
                    query:'',
                    pagenum:1,
                    pagesize:5
                },
                total:0,
                userList:[],
                addDialogVisible:false,
                editDialogVisible:false,
                addForm:{
                    username:"",
                    password:"",
                    email:"",
                    mobile:""
                },
                editForm:{
                    id:null,
                    username: "",
                    email:"",
                    mobile:""
                },
                addRules:{
                    username:[
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 8, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    password:[
                        {required:true,message:"请输入密码", trigger: 'blur'},
                        { min: 3, max: 8, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    mobile:[
                        {required:true,message:"请输入电话", trigger: 'blur'},
                        //自定义校验规则
                        {validator:checkMobile,trigger: 'blur'}
                    ],
                    email:[
                        {required:true,message:"请输入邮箱", trigger: 'blur'},
                        {type:"email",message:"请输入正确的邮箱", trigger: 'blur'}
                    ]
                }
            }
        },
        methods:{
            async getUserList() {
                const {data: res} = await this.$http.get("users", {
                    params: this.queryInfo
                })
                if (res.meta.status != 200) return this.$message.error("获取用户列表失败")
                this.userList = res.data.users
                this.total = res.data.total
            },
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getUserList()
            },
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getUserList()
            },
            async updateUserStatus(user) {
                const {data: res} = await this.$http.put("users/" + user.id + "/state/" + user.mg_state)
                if (res.meta.status != 200) return this.$message.error(res.meta.msg)
                this.$message.success(res.meta.msg)
            },
            addDialogClose() {
                this.$refs.addFormRef.resetFields()
            },
            addUser(){
                 this.$refs.addFormRef.validate(async valid => {
                     if (!valid) return
                     const {data: res} = await this.$http.post("users", this.addForm)
                     console.log(res)
                     if(res.meta.status!=201)return this.$message.error(res.meta.msg)
                     this.$message.success("创建成功")
                     this.addDialogVisible=false
                     this.getUserList()
                })
            },
            async showEditDialog(userId){
                this.editDialogVisible=true
                const {data: res} = await this.$http.get("users/" + userId)
                if (res.meta.status != 200) return this.$message.error(res.meta.msg)
                this.editForm=res.data

            },
            editFormClick(){
                this.$refs.editForm.validate(async valid=>{
                    if(!valid)return
                    const {data: res} = await this.$http.put("users/" + this.editForm.id,{
                        email:this.editForm.email,
                        mobile:this.editForm.mobile
                    })
                    if (res.meta.status != 200) return this.$message.error(res.meta.msg)
                    this.editDialogVisible=false
                    this.getUserList()

                })
            },
            removeUserById(userId) {
                this.$confirm('此操作将删除改用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                  const {data:res} =await this.$http.delete("users/"+userId)
                    if(res.meta.status!=200) return this.$message.error(res.meta.msg)
                    this.$message.success("删除用户成功")
                    this.getUserList()
                }).catch(() => {
                    this.$message.info("已取消删除")
                });
            }
        },
        created() {
            this.getUserList()
        }
    }
</script>

<style scoped>

</style>