<template>
	<div id="admin">
		<el-page-header content="管理员页">
		</el-page-header>
		  <el-tabs class="tab" type="card" v-model="activeName" @tab-click="handleTabChange" >
			<el-tab-pane label="主页" name="index">
				<h1>欢迎您，管理员</h1>
			</el-tab-pane>
		    <el-tab-pane label="版面管理" name="category" lazy >
				<el-table
				    :data="categoryList"
				    border
				    style="width: 100%">
				    <el-table-column
				      fixed
					  width="50px"
				      prop="categoryId"
				      label="id">
				    </el-table-column>
					<el-table-column
					  fixed
					  prop="categoryName"
					  label="名称">
					</el-table-column>
					<el-table-column
					  fixed
					  prop="categoryComment"
					  label="注释">
					</el-table-column>
				    <el-table-column
				      fixed="right"
				      label="操作"
				      width="100">
				      <template slot-scope="scope">
				        <el-button type="text" size="small" @click="updateFormShow(scope.row)">编辑</el-button>
				        <el-button type="text" size="small" @click="deleteCategory(scope.row)">删除</el-button>
				      </template>
				    </el-table-column>
				  </el-table>
				  <el-button type="primary" @click="categoryForm.formVisible = true">添加</el-button>
			</el-tab-pane>
			<el-tab-pane label="用户管理" name="user">
				<el-table
				      :data="userList"
				      style="width: 100%">
				      <el-table-column
				        label="头像"
				        width="80">
						<template slot-scope="scope">
						        <el-avatar :src = "scope.row.personalImage"></el-avatar>
						</template>
				      </el-table-column>
				      <el-table-column
				        prop="name"
				        label="姓名"
				        width="50">
				      </el-table-column>
				      <el-table-column
				        prop="email"
				        label="邮箱">
				      </el-table-column>
					  <el-table-column
					    prop="duties"
					    label="职务"
						width="80">
					  </el-table-column>
					  <el-table-column
					    prop="departmentName"
					    label="单位"
						width="100" style="text-align: center;">
					  </el-table-column>
					  <el-table-column
					    prop="createdTime"
					    label="注册时间">
					  </el-table-column>
					  <el-table-column label="角色">
						  <template slot-scope="scope">
							  <el-tag v-for="item in scope.row.roles" :key="item.roleId" style="margin-left: 0.1875rem;"  type="success">{{item.roleName}}</el-tag>
						  </template>
					  </el-table-column>
					  <el-table-column label="修改角色" width="50">
					  		<template slot-scope="scope">
					  			<el-button size="small" type="text" @click="userRoleShow(scope.row)">修改</el-button>
					  		</template>
					  </el-table-column>
					  <el-table-column label="权限">
						  <template slot-scope="scope">
							  <el-tag style="margin-left: 0.1875rem;" v-for="item in scope.row.authorities" :key="item.authorityId" type="danger">{{item.authority}}</el-tag>
						  </template>
					  </el-table-column>
				    </el-table>
					<el-pagination small layout="prev, pager, next" :page-size="userPage.pageSize" :current-page="userPage.startPage"
					  :total="userPage.pageSize * userPage.totalPage" @current-change="handleUserListCurrentChange">
					</el-pagination>
			</el-tab-pane>
			<el-tab-pane label="角色管理" name="role"><el-table
				      :data="roleWithAuthList"
				      style="width: 100%">
				      <el-table-column
						prop="roleId"
				        label="id"
				        width="80">
				      </el-table-column>
				      <el-table-column
				        prop="roleName"
				        label="角色名">
				      </el-table-column>
				      <el-table-column
				        prop="roleComment"
				        label="备注">
				      </el-table-column>
					  <el-table-column label="拥有权限">
						  <template slot-scope="scope">
							  <el-tag v-for="item in scope.row.authorities" :key="item.authorityId" style="margin-left: 0.1875rem;"  type="success">{{item.authority}}</el-tag>
						  </template>
					  </el-table-column>
					  <el-table-column label="修改权限" width="50">
					  		<template slot-scope="scope">
					  			<el-button size="small" type="text" @click="roleAuthShow(scope.row)">修改</el-button>
					  		</template>
					  </el-table-column>
					  
					  <el-table-column label="删除">
						  <template slot-scope="scope">
							  <el-button size="small" type="text" @click="deleteRole(scope.row.roleId)">删除</el-button>
						  </template>
					  </el-table-column>
				    </el-table>
					<el-button type="primary" @click="roleAuth.newRoleVisible = true">新建角色</el-button>
					</el-tab-pane>
		  </el-tabs>
		  
		  
		  
		  
		  <div class="diolog">
			  <!-- 新建category -->
			  <el-dialog
			    title="提示"
			    :visible.sync="categoryForm.formVisible"
			    width="50%">
			    <el-form :model="categoryForm.form" :rules="categoryForm.rules" style="margin: auto auto;" ref="categoryForm" label-width="100px" class="demo-ruleForm">
			      <el-form-item label="类型" prop="categoryName">
			        <el-input v-model="categoryForm.form.categoryName"></el-input>
			      </el-form-item>
			      <el-form-item label="备注" prop="categoryComment">
			        <el-input v-model="categoryForm.form.categoryComment"></el-input>
			      </el-form-item>
			      <el-form-item>
					<el-button @click="categoryForm.formVisible=false">取消</el-button>
			        <el-button type="primary" @click="postCategory('categoryForm')">立即创建</el-button>
			      </el-form-item>
			    </el-form>
			  </el-dialog>
			  <!-- 编辑category -->
			  <el-dialog
			    title="提示"
			    :visible.sync="categoryForm.updateVisible"
			    width="50%">
			    <el-form :model="categoryForm.form" :rules="categoryForm.rules" style="margin: auto auto;" ref="updateCategoryForm" label-width="100px" class="demo-ruleForm">
			      <el-form-item label="类型" prop="categoryName">
			        <el-input v-model="categoryForm.form.categoryName"></el-input>
			      </el-form-item>
			      <el-form-item label="备注" prop="categoryComment">
			        <el-input v-model="categoryForm.form.categoryComment"></el-input>
			      </el-form-item>
			      <el-form-item>
			  		<el-button @click="categoryForm.updateVisible=false">取消</el-button>
			        <el-button type="primary" @click="updateCategory()">立即更新</el-button>
			      </el-form-item>
			    </el-form>
			  </el-dialog>
			  <!-- 用户角色修改 -->
			  <el-dialog
			    title="用户角色修改"
			    :visible.sync="userRole.visible"
			    width="50%"
				@close="getUser()">
			    <span class="tag-group__title">当前拥有权限</span>
				<el-tag v-for="item in userRole.userRoles" closable :key="item.roleId" @close="handleCloseTags(item.roleId)">{{item.roleName}}</el-tag>
				
				</el-input>
				<el-select v-model="userRole.newRole.roleId" placeholder="请选择"
				  class="input-new-tag"
				  v-if="userRole.inputValue"
				  ref="saveTagInput"
				  size="small"
				  @change="handleInputConfirm"
				>
				    <el-option
				      v-for="item in roleList"
				      :key="item.roleId"
				      :label="item.roleName"
				      :value="item.roleId">
				    </el-option>
				  </el-select>
				<el-button v-else class="button-new-tag" size="small" @click="showInput">添加角色</el-button>
			  </el-dialog>
			  
			  <!-- 角色权限修改 -->
			  <el-dialog
			    title="角色权限修改"
			    :visible.sync="roleAuth.visible"
			    width="50%"
			  	@close="getRoleWithAuth()">
			    <span class="tag-group__title">当前拥有权限</span>
							<el-tag v-for="item in roleAuth.roleAuths" closable :key="item.authorityId" @close="handleRoleAuthCloseTags(item.authorityId)">{{item.authority}}</el-tag>
			  				
			  				
			  				</el-input>
			  				<el-select v-model="roleAuth.newAuth.authorityId" placeholder="请选择"
			  				  class="input-new-tag"
			  				  v-if="roleAuth.inputValue"
			  				  ref="roleAuthTag"
			  				  size="small"
			  				  @change="handleAuthChage"
			  				>
			  				    <el-option
			  				      v-for="item in authList"
			  				      :key="item.authorityId"
			  				      :label="item.authority"
			  				      :value="item.authorityId">
			  				    </el-option>
			  				  </el-select>
			  				<el-button v-else class="button-new-tag" size="small" @click="showRoleAuth">添加角色</el-button>
			  </el-dialog>
			  <!-- 新建角色 -->
			  <el-dialog :visible.sync="roleAuth.newRoleVisible" title="新角色">
				  <el-form>
					  <el-form-item label="角色名" >
						  <el-input placeholder="请输入角色名" v-model="roleAuth.newRoleName"></el-input>
						    <el-divider></el-divider>
						  <el-button type="primary" @click="createRole">确定</el-button>
					  </el-form-item>
				  </el-form>
			  </el-dialog>
		  </div>
		  
	</div>
	
	
