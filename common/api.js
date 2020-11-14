const MD5 = require('./md5');
/**
 加密调用
 var sign = getMD5Sign(paramsObj, timestamp, token);
**/
const API_BASE_URL = 'https://api-ll.kksrs.com'; //api地址
const IMG_BASE_URL = 'https://images-api-ll.kksrs.com'; //图片地址
// noToken为true不传用户token传固定token/noUid为true不传用户user_id
const request = (url, method, data, noToken, noUid) => {
	//获取登录token 
	let userToken = uni.getStorageSync('loginToken');
	let loginToken = noToken == true ? '$10$Xmd/LvGEoHInQ4ISXisPJOm54ULeCFU82WgDyyM5U2j2WfO3rND2K' : userToken;
	// 获取用户id
	if (noUid == '' || noUid == undefined) {
		let userInfoId = uni.getStorageSync('userInfo').user_id;
		data.user_id = userInfoId
	}
	//获取的当前时间戳（10位）
	data.timestamp = Math.round(new Date().getTime() / 1000).toString();
	//通过md5加密验签
	data.sign = getMD5Sign(data, loginToken)
	return new Promise((resolve, reject) => {
		uni.showLoading({
			title: '加载中',
			mask: true
		})
		uni.request({
			url: '/api' + url,
			method: method,
			data: data,
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			success(request) {
				console.log(request)
				if (request.statusCode == '200') {
					if (request.data.code == 200) {
						resolve(request.data)
						uni.hideLoading()
					} else {
						uni.showToast({
							title: request.data.message,
							icon: 'none'
						})
					}

				} else {
					uni.showToast({
						title: request.data.message,
						icon: 'none'
					})
				}
			},
			fail(error) {
				console.log(error)
				if (error.errMsg) {
					uni.showToast({
						title: error.errMsg,
						icon: 'none'
					})
				} else {
					reject(error)
					uni.showToast({
						title: error.errMsg,
						icon: 'none'
					})
				}
			}
		})
	});
}
//数据加密
const getMD5Sign = (params, token) => {
	if (typeof params == "string") {
		return paramsStrSort(params, token);
	} else if (typeof params == "object") {
		let newData = {};
		Object.keys(params).sort().map(key => {
			newData[key] = params[key]
		})
		let arr = [];
		for (let i in newData) {
			arr.push((i + "=" + newData[i]));
		}
		if (token == undefined) {
			return MD5(arr.join(("&"))).toUpperCase();
		} else {
			let newUrl = arr.join(("&")) + '&token=' + token;
			// console.log(newUrl)
			// console.log(MD5(newUrl).toUpperCase())
			return MD5(newUrl).toUpperCase();
		}
	}
}
const upLoadChoose = (formData) => {
	return new Promise((resolve, reject) => {
		uni.chooseImage({
			success: (chooseImageRes) => {
				const tempFilePaths = chooseImageRes.tempFilePaths;
				uni.uploadFile({
					url: API_BASE_URL + '/api_upload',
					filePath: tempFilePaths[0],
					name: 'file',
					formData: formData,
					success: (uploadFileRes) => {
						resolve(uploadFileRes.data)
					},
					error:(err)=>{
						reject(err.message)
					}
				});
			}
		});
	})
}
const upLoad = (path) => {
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: API_BASE_URL + '/api_upload',
			filePath: path,
			name: 'file',
			success: (uploadFileRes) => {
				resolve(uploadFileRes.data)
			},
			error: (res) => {
				reject(res)
			}
		});
	})
}
export default {
	API_BASE_URL,
	getMD5Sign,
	upLoad,
	upLoadChoose,
	// 存储
	setStorage: (key, value) => {
		uni.setStorage({
			key: key,
			data: value,
			success: function() {
				console.log('success');
			}
		});
	},
	// 获取存储
	getStorage: (key) => {
		let info;
		uni.getStorage({
			key: key,
			success: function(res) {
				info = res.data
			}
		});
		return info
	},

	// 注册
	regist: (data) => {
		return request('/register', 'post', data, true, true)
	},
	// 登录
	login: (data) => {
		return request('/login', 'post', data, true, true)
	},
	//重置密码
	forget: (data) => {
		return request('/reset_pass', 'post', data, true, true)
	},
	//验证登录状态
	check_login: (data) => {
		return request('/check_login', 'post', data)
	},
	//退出登录
	logout: (data) => {
		return request('/logout', 'post', data)
	},
	//矿机列表
	fpga_list: (data) => {
		return request('/mill/get_list', 'post', data)
	},
	//运行的矿机
	fpga_run_list: (data) => {
		return request('/mill/get_user_list', 'post', data)
	},
	//历史的矿机
	fpga_history_list: (data) => {
		return request('/mill/get_user_history_list', 'post', data)
	},
	//加速矿机
	fpga_speed: (data) => {
		return request('/mill/speed_up', 'post', data)
	},
	//收获矿机
	fpga_reap: (data) => {
		return request('/mill/reap', 'post', data)
	},
	//购买矿机
	fpga_buy: (data) => {
		return request('/mill/buy', 'post', data)
	},
	//修改用户名
	changeName: (data) => {
		return request('/user/set_user_name', 'post', data)
	},
	//修改密码
	changePassword: (data) => {
		return request('/user/set_pass', 'post', data)
	},
	//修改手机号
	changeMobile: (data) => {
		return request('/user/set_mobile', 'post', data)
	},
	//修改头像
	changeAvatar: (data) => {
		return request('/user/set_avatar', 'post', data)
	},
	//申请提现
	withdrawApply: (data) => {
		return request('/withdraw/create', 'post', data)
	},
	//提现记录
	withdrawList: (data) => {
		return request('/withdraw/get_list', 'post', data)
	},
	//金额变动
	moneyChange: (data) => {
		return request('/user/get_balance_log', 'post', data)
	},


}
