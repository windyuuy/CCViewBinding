
namespace databind {
	/**
	 * 观察数据中的key信息结构
	 */
	export class DataKeyInfo {
		/**
		 * 成员名
		 */
		key: string;

		/**
		 * key ID
		 * - 通过此key 可以直接对照访问
		 */
		id: number;

		/**
		 * 值
		 */
		value: any;

		/**
		 * 根节点管理
		 */
		dataHost: DataHost

		/**
		 * 数据是否改变
		 */
		changed: boolean;
	}

	/**
	 * 观察数据
	 */
	export class DataObserver {
		/**
		 * 装饰数据对象
		 * - 递归遍历所有key, 生成固有结构信息
		 * @param dataObject 
		 * @param referObject 
		 */
		decorateDataObject<T extends Object>(
			/**
			 * 构建源
			 */
			dataObject: T,
			/**
			 * 参照对象
			 */
			referObject: T
		) {
			let dataHost = new DataHost()
			for (let key in dataObject) {
				let value = Object.getOwnPropertyDescriptor(dataObject, key)

				// 判断是否已包装
				let isAlreadyWrap = value.get != null
				if (isAlreadyWrap) {
					// 包装已存在, 则更新key info
					let referValue = referObject[key]
					if (referValue != dataObject[key]) {
						dataObject[key] = referValue
						let meta = dataObject[`__$ch_${key}`] as DataKeyInfo
						meta.value = referValue
						meta.changed = true
					}
				} else {
					// 包装不存在则创建key info

					// 获取目标值和原值
					let referValue = referObject[key]
					let originValue = dataObject[key]
					// 对照合并
					this.decorateDataObject(originValue, referValue)

					// 创建key info
					let getsetKey = `__$ch_${key}`
					let keyInfo = new DataKeyInfo()
					keyInfo.key = key
					keyInfo.dataHost = dataHost
					keyInfo.id = dataHost.genKeyId()
					keyInfo.value = originValue
					dataObject[getsetKey] = keyInfo

					// 定义get set
					Object.defineProperty(dataObject, key, {
						get: function () {
							return this.dataObject[getsetKey]
						},
						set: function (v: any) {
							let meta = this.dataObject[getsetKey] as DataKeyInfo
							meta.value = v
						}
					})
				}
			}

		}
	}
}