</template>

<script>
import {getImgUrl} from '../util/fileUtil.js'
export default {
	name: 'Admin',
	data: function() {
		return {
			activeName: 'index',
			userPage: {
				startPage: 1,
				pageSize: 50,
				currrentPage: 1
			},
			userList: [],
			roleList: [],
			authList: [],
			roleWithAuthList: [],
			categoryList: [],
			categoryForm: {
				formVisible: false,
				updateVisible: false,
				form: {
					categoryName: '',
					categoryComment: ''
				},
				rules: {
					categoryName: [{ required: true, message: '请输入类型', trigger: 'blur' }],
					categoryComment: [{ required: true, message: '请输入备注', trigger: 'blur' }]
				}
			},
			userRole: {
				visible: false,
				userRoles: [],
				inputValue: false,
				newRole: {
					roleId: null,
					email: null
				}
			},
			roleAuth: {
				roleAuths: [],
				visible: false,
				inputValue: false,
				newAuth: {
					authorityId: null,
					roleId: null
				},
				newRoleName: '',
				newRoleVisible: false
			}
		}
	},
	methods: {
		getUser: function() {
			this.$axios.post('/admin/getUsers',this.userPage)
				.then( res=> {
					if (res.data.code === 1000) {
						this.userList = res.data.data.list
						this.userPage = res.data.data
						this.userList.forEach( user => {
							user.personalImage = getImgUrl(user.personalImage)
						})
					}
				})
		},
		getRoleWithAuth: function () {
			this.$axios.get('/authority/auth').then( res => {
				if (res.data.code === 1000) {
					this.roleWithAuthList = res.data.data
				}
			})
		},
		getCategory: function() {
			this.$axios.get('/admin/category').then( res => {
				if (res.data.code === 1000) {
					this.categoryList = res.data.data
				}
			})
		},
		getRole: function() {
			this.$axios.get('/authority/roles').then( res=> {
				if (res.data.code === 1000) {
					this.roleList = res.data.data
				}
			})
		},
		getAuth: function() {
			this.$axios.get('/authority/getAuth').then( res=> {
				if (res.data.code === 1000) {
					this.authList = res.data.data
				}
			})
		},
		handleTabChange: function(c) {
			if( c.name === 'category' && this.categoryList.length === 0) {
				this.getCategory()
			} else if ( c.name === 'user' && this.userList.length === 0) {
				this.getUser()
			} else if ( c.name === 'role' && this.roleWithAuthList.length === 0) {
				this.getRoleWithAuth()
				this.getAuth()
			}
		},
		postCategory: function(formRef) {
			this.$refs[formRef].validate( valid => {
				if (valid) {
					this.$axios.post('/admin/category',this.categoryForm.form).then( res=> {
						if ( res.data.code === 1000) {
							this.$message.success('增加成功')
							this.getCategory()
							this.$refs[formRef].resetFields();
							this.categoryForm.formVisible = false
						} else {
							this.$message.error('失败')
						}
					})
				} else {
					this.$message.error('请输入所有内容')
				}
			})
		},
		deleteCategory: function(row) {
			this.$confirm('此操作将永久删除该版面下的所有新闻, 是否继续?', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
			        }).then(() => {
			          this.$axios.delete('/admin/category/'+row.categoryId).then( res => {
			          	if (res.data.code === 1000) {
			          		this.getCategory()
			          		this.$message.success('删除成功')
			          	}
			          })
			        }).catch(() => {
			          this.$message({
			            type: 'info',
			            message: '已取消删除'
			          });          
			        });
			
		},
		updateFormShow: function(row) {
			this.categoryForm.form.categoryName = row.categoryName
			this.categoryForm.form.categoryComment = row.categoryComment
			this.categoryForm.form.categoryId = row.categoryId
			
			this.categoryForm.updateVisible = true
		},
		updateCategory: function() {
			this.$refs['updateCategoryForm'].validate( valid => {
				if (valid) {
					this.$axios.put('/admin/category',this.categoryForm.form).then( res => {
						if (res.data.code === 1000) {
							this.getCategory()
							this.categoryForm.updateVisible = false
							this.$message.success('更新成功')
							this.categoryForm.form.categoryName = ''
							this.categoryForm.form.categoryComment = ''
							
						}
					})
				} else {
					this.$message.error('请输入所有内容')
				}
			})
			
		},
		userRoleShow: function( row ) {
			this.userRole.visible = true
			this.userRole.newRole.email = row.email
			this.getRole()
			this.$axios.get('authority/role/'+row.email).then( res => {
				if (res.data.code === 1000) {
					this.userRole.userRoles = res.data.data.authRole
				}
			})
		},
		showInput: function() {
		  this.userRole.inputValue = true;
		  this.$nextTick(_ => {
		    this.$refs.saveTagInput.$refs.input.focus();
		  });
		},
		
		handleInputConfirm: function() {
		  let inputValue = null;
		  this.$axios.get('/authority/getRole/'+this.userRole.newRole.roleId).then( res => {
			  if (res.data.code === 1000) {
				  inputValue = res.data.data
				  this.postUserRole(res.data.data.roleId,inputValue)
			  }
		  })
		  this.userRole.inputValue = false;
		  this.userRole.newRole.roleId = '';
		},
		postUserRole: function(rowId,inputValue) {
			this.$axios.post('authority/userRole',{
				email: this.userRole.newRole.email,
				roleId: rowId
			}).then( res => {
				if (res.data.code === 1000) {
					this.userRole.userRoles.push(inputValue)
					this.$message.success('增加成功')
				} else if (res.data.code === 1001) {
					this.$message.error('已拥有该角色')
				}
			})
		},
		handleCloseTags: function(key) {
			console.log(key)
			if (this.userRole.userRoles.length <= 1) {
				this.$message.error('至少拥有一个角色')
			} else {
				this.$confirm('此操作将永久删除该用户的该角色', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
				          this.userRole.userRoles.splice(this.userRole.userRoles.indexOf(key), 1);
				          this.$axios.delete('/authority/userRole/' + this.userRole.newRole.email + '/' + key).then( res => {
				          	if (res.data.code === 1000) {
				          		this.$message.success('成功删除角色')
				          	}
				          })
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消删除'
				          });          
				        });
			}
		},
		handleUserListCurrentChange: function(current) {
			this.userPage.startPage = current
			this.getUser()
		},
		roleAuthShow: function ( row ) {
			
			
			this.roleAuth.visible = true
			this.roleAuth.newAuth.roleId = row.roleId
			this.getAuth()
			this.$axios.get('authority/auth/' + row.roleId).then (res => {
				if (res.data.code === 1000) {
					this.roleAuth.roleAuths = res.data.data
				}
			})
		},
		showRoleAuth: function() {
		  this.roleAuth.inputValue = true;
		},
		handleAuthChage: function() {
			let inputValue = null;
			this.$axios.get('/authority/getAuth/' + this.roleAuth.newAuth.authorityId).then( res => {
				if (res.data.code === 1000) {
					inputValue = res.data.data
					this.postRoleAuth(res.data.data.authorityId,inputValue)
				}
			})
			this.roleAuth.inputValue = false
			this.roleAuth.newAuth.authorityId = ''
		},
		postRoleAuth: function(rowId,inputValue) {
			this.$axios.post('authority/auth',{
				roleId: this.roleAuth.newAuth.roleId,
				authorityId: rowId
			}).then( res => {
				if (res.data.code === 1000) {
					this.roleAuth.roleAuths.push(inputValue)
					this.$message.success('增加成功')
				} else if (res.data.code === 1001) {
					this.$message.error('已拥有该角色')
				}
			})
		},
		handleRoleAuthCloseTags: function(key) {
			console.log(key)
			if (this.roleAuth.roleAuths.length <= 1) {
				this.$message.error('至少拥有一个角色')
			} else {
				this.$confirm('此操作将永久删除该用户的该权限', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
				          this.roleAuth.roleAuths.splice(this.roleAuth.roleAuths.indexOf(key), 1);
				          this.$axios.delete('/authority/auth/' + this.roleAuth.newAuth.roleId + '/' + key).then( res => {
				          	if (res.data.code === 1000) {
				          		this.$message.success('成功删除角色')
				          	}
				          })
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消删除'
				          });          
				        });
			}
		},
		deleteRole: function(roleId) {
			this.$axios.delete('/authority/role/' + roleId).then( res => {
				if (res.data.code === 1000) {
					this.$message.success('成功')
					this.getRoleWithAuth()
				} else if (res.data.code === 1001) {
					this.$message.error(res.data.data)
				}
			})
		},
		createRole: function() {
			if(this.roleAuth.newRoleName) {
				this.$axios.post('/authority/role',{
					roleName: this.roleAuth.newRoleName
				}).then( res=> {
					if (res.data.code === 1000) {
						this.$message.success('新增成功')
						this.getRoleWithAuth()
						this.roleAuth.newRoleVisible = false
						this.roleAuth.newRoleName = ''
					}
				}) 
			} else {
				this.$message.error('请输入内容')
			}
		}
	}
}
</script>

<style>
.el-tabs__item {
	font-size: medium;
}
.tab {
	margin: 5% 5%;
}
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
