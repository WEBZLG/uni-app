<template>
	<view class="content u-skeleton">
		<view class="banner">
			<u-swiper :list="bannerList" :effect3d="true"></u-swiper>
		</view>
		<view class="tab-bar">
			<view>
				<!-- <u-tabs-swiper ref="uTabs" :list="tabList" :current="current" @change="tabsChange" :is-scroll="false" swiperWidth="750"></u-tabs-swiper> -->
				<u-tabs :list="tabList" :is-scroll="false" :current="current" @change="tabsChange"></u-tabs>
			</view>
			<view class="">
				<scroll-view scroll-y @scrolltolower="onreachBottom">
					<view class="goods-list">
						<view class="goods-item" v-for="(item,index) in data_list" :key="index" v-if="isShow==true">
							<view class="picture">
								<image :src="item.thumb" mode="aspectFill"></image>
							</view>
							<view class="flex-bet">
								<view class="descript">
									<view class="title">{{item.mill_name}}</view>
									<view v-if="current==0" class="price">价格:{{item.price}}</view>
									<view v-if="current==0" class="time">时间:{{item.time}}小时</view>
									<view v-if="current==1" class="price">购买时间:{{item.create_time}}</view>
									<view v-if="current==1" class="time">剩余时间:{{item.count_down}}小时</view>
									<view class="number">数量:{{item.count}}个</view>
								</view>
								<view class="">
									<button v-if="current==0" size="mini" type="default" @click="onBuy">购买</button>
									<button v-if="current==1&&item.count_down>0" size="mini" type="default" @click="onSpeed">加速</button>
									<button v-if="current==1&&item.count_down<=0" size="mini" type="default" @click="onReap">收货</button>
								</view>
							</view>
						</view>
					</view>
					<u-empty v-if="data_list.length==0" text="暂无矿机" mode="list" margin-top="300"></u-empty>
				</scroll-view>
			</view>
		</view>
		<!--骨架组件-->
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	import API from '../../common/api.js'
	export default {
		data() {
			return {
				bannerList: ['https://cdn.uviewui.com/uview/swiper/1.jpg', 'https://cdn.uviewui.com/uview/swiper/2.jpg',
					'https://cdn.uviewui.com/uview/swiper/3.jpg'
				],
				tabList: [{
					name: '全部矿机'
				}, {
					name: '运行矿机'
				}, {
					name: '历史矿机'
				}],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				loading: true, // 是否显示骨架屏组件
				activeTab: 0,
				data_list: [],
				fpga_list: [],
				fpga_run_list: [],
				fpga_history_list: [],
				isShow: false
			}
		},
		onLoad() {
			this.getlist()
			// 通过延时模拟向后端请求数据，调隐藏骨架屏
			setTimeout(() => {
				this.loading = false;
			}, 2000)
		},
		methods: {
			// tabs通知
			tabsChange(index) {
				this.current = index
				switch (index) {
					case 0:
						this.getlist()
						break;
					case 1:
						this.getRunlist()
						break;
					case 2:
						this.getHistorylist()
						break;
					default:
						break;
				}
			},

			// scroll-view到底部加载更多
			onreachBottom() {

			},
			// 全部矿机
			getlist() {
				API.fpga_list({}).then(res => {
					this.fpga_list = res.data.mills
					this.data_list = res.data.mills
					this.isShow = true;
				})
			},
			// 运行矿机
			getRunlist() {
				API.fpga_run_list({}).then(res => {
					this.fpga_run_list = res.data.mills
					this.data_list = res.data.mills
					this.isShow = true;
				})
			},
			// 历史矿机
			getHistorylist() {
				API.fpga_history_list({}).then(res => {
					this.fpga_history_list = res.data.mills
					this.data_list = res.data.mills
					this.isShow = true;
				})
			},
			// 加速
			onSpeed(e) {
				API.fpga_speed({
					mill_id: e
				}).then(res => {
					console.log(res)
					uni.showToast({
						title: res.message
					})
					setTimeout(function() {
						this.getRunlist()
					}, 1000)
				})
			},
			// 收获
			onReap(e) {
				API.fpga_reap({
					mill_id: e
				}).then(res => {
					uni.showToast({
						title: res.message
					})
					setTimeout(function() {
						this.getRunlist()
					}, 1000)
				})
			},
			// 购买
			onBuy(e) {
				uni.showModal({
					title: '购买提示',
					content: '确定购买此矿机？',
					success: function(res) {
						if (res.confirm) {
							API.fpga_buy({
								mill_id: e
							}).then(res => {
								console.log(res)
								uni.showToast({
									title: res.message
								})
								setTimeout(function() {
									this.getlist()
								}, 1000)
							})
						} else if (res.cancel) {
							uni.showToast({
								title: '已取消'
							})
						}
					}
				});

			}

		}
	}
</script>

<style lang="scss">
	image {
		height: 100%;
		width: 100%;
	}

	.flex-bet {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.banner {
		padding: 30rpx 0;

		u-swiper {
			height: 240rpx;
			width: 100%;
		}
	}

	.swiper-box {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: calc(100% - 200px);
		top: 200px;
	}

	.goods-list {
		padding: 15rpx 30rpx;

		.goods-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			margin-bottom: 20rpx;

			.descript {
				color: #999999;

				.title {
					font-size: 28rpx;
					color: #000000;
					font-weight: bold;
				}

				.price,
				.number,
				.time {
					font-size: 24rpx;
				}
			}

			.picture {
				width: 140rpx;
				height: 140rpx;
				display: block;
				border-radius: 20rpx;
				overflow: hidden;
				flex-shrink: 0;
				margin-right: 20rpx;
				position: relative;
			}
		}
	}
	.u-empty {
		margin-top: 50%;
	}
</style>
