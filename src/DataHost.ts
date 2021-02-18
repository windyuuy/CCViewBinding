
namespace databind {
	/**
	 * 数据跟节点管理
	 */
	export class DataHost {

		/**
		 * keyId累加器
		 */
		protected keyIdAcc: number = 1
		/**
		 * 生成新的keyId
		 */
		genKeyId(): number {
			return this.keyIdAcc++
		}

	}
}
