// @ts-check

/// <reference path="./types.d.ts" />

/**
 *
 * @returns {Promise<boolean>}
 */
const simulateRemoteDelay = () => new Promise(r => setTimeout(() => r(true), 200))

export class ManageStorage {
  /**
   * @param {string} path
   * @param {"local" | "remote"} storageType
   */
  constructor(path, storageType) {
    this.path = path
    this.storageType = storageType
  }

  /**
   *
   * @param {number} index
   * @returns {Promise<string | null>}
   */
  async getDataByIndex(index) {
    const data = await this.getData()
    if (data?.length >= index) {
      return data[index]
    }
    return null
  }

  /**
   *
   * @returns {Promise<Array<string>>}
   */
  async getData() {
    if (this.storageType === 'local') {
      const storage = window.localStorage.getItem(this.path)
      return typeof storage === 'string' ? JSON.parse(storage) : []
    } else if (this.storageType === 'remote') {
      if (window.get_remote_data && typeof window.get_remote_data === 'function') {
        return (await window.get_remote_data()) || []
      } else {
        return []
      }
    }
    return []
  }

  /**
   *
   * @param {any} data
   * @returns {Promise<boolean>}
   */
  async setData(data) {
    if (this.storageType === 'local') {
      window.localStorage.setItem(this.path, JSON.stringify(data))
      return true
    } else if (this.storageType === 'remote') {
      if (window.store_remote_data && typeof window.store_remote_data === 'function') {
        return await window.store_remote_data(JSON.stringify(data))
      } else {
        return false
      }
    }
    return true
  }

  /**
   *
   * @param {number} index
   * @param {string} newData
   * @returns {Promise<boolean>}
   */
  async adjustData(index, newData) {
    const data = await this.getData()
    data[index] = newData
    return await this.setData(data)
  }
}
