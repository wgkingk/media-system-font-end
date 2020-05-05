<template>
<div style="text-align: center;">
<el-card style="width: 50%; height: 50%; margin: auto auto; border-radius: 1.875rem;">
	
<el-form :model="ruleForm" id="loginForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin: 1.25rem auto; width: 80%;text-align: left;">
  <div style="text-align: center; margin-bottom: 1.25rem;">
	  <el-upload
	    class="avatar-uploader"
		name="file"
	    :action="this.$axios.defaults.baseURL + '/file/uploadImg'"
	    :show-file-list="false"
	    :on-success="handleAvatarSuccess"
	    :before-upload="beforeAvatarUpload">
	    <el-avatar :size="100" v-if="imageUrl" :src="imageUrl"></el-avatar>
		<div v-else><el-avatar style="display: block;" :size="100" icon="el-icon-user-solid"></el-avatar><span class="title">点击更换头像</span></div>
	    
	  </el-upload>
  </div>
  <el-form-item label="邮箱" prop="email">
    <el-input type="text" v-model="ruleForm.email" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="姓名" prop="name">
    <el-input type="text" v-model="ruleForm.name" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="单位" prop="department" >
    <el-select v-model="ruleForm.department" placeholder="请选择工作单位">
          <el-option v-for="item in departmentList" :key="item.departmentId" :label="item.departmentName" :value="item.departmentId"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="生日" prop="birthday" style="text-align: left;">
    <el-date-picker v-model="ruleForm.birthday" type="date" placeholder="选择日期" > </el-date-picker>
  </el-form-item>
  <el-form-item label="职务" prop="duties">
    <el-input type="text" v-model="ruleForm.duties" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="pass">
    <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="确认密码" prop="checkPass">
    <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="个人简介" >
    <el-input type="text" v-model="ruleForm.introduction" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
    <el-button @click="resetForm('ruleForm')">重置</el-button>
  </el-form-item>
</el-form>
</el-card>
</div>
</template>
<script>
  export default {
    data() {
      var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('年龄不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value < 18) {
              callback(new Error('必须年满18岁'));
            } else {
              callback();
            }
          }
        }, 1000);
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
		imageUrl: '',
		departmentList: [],
        ruleForm: {
		  email: '',
		  name: '',
		  department: null,
		  birthday: '',
		  duties: '',
		  personalImage: '',
		  introduction: '',
          password: '',
          checkPass: '',
          age: ''
        },
        rules: {
		  email: [ { required: true, message: '请输入邮箱', trigger: 'blur' }],
		  name: [ { required: true, message: '请输入姓名', trigger: 'blur' }],
		  department: [ { required: true, message: '请选择单位', trigger: 'blur' }],
		  birthday: [ {type: 'date', required: true, message: '请选择生日日期', trigger: 'change' }],
		  duties: [ { required: true, message: '请输入职务', trigger: 'blur' }],
          pass: [
            { required:true, validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { required:true, validator: validatePass2, trigger: 'blur' }
          ],
          age: [
            { validator: checkAge, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post('/user/register',{
				userInfo: this.ruleForm,
				authUser: this.ruleForm
			}).then(res => {
				this.$message({
					type: 'success',
					message: '注册成功，跳转到登录页面'
				})
				this.$router.replace({
					name: 'Login'
				})
			})
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
	  handleAvatarSuccess(res, file) {
	          this.imageUrl = URL.createObjectURL(file.raw);
			  this.ruleForm.personalImage = res.data
			  console.log(this.ruleForm)
	        },
	  beforeAvatarUpload(file) {
	    const isJPG = file.type === 'image/jpeg';
	    const isLt2M = file.size / 1024 / 1024 < 2;
	  
	    if (!isJPG) {
	      this.$message.error('上传头像图片只能是 JPG 格式!');
	    }
	    if (!isLt2M) {
	      this.$message.error('上传头像图片大小不能超过 2MB!');
	    }
		return isJPG && isLt2M;
	    },
	  uploadSucceess: function(response, file, fileList) {
		  console.log(data.data)
	  }
    },
	mounted() {
		this.$axios.get('/department').then(res => {
			this.departmentList = res.data.data
		})
	}
  }
</script>

<style>
	#loginForm {
		border-radius: 2.1875rem;
	}
	/* .avatar-uploader .el-upload {
	    border: 1px dashed #d9d9d9;
	    border-radius: 6px;
	    cursor: pointer;
	    position: relative;
	    overflow: hidden;
	  }
	  .avatar-uploader .el-upload:hover {
	    border-color: #409EFF;
	  }
	  .avatar-uploader-icon {
	    font-size: 28px;
	    color: #8c939d;
	    width: 178px;
	    height: 178px;
	    line-height: 178px;
	    text-align: center;
	  } */
	  .avatar {
	    width: 178px;
	    height: 178px;
	    display: block;
	  }
</style>
