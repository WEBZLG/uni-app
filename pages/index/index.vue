<template>
	<view class="content u-skeleton">
		<view class="banner">
			<u-swiper :list="bannerList" :effect3d="true"></u-swiper>
		</view>
		<view class="tab-bar">
			<view>
				<u-tabs-swiper ref="uTabs" :list="tabList" :current="current" @change="tabsChange" :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
			</view>
			<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish" class="swiper-box">
				<swiper-item class="swiper-item" v-for="(item, index) in tabList" :key="index">
					<scroll-view scroll-y @scrolltolower="onreachBottom">
						<view class="goods-list">
							<view class="goods-item" v-for="(item,index) in data_list" :key="index">
								<view class="picture">
									<image :src="item.thumb" mode="aspectFill"></image>
								</view>
								<view class="flex-bet">
									<view class="descript">
										<view class="title">{{item.mill_name}}</view>
										<view class="price">价格:{{item.price}}</view>
										<view class="time">时间:{{item.time}}小时</view>
										<view class="number">数量:{{item.count}}个</view>
									</view>
									<view class="">
										<button size="mini" type="default">购买</button>
										<!-- 	<button size="mini" type="default">加速</button>
										<button size="mini" type="default">收货</button> -->
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
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
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				loading: true, // 是否显示骨架屏组件
				activeTab: 0,
				data_list: [],
				fpga_list: [],
				fpga_run_list: [],
				fpga_history_list: [],
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
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				console.log(e)
				let current = e.detail.current;
				if(this.current !== current){
					switch (current) {
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
				}
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
				
			},
			// scroll-view到底部加载更多
			onreachBottom() {

			},
			// 全部矿机
			getlist() {
				API.fpga_list({}).then(res => {
					this.fpga_list = res.data.mills
					this.data_list = res.data.mills
				})
			},
			// 运行矿机
			getRunlist() {
				API.fpga_run_list({}).then(res => {
					this.fpga_run_list = res.data.mills
					this.data_list = res.data.mills
				})
			},
			// 历史矿机
			getHistorylist() {
				API.fpga_history_list({}).then(res => {
					this.fpga_history_list = res.data.mills
					this.data_list = res.data.mills
				})
			},
			// 加速
			onSpeed(e) {
				API.fpga_speed({
					mill_id: e
				}).then(res => {
					console.log(res)
				})
			},
			// 收获
			onReap(e) {
				API.fpga_reap({
					mill_id: e
				}).then(res => {
					console.log(res)
				})
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
				line-height: 48rpx;
				color: #999999;

				.title {
					font-size: 32rpx;
					color: #000000;
					font-weight: bold;
				}

				.number {}
			}

			.picture {
				width: 200rpx;
				height: 200rpx;
				display: block;
				border-radius: 20rpx;
				overflow: hidden;
				flex-shrink: 0;
				margin-right: 20rpx;
				position: relative;
			}
		}
	}
</style>
